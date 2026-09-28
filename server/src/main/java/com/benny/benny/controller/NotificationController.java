package com.benny.benny.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.benny.benny.service.NotificationService;

import java.io.IOException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/")
    public String getMethodName(@RequestParam String param) {
        try {
            notificationService.sendNotification(param);
        } catch (IOException e) {

            e.printStackTrace();
        }
        return new String();
    }

}
