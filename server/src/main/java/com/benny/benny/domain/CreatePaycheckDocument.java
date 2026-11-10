package com.benny.benny.domain;

public record CreatePaycheckDocument(
    double amount,
    String date,
    String category) {
}
