import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from './modules/auth/auth.module';
import { CoreModule } from './modules/core/core.module';
import { GeneralModule } from './modules/general/general.module';
import { ToolbarModule } from './modules/toolbar/toolbar.module';
import { OperationsModule } from './modules/operations/operations.module';
import { MatIconModule } from '@angular/material/icon';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './modules/core/interceptors/auth.interceptor';







@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AuthModule,
    CoreModule,
    ToolbarModule,
    GeneralModule,
    OperationsModule,
    MatIconModule,

    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
