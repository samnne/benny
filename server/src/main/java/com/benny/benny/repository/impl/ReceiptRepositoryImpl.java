package com.benny.benny.repository.impl;

import com.benny.benny.domain.entity.ReceiptDocument;
import com.benny.benny.repository.ReceiptRepository;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import java.util.List;
import java.util.concurrent.ExecutionException;
import org.springframework.stereotype.Repository;

@Repository
public class ReceiptRepositoryImpl implements ReceiptRepository {

  private final Firestore firestore;
  private static final String COLLECTION_NAME = "receipts";

  public ReceiptRepositoryImpl(Firestore firestore) {
    this.firestore = firestore;
  }

  // Generates a new unique Firestore document ID
  public String generateId() {
    return firestore.collection(COLLECTION_NAME).document().getId();
  }

  public ReceiptDocument save(ReceiptDocument receipt) throws ExecutionException, InterruptedException {
    DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(receipt.getId());
    
    try {
      // .create() fails if a document with this ID already exists, preventing duplicates
      ApiFuture<WriteResult> result = docRef.create(receipt);
      System.out.println("Saved at time: " + result.get().getUpdateTime());
      
      return docRef.get().get().toObject(ReceiptDocument.class);
    } catch (ExecutionException e) {
      if (e.getMessage().contains("ALREADY_EXISTS")) {
        throw new RuntimeException("A receipt with ID " + receipt.getId() + " already exists.");
      }
      throw e; // Rethrow if it's a different database error
    }
  }

  public ReceiptDocument updateById(String receiptId, ReceiptDocument updatedReceipt) throws ExecutionException, InterruptedException {
    DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(receiptId);
    DocumentSnapshot doc = docRef.get().get();

    if (doc.exists()) {
      // Ensure the ID inside the object matches the path ID
      updatedReceipt.setId(receiptId);
      
      // .set() overwrites the existing document with the new data
      ApiFuture<WriteResult> result = docRef.set(updatedReceipt);
      System.out.println("Updated at time: " + result.get().getUpdateTime());
      
      return docRef.get().get().toObject(ReceiptDocument.class);
    } else {
      // Handle the case where the document doesn't exist
      System.out.println("Cannot update: Receipt with ID " + receiptId + " not found.");
      return null;
    }
  }
  public ReceiptDocument findById(String receiptId) throws ExecutionException, InterruptedException {
    DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(receiptId);
    DocumentSnapshot doc = docRef.get().get();

    if (doc.exists()) {
        return doc.toObject(ReceiptDocument.class);
    } else {
        return null;
    }
}

  public List<ReceiptDocument> findByUid(String uid) throws ExecutionException, InterruptedException {
    CollectionReference receipts = firestore.collection(COLLECTION_NAME);
    Query query = receipts.whereEqualTo("uid", uid);
    ApiFuture<QuerySnapshot> snapshot = query.get();
    
    return snapshot.get().getDocuments()
      .stream()
      .map(document -> document.toObject(ReceiptDocument.class))
      .toList();
  }

  public ReceiptDocument deleteById(String receiptId) throws ExecutionException, InterruptedException {
    DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(receiptId);
    DocumentSnapshot doc = docRef.get().get();
    
    if (doc.exists()) {
      WriteResult writeResult = docRef.delete().get();
      System.out.println("Update time: " + writeResult.getUpdateTime());
      return doc.toObject(ReceiptDocument.class);
    } else {
      return null;
    }
  }
}