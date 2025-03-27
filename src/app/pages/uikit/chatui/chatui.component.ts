import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { ChatUIindexdb } from '../../../indexDB/chatUIindexdb.service';
import { ChatUIindexdb } from '../../../indexDB/UserInputindexeddb.service';

interface Question {
  text: string;
  options?: { text: string; next: string }[];
  expectsInput?: boolean;
  next?: string;
}

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
  individual_name: { text: "Customer full name?", expectsInput: true, next: "individual_address" },

  // Expanded Address Input
  individual_address: { 
    text: "Enter Customer Address", 
    expectsInput: true, 
    next: "individual_contact1" 
  },

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
  currentQuestionKey: string = '';  // Track the current question key
  userInput: string = '';

  // Variables for multi-part address input
  permanentLine1: string = '';
  permanentLine2: string = '';
  permanentLine3: string = '';

  mailingLine1: string = '';
  mailingLine2: string = '';
  mailingLine3: string = '';

  constructor(private dbService: ChatUIindexdb) 
  {
    this.loadQuestion('start'); 
  }

  loadQuestion(questionKey: keyof typeof QUESTIONS) {
    if (!QUESTIONS[questionKey]) return;
    this.currentQuestion = QUESTIONS[questionKey];
    this.currentQuestionKey = questionKey;  // Store the question key

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

  // Store input in IndexedDB
  this.dbService.addData('customer_inputs', {
    key: this.currentQuestionKey, // Store input under the corresponding question key
    value: this.userInput
  });

  // Add user's response to chat history
  this.chatHistory.push({ message: this.userInput, type: 'user' });
  this.userInput = '';

  // Move to the next question
  if (this.currentQuestion.next) {
    this.loadQuestion(this.currentQuestion.next as keyof typeof QUESTIONS);
  }
}
sendAddressInput() {
  if (
    !this.permanentLine1.trim() && !this.permanentLine2.trim() && !this.permanentLine3.trim() &&
    !this.mailingLine1.trim() && !this.mailingLine2.trim() && !this.mailingLine3.trim()
  ) return;

  // Format the address properly
  const fullPermanentAddress = `${this.permanentLine1}, ${this.permanentLine2}, ${this.permanentLine3}`.trim();
  const fullMailingAddress = `${this.mailingLine1}, ${this.mailingLine2}, ${this.mailingLine3}`.trim();

  // Create an object array to store addresses
  const addresses = [
    { type: 'permanent', address: fullPermanentAddress },
    { type: 'mailing', address: fullMailingAddress }
  ];

  // Store the address array in IndexedDB as a JSON string
  this.dbService.addData('customer_inputs', { key: 'addresses', value: JSON.stringify(addresses) });

  // Add to chat history for display
  this.chatHistory.push({ message: `Permanent Address: ${fullPermanentAddress}`, type: 'user' });
  this.chatHistory.push({ message: `Mailing Address: ${fullMailingAddress}`, type: 'user' });

  // Clear input fields
  this.permanentLine1 = '';
  this.permanentLine2 = '';
  this.permanentLine3 = '';
  this.mailingLine1 = '';
  this.mailingLine2 = '';
  this.mailingLine3 = '';

  // Move to the next question if available
  if (this.currentQuestion?.next) {
    this.loadQuestion(this.currentQuestion.next as keyof typeof QUESTIONS);
  }
}



}
