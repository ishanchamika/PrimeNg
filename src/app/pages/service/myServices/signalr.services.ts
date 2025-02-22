import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { sendMessage } from '@microsoft/signalr/dist/esm/Utils';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })

export class SignalrService
{
    private hubConnection!: signalR.HubConnection;
    private messageSubject = new BehaviorSubject<string[]>([]);
    messages$ = this.messageSubject.asObservable();

    constructor()
    {
        this.startConnection();
    }

    private startConnection() 
    {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl('http://localhost:7248/chat') 
            .configureLogging(signalR.LogLevel.Information)
            .withAutomaticReconnect()
            .build();
    
        this.hubConnection.start()
            .then(() => console.log('Connected to SignalR Hub'))
            .catch(err => console.error('SignalR Connection Error:', err));
    
        this.hubConnection.on('ReceiveMessage', (username: string, message: string) => {
            this.messageSubject.next([...this.messageSubject.value, `${username}: ${message}`]);
        });
    }
    

    joinChatRoom(username: string, chatRoom: string) {
        const user = { username, chatRoom };
        this.hubConnection.invoke('JoinSpecificChatRoom', user)
            .catch(err => console.error('Join Room Error:', err));
    }
    

    sendMessage(message: string, chatRoom: string) {
        this.hubConnection.invoke('SendMessage', { message, chatRoom })
            .catch(err => console.error('Send Message Error:', err));
    }
    
}