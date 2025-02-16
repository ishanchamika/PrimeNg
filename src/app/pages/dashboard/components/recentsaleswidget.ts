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

interface Task {
    id: number;
    taskName: string;
    taskDescription: string;
    taskStatus: 'Pending' | 'In Progress' | 'Completed';
    taskDeadline: string;
}

@Component({
    standalone: true,
    selector: 'app-recent-sales-widget',
    imports: [CommonModule, TableModule, ButtonModule, RippleModule, TabsModule, RatingModule, TagModule],
    template: `
    <div class="card !mb-8 w-[1000px]">
        <div class="font-semibold text-xl mb-4">Tasks Manage</div>
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
                                    <p-button label="Edit" severity="info" rounded />
                                    <p-button label="Delete" severity="warn" rounded />
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </p-tabpanel>

                <p-tabpanel value="1">
                    <p-table [value]="tasksDoing" dataKey="id" responsiveLayout="scroll">
                        <ng-template #header>
                            <tr>
                                <th>Id</th>
                                <th>Task Name</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Deadline</th>
                                <th>Actions</th>
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
                                    <p-button label="Edit" severity="info" rounded />
                                    <p-button label="Delete" severity="warn" rounded />
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </p-tabpanel>

                <!-- Completed Tasks -->
                <p-tabpanel value="2">
                    <p-table [value]="tasksDone" dataKey="id" responsiveLayout="scroll">
                        <ng-template #header>
                            <tr>
                                <th>Id</th>
                                <th>Task Name</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Deadline</th>
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
    `,
    providers: [ProductService]
})
export class RecentSalesWidget implements OnInit, OnDestroy {
    taskSubscription$!: Subscription;
    getAllTasks$!: Observable<any>;
    products!: Product[];
    updatePendingTostartedResult$!: Observable<any>;
    updateStartedToComplete$!: Observable<any>;

    tasks: Task[] = [];
    tasksDoing: Task[] = [];
    tasksDone: Task[] = [];

    constructor(private productService: ProductService, private taskService: TaskService) {}

    ngOnInit() 
    {
        const token = localStorage.getItem('authToken');
        if(!token) return;

        try 
        {
            const decoded: { UserId: string } = jwtDecode(token);
            this.productService.getProductsSmall().then((data) => (this.products = data));
            this.getAllTasks$ = this.taskService.getTaskByUserId(decoded.UserId);

            this.taskSubscription$ = this.getAllTasks$.subscribe(
                (data) => 
                {
                    if(data.status && Array.isArray(data.tasks)) 
                    {
                        this.tasks = data.tasks.filter((task: Task) => task.taskStatus === 'Pending');
                        this.tasksDoing = data.tasks.filter((task: Task) => task.taskStatus === 'In Progress');
                        this.tasksDone = data.tasks.filter((task: Task) => task.taskStatus === 'Completed');

                        console.log('Pending Tasks:', this.tasks);
                        console.log('In Progress Tasks:', this.tasksDoing);
                        console.log('Completed Tasks:', this.tasksDone);
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
    }
}
