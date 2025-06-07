import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeidosPageRoutingModule } from './leidos-routing.module';

import { LeidosPage } from './leidos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeidosPageRoutingModule
  ],
  declarations: [LeidosPage]
})
export class LeidosPageModule {}
