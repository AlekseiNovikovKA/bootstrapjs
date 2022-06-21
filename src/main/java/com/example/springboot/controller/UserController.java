package com.example.springboot.controller;


import com.example.springboot.Util.UserValidator;
import com.example.springboot.model.Role;
import com.example.springboot.repository.RoleRepository;
import com.example.springboot.repository.UserRepository;
import com.example.springboot.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import com.example.springboot.model.User;
import com.example.springboot.service.UserService;

import javax.validation.Valid;
import java.security.Principal;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Controller
public class UserController {

    private final UserService userService;
    private final RoleService roleService;
    @Autowired
    public UserController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping("/login")
    public String login() {
        return "/login";
    }
    @GetMapping("/admin/")
    public String adminPage(@ModelAttribute("useradd") User user, Model model) {
        model.addAttribute("listusers", userService.getAllUsers());
        model.addAttribute("rolelist", roleService.getAllRole());

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User userauth = (User) authentication.getPrincipal();
        model.addAttribute("userauth", userauth);
        return "/admin/index";
    }
    @PatchMapping("/admin/{id}")
    public String updateUser(@ModelAttribute("user") User user, @PathVariable("id") Long id,
                             @RequestParam("rolesSelected") Long[] rolesId) {
        user.setRoles(roleService.findByIdIn(Arrays.stream(rolesId).toList()));
        userService.updateUser(user, id);
        return "redirect:/admin/";
    }
    @DeleteMapping("/admin/{id}")
    public String deleteUser(@PathVariable("id") Long id) {
        userService.removeUser(id);
        return "redirect:/admin/";
    }
    @PostMapping("/admin/new")
    public String createUser(@ModelAttribute("useradd") User user) {
        userService.addUser(user);
        return "redirect:/admin/";
    }

    @GetMapping("/user/")
    public String userPage(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User userAuth = (User) authentication.getPrincipal();
        model.addAttribute("userauth", userAuth);
        return "/user/index";
    }


}
