package com.benny.benny.service.impl;

import com.benny.benny.domain.entity.UserDocument;
import com.benny.benny.repository.UserRepository;
import com.benny.benny.service.UserService;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;

  public UserServiceImpl(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public UserDocument syncUser(String uid, String email, String displayName, String expoPushToken) {
    try {
      return userRepository.syncUser(uid, email, displayName, expoPushToken);
    } catch (Exception e) {
      throw new RuntimeException("Failed to sync user in Firestore", e);
    }
  }

  @Override
  public UserDocument getUser(String uid) {
    try {
      UserDocument user = userRepository.findByUid(uid);
      if (user == null) {
        user = userRepository.syncUser(uid, null, null, null);
      }
      return user;
    } catch (Exception e) {
      throw new RuntimeException("Failed to fetch user from Firestore", e);
    }
  }

  @Override
  public UserDocument updatePreferences(String uid, Map<String, Object> preferences) {
    try {
      return userRepository.updatePreferences(uid, preferences);
    } catch (Exception e) {
      throw new RuntimeException("Failed to update preferences in Firestore", e);
    }
  }

  @Override
  public UserDocument updateProfile(String uid, String email, String displayName) {
    try {
      return userRepository.updateProfile(uid, email, displayName);
    } catch (Exception e) {
      throw new RuntimeException("Failed to update profile in Firestore", e);
    }
  }

  @Override
  public UserDocument updatePushToken(String uid, String expoPushToken) {
    try {
      return userRepository.updatePushToken(uid, expoPushToken);
    } catch (Exception e) {
      throw new RuntimeException("Failed to update push token in Firestore", e);
    }
  }
}
