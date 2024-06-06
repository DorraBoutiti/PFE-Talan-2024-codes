package com.example.demo.controller;

import com.example.demo.models.Notification;
import com.example.demo.service.NotificationService;
import org.json.JSONObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequestMapping("/notification")
@RestController
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    public Map<Integer, SseEmitter> emitters = new HashMap<>();

    // method for client subscription
    @RequestMapping(value = "/subscribe", consumes = MediaType.ALL_VALUE)
    public SseEmitter subscribe(@RequestParam Integer userID) {
        SseEmitter sseEmitter = new SseEmitter(Long.MAX_VALUE);
        sendInitEvent(sseEmitter);
        emitters.put(userID, sseEmitter);

        sseEmitter.onCompletion(() -> emitters.remove(sseEmitter));
        sseEmitter.onTimeout(() -> emitters.remove(sseEmitter));
        sseEmitter.onError((e) -> emitters.remove(sseEmitter));
        //emitters.add(sseEmitter);
        return  sseEmitter;
    }

    private void sendInitEvent(SseEmitter sseEmitter) {
        try {
            sseEmitter.send(SseEmitter.event().name("INIT"));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public void dispatchEventToSpecificUser(List<Notification> notifications, Integer count) {
        //String eventFormatted = new JSONObject().put("notification", notification).toString();

        SseEmitter sseEmitter = emitters.get(notifications.get(0).getUserTo().getId());
        if (sseEmitter != null) {
            try {
                sseEmitter.send(SseEmitter.event().name("notifications").data(notifications));
                sseEmitter.send(SseEmitter.event().name("notificationCount").data(count));
            } catch (IOException e) {
                emitters.remove(sseEmitter);
            }
        }
    }

    @GetMapping("/{userID}")
    public ResponseEntity<List<Notification>> getNotificationsByUserID(@PathVariable Integer userID) {
        return ResponseEntity.ok(notificationService.getNotificationsByUserID(userID));
    }

    @GetMapping("/new/{userID}")
    public ResponseEntity<List<Notification>> getNotificationsByUserIDNotRead(@PathVariable Integer userID) {
        return ResponseEntity.ok(notificationService.getNotificationsByUserIDNotRead(userID));
    }

    @GetMapping("/limited/{userID}")
    public Page<Notification> getFirstSevenNotifications(@PathVariable Integer userID) {
        return notificationService.getFirstSevenNotifications(userID);
    }

    @GetMapping("/new/count/{userID}")
    public ResponseEntity<Integer> countByUserToIdAndReadFalse(@PathVariable Integer userID) {
        return ResponseEntity.ok(notificationService.countByUserToIdAndReadFalse(userID));
    }

    @PatchMapping("/read/{userID}")
    public void changeNotificationsStatusToRead(@PathVariable Integer userID) {
        notificationService.changeNotificationsStatusToRead(userID);
    }
}