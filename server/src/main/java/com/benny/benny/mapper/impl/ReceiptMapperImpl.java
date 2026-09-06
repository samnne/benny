package com.benny.benny.mapper.impl;

import java.util.List;

import org.springframework.stereotype.Component;

import com.benny.benny.domain.CreateReceiptDocument;
import com.benny.benny.domain.DTO.ItemDto;
import com.benny.benny.domain.DTO.MerchantDto; // Assuming you have an Item DTO
import com.benny.benny.domain.DTO.ReceiptDto;
import com.benny.benny.domain.entity.Item;
import com.benny.benny.domain.entity.Merchant;
import com.benny.benny.domain.entity.ReceiptDocument;
import com.benny.benny.mapper.ReceiptMapper;

@Component
public class ReceiptMapperImpl implements ReceiptMapper {

  public CreateReceiptDocument fromDto(ReceiptDto dto) {
    if (dto == null) {
      return null;
    }

    // Map nested Merchant DTO to Merchant Entity
    Merchant merchantEntity = null;
    if (dto.merchantDto() != null) {
      merchantEntity = new Merchant("", "");
      merchantEntity.setName(dto.merchantDto().name());
      merchantEntity.setAddress(dto.merchantDto().address());
    }

    // Map nested Item DTOs to Item Entities
    List<Item> itemEntities = fromDtoItems(dto.items());

    return new CreateReceiptDocument(
      merchantEntity,
      dto.date(),
      dto.time(),
      dto.currency(),
      itemEntities,
      dto.subtotal(),
      dto.tax(),
      dto.tip(),
      dto.discounts(),
      dto.total(),
      dto.paymentMethod(),
      dto.category(),
      dto.confidence(),
      dto.bennyMessage()
    );
  }

  public List<Item> fromDtoItems(List<ItemDto> dtoItems) {
    if (dtoItems == null) return null;

    return dtoItems
      .stream()
      .map(dtoItem -> {
        Item item = new Item();
        item.setId(dtoItem.id());
        item.setName(dtoItem.name());
        item.setQuantity(dtoItem.quantity());
        item.setUnitPrice(dtoItem.unitPrice());
        item.setTotalPrice(dtoItem.totalPrice());
        return item;
      })
      .toList();
  }

  public List<ItemDto> toDtoItems(List<Item> items) {
    if (items == null) return null;

    return items
      .stream()
      .map(item -> {
        ItemDto itemDto = new ItemDto(
          item.getName(),
          
          item.getQuantity(),
          item.getId(),
          item.getUnitPrice(),
          item.getTotalPrice()
        );
        return itemDto;
      })
      .toList();
  }

  @Override
  public ReceiptDto toDto(ReceiptDocument document) {
    MerchantDto merchantDto = new MerchantDto(
      document.getMerchant().getName(),
      document.getMerchant().getAddress()
    );

    return new ReceiptDto(
      document.getId(),
      merchantDto,
      document.getDate(),
      document.getTime(),
      document.getCurrency(),
      toDtoItems(document.getItems()),
      document.getSubtotal(),
      document.getTax(),
      document.getTip(),
      document.getDiscounts(),
      document.getTotal(),
      document.getPaymentMethod(),
      document.getCategory(),
      document.getConfidence(),
      document.getBennyMessage()
    );
  }
}
