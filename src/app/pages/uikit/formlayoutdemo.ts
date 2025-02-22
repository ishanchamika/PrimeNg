import { Component } from '@angular/core';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';

import { SignalrService } from '../service/myServices/signalr.services';

@Component({
    selector: 'app-formlayout-demo',
    standalone: true,
    imports: [InputTextModule, FluidModule, ButtonModule, SelectModule, FormsModule, TextareaModule],
    template: `
            <div class="chat-container">
            <div class="messages">
                <div *ngFor="let msg of messages" class="message">
                {{ msg }}
                </div>
            </div>
            <input type="text" [(ngModel)]="message" placeholder="Type a message..." />
            <button (click)="sendMessage()">Send</button>
            </div>
`
})
export class FormLayoutDemo {
    message = '';
    messages: string[] = [];
    username = 'User1'; // Replace with dynamic user input
    chatRoom = 'General'; // Replace with dynamic chat room selection

    constructor(private signalrService: SignalrService) {
        this.signalrService.messages$.subscribe(msgs => {
            this.messages = msgs;
        });

        // Join chat room when component initializes
        this.signalrService.joinChatRoom(this.username, this.chatRoom);
    }

    sendMessage() {
        if (this.message.trim()) {
            this.signalrService.sendMessage(this.message, this.chatRoom);
            this.message = '';
        }
    }
}

