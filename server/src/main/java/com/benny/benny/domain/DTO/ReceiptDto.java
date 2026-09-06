package com.benny.benny.domain.DTO;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.firebase.database.annotations.Nullable;

public record ReceiptDto(
  
  String id,
  @JsonProperty("merchant")
    MerchantDto merchantDto,
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
    
    @JsonProperty("payment_method") 
    String paymentMethod,  
    
    String category,
    String confidence,
    
    @JsonProperty("benny_message") 
    String bennyMessage    
) {

   }
