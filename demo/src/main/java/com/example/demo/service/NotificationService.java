package com.example.demo.service;

import com.example.demo.controller.NotificationController;
import com.example.demo.models.Notification;
import com.example.demo.repository.NotificationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class NotificationService {
    private final NotificationRepository notificationRepository;
    //private final NotificationController notificationController;
    public NotificationService(NotificationRepository notificationRepository/*, NotificationController notificationController*/) {
        this.notificationRepository = notificationRepository;
        //this.notificationController = notificationController;
    }

    public Map<Integer, SseEmitter> emitters = new HashMap<>();

    /*public void dispatchEventToSpecificUser(Notification notification) {
        String eventFormatted = new JSONObject().put("notification", notification).toString();

        SseEmitter sseEmitter = emitters.get(notification.getUserTo().getId());
        if(sseEmitter != null) {
            try {
                sseEmitter.send(SseEmitter.event().name("notifications").data(eventFormatted));
            } catch (IOException e) {
                emitters.remove(sseEmitter);
            }
        }
    }*/

    public Notification createNotificationStorage(Notification notificationStorage) {
        return notificationRepository.save(notificationStorage);
    }

    public Notification getNotificationsByID(Integer id) {
        return notificationRepository.findById(id).orElseThrow(() -> new RuntimeException("notification not found!"));
    }

    public List<Notification> getNotificationsByUserID(Integer userID) {
        return notificationRepository.findByUserToIdOrderByDateDesc(userID);
    }

    public Page<Notification> getFirstSevenNotifications(Integer userID) {
        Pageable pageable = PageRequest.of(0, 7);
        return notificationRepository.findByUserToIdOrderByDateDesc(userID, pageable);
    }

    public List<Notification> getNotificationsByUserIDNotRead(Integer userID) {
        return notificationRepository.findByUserToIdAndReadFalseOrderByDateDesc(userID);
    }

    public void changeNotificationsStatusToRead(Integer userID) {
        List<Notification> notifications = notificationRepository.findByUserToIdOrderByDateDesc(userID);
                //.orElseThrow(() -> new RuntimeException("not found!"));
        for(Notification notification : notifications) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }

        //List<Notification> notificationsNotRead = getNotificationsByUserIDNotRead(userID);
        //Integer count = countByUserToIdAndReadFalse((userID));

        //notificationController.dispatchEventToSpecificUser(null, count);
    }

    public Integer countByUserToIdAndReadFalse(Integer userID) {
        return notificationRepository.countByUserToIdAndReadFalse(userID);
    }

    public void clear() {
        notificationRepository.deleteAll();
    }
}
