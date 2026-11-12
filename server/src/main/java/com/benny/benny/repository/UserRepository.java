package com.benny.benny.repository;

import com.benny.benny.domain.entity.UserDocument;
import java.util.Map;
import java.util.concurrent.ExecutionException;

public interface UserRepository {

  UserDocument syncUser(String uid, String email, String displayName, String expoPushToken)
      throws ExecutionException, InterruptedException;

  UserDocument findByUid(String uid)
      throws ExecutionException, InterruptedException;

  UserDocument updatePreferences(String uid, Map<String, Object> preferences)
      throws ExecutionException, InterruptedException;

  UserDocument updateProfile(String uid, String email, String displayName)
      throws ExecutionException, InterruptedException;

  UserDocument updatePushToken(String uid, String expoPushToken)
      throws ExecutionException, InterruptedException;
}
