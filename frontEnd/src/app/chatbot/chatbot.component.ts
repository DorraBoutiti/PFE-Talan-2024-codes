import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, input } from '@angular/core';
import { AudioService } from './audio.service';
import { AdviceService } from './advice.service';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { User } from '../models/user.model';
import { MatIconModule } from '@angular/material/icon';

export class Message {
  type!: string;
  text!: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule
  ],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})

export class ChatbotComponent {
  @Input() currentUser!: User;
  chatOpenStatus = false;
  chatWindow1 = true;
  userText = '';
  messages: Message[] = [];

  constructor(private audioService: AudioService, private adviceService: AdviceService) { }

  chatOpen() {
    this.chatOpenStatus = true;
    this.chatWindow1 = true;
    this.audioService.playAudio();
  }

  chatClose() {
    this.chatOpenStatus = false;
    this.audioService.playAudio();
  }

  openConversation() {
    this.chatWindow1 = false;
    this.audioService.playAudio();
  }

  userResponse() {
    if (this.userText.trim() === '') {
      alert("Please type something!");
    } else {
      const message = { type: 'user', text: this.userText };
      this.messages.push(message);
      this.audioService.playNotification();
      this.userText = '';
      setTimeout(() => {
        this.adminResponse(message.text);
      }, 5000);
    }
  }

  adminResponse(message: string) {
    this.adviceService.sendMessage(message).subscribe(
      (response: any) => {
        this.messages.push({ type: 'admin', text: response.message });
        this.audioService.playNotification();
      }
    );
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.userResponse();
    }
  }
}
