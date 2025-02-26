import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SignalrService } from '../service/myServices/signalr.services';
import { jwtDecode } from "jwt-decode";

interface ChatMessage {
  sender: string;
  content: string;
  timestamp: Date;
  isOwnMessage: boolean;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-app">
      <!-- Header -->
      <div class="header">
        <div class="header-content">
          <div *ngIf="joined" class="back-button" (click)="leaveChat()">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"></path>
            </svg>
          </div>
          <div class="title">
            <h2>{{ joined ? chatRoom : 'Chat' }}</h2>
            <small *ngIf="joined">{{ activeUsers }} active</small>
          </div>
        </div>
      </div>

      <!-- Join Screen -->
      <div *ngIf="!joined" class="join-container">
        <div class="join-card">
          <div class="profile-avatar">
            <span>{{ getInitials(email) }}</span>
          </div>
          <div class="user-info">
            <p>{{ email }}</p>
          </div>
          <div class="room-input">
            <input 
              type="text" 
              [(ngModel)]="chatRoom" 
              placeholder="Enter chat room name" 
              (keyup.enter)="joinChat()"
            />
          </div>
          <button class="join-button" (click)="joinChat()" [disabled]="!chatRoom.trim()">
            Join Room
          </button>
        </div>
      </div>

      <!-- Chat Screen -->
      <div *ngIf="joined" class="chat-container">
        <div class="message-list" #messageList>
          <div *ngIf="formattedMessages.length === 0" class="empty-chat">
            <div class="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#25D366" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <p>No messages yet</p>
              <small>Be the first to send a message!</small>
            </div>
          </div>
          
          <ng-container *ngFor="let msg of formattedMessages; let i = index">
            <!-- Date separator -->
            <div *ngIf="showDateSeparator(i)" class="date-separator">
              <span>{{ formatDateSeparator(msg.timestamp) }}</span>
            </div>
            
            <!-- Message item -->
            <div class="message-item" [ngClass]="{'own-message': msg.isOwnMessage, 'other-message': !msg.isOwnMessage}">
              <div class="message-bubble">
                <div *ngIf="!msg.isOwnMessage" class="sender-name">{{ msg.sender }}</div>
                <div class="message-content">{{ msg.content }}</div>
                <div class="message-time">{{ formatTime(msg.timestamp) }}</div>
              </div>
            </div>
          </ng-container>
        </div>

        <div class="message-input">
          <input 
            type="text" 
            [(ngModel)]="message" 
            placeholder="Type a message..." 
            (keyup.enter)="sendMessage()"
          />
          <button [disabled]="!message.trim()" (click)="sendMessage()">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chat-app {
      display: flex;
      flex-direction: column;
      height: 100vh;
      max-width: 100%;
      margin: 0 auto;
      background-color: #f0f2f5;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }

    .header {
      background-color: #128C7E;
      color: white;
      padding: 10px 16px;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .header-content {
      display: flex;
      align-items: center;
    }

    .back-button {
      margin-right: 10px;
      cursor: pointer;
    }

    .title {
      flex: 1;
    }

    .title h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 500;
    }

    .title small {
      font-size: 12px;
      opacity: 0.8;
    }

    /* Join Screen */
    .join-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .join-card {
      background: white;
      border-radius: 8px;
      padding: 30px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .profile-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background-color: #128C7E;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      margin-bottom: 16px;
    }

    .user-info {
      margin-bottom: 24px;
      text-align: center;
    }

    .room-input {
      width: 100%;
      margin-bottom: 16px;
    }

    .room-input input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #ddd;
      border-radius: 24px;
      font-size: 16px;
      box-sizing: border-box;
    }

    .join-button {
      background-color: #128C7E;
      color: white;
      border: none;
      border-radius: 24px;
      padding: 12px 24px;
      font-size: 16px;
      cursor: pointer;
      width: 100%;
      transition: background-color 0.3s;
    }

    .join-button:hover {
      background-color: #0e6b5e;
    }

    .join-button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    /* Chat Screen */
    .chat-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
      background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23e0e0e0' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E");
    }

    .message-list {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    }

    .empty-chat {
      display: flex;
      height: 100%;
      align-items: center;
      justify-content: center;
    }

    .empty-state {
      text-align: center;
      color: #888;
    }

    .date-separator {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 16px 0;
    }

    .date-separator span {
      background-color: rgba(225, 245, 254, 0.92);
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      color: #128C7E;
    }

    .message-item {
      margin-bottom: 8px;
      display: flex;
      flex-direction: column;
    }

    .own-message {
      align-items: flex-end;
    }

    .other-message {
      align-items: flex-start;
    }

    .message-bubble {
      max-width: 75%;
      padding: 8px 12px;
      border-radius: 8px;
      position: relative;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .own-message .message-bubble {
      background-color: #dcf8c6;
      border-radius: 8px 0 8px 8px;
    }

    .other-message .message-bubble {
      background-color: white;
      border-radius: 0 8px 8px 8px;
    }

    .sender-name {
      font-size: 12px;
      font-weight: bold;
      color: #128C7E;
      margin-bottom: 2px;
    }

    .message-content {
      font-size: 14px;
      word-break: break-word;
    }

    .message-time {
      font-size: 11px;
      color: #888;
      text-align: right;
      margin-top: 2px;
    }

    .message-input {
      padding: 12px;
      background-color: #f0f2f5;
      display: flex;
      align-items: center;
      border-top: 1px solid #e1e1e1;
    }

    .message-input input {
      flex: 1;
      padding: 12px 16px;
      border: none;
      border-radius: 24px;
      font-size: 15px;
      background-color: white;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .message-input button {
      margin-left: 8px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #128C7E;
      color: white;
      border: none;
      cursor: pointer;
    }

    .message-input button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .message-input button svg {
      width: 20px;
      height: 20px;
    }
  `]
})
export class ChatComponent implements OnInit, OnDestroy {
  message = '';
  messages: string[] = [];
  formattedMessages: ChatMessage[] = [];
  username = '';
  chatRoom = '';
  joined = false;
  email: string = '';
  activeUsers: number = 0;
  private subscription: Subscription = new Subscription();

  constructor(private signalrService: SignalrService) {
    this.loadUserFromToken();
  }

  ngOnInit() {
    // Subscribe to messages from SignalR service
    this.subscription.add(
      this.signalrService.messages$.subscribe(msgs => {
        this.messages = msgs;
        this.formatMessages();
      })
    );

    // Subscribe to active users count
    this.subscription.add(
      this.signalrService.activeUsers$.subscribe(count => {
        this.activeUsers = count;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (this.joined) {
      this.signalrService.leaveChatRoom(this.chatRoom);
    }
  }

  loadUserFromToken() {
    const token = localStorage.getItem('authToken');

    if (!token) {
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      this.email = decoded.Email;
      this.username = decoded.Email; // Use email as username
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  joinChat() {
    if (this.chatRoom.trim()) {
      this.signalrService.joinChatRoom(this.username, this.chatRoom);
      this.joined = true;
      // Clear any previous messages when joining a new room
      this.messages = [];
      this.formattedMessages = [];
    }
  }

  leaveChat() {
    this.signalrService.leaveChatRoom(this.chatRoom);
    this.joined = false;
    this.chatRoom = '';
    this.messages = [];
    this.formattedMessages = [];
  }

  sendMessage() {
    if (this.message.trim()) {
      this.signalrService.sendMessage(this.message, this.chatRoom);
      this.message = '';
    }
  }

  formatMessages() {
    this.formattedMessages = this.messages.map(msg => {
      const parts = msg.split(': ');
      const sender = parts[0];
      const content = parts.slice(1).join(': ');
      
      return {
        sender: sender,
        content: content,
        timestamp: new Date(),
        isOwnMessage: sender === this.username
      };
    });
  }

  showDateSeparator(index: number): boolean {
    if (index === 0) return true;
    
    const currentDate = new Date(this.formattedMessages[index].timestamp);
    const previousDate = new Date(this.formattedMessages[index - 1].timestamp);
    
    return currentDate.toDateString() !== previousDate.toDateString();
  }

  formatDateSeparator(date: Date): string {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined 
      });
    }
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  }

  getInitials(email: string): string {
    if (!email) return '?';
    
    const parts = email.split('@')[0].split(/[._-]/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }
}