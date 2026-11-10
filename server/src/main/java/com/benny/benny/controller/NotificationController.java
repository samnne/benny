package com.benny.benny.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.benny.benny.service.NotificationService;

import shaded_package.javax.validation.constraints.NotBlank;

import java.io.IOException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private record Body (
        String param
    ){}
  
    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/")
    public String getMethodName(@RequestBody  Body body) {
        
        try {
            
            notificationService.sendNotification(body.param);
            System.out.println("Success");
        } catch (Exception e) {

            e.printStackTrace();
        }
        return new String();
    }

}
