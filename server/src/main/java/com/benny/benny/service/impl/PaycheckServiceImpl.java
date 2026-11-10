package com.benny.benny.service.impl;

import com.benny.benny.domain.CreatePaycheckDocument;
import com.benny.benny.domain.entity.PaycheckDocument;
import com.benny.benny.mapper.PaycheckMapper;
import com.benny.benny.repository.PaycheckRepository;
import com.benny.benny.service.PaycheckService;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class PaycheckServiceImpl implements PaycheckService {

  private final PaycheckRepository repository;
  private final PaycheckMapper mapper;

  public PaycheckServiceImpl(
      PaycheckRepository repository,
      PaycheckMapper mapper) {
    this.repository = repository;
    this.mapper = mapper;
  }

  @Override
  public PaycheckDocument createPaycheck(
      CreatePaycheckDocument request,
      String uid) {
    validate(request);

    try {
      PaycheckDocument paycheck = mapper.fromRequest(request);
      paycheck.setId(repository.generateId());
      paycheck.setUid(uid);
      paycheck.setAmount(roundAmount(request.amount()));
      paycheck.setDate(request.date());
      paycheck.setCategory(normalizeCategory(request.category()));

      return repository.save(paycheck);
    } catch (IllegalArgumentException e) {
      throw e;
    } catch (Exception e) {
      throw new RuntimeException("Failed to save paycheck to Firestore", e);
    }
  }

  @Override
  public List<PaycheckDocument> getPaychecks(String uid) {
    try {
      return repository
          .findByUid(uid)
          .stream()
          .sorted(
              Comparator.comparing(
                  PaycheckDocument::getDate,
                  Comparator.nullsLast(Comparator.reverseOrder())))
          .toList();
    } catch (Exception e) {
      throw new RuntimeException("Failed to load paychecks from Firestore", e);
    }
  }

  @Override
  public PaycheckDocument updatePaycheck(
      String paycheckId,
      CreatePaycheckDocument request,
      String uid) {
    validate(request);

    try {
      PaycheckDocument existing = repository.findById(paycheckId);
      if (existing == null || !uid.equals(existing.getUid())) {
        return null;
      }

      existing.setAmount(roundAmount(request.amount()));
      existing.setDate(request.date());
      existing.setCategory(normalizeCategory(request.category()));

      return repository.updateById(paycheckId, existing);
    } catch (IllegalArgumentException e) {
      throw e;
    } catch (Exception e) {
      throw new RuntimeException("Failed to update paycheck in Firestore", e);
    }
  }

  @Override
  public PaycheckDocument deletePaycheck(String paycheckId, String uid) {
    try {
      PaycheckDocument existing = repository.findById(paycheckId);
      if (existing == null || !uid.equals(existing.getUid())) {
        return null;
      }

      return repository.deleteById(paycheckId);
    } catch (Exception e) {
      throw new RuntimeException("Failed to delete paycheck from Firestore", e);
    }
  }

  @Override
  public List<String> getCategories(String uid) {
    try {
      return repository.findCategoriesByUid(uid);
    } catch (Exception e) {
      throw new RuntimeException("Failed to load paycheck categories", e);
    }
  }

  @Override
  public List<String> addCategory(String uid, String name) {
    String clean = normalizeCategory(name);
    if (clean.isEmpty()) {
      throw new IllegalArgumentException("Category name is required");
    }
    if (clean.length() > 40) {
      throw new IllegalArgumentException(
          "Category name must be 40 characters or less");
    }

    try {
      List<String> existing = repository.findCategoriesByUid(uid);
      boolean alreadyExists = existing
          .stream()
          .anyMatch(category -> category.equalsIgnoreCase(clean));

      if (alreadyExists) {
        return existing;
      }

      return repository.addCategory(uid, clean);
    } catch (Exception e) {
      throw new RuntimeException("Failed to save paycheck category", e);
    }
  }

  private void validate(CreatePaycheckDocument request) {
    if (request == null) {
      throw new IllegalArgumentException("Paycheck body is required");
    }
    if (!Double.isFinite(request.amount()) || request.amount() <= 0) {
      throw new IllegalArgumentException("Amount must be greater than 0");
    }
    if (request.date() == null || request.date().isBlank()) {
      throw new IllegalArgumentException("Date is required");
    }

    try {
      LocalDate.parse(request.date());
    } catch (DateTimeParseException e) {
      throw new IllegalArgumentException("Date must be in YYYY-MM-DD format");
    }
  }

  private double roundAmount(double amount) {
    return Math.round(amount * 100.0) / 100.0;
  }

  private String normalizeCategory(String category) {
    if (category == null) {
      return "";
    }
    return category.trim().replaceAll("\\s+", " ");
  }
}
