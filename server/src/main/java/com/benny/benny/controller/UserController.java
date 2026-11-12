package com.benny.benny.controller;

import com.benny.benny.domain.DTO.SyncUserRequest;
import com.benny.benny.domain.DTO.UserDto;
import com.benny.benny.domain.entity.UserDocument;
import com.benny.benny.service.UserService;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @PostMapping("/sync")
  public ResponseEntity<UserDto> syncUser(
      @RequestAttribute("uid") String uid,
      @RequestAttribute(value = "email", required = false) String tokenEmail,
      @RequestAttribute(value = "name", required = false) String tokenName,
      @RequestBody(required = false) SyncUserRequest request) {

    String email = (request != null && request.email() != null && !request.email().isBlank())
        ? request.email()
        : tokenEmail;
    String displayName = (request != null && request.displayName() != null && !request.displayName().isBlank())
        ? request.displayName()
        : tokenName;
    String expoPushToken = request != null ? request.expoPushToken() : null;

    UserDocument userDoc = userService.syncUser(uid, email, displayName, expoPushToken);

    UserDto dto = new UserDto(
        userDoc.getUid(),
        userDoc.getEmail(),
        userDoc.getDisplayName(),
        userDoc.getExpoPushToken(),
        userDoc.getPreferences());

    return ResponseEntity.ok(dto);
  }

  @GetMapping("/me")
  public ResponseEntity<UserDto> getCurrentUser(@RequestAttribute("uid") String uid) {
    UserDocument userDoc = userService.getUser(uid);
    UserDto dto = new UserDto(
        userDoc.getUid(),
        userDoc.getEmail(),
        userDoc.getDisplayName(),
        userDoc.getExpoPushToken(),
        userDoc.getPreferences());
    return ResponseEntity.ok(dto);
  }

  @PutMapping("/preferences")
  public ResponseEntity<UserDto> updatePreferences(
      @RequestAttribute("uid") String uid,
      @RequestBody Map<String, Object> preferences) {

    UserDocument userDoc = userService.updatePreferences(uid, preferences);
    UserDto dto = new UserDto(
        userDoc.getUid(),
        userDoc.getEmail(),
        userDoc.getDisplayName(),
        userDoc.getExpoPushToken(),
        userDoc.getPreferences());
    return ResponseEntity.ok(dto);
  }

  @PutMapping("/profile")
  public ResponseEntity<UserDto> updateProfile(
      @RequestAttribute("uid") String uid,
      @RequestBody SyncUserRequest request) {

    String email = request != null ? request.email() : null;
    String displayName = request != null ? request.displayName() : null;

    UserDocument userDoc = userService.updateProfile(uid, email, displayName);
    UserDto dto = new UserDto(
        userDoc.getUid(),
        userDoc.getEmail(),
        userDoc.getDisplayName(),
        userDoc.getExpoPushToken(),
        userDoc.getPreferences());
    return ResponseEntity.ok(dto);
  }

  @PutMapping("/push-token")
  public ResponseEntity<UserDto> updatePushToken(
      @RequestAttribute("uid") String uid,
      @RequestBody Map<String, String> body) {

    String pushToken = body != null ? body.get("pushToken") : null;
    UserDocument userDoc = userService.updatePushToken(uid, pushToken);
    UserDto dto = new UserDto(
        userDoc.getUid(),
        userDoc.getEmail(),
        userDoc.getDisplayName(),
        userDoc.getExpoPushToken(),
        userDoc.getPreferences());
    return ResponseEntity.ok(dto);
  }
}
