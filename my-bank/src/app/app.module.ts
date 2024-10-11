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
import { ProtectedComponent } from './protected/protected.component';






@NgModule({
  declarations: [
    AppComponent,
    ProtectedComponent,
    
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
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
