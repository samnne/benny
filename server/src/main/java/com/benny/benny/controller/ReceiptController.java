package com.benny.benny.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.benny.benny.domain.CreateReceiptDocument;
import com.benny.benny.domain.DTO.ReceiptDto;
import com.benny.benny.domain.entity.ReceiptDocument;
import com.benny.benny.mapper.ReceiptMapper;
import com.benny.benny.service.GeminiService;
import com.benny.benny.service.ReceiptService;

import io.github.cdimascio.dotenv.Dotenv;

@RestController
@RequestMapping("/api/receipt")
public class ReceiptController {

  private final ReceiptService receiptService;
  private final ReceiptMapper receiptMapper;
  private final GeminiService geminiService;

  public ReceiptController(
    ReceiptService receiptService,
    ReceiptMapper receiptMapper,
    GeminiService geminiService
  ) {
    this.receiptService = receiptService;
    this.receiptMapper = receiptMapper;
    this.geminiService = geminiService;
  }

  @GetMapping("/")
  public ResponseEntity<List<ReceiptDocument>> getMethodName() {
    List<ReceiptDocument> document = receiptService.getReceipts("uid");
    return ResponseEntity.ok(document);
  }

  @PostMapping("/")
  public ResponseEntity<String> receiptRequest(@RequestBody byte[] bytes) {
    try {
      System.out.println(bytes);
      String response = geminiService.sendResponse(bytes);

      return ResponseEntity.ok(response);
    } catch (Exception e) {
      e.printStackTrace();
      Dotenv dotenv = Dotenv.load();
      String production = dotenv.get("SPRING_ENV");
      String response =
        "Sorry We ran into an error" + e.getMessage() + production == "true"
          ? e.getStackTrace().toString()
          : "";
      return ResponseEntity.internalServerError().body(response);
    }
  }

  @PostMapping("/save")
  public ResponseEntity<ReceiptDto> saveReceipt(
    @RequestBody ReceiptDto createReceiptDto
  ) {
    System.out.println("Saving Receipt");
    CreateReceiptDocument createReceiptDocumentRequest = receiptMapper.fromDto(
      createReceiptDto
    );
    ReceiptDocument receiptDocument = receiptService.saveReceipt(
      createReceiptDocumentRequest
    );
    ReceiptDto receiptDto = receiptMapper.toDto(receiptDocument);
    System.out.println(receiptDto.id());

    return new ResponseEntity<>(receiptDto, HttpStatus.CREATED);
  }
}
