import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';

import { MapaPageRoutingModule } from './mapa-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { MapaPage } from './mapa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    MapaPageRoutingModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatOption,
  ],
  declarations: [MapaPage]
})
export class MapaPageModule {}
