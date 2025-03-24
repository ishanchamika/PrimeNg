import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = 'https://localhost:7248/api';

  constructor(private http: HttpClient) {}

  signup(name: any, email:any, password:any): Observable<any> {
    const body = { name, email, password }; 
    return this.http.post(`${this.apiUrl}/Signup`, body);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Signup/login`, { email, password });
  }

  getAllUsers(){
    return this.http.get(`${this.apiUrl}/Signup`);
  }
}
