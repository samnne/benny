package com.benny.benny.domain.DTO;

public record SyncUserRequest(
    String email,
    String displayName,
    String expoPushToken) {}
