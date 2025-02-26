import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SignalrService 
{
  private hubConnection!: signalR.HubConnection;
  private messagesSubject = new BehaviorSubject<string[]>([]);
  messages$ = this.messagesSubject.asObservable();
  private messages: string[] = [];

  constructor(private http: HttpClient) 
  {
    this.startConnection();
  }

  private startConnection() 
  {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7248/Chat')
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connected to SignalR'))
      .catch(err => console.error('Error connecting to SignalR:', err));

    this.hubConnection.on('ReceiveSpecificMessage', (username: string, msg: string) => {
      this.messages.push(`${username}: ${msg}`);
      this.messagesSubject.next([...this.messages]);
    });
  }

  joinChatRoom(username: string, chatRoom: string) {
    this.hubConnection.invoke('JoinSpecificChatRoom', { username, chatRoom })
      .catch(err => console.error('Error joining chat room:', err));
  }

  sendMessage(message: string, chatRoom: string) {
    this.hubConnection.invoke('SendMessage', message)
      .catch(err => console.error('Error sending message:', err));
  }
}
