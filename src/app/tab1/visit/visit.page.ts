import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'visit',
    templateUrl: 'visit.page.html',
    styleUrls: ['visit.page.scss']
})
export class VisitPage {
    constructor(private router: Router) {
    }
    goDetail() {
        this.router.navigate(['/tabs/tab1/visit-detail']);
    }
    goVisit() {
        this.router.navigate(['/tabs/tab1/go-visit']);
    }
    goArea() {
        this.router.navigate(['/tabs/tab1/area']);
    }
    subArea() {

    }
}
