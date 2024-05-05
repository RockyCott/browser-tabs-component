import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TabsFullModule } from './components/tabs/tabs-full.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { ExampleComponent } from './example/example.component';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TabsFullModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    ExampleComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
