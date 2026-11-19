package com.mouadh.backend.persistence;

import com.mouadh.backend.model.Buyer;
import com.mouadh.backend.repository.BuyerRepository;
import com.mouadh.backend.model.Order;
import com.mouadh.backend.model.OrderStatus;
import com.mouadh.backend.model.Recipe;
import com.mouadh.backend.repository.OrderRepository;
import com.mouadh.backend.service.OrderService;
import com.mouadh.backend.service.RecipeAccessService;
import com.mouadh.backend.service.RecipeService;
import com.mouadh.backend.repository.RecipeRepository;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.context.annotation.Import;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import static org.assertj.core.api.Assertions.*;

@DataMongoTest(properties = "spring.data.mongodb.auto-index-creation=true")
@Import({OrderService.class, RecipeAccessService.class, RecipeService.class})
class RecipeMongoIT {
    private static final String DATABASE = "recipe_validation_" + UUID.randomUUID().toString().replace("-", "");
    private final String id = "fixture-" + UUID.randomUUID();
    @Autowired RecipeRepository recipes;
    @Autowired OrderRepository orders;
    @Autowired BuyerRepository buyers;
    @Autowired OrderService orderService;
    @Autowired RecipeService recipeService;
    private final String buyerId = "buyer-" + UUID.randomUUID();
    private String orderId;

    @DynamicPropertySource
    static void isolatedDatabase(DynamicPropertyRegistry registry) {
        String port = System.getenv().getOrDefault("RECIPE_TEST_MONGO_PORT", "27031");
        if (!port.matches("[0-9]{4,5}") || Integer.parseInt(port) < 1024
                || Integer.parseInt(port) > 65535 || port.equals("27017")) {
            throw new IllegalArgumentException("Use a dedicated non-default loopback MongoDB port");
        }
        registry.add("spring.data.mongodb.uri", () -> "mongodb://127.0.0.1:" + port + "/" + DATABASE
                + "?serverSelectionTimeoutMS=4000");
    }

    @AfterEach void deleteFixtureOnly() {
        recipes.deleteById(id);
        if (orderId != null) {
            orders.deleteById(orderId);
        }
    }

    @Test void insertsAndReadsFromMongo() {
        Recipe saved = recipes.insert(fixture());
        assertThat(saved.getId()).isEqualTo(id);
        assertThat(recipes.existsById(id)).isTrue();
    }

    @Test void roundTripsRecipeFields() {
        recipes.insert(fixture());
        Recipe actual = recipes.findById(id).orElseThrow();
        assertThat(actual.getTitle()).isEqualTo("Tomato soup");
        assertThat(actual.getIngredients()).containsExactly("Tomatoes", "Salt");
        assertThat(actual.getSteps()).containsExactly("Simmer");
        assertThat(actual.getPrice()).isEqualTo(4.25);
        assertThat(actual.isPremium()).isTrue();
    }

    @Test void persistsChangedTitle() {
        Recipe saved = recipes.insert(fixture());
        saved.setTitle("Roasted tomato soup");
        recipes.save(saved);
        assertThat(recipes.findById(id).orElseThrow().getTitle()).isEqualTo("Roasted tomato soup");
    }

    @Test void deletesExistingFixture() {
        recipes.insert(fixture());
        recipes.deleteById(id);
        assertThat(recipes.findById(id)).isEmpty();
    }

    @Test void rejectsDuplicateMongoId() {
        recipes.insert(fixture());
        assertThatThrownBy(() -> recipes.insert(fixture())).isInstanceOf(DuplicateKeyException.class);
        assertThat(recipes.findById(id)).isPresent();
    }

    @Test void databaseAllowsMissingTitleWithoutDtoValidation() {
        Recipe recipe = fixture();
        recipe.setTitle(null);
        recipes.insert(recipe);
        assertThat(recipes.findById(id).orElseThrow().getTitle()).isNull();
    }

    @Test void markingPersistedOrderPaidUnlocksRecipe() {
        recipes.insert(fixture());
        Order order = orderService.createOrder(buyerId, id);
        orderId = order.getId();

        assertThat(orders.findById(orderId).orElseThrow().getStatus()).isEqualTo(OrderStatus.PENDING);
        assertThat(recipeService.getRecipeById(id, buyerId).isFullAccess()).isFalse();

        orderService.markOrderPaid(orderId);

        assertThat(orders.findById(orderId).orElseThrow().getStatus()).isEqualTo(OrderStatus.PAID);
        assertThat(recipeService.getRecipeById(id, buyerId).getIngredients()).containsExactly("Tomatoes", "Salt");
    }

    @Test void configuredUniqueBuyerEmailIndexRejectsDuplicate() {
        String email = buyerId + "@example.test";
        Buyer first = new Buyer();
        first.setId(buyerId);
        first.setEmail(email);
        Buyer second = new Buyer();
        second.setId(buyerId + "-duplicate");
        second.setEmail(email);

        try {
            buyers.insert(first);
            assertThatThrownBy(() -> buyers.insert(second)).isInstanceOf(DuplicateKeyException.class);
            assertThat(buyers.findByEmail(email)).get().extracting(Buyer::getId).isEqualTo(buyerId);
        } finally {
            buyers.deleteById(first.getId());
            buyers.deleteById(second.getId());
        }
    }

    private Recipe fixture() {
        Recipe recipe = new Recipe();
        recipe.setId(id);
        recipe.setTitle("Tomato soup");
        recipe.setIngredients(List.of("Tomatoes", "Salt"));
        recipe.setSteps(List.of("Simmer"));
        recipe.setPremium(true);
        recipe.setPrice(4.25);
        recipe.setChefId("fixture-chef");
        return recipe;
    }
}
