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
        .withUrl('https://localhost:7248/chat-hub')
        .configureLogging(signalR.LogLevel.Information)
        .withAutomaticReconnect()
        .build();

        this.hubConnection.start().catch(err => console.error(err));

        this.hubConnection.on('ReceiveMessage', (message: string) =>
        {
            this.messageSubject.next([...this.messageSubject.value, message]);
        });
    }

    sendMessage(message: String)
    {
        this.hubConnection.invoke('SendMessage', message).catch(err => console.error(err));
    }
}