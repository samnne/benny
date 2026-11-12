package com.benny.benny.domain.DTO;

import java.util.Map;

public record UserDto(
    String uid,
    String email,
    String displayName,
    String expoPushToken,
    Map<String, Object> preferences) {}
