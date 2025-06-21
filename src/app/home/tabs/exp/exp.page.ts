import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exp',
  templateUrl: './exp.page.html',
  styleUrls: ['./exp.page.scss'],
  standalone: false
})
export class ExpPage implements OnInit {

  user: string = '';
  empresa: string = '';
  trabaja_actualmente: boolean = false;
  anio_inicio: number | null = null;
  anio_termino: number | null = null;
  cargo: string = '';

  constructor() { }

  ngOnInit() {
  }

}
