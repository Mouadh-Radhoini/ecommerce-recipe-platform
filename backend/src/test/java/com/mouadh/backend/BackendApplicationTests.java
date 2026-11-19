package com.mouadh.backend;

import java.security.SecureRandom;
import java.util.HexFormat;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class BackendApplicationTests {

    @DynamicPropertySource
    static void testProperties(DynamicPropertyRegistry registry) {
        byte[] key = new byte[32];
        new SecureRandom().nextBytes(key);
        registry.add("jwt.secret", () -> HexFormat.of().formatHex(key));
        registry.add("spring.data.mongodb.uri", () -> "mongodb://127.0.0.1:"
                + System.getenv().getOrDefault("RECIPE_TEST_MONGO_PORT", "27031") + "/recipe_validation_context");
    }

	@Test
	void contextLoads() {
	}

}
