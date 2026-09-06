package com.benny.benny.domain.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ItemDto(
  String name,
  Double quantity,
  
  String id,

    @JsonProperty("unit_price") 
  Double unitPrice,

    @JsonProperty("total_price") 
  Double totalPrice 
) {
}
