import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { TaskDetailPage } from './task-detail/task-detail.page';
import { VisitPage } from './visit/visit.page';
import { GoVisitPage } from './go-visit/go-visit.page';
import { AreaPage } from './area/area.page';
import { VisitDetailpage } from './visit-detail/visit-detail.page';
import { ServicesModule } from 'src/services/services.module';
import { AreaDetailPage } from './area-detail/area-detail.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: Tab1Page },
      { path: 'task-detail/:id', component: TaskDetailPage },
      { path: 'visit/:id', component: VisitPage },
      { path: 'go-visit/:id', component: GoVisitPage },
      { path: 'area/:id', component: AreaPage },
      { path: 'visit-detail/:id', component: VisitDetailpage },
      { path: 'area-detail/:id', component: AreaDetailPage }
    ])
  ],
  declarations: [Tab1Page, TaskDetailPage, VisitPage, GoVisitPage, AreaPage, VisitDetailpage, AreaDetailPage]
})
export class Tab1PageModule { }
