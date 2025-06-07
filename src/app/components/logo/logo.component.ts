import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
  standalone: false
})
export class LogoComponent {

  constructor() { }
  @Input() logoUrl: string = 'assets/images/logo.png';

}
