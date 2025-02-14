import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class TaskService
{
    private apiUrl = 'https://localhost:7248/api';

    constructor(private http: HttpClient){}

    addTask(userId: string, taskName: string, taskDescription: string, taskStatus: string, taskDeadline: string): Observable<any>
    {
        return this.http.post(`${this.apiUrl}/Task`, { userId, taskName, taskDescription, taskStatus, taskDeadline });
    }
    getTaskByUserId(userId: string): Observable<any>
    {
        return this.http.get(`${this.apiUrl}/Task/${userId}`);
    }
}