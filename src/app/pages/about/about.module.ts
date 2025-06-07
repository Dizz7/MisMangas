import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AboutPage } from './about.page';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';

import { AboutPageRoutingModule } from './about-routing.module';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    IonicModule,
    AboutPageRoutingModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatOption,
  ],
  declarations: [AboutPage]
})
export class AboutPageModule {

}

