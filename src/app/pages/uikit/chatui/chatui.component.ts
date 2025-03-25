import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Question {
  text: string;
  options?: { text: string; next: string }[];
  expectsInput?: boolean;
  next?: string;
}

// Define chatbot questions
const QUESTIONS: Record<string, Question> = {
  start: { 
    text: "Hello! Please select the correct option to register the customer.", 
    options: [
      { text: "Individual", next: "p_individual" },
      { text: "Corporate", next: "p_corporate" }
    ] 
  },

  // Individual Flow
  p_individual: { text: "Enter the NIC number:", expectsInput: true, next: "individual_name" },
  individual_name: { text: "Customer full name?", expectsInput: true, next: "individual_contact1" },
  individual_contact1: { text: "Contact number 1?", expectsInput: true, next: "individual_contact2" },
  individual_contact2: { text: "Contact number 2?", expectsInput: true, next: "individual_email" },
  individual_email: { text: "Email?", expectsInput: true },

  // Corporate Flow
  p_corporate: { text: "Enter the BR number:", expectsInput: true, next: "corporate_name" },
  corporate_name: { text: "What is the Business name?", expectsInput: true, next: "corporate_owner" },
  corporate_owner: { text: "Business Owner's name?", expectsInput: true, next: "corporate_address" },
  corporate_address: { text: "Permanent Address?", expectsInput: true, next: "corporate_mailing" },
  corporate_mailing: { text: "Mailing Address?", expectsInput: true }
};

@Component({
  selector: 'app-chatui',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatui.component.html',
  styleUrls: ['./chatui.component.scss']
})
export class ChatuiComponent {
  chatHistory: { message: string; type: 'bot' | 'user' }[] = [];
  currentQuestion: Question | null = null;
  userInput: string = '';

  constructor() {
    this.loadQuestion('start'); 
  }

  loadQuestion(questionKey: keyof typeof QUESTIONS) {
    if (!QUESTIONS[questionKey]) return;
    this.currentQuestion = QUESTIONS[questionKey];

    // Avoid duplicate questions
    if (!this.chatHistory.some(chat => chat.message === this.currentQuestion?.text)) {
      this.chatHistory.push({ message: this.currentQuestion.text, type: 'bot' });
    }
  }

  selectOption(option: { text: string; next: string }) {
    this.chatHistory.push({ message: option.text, type: 'user' });
    this.loadQuestion(option.next as keyof typeof QUESTIONS);
  }

  sendInput() {
    if (this.userInput.trim() === '' || !this.currentQuestion) return;

    // Add user's response
    this.chatHistory.push({ message: this.userInput, type: 'user' });
    this.userInput = '';

    // Move to the next question
    if (this.currentQuestion.next) {
      this.loadQuestion(this.currentQuestion.next as keyof typeof QUESTIONS);
    }
  }
}
