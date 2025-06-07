import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PorLeerPageRoutingModule } from './por-leer-routing.module';

import { PorLeerPage } from './por-leer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PorLeerPageRoutingModule
  ],
  declarations: [PorLeerPage]
})
export class PorLeerPageModule {}
