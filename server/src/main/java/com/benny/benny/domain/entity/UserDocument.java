package com.benny.benny.domain.entity;

import com.google.cloud.firestore.annotation.DocumentId;
import java.util.Map;

public class UserDocument {

  @DocumentId
  private String id;

  private String uid;

  private String email;

  private String displayName;

  private String expoPushToken;

  private Map<String, Object> preferences;

  public UserDocument() {}

  public UserDocument(
      String id,
      String uid,
      String email,
      String displayName,
      String expoPushToken,
      Map<String, Object> preferences) {
    this.id = id;
    this.uid = uid;
    this.email = email;
    this.displayName = displayName;
    this.expoPushToken = expoPushToken;
    this.preferences = preferences;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getUid() {
    return uid;
  }

  public void setUid(String uid) {
    this.uid = uid;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getDisplayName() {
    return displayName;
  }

  public void setDisplayName(String displayName) {
    this.displayName = displayName;
  }

  public String getExpoPushToken() {
    return expoPushToken;
  }

  public void setExpoPushToken(String expoPushToken) {
    this.expoPushToken = expoPushToken;
  }

  public Map<String, Object> getPreferences() {
    return preferences;
  }

  public void setPreferences(Map<String, Object> preferences) {
    this.preferences = preferences;
  }
}
