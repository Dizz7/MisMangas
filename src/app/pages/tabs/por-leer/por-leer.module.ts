import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PorLeerPageRoutingModule } from './por-leer-routing.module';

import { PorLeerPage } from './por-leer.page';
import { SharedModule } from '../../../shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';



@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    IonicModule,
    PorLeerPageRoutingModule,
    MatFormFieldModule,
    MatLabel,
    MatOption,
    MatSelectModule,
  ],
  declarations: [PorLeerPage]
})
export class PorLeerPageModule {}
