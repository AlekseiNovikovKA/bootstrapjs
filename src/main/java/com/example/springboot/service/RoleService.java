package com.example.springboot.service;

import com.example.springboot.model.Role;

import java.util.List;
import java.util.Set;

public interface RoleService {
    List<Role> getAllRole ();
    Set<Role> findByIdIn(List<Long> ids);
}
