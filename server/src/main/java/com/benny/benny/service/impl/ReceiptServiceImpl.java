package com.benny.benny.service.impl;

import java.util.List;
import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Service;

import com.benny.benny.domain.CreateReceiptDocument;
import com.benny.benny.domain.entity.ReceiptDocument;
import com.benny.benny.service.ReceiptService;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;

@Service
public class ReceiptServiceImpl implements ReceiptService {

  private final Firestore firestore;

  // Spring Boot automatically injects the Firestore bean we created
  public ReceiptServiceImpl(Firestore firestore) {
    this.firestore = firestore;
  }

  public ReceiptDocument saveReceipt(CreateReceiptDocument request) {
    try {
      DocumentReference docRef = firestore.collection("receipts").document();
      String id = docRef.getId();

      ReceiptDocument receipt = new ReceiptDocument();
      receipt.setId(id);
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

      ApiFuture<WriteResult> result = docRef.set(receipt);

      System.out.println("Saved at time: " + result.get().getUpdateTime());

      return docRef.get().get().toObject(ReceiptDocument.class);
    } catch (InterruptedException | ExecutionException e) {
      throw new RuntimeException("Failed to save receipt to Firestore", e);
    }
  }

  @Override
  public List<ReceiptDocument> getReceipts(String uid) {
    try {
      CollectionReference receipts = firestore.collection("receipts");
      ApiFuture<QuerySnapshot> query = receipts.get();
      List<QueryDocumentSnapshot> queryDocumentSnapshot = query
        .get()
        .getDocuments();
      List<ReceiptDocument> receiptList = queryDocumentSnapshot
        .stream()
        .map(document -> document.toObject(ReceiptDocument.class))
        .toList();

      return receiptList;
    } catch (Exception e) {
      // TODO: handle exception
      System.out.println("Exception");
    }
    return null;
  }
}
