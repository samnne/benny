package com.benny.benny.service.impl;

import org.springframework.stereotype.Service;

import com.niamedtech.expo.exposerversdk.ExpoPushNotificationClient;
import com.niamedtech.expo.exposerversdk.request.PushNotification;
import com.niamedtech.expo.exposerversdk.response.TicketResponse;

import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.benny.benny.domain.DTO.NotificationDto;
import com.benny.benny.service.NotificationService;

@Service
public class NotificationServeImpl implements NotificationService {

    public NotificationServeImpl() {
    }

    public void sendNotification(String ExpoToken) throws IOException {
        // Replace with your real user Expo push token
        String recipientToken = ExpoToken.length() > 2 ? ExpoToken : "ExponentPushToken[s4Y_pMD4hjmso2Q7--ky7W]";
        List<String> to = new ArrayList<>();
        CloseableHttpClient httpClient = HttpClients.createDefault();
        to.add(recipientToken);

        ExpoPushNotificationClient client = ExpoPushNotificationClient
                .builder()
                .setHttpClient(httpClient)
                // .setAccessToken("TOKEN")
                .build();

        PushNotification pushNotification = new PushNotification();
        pushNotification.setTo(to);
        pushNotification.setTitle("Benny Says Good Work!");
        pushNotification.setBody("You just got your PayCheck!");

        // Play Sound - iOS Only ( Android uses Channels to configure Sounds )
        // pass the sound name ( the sound must be already available on the project )
        // Check:
        // https://docs.expo.dev/versions/latest/sdk/notifications/#configurable-properties
        // and
        // https://docs.expo.dev/versions/latest/sdk/notifications/#set-custom-notification-sounds
        pushNotification.setSound("default");

        List<PushNotification> notifications = new ArrayList<>();
        notifications.add(pushNotification);

        List<TicketResponse.Ticket> response = client.sendPushNotifications(notifications);

        for (TicketResponse.Ticket ticket : response) {
            System.out.println(ticket.getId());
            System.out.println(ticket.getStatus());
            // OK on success, ERROR on error
            // use import com.niamedtech.expo.exposerversdk.response.Status;

            // getDetails is only available on Error
            // System.out.println(ticket.getMessage());
            // System.out.println(ticket.getDetails().getSentAt());
            // System.out.println(ticket.getDetails().getExpoPushToken());
        }
    }

}
