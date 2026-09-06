package com.benny.benny.config;

import com.google.genai.Client;

import io.github.cdimascio.dotenv.Dotenv;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GeminiConfig {

  
  @Bean
  public Client geminiClient() {
    Dotenv dotenv = Dotenv.load();
    String apiKey = dotenv.get("GEMINI_API_KEY");
    return Client.builder().apiKey(apiKey).build();
  }
}
