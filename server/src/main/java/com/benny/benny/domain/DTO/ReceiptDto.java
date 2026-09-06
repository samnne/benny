package com.benny.benny.domain.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record ReceiptDto(
  String id,
  @JsonProperty("merchant") MerchantDto merchantDto,
  String date,
  String time,
  String currency,
  List<ItemDto> items,

  // Using the 'Double' object wrapper allows these to be null
  Double subtotal,
  Double tax,
  Double tip,
  Double discounts,

  // Using primitive 'double' enforces that this cannot be null
  double total,

  @JsonProperty("payment_method") String paymentMethod,

  String category,
  String confidence,

  @JsonProperty("benny_message") String bennyMessage,

  String uid
) {}
