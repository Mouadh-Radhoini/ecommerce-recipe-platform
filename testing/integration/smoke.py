"""Run against the isolated local recipe application configured in testing/README.md."""
import json
import os
import secrets
import sys
from concurrent.futures import ThreadPoolExecutor
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen

BASE = os.environ.get("RECIPE_SMOKE_URL", "http://127.0.0.1:18081")
if urlparse(BASE).hostname not in {"127.0.0.1", "localhost", "::1"}:
    sys.exit("Use a loopback application endpoint backed by an isolated test database.")

run = secrets.token_hex(5)
password = secrets.token_urlsafe(20)
buyer = {"name": "Smoke Buyer", "email": f"buyer-{run}@example.test", "password": password}
chef = {"name": "Smoke Chef", "email": f"chef-{run}@example.test", "password": password}
premium = {
    "title": f"Smoke Premium {run}", "description": "Isolated smoke preview",
    "ingredients": ["test ingredient"], "steps": ["test step"], "premium": True, "price": 4.5,
}
state = {}
results = []


def request(path, expected, method="GET", data=None, token=None, headers=None):
    headers = dict(headers or {})
    if data is not None:
        data = json.dumps(data).encode()
        headers["Content-Type"] = "application/json"
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = Request(f"{BASE}/api{path}", data=data, method=method, headers=headers)
    try:
        response = urlopen(req, timeout=8)
    except HTTPError as error:
        response = error
    with response:
        assert response.status == expected, f"expected HTTP {expected}, got {response.status}"
        body = response.read()
        return json.loads(body) if body and "application/json" in response.headers.get("Content-Type", "") else response.headers


def check(label, action, requires=()):
    if any(key not in state for key in requires):
        print(f"BLOCKED {label} (prerequisite failed)")
        results.append(False)
        return
    try:
        action()
    except URLError as error:
        print(f"BLOCKED {label} ({error.reason})")
        results.append(False)
    except (AssertionError, KeyError, ValueError) as error:
        print(f"FAIL {label} ({error})")
        results.append(False)
    else:
        print(f"PASS {label}")
        results.append(True)


def register(role, account):
    reply = request(f"/auth/register/{role.lower()}", 200, "POST", account)
    assert reply["user"]["role"] == role and "password" not in reply["user"]
    state[role] = reply["token"]


def login():
    reply = request("/auth/login", 200, "POST", {key: buyer[key] for key in ("email", "password")})
    profile = request("/buyers/me", 200, token=reply["token"])
    assert profile["id"] == reply["user"]["id"] and "password" not in profile


def cors():
    headers = request("/recipes", 200, "OPTIONS", headers={
        "Origin": "http://localhost:4200", "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "authorization,content-type",
    })
    assert headers["Access-Control-Allow-Origin"] == "http://localhost:4200"


def create_recipe():
    response = request("/recipes", 200, "POST", premium, state["CHEF"])
    assert response["title"] == premium["title"] and response["fullAccess"]
    state["recipe"] = response["id"]


def listing():
    recipes = request("/recipes", 200, token=state["BUYER"])
    preview = next((recipe for recipe in recipes if recipe["id"] == state["recipe"]), None)
    assert preview and preview["title"] == premium["title"] and not preview.get("ingredients")


def create_order():
    response = request(recipe_order(), 200, "POST", {}, state["BUYER"])
    assert response["status"] == "PENDING" and response["amount"] == premium["price"]
    history = request("/orders/my", 200, token=state["BUYER"])
    assert any(order["id"] == response["id"] for order in history)


def concurrent_orders():
    reply = request("/auth/register/buyer", 200, "POST", {
        **buyer, "email": f"parallel-{run}@example.test",
    })

    def attempt(_):
        req = Request(f"{BASE}/api{recipe_order()}", data=b"{}", method="POST", headers={
            "Authorization": f"Bearer {reply['token']}", "Content-Type": "application/json",
        })
        try:
            response = urlopen(req, timeout=8)
        except HTTPError as error:
            response = error
        with response:
            return response.status

    with ThreadPoolExecutor(max_workers=4) as executor:
        assert sorted(executor.map(attempt, range(4))) == [200, 409, 409, 409]
    history = request("/orders/my", 200, token=reply["token"])
    assert len(history) == 1


def recipe_order():
    return f"/orders/{state['recipe']}"


def access():
    path = f"/recipes/{state['recipe']}"
    preview = request(path, 200, token=state["BUYER"])
    assert preview["fullAccess"] is False and not preview.get("ingredients") and not preview.get("steps")
    own = request(path, 200, token=state["CHEF"])
    assert own["fullAccess"] and own["ingredients"] == premium["ingredients"] and own["steps"] == premium["steps"]


def free_recipe():
    recipe = request("/recipes", 200, "POST", {**premium, "premium": False}, state["CHEF"])
    path = f"/recipes/{recipe['id']}"
    detail = request(path, 200, token=state["BUYER"])
    assert detail["fullAccess"] and detail["ingredients"] == premium["ingredients"]
    request(f"/orders/{recipe['id']}", 400, "POST", {}, state["BUYER"])


check("Application startup", lambda: request("/recipes", 401))
check("CORS preflight", cors)
check("Buyer registration", lambda: register("BUYER", buyer))
check("Chef registration", lambda: register("CHEF", chef))
check("Login and JWT authentication", login, ("BUYER",))
check("Invalid credentials", lambda: request("/auth/login", 401, "POST",
      {"email": buyer["email"], "password": secrets.token_urlsafe(20)}), ("BUYER",))
check("Chef recipe creation", create_recipe, ("CHEF",))
check("Recipe listing and persistence", listing, ("BUYER", "recipe"))
check("Anonymous recipe creation denied", lambda: request("/recipes", 401, "POST", premium))
check("Buyer recipe creation denied", lambda: request("/recipes", 403, "POST", premium, state["BUYER"]), ("BUYER",))
check("Chef order creation denied", lambda: request(recipe_order(), 403, "POST", {}, state["CHEF"]), ("CHEF", "recipe"))
check("Order creation and history", create_order, ("BUYER", "recipe"))
check("Duplicate purchase rejected", lambda: request(recipe_order(), 409, "POST", {}, state["BUYER"]), ("BUYER", "recipe"))
check("Concurrent duplicate orders rejected", concurrent_orders, ("recipe",))
check("Premium access for owner and denial for pending buyer", access, ("BUYER", "CHEF", "recipe"))
check("Free recipe access and purchase rejection", free_recipe, ("BUYER", "CHEF"))

sys.exit(0 if all(results) else 1)
