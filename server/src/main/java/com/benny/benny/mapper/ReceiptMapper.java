package com.benny.benny.mapper;

import java.util.List;

import com.benny.benny.domain.CreateReceiptDocument;
import com.benny.benny.domain.DTO.ItemDto;
import com.benny.benny.domain.DTO.ReceiptDto;
import com.benny.benny.domain.entity.Item;
import com.benny.benny.domain.entity.ReceiptDocument;

public interface ReceiptMapper {
    CreateReceiptDocument fromDto(ReceiptDto dto);

    List<Item> fromDtoItems(List<ItemDto> dtoItems);

    ReceiptDto toDto(ReceiptDocument document);
}
