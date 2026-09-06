package com.benny.benny.domain;

import java.util.List;

import com.benny.benny.domain.entity.Item;
import com.benny.benny.domain.entity.Merchant;

public record CreateReceiptDocument(
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
}