package com.benny.benny.repository.impl;

import com.benny.benny.domain.entity.UserDocument;
import com.benny.benny.repository.UserRepository;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.SetOptions;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepositoryImpl implements UserRepository {

  private final Firestore firestore;
  private static final String COLLECTION_NAME = "users";

  public UserRepositoryImpl(Firestore firestore) {
    this.firestore = firestore;
  }

  public Map<String, Object> getDefaultPreferences() {
    Map<String, Object> preferences = new HashMap<>();
    preferences.put("payFrequency", "biweekly");
    preferences.put("nextPayday", null);
    preferences.put("budgetPerPeriod", 1200.0);
    preferences.put("chattiness", 1);

    Map<String, Boolean> notifications = new HashMap<>();
    notifications.put("weeklySummary", true);
    notifications.put("budgetAlert", true);
    notifications.put("paydayReminder", false);
    preferences.put("notifications", notifications);

    preferences.put("onboardingComplete", false);
    return preferences;
  }

  @Override
  public UserDocument syncUser(String uid, String email, String displayName, String expoPushToken)
      throws ExecutionException, InterruptedException {
    DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(uid);
    DocumentSnapshot doc = docRef.get().get();

    if (!doc.exists()) {
      UserDocument newUser = new UserDocument();
      newUser.setId(uid);
      newUser.setUid(uid);
      newUser.setEmail(email != null ? email : "");
      newUser.setDisplayName(displayName != null ? displayName : "");
      newUser.setExpoPushToken(expoPushToken != null ? expoPushToken : "");
      newUser.setPreferences(getDefaultPreferences());

      docRef.set(newUser).get();
      System.out.println("Created new user in users collection: " + uid);
      return newUser;
    } else {
      UserDocument existingUser = doc.toObject(UserDocument.class);
      if (existingUser == null) {
        existingUser = new UserDocument(uid, uid, email, displayName, expoPushToken, getDefaultPreferences());
      }

      boolean needsUpdate = false;
      if (email != null && !email.isBlank() && !email.equals(existingUser.getEmail())) {
        existingUser.setEmail(email);
        needsUpdate = true;
      }
      if (displayName != null && !displayName.isBlank() && !displayName.equals(existingUser.getDisplayName())) {
        existingUser.setDisplayName(displayName);
        needsUpdate = true;
      }
      if (expoPushToken != null && !expoPushToken.isBlank() && !expoPushToken.equals(existingUser.getExpoPushToken())) {
        existingUser.setExpoPushToken(expoPushToken);
        needsUpdate = true;
      }
      if (existingUser.getPreferences() == null) {
        existingUser.setPreferences(getDefaultPreferences());
        needsUpdate = true;
      }

      if (needsUpdate) {
        docRef.set(existingUser, SetOptions.merge()).get();
      }

      return existingUser;
    }
  }

  @Override
  public UserDocument findByUid(String uid)
      throws ExecutionException, InterruptedException {
    DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(uid);
    DocumentSnapshot doc = docRef.get().get();

    if (doc.exists()) {
      return doc.toObject(UserDocument.class);
    }
    return null;
  }

  @Override
  public UserDocument updatePreferences(String uid, Map<String, Object> preferences)
      throws ExecutionException, InterruptedException {
    DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(uid);
    DocumentSnapshot doc = docRef.get().get();

    if (!doc.exists()) {
      syncUser(uid, null, null, null);
    }

    Map<String, Object> updates = new HashMap<>();
    updates.put("preferences", preferences);

    docRef.set(updates, SetOptions.merge()).get();

    DocumentSnapshot updatedDoc = docRef.get().get();
    return updatedDoc.toObject(UserDocument.class);
  }

  @Override
  public UserDocument updateProfile(String uid, String email, String displayName)
      throws ExecutionException, InterruptedException {
    DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(uid);
    Map<String, Object> updates = new HashMap<>();

    if (email != null) {
      updates.put("email", email);
    }
    if (displayName != null) {
      updates.put("displayName", displayName);
    }

    if (!updates.isEmpty()) {
      docRef.set(updates, SetOptions.merge()).get();
    }

    DocumentSnapshot doc = docRef.get().get();
    return doc.toObject(UserDocument.class);
  }

  @Override
  public UserDocument updatePushToken(String uid, String expoPushToken)
      throws ExecutionException, InterruptedException {
    DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(uid);
    Map<String, Object> updates = new HashMap<>();
    updates.put("expoPushToken", expoPushToken != null ? expoPushToken : "");

    docRef.set(updates, SetOptions.merge()).get();

    DocumentSnapshot doc = docRef.get().get();
    return doc.toObject(UserDocument.class);
  }
}
