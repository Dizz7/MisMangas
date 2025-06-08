import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss'],
  standalone: false
})
export class ImageModalComponent {
  @Input() imagen: string = '';

  constructor(private modalCtrl: ModalController) {}

  cerrar() {
    this.modalCtrl.dismiss();
  }
}
