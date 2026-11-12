package com.benny.benny.service;

import com.benny.benny.domain.entity.UserDocument;
import java.util.Map;

public interface UserService {

  UserDocument syncUser(String uid, String email, String displayName, String expoPushToken);

  UserDocument getUser(String uid);

  UserDocument updatePreferences(String uid, Map<String, Object> preferences);

  UserDocument updateProfile(String uid, String email, String displayName);

  UserDocument updatePushToken(String uid, String expoPushToken);
}
