package com.example.apiusermanager.service;

import com.example.apiusermanager.exception.ValidationException;
import com.example.apiusermanager.models.User;
import com.example.apiusermanager.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepo userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    public User login(String username, String password) {
        Map<String, String> errors = new HashMap<>();

        if (username == null || username.trim().isEmpty()) {
            errors.put("username", "Tên người dùng không được để trống");
        }
        if (password == null || password.trim().isEmpty()) {
            errors.put("password", "Mật khẩu không được để trống");
        }

        if (!errors.isEmpty()) {
            throw new ValidationException(errors);
        }

        User user = userRepo.findByUsername(username);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
                errors.put("general", "Bạn không có quyền ADMIN");
                throw new ValidationException(errors);
            }
            return user;
        }

        errors.put("general", "Tên người dùng hoặc mật khẩu không đúng");
        throw new ValidationException(errors);
    }


    public User register(User user) {
        Map<String, String> errors = new HashMap<>();
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            errors.put("username", "Tên người dùng không được để trống");
        }

        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            errors.put("email", "Email không được để trống");
        }

        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            errors.put("password", "Mật khẩu không được để trống");
        } else if (user.getPassword().length() < 8) {
            errors.put("password", "Mật khẩu phải có ít nhất 8 ký tự");
        }

        if (user.getPhone() == null || user.getPhone().trim().isEmpty()) {
            errors.put("phone", "Mật khẩu không được để trống");
        } else if (user.getPhone().length() < 10) {
            errors.put("phone", "sdt phải có ít nhất 10 ký tự");
        }

        if (userRepo.existsByUsername(user.getUsername())) {
            errors.put("username", "Tên người dùng đã tồn tại");
        }

        if (userRepo.existsByEmail(user.getEmail())) {
            errors.put("email", "Email đã được sử dụng");
        }

        if (user.getPhone() != null && userRepo.existsByPhone(user.getPhone())) {
            errors.put("phone", "Số điện thoại đã được sử dụng");
        }
        if (!errors.isEmpty()) {
            throw new ValidationException(errors);
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("ADMIN");
        return userRepo.save(user);
    }

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    public User createUser(User user) {
        Map<String, String> errors = new HashMap<>();
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            errors.put("username", "Tên người dùng không được để trống");
        }

        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            errors.put("email", "Email không được để trống");
        }

        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            errors.put("password", "Mật khẩu không được để trống");
        } else if (user.getPassword().length() < 8) {
            errors.put("password", "Mật khẩu phải có ít nhất 8 ký tự");
        }

        if (user.getPhone() == null || user.getPhone().trim().isEmpty()) {
            errors.put("phone", "Mật khẩu không được để trống");
        } else if (user.getPhone().length() < 10) {
            errors.put("phone", "sdt phải có ít nhất 10 ký tự");
        }

        if (userRepo.existsByUsername(user.getUsername())) {
            errors.put("username", "Tên người dùng đã tồn tại");
        }

        if (userRepo.existsByEmail(user.getEmail())) {
            errors.put("email", "Email đã được sử dụng");
        }

        if (user.getPhone() != null && userRepo.existsByPhone(user.getPhone())) {
            errors.put("phone", "Số điện thoại đã được sử dụng");
        }
        if (!errors.isEmpty()) {
            throw new ValidationException(errors);
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER");
        return userRepo.save(user);
    }

    public User updateUser(Long id, User userDetails) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUsername(userDetails.getUsername());
        user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        user.setPhone(userDetails.getPhone());
        user.setGender(userDetails.getGender());
        user.setRole(userDetails.getRole());
        user.setEmail(userDetails.getEmail());

        return userRepo.save(user);
    }

    public void deleteUser(Long id) {
        userRepo.deleteById(id);
    }
}
