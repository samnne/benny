package com.benny.benny.service;

import com.benny.benny.domain.CreatePaycheckDocument;
import com.benny.benny.domain.entity.PaycheckDocument;
import java.util.List;

public interface PaycheckService {
  PaycheckDocument createPaycheck(CreatePaycheckDocument request, String uid);

  List<PaycheckDocument> getPaychecks(String uid);

  PaycheckDocument updatePaycheck(
      String paycheckId,
      CreatePaycheckDocument request,
      String uid);

  PaycheckDocument deletePaycheck(String paycheckId, String uid);

  List<String> getCategories(String uid);

  List<String> addCategory(String uid, String name);
}
