package com.example.demo.test;

import org.json.JSONObject;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

//@RestController
@Service
public class Controller {
    //public List<SseEmitter> emitters = new CopyOnWriteArrayList<>();
    //public Map<String, SseEmitter> emitters = new HashMap<>();

    // method for client subscription
    /*@CrossOrigin("*")
    @RequestMapping(value = "/subscribe", consumes = MediaType.ALL_VALUE)
    public SseEmitter subscribe(@RequestParam String userID) {
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
    }*/

    // method for dispatching events to a specific User
    /*@CrossOrigin
    @PostMapping(value = "/dispatchEventToSpecificUser")*/
    /*public void dispatchEventToClients(String title, String text, String userID) {
        String eventFormatted = new JSONObject().put("title", title).put("text", text).toString();

        SseEmitter sseEmitter = emitters.get(userID);
        if(sseEmitter != null) {
            try {
                sseEmitter.send(SseEmitter.event().name("latestNews").data(eventFormatted));
            } catch (IOException e) {
                emitters.remove(sseEmitter);
            }
        }
    }*/

    // method for dispatching events to all clients
    /*@CrossOrigin
    @PostMapping(value = "/dispatchEvent")
    public void dispatchEventToClients(@RequestParam String title, @RequestParam String text) {
        String eventFormatted = new JSONObject().put("title", title).put("text", text).toString();
        for(SseEmitter emitter: emitters) {
            try {
                emitter.send(SseEmitter.event().name("latestNews").data(eventFormatted));
            } catch (IOException e) {
                emitters.remove(emitter);
            }
        }
    }*/
}