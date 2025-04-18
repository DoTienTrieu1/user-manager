package com.example.apiusermanager.config;

import com.example.apiusermanager.models.User;
import com.example.apiusermanager.repo.UserRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepo userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByUsername("admin") == null) {
                User admin = new User(
                        "admin",
                        passwordEncoder.encode("1234"),
                        "admin@example.com",
                        "0123456789",
                        "Male",
                        "ADMIN"
                );
                userRepository.save(admin);
                System.out.println(" Admin user created.");
            } else {
                System.out.println("Admin user already exists.");
            }
        };
    }
}
