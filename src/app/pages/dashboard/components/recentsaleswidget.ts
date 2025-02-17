import { Component, OnInit, OnDestroy } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Product, ProductService } from '../../service/product.service';
import { TaskService } from '../../service/myServices/tasks.services';
import { TabsModule } from 'primeng/tabs';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { Observable, Subscription } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { DialogModule } from 'primeng/dialog';
import { FluidModule } from 'primeng/fluid';
import { DatePickerModule } from 'primeng/datepicker';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TextareaModule } from 'primeng/textarea';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { SplitButtonModule } from 'primeng/splitbutton';




interface Task {
    id: number;
    taskName: string;
    taskDescription: string;
    taskStatus: string;
    taskDeadline: string;
}

@Component({
    standalone: true,
    selector: 'app-recent-sales-widget',
    imports: [CommonModule,FloatLabelModule, InputTextModule,InputGroupModule,InputGroupAddonModule,TextareaModule,ButtonGroupModule,SplitButtonModule, TableModule,FormsModule, ButtonModule, RippleModule, TabsModule, InputIconModule, RatingModule, TagModule, DialogModule, FluidModule, DatePickerModule, IconFieldModule],
    template: `
    <div class="card !mb-8 w-[1000px] ml-[-17%]">
        <div class="font-semibold text-xl mb-4">Tasks Manager</div>
        <p-tabs value="0">
            <p-tablist>
                <p-tab value="0">Pending</p-tab>
                <p-tab value="1">In Progress</p-tab>
                <p-tab value="2">Completed</p-tab>
            </p-tablist>
            <p-tabpanels>
                <p-tabpanel value="0">
                    <p-table [value]="tasks" dataKey="id" responsiveLayout="scroll">
                        <ng-template #header>
                            <tr>
                                <th style="width: 1rem">Id</th>
                                <th pSortableColumn="taskName" style="width: 1rem">Task Name <p-sortIcon field="taskName"></p-sortIcon></th>
                                <th pSortableColumn="taskDescription" style="width: 1rem">Description <p-sortIcon field="taskDescription"></p-sortIcon></th>
                                <th pSortableColumn="taskStatus" style="width: 1rem">Status <p-sortIcon field="taskStatus"></p-sortIcon></th>
                                <th pSortableColumn="taskDeadline" style="width: 1rem">Deadline <p-sortIcon field="taskDeadline"></p-sortIcon></th>
                                <th style="width: 11rem">Actions</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-task>
                            <tr>
                                <td>{{ task.id }}</td>
                                <td>{{ task.taskName }}</td>
                                <td>{{ task.taskDescription }}</td>
                                <td>{{ task.taskStatus }}</td>
                                <td>{{ task.taskDeadline }}</td>
                                <td class="flex flex-wrap gap-2">
                                    <p-button label="Start" rounded (click)="updatePendingToStarted(task.id)" />
                                    <p-button label="Edit" severity="info" rounded (click)="showAddTaskDialog(task.id, task.taskName, task.taskDescription, task.taskStatus, task.taskDeadline)" />
                                    <p-button label="Delete" severity="warn" rounded (click)="deleteTask(task.id)" />
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </p-tabpanel>

                <p-tabpanel value="1">
                    <p-table [value]="tasksDoing" dataKey="id" responsiveLayout="scroll">
                        <ng-template #header>
                            <tr>
                                <th style="width: 1rem">Id</th>
                                <th pSortableColumn="taskName" style="width: 1rem">Task Name <p-sortIcon field="taskName"></p-sortIcon></th>
                                <th pSortableColumn="taskDescription" style="width: 1rem">Description <p-sortIcon field="taskDescription"></p-sortIcon></th>
                                <th pSortableColumn="taskStatus" style="width: 1rem">Status <p-sortIcon field="taskStatus"></p-sortIcon></th>
                                <th pSortableColumn="taskDeadline" style="width: 1rem">Deadline <p-sortIcon field="taskDeadline"></p-sortIcon></th>
                                <th style="width: 11rem">Actions</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-task>
                            <tr>
                                <td>{{ task.id }}</td>
                                <td>{{ task.taskName }}</td>
                                <td>{{ task.taskDescription }}</td>
                                <td>{{ task.taskStatus }}</td>
                                <td>{{ task.taskDeadline }}</td>
                                <td class="flex flex-wrap gap-2">
                                    <p-button label="Complete" severity="success" rounded (click)="updateStartedToComplete(task.id)"/>
                                    <p-button label="Edit" severity="info" rounded  (click)="showAddTaskDialog(task.id, task.taskName, task.taskDescription, task.taskStatus, task.taskDeadline)"/>
                                    <p-button label="Delete" severity="warn" rounded (click)="deleteTask(task.id)"/>
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </p-tabpanel>

                <!-- task.id, task.taskName, task.taskDescription, task.taskStatus, task.taskDeadline -->
                <!-- Completed Tasks -->
                <p-tabpanel value="2">
                    <p-table [value]="tasksDone" dataKey="id" responsiveLayout="scroll">
                        <ng-template #header>
                            <tr>
                                <th style="width: 1rem">Id</th>
                                <th pSortableColumn="taskName" style="width: 1rem">Task Name <p-sortIcon field="taskName"></p-sortIcon></th>
                                <th pSortableColumn="taskDescription" style="width: 1rem">Description <p-sortIcon field="taskDescription"></p-sortIcon></th>
                                <th pSortableColumn="taskStatus" style="width: 1rem">Status <p-sortIcon field="taskStatus"></p-sortIcon></th>
                                <th pSortableColumn="taskDeadline" style="width: 1rem">Deadline <p-sortIcon field="taskDeadline"></p-sortIcon></th>
                                <!-- <th style="width: 11rem">Actions</th> -->
                            </tr>
                        </ng-template>
                        <ng-template #body let-task>
                            <tr>
                                <td>{{ task.id }}</td>
                                <td>{{ task.taskName }}</td>
                                <td>{{ task.taskDescription }}</td>
                                <td>{{ task.taskStatus }}</td>
                                <td>{{ task.taskDeadline }}</td>
                            </tr>
                        </ng-template>
                    </p-table>
                </p-tabpanel>
            </p-tabpanels>
        </p-tabs>
    </div>


    <!-- popup form  -->
    <p-dialog [(visible)]="displayTaskDialog" [modal]="true" header="Add New Task" [style]="{ width: '50vw', height: '70vw' }">
            <p-fluid class="flex flex-col md:flex-row gap-8">
                <div class="md:w-full">
                        <div class="card flex flex-col gap-4">
                            <input type="hidden" [(ngModel)]="newTask.id" />
                            <div class="font-semibold text-xl">Task Title</div>
                            <div class="flex flex-col md:flex-row gap-4">
                                <input pInputText type="text" placeholder="Default" [(ngModel)]="newTask.taskName"/>
                            </div>

                            <div class="font-semibold text-xl">Task Description</div>
                            <p-iconfield>
                                <p-inputicon class="pi pi-user" />
                                <input pInputText type="text" placeholder="description" [(ngModel)]="newTask.taskDescription"/>
                            </p-iconfield>

                            <div class="font-semibold text-xl">Task Status</div>
                            <select id="taskStatus" class="p-inputtext p-component" [(ngModel)]="newTask.taskStatus">
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>

                            <div class="font-semibold text-xl">Task Deadline</div>
                            <p-datepicker [(ngModel)]="newTask.taskDeadline" showIcon dateFormat="yy-mm-dd"></p-datepicker>
                        </div>
                </div>
            </p-fluid>
            <ng-template pTemplate="footer">
                <p-button label="Save" severity="success" (click)="saveTask(newTask.id, newTask.taskName, newTask.taskDescription, newTask.taskStatus, newTask.taskDeadline)" ></p-button>
                <p-button label="Cancel" severity="danger" (click)="displayTaskDialog = false" />
            </ng-template>
        </p-dialog>
    `,
    providers: [ProductService]
})
export class RecentSalesWidget implements OnInit, OnDestroy {
    displayTaskDialog: boolean = false;
    updateData: Task[] = [];
    newTask: Task = { id: 0, taskName: '', taskDescription: '', taskStatus: 'Pending', taskDeadline: '' };

    taskSubscription$!: Subscription;
    getAllTasks$!: Observable<any>;
    products!: Product[];
    updatePendingTostartedResult$!: Observable<any>;
    updateStartedToComplete$!: Observable<any>;

    tasks: Task[] = [];
    tasksDoing: Task[] = [];
    tasksDone: Task[] = [];

    lenTasks: number = 0;
    lenTasksDoing: number = 0;
    lenTasksDone: number = 0;

    constructor(private productService: ProductService, private taskService: TaskService) {}

    ngOnInit() 
    {
        this.getAllTasks();
    }

    getAllTasks()
    {
        const token = localStorage.getItem('authToken');
        if(!token) return;

        try 
        {
            const decoded: { UserId: string } = jwtDecode(token);
            // this.productService.getProductsSmall().then((data) => (this.products = data));
            this.getAllTasks$ = this.taskService.getTaskByUserId(decoded.UserId);

            this.taskSubscription$ = this.getAllTasks$.subscribe(
                (data) => 
                {
                    if(data.status && Array.isArray(data.tasks))
                    {
                        this.tasks = data.tasks.filter((task: Task) => task.taskStatus === 'Pending');
                        this.tasksDoing = data.tasks.filter((task: Task) => task.taskStatus === 'In Progress');
                        this.tasksDone = data.tasks.filter((task: Task) => task.taskStatus === 'Completed');

                        this.lenTasks = this.tasks.length;
                        this.lenTasksDoing = this.tasksDoing.length;
                        this.lenTasksDone = this.tasksDone.length;
                    } 
                    else 
                    {
                        console.error('Unexpected response format:', data);
                    }
                },
                (error) => 
                {
                    console.error('Error fetching tasks:', error);
                }
            );
        } 
        catch(error) 
        {
            console.error('Invalid token format:', error);
        }
    }
    ngOnDestroy() 
    {
        if(this.taskSubscription$) 
        {
            this.taskSubscription$.unsubscribe();
        }
    }

    updatePendingToStarted(id: number)
    {
        const confirmSave = confirm("Are you sure start this task?");
        if (!confirmSave) return;

        this.updatePendingTostartedResult$ = this.taskService.updatePendingToStarted(id);
        this.updatePendingTostartedResult$.subscribe(
            (data)=>
            {
                console.log('aaaaaaa', data);
                if(data.status === true)
                {
                    window.alert(data.message);
                }
                else
                {
                    window.alert("error updating task");
                }
            },
            (error)=>
            {
                console.error('Error fetching tasks:', error);
            });

        this.getAllTasks();
    }

    updateStartedToComplete(id: number)
    {
        const updateConfirm = confirm("Are you sure complete the task?");
        if(!updateConfirm) return;
        this.updateStartedToComplete$ = this.taskService.updateStartedToComplete(id);
        this.updateStartedToComplete$.subscribe(
            (data)=>
            {
                if(data.status === true)
                {
                    window.alert(data.message);
                }
                else
                {
                    window.alert("error updating task");
                }
            },
            (error)=>
            {
                console.error('Error updating task', error);
            });

        this.getAllTasks();
    }

    saveTask(taskId: number, taskName: string, taskDescription: string, taskStatus: string, taskDeadline: string)
    {
        const token = localStorage.getItem('authToken');
        if(!token) return;

        const dateOnly = new Date(this.newTask.taskDeadline).toISOString().split("T")[0];
        const decoded: any = jwtDecode(token);

        this.taskService.updateTask(taskId, decoded.UserId, taskName, taskDescription, taskStatus, dateOnly).subscribe(
            (data)=>
            {
                if(data.status === true)
                {
                    window.alert(data.message);
                    this.displayTaskDialog = false;
                }
                else
                {
                    window.alert(data.message);
                }
            },
            (error)=>
            {
                console.error('Error updating task', error);
                window.alert('Internal Server Error, please try again');
            });
    }

    deleteTask(taskId: number)
    {
        const updateConfirm = confirm("Are you sure complete the task?");
        if(!updateConfirm) return;

        this.taskService.deleteTask(taskId).subscribe(
            (data) =>
            {
                if(data.stats === true)
                {
                    window.alert(data.message);
                }
                else
                {
                    window.alert(data.message);
                }
            },
            (error) =>
            {
                console.log('server error', error);
                window.alert('Internal Server error, please try again later');
            }
        )
    }

    showAddTaskDialog(id: number, taskName: string, taskDescription: string, taskStatus: string, taskDeadline: string) 
    {
        this.displayTaskDialog = true;
        this.newTask = { id, taskName, taskDescription, taskStatus, taskDeadline };
        console.log('aaaa', this.newTask);
    }
}
