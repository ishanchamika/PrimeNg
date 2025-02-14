import { Component, OnInit } from '@angular/core';
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


@Component({
    standalone: true,
    selector: 'app-recent-sales-widget',
    imports: [CommonModule, TableModule, ButtonModule, RippleModule, TabsModule, RatingModule, TagModule],
    template: `
    <div class="card !mb-8 w-[800px]">
    <div class="font-semibold text-xl mb-4">Tasks Manage</div>
    <!-- <div class="card"> -->
            <div class="font-semibold text-xl mb-4">Tabs</div>
            <p-tabs value="0">
                <p-tablist>
                    <p-tab value="0">Pending</p-tab>
                    <p-tab value="1">In Progress</p-tab>
                    <p-tab value="2">Completed</p-tab>
                </p-tablist>
                <p-tabpanels>
                    <p-tabpanel value="0">
                        <p-table [value]="products" dataKey="name" responsiveLayout="scroll">
                            <ng-template #header>
                                <tr>
                                    <th style="width: 3rem"></th>
                                    <th pSortableColumn="name">
                                        Task Name
                                        <p-sortIcon field="name"></p-sortIcon>
                                    </th>
                                    <th pSortableColumn="price">
                                        Description
                                        <p-sortIcon field="price"></p-sortIcon>
                                    </th>
                                    <th pSortableColumn="category">
                                        Status
                                        <p-sortIcon field="category"></p-sortIcon>
                                    </th>
                                    <th pSortableColumn="rating">
                                        Deadline
                                        <p-sortIcon field="rating"></p-sortIcon>
                                    </th>
                                    <th pSortableColumn="inventoryStatus">
                                        Action
                                        <p-sortIcon field="inventoryStatus"></p-sortIcon>
                                    </th>
                                </tr>
                            </ng-template>
                            <ng-template #body let-product let-expanded="expanded">
                                <tr>
                                    <td><button type="button" pButton pRipple [pRowToggler]="product" class="p-button-text p-button-rounded p-button-plain" [icon]="expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"></button></td>
                                    <td style="min-width: 12rem;">{{ product.name }}</td>
                                    <td style="min-width: 8rem;">{{ product.price | currency: 'USD' }}</td>
                                    <td style="min-width: 10rem;">{{ product.category }}</td>
                                    <td style="min-width: 10rem;"><p-rating></p-rating></td>
                                    <td>
                                        <p-tag styleClass="dark:!bg-surface-900" />
                                    </td>
                                </tr>
                            </ng-template>
                        </p-table>
                    </p-tabpanel>
                    <p-tabpanel value="1">
                        <p class="m-0">
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
                            explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non
                            numquam eius modi.
                        </p>
                    </p-tabpanel>
                    <p-tabpanel value="2">
                        <p class="m-0">
                            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident,
                            similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio
                            cumque nihil impedit quo minus.
                        </p>
                    </p-tabpanel>
                </p-tabpanels>
            </p-tabs>
        <!-- </div> -->
    </div>`,
    providers: [ProductService]
})
export class RecentSalesWidget implements OnInit
{
    taskSubscription$!: Subscription;
    getAllTasks$!: Observable<any>;
    products!: Product[];

    constructor(private productService: ProductService, private taskService: TaskService) {}

    ngOnInit() 
    {
        const token = localStorage.getItem('authToken');
        if(!token) return new Observable();
        const decoded: any = jwtDecode(token);

        this.productService.getProductsSmall().then((data) => (this.products = data));
        this.getAllTasks$ = this.taskService.getTaskByUserId(decoded.UserId);
        this.taskSubscription$ = this.getAllTasks$.subscribe(data =>
        {
            if(data.status === true)
            {
                console.log('fffffff', data.tasks);
            }
            else
            {
                console.error('Unexpected response format:', data.data);
            }
        }
        )
        return;
    }
}
