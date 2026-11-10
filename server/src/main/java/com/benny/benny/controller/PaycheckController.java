package com.benny.benny.controller;

import com.benny.benny.domain.CreatePaycheckDocument;
import com.benny.benny.domain.DTO.CategoryRequest;
import com.benny.benny.domain.DTO.PaycheckDto;
import com.benny.benny.domain.entity.PaycheckDocument;
import com.benny.benny.mapper.PaycheckMapper;
import com.benny.benny.service.PaycheckService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/paychecks")
public class PaycheckController {

  private final PaycheckService paycheckService;
  private final PaycheckMapper paycheckMapper;

  public PaycheckController(
      PaycheckService paycheckService,
      PaycheckMapper paycheckMapper) {
    this.paycheckService = paycheckService;
    this.paycheckMapper = paycheckMapper;
  }

  @GetMapping("/")
  public ResponseEntity<List<PaycheckDto>> getPaychecks(
      @RequestAttribute("uid") String uid) {
    List<PaycheckDto> paychecks = paycheckService
        .getPaychecks(uid)
        .stream()
        .map(paycheckMapper::toDto)
        .toList();

    return ResponseEntity.ok(paychecks);
  }

  @PostMapping("/")
  public ResponseEntity<?> createPaycheck(
      @RequestBody CreatePaycheckDocument request,
      @RequestAttribute("uid") String uid) {
    try {
      PaycheckDocument paycheck = paycheckService.createPaycheck(request, uid);
      return new ResponseEntity<>(
          paycheckMapper.toDto(paycheck),
          HttpStatus.CREATED);
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
          .internalServerError()
          .body("Failed to save paycheck");
    }
  }

  @PutMapping("/{paycheckId}")
  public ResponseEntity<?> updatePaycheck(
      @PathVariable String paycheckId,
      @RequestBody CreatePaycheckDocument request,
      @RequestAttribute("uid") String uid) {
    try {
      PaycheckDocument paycheck = paycheckService.updatePaycheck(
          paycheckId,
          request,
          uid);

      if (paycheck == null) {
        return ResponseEntity.notFound().build();
      }

      return ResponseEntity.ok(paycheckMapper.toDto(paycheck));
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
          .internalServerError()
          .body("Failed to update paycheck");
    }
  }

  @DeleteMapping("/{paycheckId}")
  public ResponseEntity<?> deletePaycheck(
      @PathVariable String paycheckId,
      @RequestAttribute("uid") String uid) {
    try {
      PaycheckDocument paycheck = paycheckService.deletePaycheck(
          paycheckId,
          uid);

      if (paycheck == null) {
        return ResponseEntity.notFound().build();
      }

      return ResponseEntity.ok(paycheckMapper.toDto(paycheck));
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
          .internalServerError()
          .body("Failed to delete paycheck");
    }
  }

  @GetMapping("/categories")
  public ResponseEntity<List<String>> getCategories(
      @RequestAttribute("uid") String uid) {
    return ResponseEntity.ok(paycheckService.getCategories(uid));
  }

  @PostMapping("/categories")
  public ResponseEntity<?> addCategory(
      @RequestBody CategoryRequest request,
      @RequestAttribute("uid") String uid) {
    try {
      List<String> categories = paycheckService.addCategory(
          uid,
          request == null ? null : request.name());
      return ResponseEntity.ok(categories);
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
          .internalServerError()
          .body("Failed to save paycheck category");
    }
  }
}
