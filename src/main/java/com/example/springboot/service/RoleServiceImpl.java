package com.example.springboot.service;

import com.example.springboot.model.Role;
import com.example.springboot.repository.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;


@Service
public class RoleServiceImpl implements RoleService{

    private final RoleRepository roleRepository;

    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public List<Role> getAllRole() {
        return roleRepository.findAll();
    }
    @Override
    public Set<Role> findByIdIn(List<Long> ids) {
       return  roleRepository.findByIdIn(ids);
    }
}
