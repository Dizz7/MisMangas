import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cert',
  templateUrl: './cert.page.html',
  styleUrls: ['./cert.page.scss'],
  standalone: false
})
export class CertPage implements OnInit {

  user: string = '';
  nombre_certificado: string = '';
  fecha_obtencion: string = '';
  certificado_vencimiento: boolean = false;
  fecha_vencimiento: string = '';

  constructor() { }

  ngOnInit() {
  }

}
