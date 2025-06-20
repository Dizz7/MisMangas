import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Geolocation, Position } from '@capacitor/geolocation';


declare var google: any;

  
@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
  standalone: false
})
export class MapaPage implements OnInit, OnDestroy {



  watchId: any;
  lat: number = 0;
  lng: number = 0;

  constructor(
    private router: Router, 
    private menuCtrl: MenuController
  ){}

  ngOnInit() {
    this.menuCtrl.close("main-menu");
    this.startWatchingPosition();
  }

  ngOnDestroy() {
    this.stopWatchingPosition();
  }

  async startWatchingPosition() {
    this.watchId = Geolocation.watchPosition({}, (position, err) => {
      if (position) {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.loadMap();
      }
      if (err) {
        console.error('Error obteniendo posición:', err);
      }
    });
  }

  stopWatchingPosition() {
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
    }
  }

  loadMap() {
    const mapEle = document.getElementById('map');
    if (!mapEle) return;

    const map = new google.maps.Map(mapEle, {
      center: { lat: this.lat, lng: this.lng },
      zoom: 15
    });

    new google.maps.Marker({
      position: { lat: this.lat, lng: this.lng },
      map,
      title: 'Ubicación actual'
    });
  }
}