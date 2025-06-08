import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeidosPageRoutingModule } from './leidos-routing.module';

import { LeidosPage } from './leidos.page';
import { SharedModule } from 'src/app/shared/shared.module';
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
    LeidosPageRoutingModule,
    MatFormFieldModule,
    MatLabel,
    MatOption,
    MatSelectModule,
  ],
  declarations: [LeidosPage]
})
export class LeidosPageModule {}
