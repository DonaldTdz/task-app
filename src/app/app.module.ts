import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { HttpClientModule } from '@angular/common/http';
import { UserInfoService } from 'src/services/common/userinfo.service';
// import { SQLite } from '@ionic-native/sqlite/ngx';
// import { SQLite, SQLiteDatabaseConfig, SQLiteObject } from '@ionic-native/sqlite';

// class SQLiteMock {
//   public create(config: SQLiteDatabaseConfig): Promise<SQLiteObject> {

//     return new Promise((resolve, reject) => {
//       resolve(new SQLiteObject(new Object()));
//     });
//   }
// }
// export function StartupServiceFactory(injector: Injector): Function {
//   return () => {
//     let settingSer = injector.get(UserInfoService);
//     // await settingSer.initDB();
//     return settingSer.initSys();
//   };
// }

// export function IninDBFactory(injector: Injector): Function {
//   return () => {
//     let settingSer = injector.get(UserInfoService);
//     return settingSer.getUserInfo();
//   };
// }

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    StatusBar,
    SQLite,
    SplashScreen,
    // UserInfoService,
    // { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },

    // { provide: SQLite, useClass: SQLiteMock },

    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: StartupServiceFactory,
    //   deps: [Injector],
    //   multi: true
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

