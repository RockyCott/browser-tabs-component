import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TabsFullModule } from './components/tabs/tabs-full.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PersonEditComponent } from './people/person-edit.component';
import { PeopleListComponent } from './people/people-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TabComponent } from './components/tabs/components/tab/tab.component';

@NgModule({
  declarations: [
    AppComponent,
    PersonEditComponent,
    PeopleListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TabsFullModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
  ],
  bootstrap: [AppComponent],
  entryComponents: [TabComponent]
})
export class AppModule {}
