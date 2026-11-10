package com.benny.benny.mapper.impl;

import org.springframework.stereotype.Component;

import com.benny.benny.domain.CreatePaycheckDocument;
import com.benny.benny.domain.DTO.PaycheckDto;
import com.benny.benny.domain.entity.PaycheckDocument;
import com.benny.benny.mapper.PaycheckMapper;

@Component
public class PaycheckMapperImpl implements PaycheckMapper {

  @Override
  public PaycheckDocument fromRequest(CreatePaycheckDocument request) {
    if (request == null) {
      return null;
    }

    PaycheckDocument document = new PaycheckDocument();
    document.setAmount(request.amount());
    document.setDate(request.date());
    document.setCategory(request.category());
    return document;
  }

  @Override
  public PaycheckDto toDto(PaycheckDocument document) {
    if (document == null) {
      return null;
    }

    return new PaycheckDto(
        document.getId(),
        document.getAmount(),
        document.getDate(),
        document.getCategory(),
        document.getUid());
  }
}
