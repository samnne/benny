package com.benny.benny.domain.entity;

import com.google.cloud.firestore.annotation.DocumentId;

public class PaycheckDocument {

  @DocumentId
  private String id;

  private String uid;

  private double amount;

  private String date; // YYYY-MM-DD, local date

  private String category; // user-defined category, may be empty

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getUid() {
    return uid;
  }

  public void setUid(String uid) {
    this.uid = uid;
  }

  public double getAmount() {
    return amount;
  }

  public void setAmount(double amount) {
    this.amount = amount;
  }

  public String getDate() {
    return date;
  }

  public void setDate(String date) {
    this.date = date;
  }

  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }

  // Default no-arg constructor required by Firestore SDK
  public PaycheckDocument() {}
}
