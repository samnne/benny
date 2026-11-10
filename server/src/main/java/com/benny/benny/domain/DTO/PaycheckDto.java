package com.benny.benny.domain.DTO;

public record PaycheckDto(
    String id,
    double amount,
    String date,
    String category,
    String uid) {
}
