package com.benny.benny.domain.entity;

import java.util.List;

import com.google.cloud.firestore.annotation.DocumentId;



public class ReceiptDocument {

  @DocumentId
  private String id; // Matches Firestore Document ID

  private Merchant merchant;

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public Merchant getMerchant() {
    return merchant;
  }

  public void setMerchant(Merchant merchant) {
    this.merchant = merchant;
  }

  public String getDate() {
    return date;
  }

  public void setDate(String date) {
    this.date = date;
  }

  public String getTime() {
    return time;
  }

  public void setTime(String time) {
    this.time = time;
  }

  public String getCurrency() {
    return currency;
  }

  public void setCurrency(String currency) {
    this.currency = currency;
  }

  public List<Item> getItems() {
    return items;
  }

  public void setItems(List<Item> items) {
    this.items = items;
  }

  public Double getSubtotal() {
    return subtotal;
  }

  public void setSubtotal(Double subtotal) {
    this.subtotal = subtotal;
  }

  public Double getTax() {
    return tax;
  }

  public void setTax(Double tax) {
    this.tax = tax;
  }

  public Double getTip() {
    return tip;
  }

  public void setTip(Double tip) {
    this.tip = tip;
  }

  public Double getDiscounts() {
    return discounts;
  }

  public void setDiscounts(Double discounts) {
    this.discounts = discounts;
  }

  public double getTotal() {
    return total;
  }

  public void setTotal(double total) {
    this.total = total;
  }

  public String getPaymentMethod() {
    return paymentMethod;
  }

  public void setPaymentMethod(String paymentMethod) {
    this.paymentMethod = paymentMethod;
  }

  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }

  public String getConfidence() {
    return confidence;
  }

  public void setConfidence(String confidence) {
    this.confidence = confidence;
  }

  public String getBennyMessage() {
    return bennyMessage;
  }

  public void setBennyMessage(String bennyMessage) {
    this.bennyMessage = bennyMessage;
  }

  private String date;
  private String time;
  private String currency;
  private List<Item> items;
  private Double subtotal;
  private Double tax;
  private Double tip;
  private Double discounts;
  private double total;
  private String paymentMethod;
  private String category;
  private String confidence;
  private String bennyMessage;

  // Default no-arg constructor required by Firestore SDK
  public ReceiptDocument() {}

  public ReceiptDocument(
    String id,
    Merchant merchant,
    String date,
    String time,
    String currency,
    List<Item> items,
    Double subtotal,
    Double tax,
    Double tip,
    Double discounts,
    double total,
    String paymentMethod,
    String category,
    String confidence,
    String bennyMessage
  ) {
    this.id = id;
    this.merchant = merchant;
    this.date = date;
    this.time = time;
    this.currency = currency;
    this.items = items;
    this.subtotal = subtotal;
    this.tax = tax;
    this.tip = tip;
    this.discounts = discounts;
    this.total = total;
    this.paymentMethod = paymentMethod;
    this.category = category;
    this.confidence = confidence;
    this.bennyMessage = bennyMessage;
  }

  // Nested classes (No separate collections or tables needed)
  

  

}
