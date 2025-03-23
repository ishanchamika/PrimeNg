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

import { TaskService } from '../../service/myServices/tasks.services';
import { IndexeddbService } from '../../../indexDB/indexeddb.service';


interface Task {
    id: number;
    taskName: string;
    taskDescription: string;
    taskStatus: 'Pending' | 'In Progress' | 'Completed';
    taskDeadline: string;
}

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule, ButtonModule,  SplitButtonModule,  ButtonGroupModule, InputGroupAddonModule, TextareaModule, InputGroupModule, FormsModule, ToastModule, DialogModule,IconFieldModule, InputIconModule, FloatLabelModule,DatePickerModule, FluidModule, InputTextModule],
    template: `<div class="col-span-12 lg:col-span-6 xl:col-span-3">
                    <div class="card mb-0">
                        <div class="flex justify-between mb-4">
                            <div>
                                <span class="block text-muted-color font-medium mb-4"><h6>Add Task</h6></span>
                                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{lenTasks}}</div>
                            </div>
                            <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem" (click)="showAddTaskDialog()">
                            <i class="pi pi-plus text-blue-500 !text-xl"></i>
                            </div>
                        </div>
                        <span class="text-primary font-medium">{{todayTasks}} </span>
                        <span class="text-muted-color">tasks should be completed today</span>
                        <!-- <p-button label="View" rounded /> -->
                    </div>
                </div>
                <div class="col-span-12 lg:col-span-6 xl:col-span-3">
                    <div class="card mb-0">
                        <div class="flex justify-between mb-4">
                            <div>
                                <span class="block text-muted-color font-medium mb-4"><h6>Started Tasks</h6></span>
                                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{lenTasksDoing}}</div>
                            </div>
                            <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                                <i class="pi pi-pause text-orange-500 !text-xl"></i>
                            </div>
                        </div>
                        <span class="text-primary font-medium">{{todayTasksDoing}} </span>
                        <span class="text-muted-color">tasks should be completed today</span>
                    </div>
                </div>
                <div class="col-span-12 lg:col-span-6 xl:col-span-3">
                    <div class="card mb-0">
                        <div class="flex justify-between mb-4">
                            <div>
                                <span class="block text-muted-color font-medium mb-4"><h6>Completed Tasks</h6></span>
                                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{lenTasksDone}}</div>
                            </div>
                            <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                                <i class="pi pi-check text-purple-500 !text-xl"></i>
                            </div>
                        </div>
                        <span class="text-primary font-medium">{{todayTasksDone}} </span>
                        <span class="text-muted-color">tasks you have done today</span>
                    </div>
                </div>
                <div class="col-span-12 lg:col-span-6 xl:col-span-3">
                    <div class="card mb-0" style="background-color: #ffffff;">
                        <div class="flex justify-between mb-4">
                            <div>
                                <span class="block text-muted-color font-medium mb-4"><h4>Attendance</h4></span>
                                <div class="text-surface-1000 dark:text-surface-0 font-bold text-xl">{{ attendanceCount }}</div>
                            </div>
                            <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                                <i class="pi pi-users text-cyan-500 !text-xl"></i>
                            </div>
                        </div>
                        <!-- <span class="text-primary font-medium">{{ attendanceCount }} </span> -->
                        <span class="text-muted-color">In this month</span>
                    </div>
                </div> 


        <!-- Add Task Dialog -->
        <p-dialog [(visible)]="displayTaskDialog" [modal]="true" header="Add New Task" [style]="{ width: '50vw', height: '70vw' }">
            <p-fluid class="flex flex-col md:flex-row gap-8">
                <div class="md:w-full">
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

    getAllTasks$!: Observable<any>;
    taskSubscription$!: Subscription;
    
    tasks: Task[] = [];
    tasksDoing: Task[] = [];
    tasksDone: Task[] = [];

    lenTasks: number = 0;
    lenTasksDoing: number = 0;
    lenTasksDone: number = 0;

    todayTasks: number = 0;
    todayTasksDoing: number = 0;
    todayTasksDone: number = 0;

    newTask = {
        taskName: '',
        taskDescription: '',
        taskStatus: 'Pending',
        taskDeadline: ''
    };

    constructor(private attendanceService: AttendanceService, private router: Router, private taskService: TaskService, private indexedDBService: IndexeddbService)
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
            // const loggedUser = {name: decoded.UserId, email: decoded.Email, stepData: 'Step 1 completed'};
            // this.indexedDBService.addCustomerData(loggedUser).then(()=>
            // {
            //     console.log('Data saved in IndexedDB');
            // });
        }
        catch(error)
        {
            this.router.navigate(['/auth/login']);
        }
    }

    ngOnInit() 
    {
        this.indexedDBService.getAllCustomerData().then(data => 
        {
            console.log('Retrieved IndexedDB Data:', data);
        });

        this.getAllTasks();
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
        const token = localStorage.getItem('authToken');
        if(!token) return new Observable();
        const decoded: any = jwtDecode(token);

        if(this.newTask.taskName.trim() === '' || this.newTask.taskDescription.trim() === '' || this.newTask.taskDeadline === '') 
        {
            alert("All field are required");
            return;
        }
        const confirmSave = confirm("Are you sure you want to add this task?");
        if (!confirmSave) return;

        const dateOnly = new Date(this.newTask.taskDeadline).toISOString().split("T")[0];

        this.taskService.addTask(decoded.UserId, this.newTask.taskName, this.newTask.taskDescription, this.newTask.taskStatus, dateOnly)
        .subscribe((response) => 
            {
                alert('Successfully added task');
                console.log('New Task Added:', response);
                this.displayTaskDialog = false;
                // Reset form
                this.newTask = {
                    taskName: '',
                    taskDescription: '',
                    taskStatus: 'Pending',
                    taskDeadline: ''
                };
            },
            (error) => 
            {
                console.error('Error adding task:', error);
                alert('Failed to add task');
            }
        );

        return;
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

    getAllTasks()
    {
        const token = localStorage.getItem('authToken');
        if(!token) return;

        try
        {
            const decoded: { UserId: string } = jwtDecode(token);
            this.getAllTasks$ = this.taskService.getTaskByUserId(decoded.UserId);
            this.getAllTasks$.subscribe(
                async (data)=>
                {
                    if(data.status && Array.isArray(data.tasks)) 
                    {
                        await this.indexedDBService.clearTasks();
                        await this.indexedDBService.addTasks(data.tasks);

                        this.tasks = data.tasks.filter((task: Task) => task.taskStatus === 'Pending');
                        this.tasksDoing = data.tasks.filter((task: Task) => task.taskStatus === 'In Progress');
                        this.tasksDone = data.tasks.filter((task: Task) => task.taskStatus === 'Completed');

                        this.lenTasks = this.tasks.length;
                        this.lenTasksDoing = this.tasksDoing.length;
                        this.lenTasksDone = this.tasksDone.length;

                        const today = new Date();
                        today.setMinutes(today.getMinutes() + today.getTimezoneOffset() + 330);
                        const date = today.toISOString().split('T')[0];

                        this.todayTasks = data.tasks.filter((task: Task) => task.taskStatus === 'Pending' && task.taskDeadline === date).length;
                        this.todayTasksDoing = data.tasks.filter((task: Task) => task.taskStatus === 'In Progress' && task.taskDeadline === date).length;
                        this.todayTasksDone = data.tasks.filter((task: Task) => task.taskStatus === 'Completed' && task.taskDeadline === date).length;
                    } 
                    else 
                    {
                        console.error('Unexpected response format:', data);
                    }
                },
                (error) => 
                {
                    console.error('Error fetching tasks:', error);
                });
        }
        catch(error)
        {
            console.error('Invalid token format:', error);
        }
    }
}