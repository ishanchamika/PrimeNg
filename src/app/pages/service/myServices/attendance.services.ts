import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class AttendanceService{
    private apiUrl = 'https://localhost:7248/api';

    constructor(private http: HttpClient){}

    getAttendance(): Observable<any>
    {
        return this.http.get(`${this.apiUrl}/Attendance`);
    }

    getAttendanceByDateAndUserId(userId: string, date: string): Observable<any>
    {
        return this.http.post(`${this.apiUrl}/Attendance/getAllByUserIdAndDate`, { userId, date });
    }

    markAttendance(userId: string, date: string, cameTime: string, leftTime: string, isUpdated: boolean, reason: string): Observable<any>
    {
        return this.http.post(`${this.apiUrl}/Attendance`, { userId, date, cameTime, leftTime, isUpdated, reason });
    }

}