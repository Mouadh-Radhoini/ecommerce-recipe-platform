"""Browser smoke using the local Chromium and ChromeDriver, without npm dependencies."""
import json
import os
import secrets
import subprocess
import sys
import tempfile
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen

BASE = os.environ.get("RECIPE_BROWSER_URL", "http://127.0.0.1:14200")
if urlparse(BASE).hostname not in {"127.0.0.1", "localhost", "::1"}:
    sys.exit("Use the local Angular server with an isolated backend.")
DRIVER = "http://127.0.0.1:19515"
session = None
run = secrets.token_hex(5)
password = secrets.token_urlsafe(20)


def webdriver(path, method="GET", body=None):
    if body is not None:
        body = json.dumps(body).encode()
    request = Request(DRIVER + path, data=body, method=method,
                      headers={"Content-Type": "application/json"})
    try:
        with urlopen(request, timeout=15) as response:
            return json.load(response)["value"]
    except HTTPError as error:
        raise RuntimeError(f"ChromeDriver returned {error.code} for {path}") from error


def command(path, method="GET", body=None):
    return webdriver(f"/session/{session}{path}", method, body)


def eventually(action, label):
    deadline = time.monotonic() + 12
    while time.monotonic() < deadline:
        try:
            result = action()
            if result:
                return result
        except (RuntimeError, URLError):
            pass
        time.sleep(.2)
    raise AssertionError(label)


def element(selector):
    elements = command("/elements", "POST", {"using": "css selector", "value": selector})
    if elements:
        return next(iter(elements[0].values()))
    return None


def click(selector):
    node = eventually(lambda: element(selector), f"Missing {selector}")
    command(f"/element/{node}/click", "POST", {})


def fill(selector, value):
    node = eventually(lambda: element(selector), f"Missing {selector}")
    command(f"/element/{node}/value", "POST", {"text": value})


def heading(value):
    def matches():
        node = element("main h1, main h2")
        return node and command(f"/element/{node}/text").strip().lower() == value.lower()
    eventually(matches, f"Expected heading {value}")


def text_visible(text):
    eventually(lambda: text in command(f"/element/{element('body')}/text"), f"Missing text {text}")


def visit(path):
    command("/url", "POST", {"url": BASE + path})


def register(role):
    visit("/auth/register")
    for field, value in {"email": f"{role}-{run}@example.test", "name": f"Browser {role}",
                         "password": password, "confirmPassword": password}.items():
        fill(f'[formcontrolname="{field}"]', value)
    if role == "chef":
        click('#role-chef')
    click('button[type="submit"]')
    heading("Recipes")


try:
    with tempfile.TemporaryDirectory(prefix="recipe-chromium-") as profile:
        driver = subprocess.Popen(["chromedriver", "--port=19515"], stdout=subprocess.DEVNULL,
                                  stderr=subprocess.DEVNULL)
        try:
            eventually(lambda: webdriver("/status").get("ready"), "ChromeDriver unavailable")
            session = webdriver("/session", "POST", {"capabilities": {"alwaysMatch": {
                "browserName": "chrome",
                "goog:chromeOptions": {"binary": "/usr/bin/chromium", "args": [
                    "--headless=new", f"--user-data-dir={profile}",
                ]},
            }}})["sessionId"]
            visit("/")
            heading("Login")
            print("PASS Browser startup and anonymous guard")
            register("chef")
            visit("/dashboard")
            heading("Chef dashboard")
            click('a[href="/my-recipes/create"]')
            heading("Create recipe")
            title = f"Browser premium {run}"
            for field, value in {"title": title, "description": "Browser smoke recipe",
                                 "ingredients": "Browser ingredient", "steps": "Browser step"}.items():
                fill(f'[formcontrolname="{field}"]', value)
            click('[formcontrolname="premium"]')
            fill('[formcontrolname="price"]', "5")
            click('button[type="submit"]')
            heading(title)
            text_visible("Browser ingredient")
            detail = urlparse(command("/url")).path
            print("PASS Chef registration, dashboard, recipe creation and owner details")
            click("header nav button")
            register("buyer")
            click("header nav button")
            heading("Login")
            fill('[formcontrolname="email"]', f"buyer-{run}@example.test")
            fill('[formcontrolname="password"]', password)
            click('button[type="submit"]')
            heading("Recipes")
            text_visible(title)
            click(f'a[href="{detail}"]')
            heading(title)
            text_visible("requires a paid order")
            assert "Browser ingredient" not in command(f"/element/{element('body')}/text")
            click('a[href^="/checkout"]')
            heading("Review order")
            eventually(lambda: element("main button"), "Pending order button unavailable")
            click("main button")
            heading("My Orders")
            text_visible("PENDING")
            visit("/dashboard")
            eventually(lambda: urlparse(command("/url")).path == "/unauthorized", "Buyer role guard failed")
            print("PASS Buyer registration, login, listing, premium preview, checkout, order history and role guard")
        finally:
            if session:
                command("", "DELETE")
            driver.terminate()
            driver.wait(timeout=10)
except (AssertionError, RuntimeError, URLError, OSError) as error:
    sys.exit(f"FAIL Browser smoke ({error})")
