import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'task-detail',
    templateUrl: 'task-detail.page.html',
    styleUrls: ['task-detail.page.scss']
})
export class TaskDetailPage {
    constructor(private router: Router) {
    }
    goDetails() {
        this.router.navigate(['/tabs/tab1/visit']);
    }
}
