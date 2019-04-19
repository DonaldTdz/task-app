import { IonicModule } from '@ionic/angular';
import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SQLite } from '@ionic-native/sqlite/ngx';
import { LoginPage } from './login.page';
import { LoginPageRoutingModule } from './login.router.module';
import { UserInfoService } from 'src/services';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        LoginPageRoutingModule
    ],
    declarations: [LoginPage],
    providers: [SQLite]
})
export class LoginPageModule { }
