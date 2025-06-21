import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent } from '../components/logo/logo.component';
import { FooterComponent } from '../components/footer/footer.component';







@NgModule({
  declarations: [LogoComponent, FooterComponent ],
  imports: [
    CommonModule
  ],
  exports: [LogoComponent, FooterComponent ] 
})
export class SharedModule { }
