import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TabsFullModule } from './components/tabs/tabs-full.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TabComponent } from './components/tabs/components/tab/tab.component';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TabsFullModule,
    BrowserAnimationsModule,
  ],
  bootstrap: [AppComponent],
  entryComponents: [TabComponent],
})
export class AppModule {}
