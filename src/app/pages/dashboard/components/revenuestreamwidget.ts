import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { debounceTime, Observable, Subscription } from 'rxjs';
import { LayoutService } from '../../../layout/service/layout.service';
import { TaskService } from '../../service/myServices/tasks.services';
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
    selector: 'app-revenue-stream-widget',
    imports: [ChartModule],
    template: `<div class="card !mb-8">
        <div class="font-semibold text-xl mb-4">Revenue Stream</div>
        <p-chart type="bar" [data]="chartData" [options]="chartOptions" class="h-80" />
    </div>`
})
export class RevenueStreamWidget 
{
    chartData: any;
    chartOptions: any;
    subscription!: Subscription;

    taskSubscription$!: Subscription;
    getAllTasks$!: Observable<any>;
    tasks: Task[] = [];
    tasksDoing: Task[] = [];
    tasksDone: Task[] = [];

    lenTasks: number = 0;
    lenTasksDoing: number = 0;
    lenTasksDone: number = 0;
    constructor(public layoutService: LayoutService, private taskService: TaskService) 
    {
        this.subscription = this.layoutService.configUpdate$.pipe(debounceTime(25)).subscribe(() => 
        {
            this.initChart();
        });
    }

    ngOnInit() 
    {
        this.getAllTasks();
    }
    
    getAllTasks() 
    {
        const token = localStorage.getItem('authToken');
        if (!token) return;
    
        try 
        {
            const decoded: { UserId: string } = jwtDecode(token);
            this.getAllTasks$ = this.taskService.getTaskByUserId(decoded.UserId);
    
            this.taskSubscription$ = this.getAllTasks$.subscribe(
                (data) => 
                {
                    if (data.status && Array.isArray(data.tasks)) 
                    {
                        this.tasks = data.tasks.filter((task: Task) => task.taskStatus === 'Pending');
                        this.tasksDoing = data.tasks.filter((task: Task) => task.taskStatus === 'In Progress');
                        this.tasksDone = data.tasks.filter((task: Task) => task.taskStatus === 'Completed');
    
                        this.lenTasks = this.tasks.length;
                        this.lenTasksDoing = this.tasksDoing.length;
                        this.lenTasksDone = this.tasksDone.length;
    
                        this.initChart();
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
        catch (error) 
        {
            console.error('Invalid token format:', error);
        }
    }
    
    // Modify initChart() to use task lengths
    initChart() 
    {
        const documentStyle = getComputedStyle(document.documentElement);
    
        this.chartData = 
        {
            labels: ['Pending', 'In Progress', 'Completed'],
            datasets: [
                {
                    type: 'bar',
                    label: 'Tasks',
                    backgroundColor: documentStyle.getPropertyValue('--p-primary-400'),
                    data: [this.lenTasks, this.lenTasksDoing, this.lenTasksDone], // Use fetched task counts
                    barThickness: 32
                }
            ]
        };
    
        this.chartOptions = 
        {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: documentStyle.getPropertyValue('--text-color')
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        color: documentStyle.getPropertyValue('--text-color-secondary')
                    },
                    grid: {
                        color: 'transparent',
                        borderColor: 'transparent'
                    }
                },
                y: {
                    stacked: true,
                    ticks: {
                        color: documentStyle.getPropertyValue('--text-color-secondary')
                    },
                    grid: {
                        color: documentStyle.getPropertyValue('--surface-border'),
                        borderColor: 'transparent',
                        drawTicks: false
                    }
                }
            }
        };
    }
    
    ngOnDestroy() 
    {
        if(this.subscription) 
        {
            this.subscription.unsubscribe();
        }
    }
}
