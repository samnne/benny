package com.benny.benny.repository.impl;

import com.benny.benny.domain.entity.PaycheckDocument;
import com.benny.benny.repository.PaycheckRepository;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.FieldValue;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.SetOptions;
import com.google.cloud.firestore.WriteResult;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import org.springframework.stereotype.Repository;

@Repository
public class PaycheckRepositoryImpl implements PaycheckRepository {

  private final Firestore firestore;

  private static final String COLLECTION_NAME = "paychecks";
  private static final String CATEGORIES_COLLECTION_NAME = "paycheckCategories";

  public PaycheckRepositoryImpl(Firestore firestore) {
    this.firestore = firestore;
  }

  @Override
  public String generateId() {
    return firestore.collection(COLLECTION_NAME).document().getId();
  }

  @Override
  public PaycheckDocument save(PaycheckDocument paycheck)
      throws ExecutionException, InterruptedException {
    DocumentReference docRef = firestore
        .collection(COLLECTION_NAME)
        .document(paycheck.getId());

    try {
      // .create() fails if a document with this ID already exists
      ApiFuture<WriteResult> result = docRef.create(paycheck);
      System.out.println("Saved paycheck at time: " + result.get().getUpdateTime());

      return docRef.get().get().toObject(PaycheckDocument.class);
    } catch (ExecutionException e) {
      if (e.getMessage() != null && e.getMessage().contains("ALREADY_EXISTS")) {
        throw new RuntimeException(
            "A paycheck with ID " + paycheck.getId() + " already exists.");
      }
      throw e;
    }
  }

  @Override
  public PaycheckDocument findById(String paycheckId)
      throws ExecutionException, InterruptedException {
    DocumentReference docRef = firestore
        .collection(COLLECTION_NAME)
        .document(paycheckId);
    DocumentSnapshot doc = docRef.get().get();

    if (doc.exists()) {
      return doc.toObject(PaycheckDocument.class);
    }
    return null;
  }

  @Override
  public List<PaycheckDocument> findByUid(String uid)
      throws ExecutionException, InterruptedException {
    CollectionReference paychecks = firestore.collection(COLLECTION_NAME);
    Query query = paychecks.whereEqualTo("uid", uid);
    ApiFuture<QuerySnapshot> snapshot = query.get();

    return snapshot
        .get()
        .getDocuments()
        .stream()
        .map(document -> document.toObject(PaycheckDocument.class))
        .toList();
  }

  @Override
  public PaycheckDocument updateById(
      String paycheckId,
      PaycheckDocument updatedPaycheck)
      throws ExecutionException, InterruptedException {
    DocumentReference docRef = firestore
        .collection(COLLECTION_NAME)
        .document(paycheckId);
    DocumentSnapshot doc = docRef.get().get();

    if (!doc.exists()) {
      return null;
    }

    // Ensure the ID inside the object matches the path ID
    updatedPaycheck.setId(paycheckId);
    ApiFuture<WriteResult> result = docRef.set(updatedPaycheck);
    System.out.println("Updated paycheck at time: " + result.get().getUpdateTime());

    return docRef.get().get().toObject(PaycheckDocument.class);
  }

  @Override
  public PaycheckDocument deleteById(String paycheckId)
      throws ExecutionException, InterruptedException {
    DocumentReference docRef = firestore
        .collection(COLLECTION_NAME)
        .document(paycheckId);
    DocumentSnapshot doc = docRef.get().get();

    if (!doc.exists()) {
      return null;
    }

    WriteResult writeResult = docRef.delete().get();
    System.out.println("Deleted paycheck at time: " + writeResult.getUpdateTime());
    return doc.toObject(PaycheckDocument.class);
  }

  @Override
  public List<String> findCategoriesByUid(String uid)
      throws ExecutionException, InterruptedException {
    DocumentSnapshot doc = firestore
        .collection(CATEGORIES_COLLECTION_NAME)
        .document(uid)
        .get()
        .get();

    if (!doc.exists()) {
      return List.of();
    }

    Object value = doc.get("categories");
    if (!(value instanceof List<?> list)) {
      return List.of();
    }

    return list
        .stream()
        .filter(String.class::isInstance)
        .map(String.class::cast)
        .toList();
  }

  @Override
  public List<String> addCategory(String uid, String name)
      throws ExecutionException, InterruptedException {
    DocumentReference docRef = firestore
        .collection(CATEGORIES_COLLECTION_NAME)
        .document(uid);

    Map<String, Object> data = new HashMap<>();
    data.put("uid", uid);
    data.put("categories", FieldValue.arrayUnion(name));

    // arrayUnion avoids duplicate values and creates the array if needed.
    docRef.set(data, SetOptions.merge()).get();

    return findCategoriesByUid(uid);
  }
}
