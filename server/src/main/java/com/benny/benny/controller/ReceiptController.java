package com.benny.benny.controller;

import com.benny.benny.domain.CreateReceiptDocument;
import com.benny.benny.domain.DTO.ReceiptDto;
import com.benny.benny.domain.entity.ReceiptDocument;
import com.benny.benny.mapper.ReceiptMapper;
import com.benny.benny.service.GeminiService;
import com.benny.benny.service.ReceiptService;
import io.github.cdimascio.dotenv.Dotenv;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
  public ResponseEntity<List<ReceiptDocument>> getMethodName(
    @RequestAttribute("uid") String uid
  ) {
    List<ReceiptDocument> document = receiptService.getReceipts(uid);
    return ResponseEntity.ok(document);
  }

  @PostMapping("/")
  public ResponseEntity<String> receiptRequest(
    @RequestBody byte[] bytes,
    @RequestAttribute("uid") String uid
  ) {
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
    @RequestBody ReceiptDto createReceiptDto,
    @RequestAttribute("uid") String uid
  ) {
    System.out.println("Saving Receipt");
    CreateReceiptDocument createReceiptDocumentRequest = receiptMapper.fromDto(
      createReceiptDto
    );
    ReceiptDocument receiptDocument = receiptService.saveReceipt(
      createReceiptDocumentRequest,
      uid
    );
    ReceiptDto receiptDto = receiptMapper.toDto(receiptDocument);


    return new ResponseEntity<>(receiptDto, HttpStatus.CREATED);
  }

  @DeleteMapping("/")
  public ResponseEntity<ReceiptDto> deleteReceipt(
    @RequestParam String receiptId,
    @RequestAttribute("uid") String uid
  ) {
    System.out.println(receiptId);
    ReceiptDocument deletedDoc = receiptService.deleteReceipt(receiptId, uid);
    ReceiptDto receiptDto = receiptMapper.toDto(deletedDoc);

    return new ResponseEntity<>(receiptDto, HttpStatus.OK);
  }
}
