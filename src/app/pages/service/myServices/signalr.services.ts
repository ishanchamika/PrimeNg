import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private hubConnection!: signalR.HubConnection;
  private messagesSubject = new BehaviorSubject<{ username: string; msg: string }[]>([]);
  messages$ = this.messagesSubject.asObservable();

  constructor() {}

  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7248/Chat')
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.hubConnection.on('ReceiveSpecificMessage', (username: string, msg: string) => {
      const currentMessages = this.messagesSubject.getValue();
      this.messagesSubject.next([...currentMessages, { username, msg }]);
    });

    this.hubConnection.start()
      .then(() => console.log('Connected to SignalR server!'))
      .catch(err => console.error('Error connecting to SignalR:', err));
  }

  joinChatRoom(username: string, chatroom: string) {
    if (this.hubConnection) {
      this.hubConnection.invoke('JoinSpecificChatRoom', { username, chatroom })
        .catch(err => console.error('Error joining chat room:', err));
    }
  }

  sendMessage(message: string) {
    if (this.hubConnection) {
      this.hubConnection.invoke('SendMessage', message)
        .catch(err => console.error('Error sending message:', err));
    }
  }
}
