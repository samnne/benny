package com.benny.benny.mapper;

import com.benny.benny.domain.CreatePaycheckDocument;
import com.benny.benny.domain.DTO.PaycheckDto;
import com.benny.benny.domain.entity.PaycheckDocument;

public interface PaycheckMapper {
  PaycheckDocument fromRequest(CreatePaycheckDocument request);

  PaycheckDto toDto(PaycheckDocument document);
}
