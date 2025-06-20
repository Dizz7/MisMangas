import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PruebaMangasPageRoutingModule } from './prueba-mangas-routing.module';

import { PruebaMangasPage } from './prueba-mangas.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    PruebaMangasPageRoutingModule
  ],
  declarations: [PruebaMangasPage]
})
export class PruebaMangasPageModule {}
