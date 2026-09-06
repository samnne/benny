package com.benny.benny.domain.entity;

public class Merchant {

    private String name;
    private String address;

    // Default no-arg constructor required by Firestore SDK
    public Merchant() {}

    public Merchant(String name, String address) {
        this.name = name;
        this.address = address;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}