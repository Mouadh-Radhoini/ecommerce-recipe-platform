package com.mouadh.backend.service;

import com.mouadh.backend.dto.auth.BuyerRegisterRequest;
import com.mouadh.backend.dto.auth.LoginRequest;
import com.mouadh.backend.dto.recipe.RecipeRequest;
import com.mouadh.backend.model.Buyer;
import com.mouadh.backend.model.Order;
import com.mouadh.backend.model.OrderStatus;
import com.mouadh.backend.model.Recipe;
import com.mouadh.backend.repository.BuyerRepository;
import com.mouadh.backend.repository.ChefRepository;
import com.mouadh.backend.repository.OrderRepository;
import com.mouadh.backend.repository.RecipeRepository;
import com.mouadh.backend.security.JwtService;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BusinessRulesTest {
    @Mock RecipeRepository recipes;
    @Mock OrderRepository orders;
    @Mock BuyerRepository buyers;
    @Mock ChefRepository chefs;
    @Mock PasswordEncoder encoder;
    @Mock JwtService jwt;
    @Mock RecipeAccessService access;

    @InjectMocks RecipeService recipeService;
    @InjectMocks OrderService orderService;
    @InjectMocks AuthService auth;
    @InjectMocks RecipeAccessService accessService;

    @Test void freeRecipeIgnoresSubmittedPrice() {
        RecipeRequest request = new RecipeRequest();
        request.setPrice(12.0);
        when(recipes.save(any(Recipe.class))).thenAnswer(call -> call.getArgument(0));

        assertThat(recipeService.createRecipe(request, "chef").getPrice()).isZero();
        verify(recipes).save(argThat(recipe -> recipe.getPrice() == 0 && recipe.getChefId().equals("chef")));
    }

    @Test void premiumRecipeKeepsPositivePrice() {
        RecipeRequest request = new RecipeRequest();
        request.setPremium(true);
        request.setPrice(12.5);
        when(recipes.save(any(Recipe.class))).thenAnswer(call -> call.getArgument(0));

        assertThat(recipeService.createRecipe(request, "chef").getPrice()).isEqualTo(12.5);
        verify(recipes).save(argThat(recipe -> recipe.isPremium() && recipe.getPrice() == 12.5));
    }

    @Test void premiumRecipeRejectsZeroPrice() {
        RecipeRequest request = new RecipeRequest();
        request.setPremium(true);
        request.setPrice(0.0);

        assertStatus(400, () -> recipeService.createRecipe(request, "chef"));
        verifyNoInteractions(recipes);
    }

    @Test void freeRecipeCannotBeOrdered() {
        stubRecipe(false);
        assertStatus(400, () -> orderService.createOrder("buyer", "recipe"));
        verifyNoInteractions(orders);
    }

    @Test void ownerCannotOrderOwnRecipe() {
        stubRecipe(true);
        assertStatus(403, () -> orderService.createOrder("chef", "recipe"));
        verifyNoInteractions(orders);
    }

    @Test void existingPendingOrderPreventsDuplicate() {
        stubRecipe(true);
        Order prior = new Order();
        prior.setStatus(OrderStatus.PENDING);
        when(orders.findByBuyerIdAndRecipeId("buyer", "recipe")).thenReturn(Optional.of(prior));

        assertStatus(409, () -> orderService.createOrder("buyer", "recipe"));
        verify(orders, never()).insert(any(Order.class));
    }

    @Test void newOrderPersistsPendingStatusAndRecipePrice() {
        stubRecipe(true);
        when(orders.insert(any(Order.class))).thenAnswer(call -> call.getArgument(0));

        Order order = orderService.createOrder("buyer", "recipe");

        assertThat(order.getStatus()).isEqualTo(OrderStatus.PENDING);
        assertThat(order.getAmount()).isEqualTo(8.5);
        assertThat(order.getBuyerId()).isEqualTo("buyer");
        assertThat(order.getRecipeId()).isEqualTo("recipe");
        verify(orders).insert(order);
    }

    @Test void pendingOrderDoesNotUnlockPremium() {
        Order order = new Order();
        order.setStatus(OrderStatus.PENDING);
        when(orders.findByBuyerIdAndRecipeId("buyer", "recipe")).thenReturn(Optional.of(order));

        assertThat(accessService.hasPaidAccess("buyer", "recipe")).isFalse();
    }

    @Test void paidOrderUnlocksPremium() {
        Order order = new Order();
        order.setStatus(OrderStatus.PAID);
        when(orders.findByBuyerIdAndRecipeId("buyer", "recipe")).thenReturn(Optional.of(order));

        assertThat(accessService.hasPaidAccess("buyer", "recipe")).isTrue();
    }

    @Test void duplicateRegistrationDoesNotPersistUser() {
        BuyerRegisterRequest request = new BuyerRegisterRequest();
        request.setEmail("unit@example.test");
        when(buyers.findByEmail(request.getEmail())).thenReturn(Optional.of(new Buyer()));

        assertStatus(409, () -> auth.registerBuyer(request));
        verify(buyers, never()).save(any(Buyer.class));
        verifyNoInteractions(jwt, encoder);
    }

    @Test void incorrectPasswordDoesNotIssueToken() {
        LoginRequest request = new LoginRequest();
        request.setEmail("unit@example.test");
        request.setPassword("wrong");
        Buyer buyer = new Buyer();
        buyer.setPassword("stored-hash");
        when(buyers.findByEmail(request.getEmail())).thenReturn(Optional.of(buyer));
        when(encoder.matches("wrong", "stored-hash")).thenReturn(false);

        assertStatus(401, () -> auth.login(request));
        verifyNoInteractions(jwt);
    }

    @Test void validLoginReturnsBuyerIdentityAndToken() {
        LoginRequest request = new LoginRequest();
        request.setEmail("unit@example.test");
        request.setPassword("fixture-password");
        Buyer buyer = new Buyer();
        buyer.setId("buyer-fixture");
        buyer.setPassword("fixture-hash");
        buyer.setEmail(request.getEmail());
        when(buyers.findByEmail(request.getEmail())).thenReturn(Optional.of(buyer));
        when(encoder.matches(request.getPassword(), buyer.getPassword())).thenReturn(true);
        when(jwt.generateToken("buyer-fixture", "ROLE_BUYER")).thenReturn("mock-token");

        var response = auth.login(request);

        assertThat(response.getToken()).isEqualTo("mock-token");
        assertThat(response.getUser().getId()).isEqualTo("buyer-fixture");
        assertThat(response.getUser().getEmail()).isEqualTo(request.getEmail());
        assertThat(response.getUser().getRole()).isEqualTo("BUYER");
        verifyNoInteractions(chefs);
    }

    private void stubRecipe(boolean premium) {
        Recipe recipe = new Recipe();
        recipe.setChefId("chef");
        recipe.setPremium(premium);
        recipe.setPrice(8.5);
        when(recipes.findById("recipe")).thenReturn(Optional.of(recipe));
    }

    private void assertStatus(int status, org.assertj.core.api.ThrowableAssert.ThrowingCallable call) {
        assertThatExceptionOfType(ResponseStatusException.class).isThrownBy(call)
                .satisfies(error -> assertThat(error.getStatusCode().value()).isEqualTo(status));
    }
}
