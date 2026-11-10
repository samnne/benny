package com.benny.benny.repository;

import com.benny.benny.domain.entity.PaycheckDocument;
import java.util.List;
import java.util.concurrent.ExecutionException;

public interface PaycheckRepository {
  String generateId();

  PaycheckDocument save(PaycheckDocument paycheck)
      throws ExecutionException, InterruptedException;

  PaycheckDocument findById(String paycheckId)
      throws ExecutionException, InterruptedException;

  List<PaycheckDocument> findByUid(String uid)
      throws ExecutionException, InterruptedException;

  PaycheckDocument updateById(String paycheckId, PaycheckDocument updatedPaycheck)
      throws ExecutionException, InterruptedException;

  PaycheckDocument deleteById(String paycheckId)
      throws ExecutionException, InterruptedException;

  List<String> findCategoriesByUid(String uid)
      throws ExecutionException, InterruptedException;

  List<String> addCategory(String uid, String name)
      throws ExecutionException, InterruptedException;
}
