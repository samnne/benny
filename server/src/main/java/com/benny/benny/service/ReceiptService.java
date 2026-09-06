
package com.benny.benny.service;
import java.util.List;

import com.benny.benny.domain.CreateReceiptDocument;
import com.benny.benny.domain.entity.ReceiptDocument;

public interface ReceiptService {
 ReceiptDocument saveReceipt(CreateReceiptDocument request, String uid); 
 ReceiptDocument deleteReceipt(String receiptId, String uid); 
  List<ReceiptDocument> getReceipts(String uid);

}
