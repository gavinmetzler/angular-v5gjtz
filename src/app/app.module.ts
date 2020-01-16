import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
library.add(fas, fab);

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio'; 
import { MatGridListModule } from '@angular/material/grid-list'; 

import { AppComponent } from './app.component';
import { QuoteFormComponent } from './quote-form/quote-form.component';
import  {PostService} from './quote-form/services/post.service';

@NgModule({
  imports:      [ BrowserModule, ReactiveFormsModule, HttpClientModule, MatInputModule, MatSelectModule, MatButtonModule, MatCheckboxModule, MatChipsModule, FontAwesomeModule, BrowserAnimationsModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule, MatGridListModule ],
  declarations: [ AppComponent, QuoteFormComponent ],
  bootstrap:    [ AppComponent ],
  providers: [PostService]
})
export class AppModule { }
