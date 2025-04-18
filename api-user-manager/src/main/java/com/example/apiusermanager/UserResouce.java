package com.example.apiusermanager;

import com.example.apiusermanager.exception.ValidationException;
import com.example.apiusermanager.models.User;
import com.example.apiusermanager.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserResouce {
    private final UserService userService;

    public UserResouce(UserService userService) {
        this.userService = userService;
    }

    @RestControllerAdvice
    public class GlobalExceptionHandler {

        @ExceptionHandler(ValidationException.class)
        public ResponseEntity<Map<String, String>> handleCustomValidation(ValidationException ex) {
            return ResponseEntity.badRequest().body(ex.getErrors());
        }
    }
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        user.setId(null);
        String newUser = userService.register(user);
        return new ResponseEntity<>(newUser, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            User loggedIn = userService.login(user.getUsername(), user.getPassword());
            return new ResponseEntity<>(loggedIn, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Invalid username or password", HttpStatus.UNAUTHORIZED);
        }
    }


    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<User> addUser(@RequestBody User user) {
        user.setId(null);
        user = userService.createUser(user);
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<User> updateUser(@PathVariable("id") Long id, @RequestBody User user) {
        User updatedUser = userService.updateUser(id, user);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<User> deleteUser(@PathVariable("id") Long id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
