package com.benny.benny.repository;

import com.benny.benny.domain.entity.ReceiptDocument;
import java.util.List;
import java.util.concurrent.ExecutionException;

public interface ReceiptRepository {
  public String generateId();
  public ReceiptDocument deleteById(String receiptId)
    throws ExecutionException, InterruptedException;
  public List<ReceiptDocument> findByUid(String uid)
    throws ExecutionException, InterruptedException;
  public ReceiptDocument updateById(
    String receiptId,
    ReceiptDocument updatedReceipt
  ) throws ExecutionException, InterruptedException;
  public ReceiptDocument findById(String receiptId)
    throws ExecutionException, InterruptedException;
  public ReceiptDocument save(ReceiptDocument receipt)
    throws ExecutionException, InterruptedException;
}
