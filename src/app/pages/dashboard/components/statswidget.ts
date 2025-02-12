import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpeedDial } from 'primeng/speeddial';
import { ToastModule } from 'primeng/toast';
import { AttendanceService } from '../../service/myServices/attendance.services';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { SplitButtonModule } from 'primeng/splitbutton';




@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule, ButtonModule,  SplitButtonModule,  ButtonGroupModule, InputGroupAddonModule, TextareaModule, InputGroupModule, FormsModule, ToastModule, DialogModule,IconFieldModule, InputIconModule, FloatLabelModule,DatePickerModule, FluidModule, InputTextModule],
    template: `<div class="col-span-12 lg:col-span-6 xl:col-span-3">
                    <div class="card mb-0">
                        <div class="flex justify-between mb-4">
                            <div>
                                <span class="block text-muted-color font-medium mb-4">Add Task</span>
                                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">152</div>
                            </div>
                            <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem" (click)="showAddTaskDialog()">
                            <i class="pi pi-plus text-blue-500 !text-xl"></i>
                            </div>
                        </div>
                        <span class="text-primary font-medium">24 new </span>
                        <span class="text-muted-color">since last visit</span>
                    </div>
                </div>
                <div class="col-span-12 lg:col-span-6 xl:col-span-3">
                    <div class="card mb-0">
                        <div class="flex justify-between mb-4">
                            <div>
                                <span class="block text-muted-color font-medium mb-4">Started Tasks</span>
                                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">$2.100</div>
                            </div>
                            <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                                <i class="pi pi-pause text-orange-500 !text-xl"></i>
                            </div>
                        </div>
                        <span class="text-primary font-medium">%52+ </span>
                        <span class="text-muted-color">since last week</span>
                    </div>
                </div>
                <div class="col-span-12 lg:col-span-6 xl:col-span-3">
                    <div class="card mb-0">
                        <div class="flex justify-between mb-4">
                            <div>
                                <span class="block text-muted-color font-medium mb-4">Completed Tasks</span>
                                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">152 Unread</div>
                            </div>
                            <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                                <i class="pi pi-check text-purple-500 !text-xl"></i>
                            </div>
                        </div>
                        <span class="text-primary font-medium">85 </span>
                        <span class="text-muted-color">responded</span>
                    </div>
                </div>
                <div class="col-span-12 lg:col-span-6 xl:col-span-3">
                    <div class="card mb-0">
                        <div class="flex justify-between mb-4">
                            <div>
                                <span class="block text-muted-color font-medium mb-4">Attendance</span>
                                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ attendanceCount }}</div>
                            </div>
                            <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                                <i class="pi pi-users text-cyan-500 !text-xl"></i>
                            </div>
                        </div>
                        <span class="text-primary font-medium">{{ attendanceCount }} </span>
                        <span class="text-muted-color">In this month</span>
                    </div>
                </div> 


        <!-- Add Task Dialog -->
        <p-dialog [(visible)]="displayTaskDialog" [modal]="true" header="Add New Task" [style]="{ width: '50vw', height: '70vw' }">
            <p-fluid class="flex flex-col md:flex-row gap-8">
                <div class="md:w-1/2">
                        <div class="card flex flex-col gap-4">
                            <div class="font-semibold text-xl">Task Title</div>
                            <div class="flex flex-col md:flex-row gap-4">
                                <input pInputText type="text" placeholder="Default" [(ngModel)]="newTask.taskName" />
                            </div>

                            <div class="font-semibold text-xl">Task Description</div>
                            <p-iconfield>
                                <p-inputicon class="pi pi-user" />
                                <input pInputText type="text" placeholder="description" [(ngModel)]="newTask.taskDescription" />
                            </p-iconfield>

                            <div class="font-semibold text-xl">Task Status</div>
                            <select id="taskStatus" class="p-inputtext p-component" [(ngModel)]="newTask.taskStatus">
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>

                            <div class="font-semibold text-xl">Task Deadline</div>
                            <p-datepicker [showIcon]="true" [showButtonBar]="true" [(ngModel)]="newTask.taskDeadline"></p-datepicker>
                        </div>
                </div>
            </p-fluid>
            <ng-template pTemplate="footer">
                <p-button label="Save" severity="success" (click)="saveTask()"></p-button>
                <p-button label="Cancel" severity="danger" (click)="displayTaskDialog = false" />
            </ng-template>
        </p-dialog>
                `
})


export class StatsWidget implements OnInit
{
    attendanceData$!: Observable<any>;
    attendanceSubscription!: Subscription;
    attendanceCount: number = 0;
    totalTasks: number = 152;
    displayTaskDialog: boolean = false;
    
    newTask = {
        taskName: '',
        taskDescription: '',
        taskStatus: 'Pending',
        taskDeadline: ''
    };

    constructor(private attendanceService: AttendanceService, private router: Router)
    {
        const token = localStorage.getItem('authToken');
        if(!token) 
        {
            this.router.navigate(['/auth/login']);
            return;
        }
        try
        {
            const decoded: any = jwtDecode(token);
            // console.log("UserId:", decoded.UserId);
            // console.log("Email:", decoded.Email);
        }
        catch(error)
        {
            this.router.navigate(['/auth/login']);
        }
    }

    ngOnInit() 
    {
        this.attendanceData$ = this.getAttendanceData();
        this.attendanceSubscription = this.attendanceData$.subscribe(data => 
        {
            if(Array.isArray(data.data)) 
            {
                this.attendanceCount = data.data.length;
            } 
            else 
            {
                console.error('Unexpected response format:', data.data);
            }
        });
    }

    showAddTaskDialog() 
    {
        this.displayTaskDialog = true;
    }

    saveTask() 
    {
        if(this.newTask.taskName.trim() === '' || this.newTask.taskDescription.trim() === '' || this.newTask.taskDeadline === '') 
        {
            alert("All field are required");
            return;
        }

        alert("Successfully saved new task");
        console.log("New Task Added:", this.newTask);
        this.displayTaskDialog = false;

        // Reset form
        this.newTask = {
            taskName: '',
            taskDescription: '',
            taskStatus: 'Pending',
            taskDeadline: ''
        };
    }

    ngOnDestroy()
    {
        if(this.attendanceSubscription)
        {
            this.attendanceSubscription.unsubscribe(); // Prevent memory leaks
        }
    }
    getAttendanceData(): Observable<any> 
    {
        const token = localStorage.getItem('authToken');
        if (!token) return new Observable();

        const decoded: any = jwtDecode(token);
        const today = new Date();
        today.setMinutes(today.getMinutes() + today.getTimezoneOffset() + 330);
        const date = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD

        return this.attendanceService.getAttendanceByDateAndUserId(decoded.UserId, date);
    }
}