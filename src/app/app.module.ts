import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { HttpClientModule } from '@angular/common/http';
// import { SQLite } from '@ionic-native/sqlite/ngx';
// import { SQLite, SQLiteDatabaseConfig, SQLiteObject } from '@ionic-native/sqlite';

// class SQLiteMock {
//   public create(config: SQLiteDatabaseConfig): Promise<SQLiteObject> {

//     return new Promise((resolve, reject) => {
//       resolve(new SQLiteObject(new Object()));
//     });
//   }
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
    // { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },

    // { provide: SQLite, useClass: SQLiteMock },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

