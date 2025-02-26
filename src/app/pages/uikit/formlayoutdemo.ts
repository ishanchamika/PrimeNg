import { Component, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { SignalrService } from '../service/myServices/signalr.services';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-container">
      <div *ngIf="!joined">
        <input type="text" [(ngModel)]="username" placeholder="Enter username" />
        <input type="text" [(ngModel)]="chatRoom" placeholder="Enter chat room" />
        <button (click)="joinChat()">Join</button>
      </div>
      <div *ngIf="joined">
        <div class="messages">
          <div *ngFor="let msg of messages" class="message">
            {{ msg }}
          </div>
        </div>
        <input type="text" [(ngModel)]="message" placeholder="Type a message..." />
        <button (click)="sendMessage()">Send</button>
      </div>
    </div>
  `,
  styles: [`
    .chat-container { max-width: 400px; margin: auto; padding: 10px; border: 1px solid #ccc; border-radius: 5px; }
    .messages { height: 200px; overflow-y: scroll; border: 1px solid #ddd; margin-bottom: 10px; padding: 5px; }
    .message { padding: 5px; border-bottom: 1px solid #eee; }
    input, button { display: block; width: 100%; margin-bottom: 5px; padding: 8px; }
  `]
})
export class ChatComponent {
  message = '';
  messages: string[] = [];
  username = '';
  chatRoom = '';
  joined = false;

  constructor(private signalrService: SignalrService) {
    this.signalrService.messages$.subscribe(msgs => {
      this.messages = msgs;
    });
  }

  joinChat() {
    if (this.username.trim() && this.chatRoom.trim()) {
      this.signalrService.joinChatRoom(this.username, this.chatRoom);
      this.joined = true;
    }
  }

  sendMessage() {
    if (this.message.trim()) {
      this.signalrService.sendMessage(this.message, this.chatRoom);
      this.message = '';
    }
  }
}
