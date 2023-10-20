import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TabsFullModule } from './components/tabs/tabs-full.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TabsFullModule,
    BrowserAnimationsModule,
    MatCardModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
