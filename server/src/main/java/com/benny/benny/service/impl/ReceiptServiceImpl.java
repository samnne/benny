package com.benny.benny.service.impl;

import com.benny.benny.domain.CreateReceiptDocument;
import com.benny.benny.domain.entity.ReceiptDocument;
import com.benny.benny.repository.ReceiptRepository;
import com.benny.benny.service.ReceiptService;
import java.util.List;

import org.springframework.stereotype.Service;


@Service
public class ReceiptServiceImpl implements ReceiptService {

  private final ReceiptRepository repository;

  // Spring Boot automatically injects the Firestore bean we created
  public ReceiptServiceImpl(ReceiptRepository repository) {
    this.repository = repository;
  }

  // Inside your ReceiptServiceImpl.java

  public ReceiptDocument saveReceipt(
    CreateReceiptDocument request,
    String uid
  ) {
    try {
      ReceiptDocument receipt = new ReceiptDocument();
      receipt.setId(repository.generateId());

      receipt.setTax(request.tax());

      receipt.setTotal(request.total());

      receipt.setSubtotal(request.subtotal());

      receipt.setBennyMessage(request.bennyMessage());

      receipt.setCategory(request.category());

      receipt.setConfidence(request.confidence());

      receipt.setDate(request.date());

      receipt.setItems(request.items());

      receipt.setMerchant(request.merchant());

      receipt.setCurrency(request.currency());

      receipt.setTime(request.time());

      receipt.setDate(request.date());

      receipt.setDiscounts(request.discounts());

      receipt.setPaymentMethod(request.paymentMethod());

      receipt.setTip(request.tip());

      receipt.setUid(uid);

      return repository.save(receipt); // Delegate DB call to repo
    } catch (Exception e) {
      throw new RuntimeException("Failed to save receipt to Firestore", e);
    }
  }

  @Override
  public List<ReceiptDocument> getReceipts(String uid) {
    try {
      return repository.findByUid(uid);
    } catch (Exception e) {
      System.out.println("Exception");
      return null;
    }
  }

  @Override

public ReceiptDocument deleteReceipt(String receiptId, String uid) {
  try {
    
    ReceiptDocument receipt = repository.findById(receiptId); 
    if (receipt == null) {
      return null;
    }
    System.out.println(receipt.getId());
    System.out.println(uid);
    if (!uid.equals(receipt.getUid())) {
      return null;
    }
    
    return repository.deleteById(receiptId);
  } catch (Exception e) {
    e.printStackTrace();
  }
  return null;
}
}
