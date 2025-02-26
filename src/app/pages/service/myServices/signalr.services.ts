import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private hubConnection!: signalR.HubConnection;
  private messagesSubject = new BehaviorSubject<string[]>([]);
  private activeUsersSubject = new BehaviorSubject<number>(0);
  private messages: string[] = [];

  // Public observables for components to subscribe to
  messages$ = this.messagesSubject.asObservable();
  activeUsers$ = this.activeUsersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.startConnection();
  }

  private startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7248/Chat')
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect([0, 2000, 5000, 10000, 20000]) // Retry policy
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connected to SignalR'))
      .catch(err => {
        console.error('Error connecting to SignalR:', err);
        // Try reconnecting after 5 seconds
        setTimeout(() => this.startConnection(), 5000);
      });

    // Register event handlers
    this.registerEventHandlers();
  }

  private registerEventHandlers() {
    // Handle incoming messages from specific chat rooms
    this.hubConnection.on('ReceiveSpecificMessage', (username: string, msg: string) => {
      this.messages.push(`${username}: ${msg}`);
      this.messagesSubject.next([...this.messages]);
    });

    // Optional: Handle system messages if your backend supports them
    this.hubConnection.on('UserJoinedRoom', (username: string) => {
      const systemMessage = `System: ${username} has joined the chat`;
      this.messages.push(systemMessage);
      this.messagesSubject.next([...this.messages]);
      
      // Update active users count if available
      const currentCount = this.activeUsersSubject.value;
      this.activeUsersSubject.next(currentCount + 1);
    });

    this.hubConnection.on('UserLeftRoom', (username: string) => {
      const systemMessage = `System: ${username} has left the chat`;
      this.messages.push(systemMessage);
      this.messagesSubject.next([...this.messages]);
      
      // Update active users count if available
      const currentCount = this.activeUsersSubject.value;
      if (currentCount > 0) {
        this.activeUsersSubject.next(currentCount - 1);
      }
    });

    // Optional: Handle active users update if your backend supports it
    this.hubConnection.on('UpdateActiveUsers', (count: number) => {
      this.activeUsersSubject.next(count);
    });

    // Handle connection events
    this.hubConnection.onreconnecting((error) => {
      console.log('Attempting to reconnect to SignalR hub...', error);
    });

    this.hubConnection.onreconnected((connectionId) => {
      console.log('Reconnected to SignalR hub with connection ID:', connectionId);
    });

    this.hubConnection.onclose((error) => {
      console.log('Connection closed with error:', error);
      // Try to restart the connection
      setTimeout(() => this.startConnection(), 5000);
    });
  }

  joinChatRoom(username: string, chatRoom: string) {
    // Reset messages when joining a new room
    this.messages = [];
    this.messagesSubject.next([]);
    
    this.hubConnection.invoke('JoinSpecificChatRoom', { username, chatRoom })
      .catch(err => console.error('Error joining chat room:', err));
  }

  leaveChatRoom(chatRoom: string) {
    // Check if the connection is in the 'Connected' state
    if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
      // If your backend supports a leave room method, use it
      this.hubConnection.invoke('LeaveSpecificChatRoom', chatRoom)
        .catch(err => console.error('Error leaving chat room:', err));
    }
    
    // Reset messages
    this.messages = [];
    this.messagesSubject.next([]);
    this.activeUsersSubject.next(0);
  }

  sendMessage(message: string, chatRoom: string) {
    this.hubConnection.invoke('SendMessage', message)
      .catch(err => console.error('Error sending message:', err));
  }
  
  // Additional method to get active users if your backend supports it
  requestActiveUsers(chatRoom: string) {
    if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.invoke('GetActiveUsers', chatRoom)
        .catch(err => console.error('Error getting active users:', err));
    }
  }

  // Method to check connection state
  isConnected(): boolean {
    return this.hubConnection.state === signalR.HubConnectionState.Connected;
  }

  // Method to reconnect if connection is lost
  reconnect() {
    if (this.hubConnection.state !== signalR.HubConnectionState.Connected) {
      this.hubConnection.start()
        .then(() => console.log('Reconnected to SignalR'))
        .catch(err => console.error('Error reconnecting to SignalR:', err));
    }
  }
}