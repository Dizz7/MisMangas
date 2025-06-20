import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PruebaMangasPage } from './prueba-mangas.page';

describe('PruebaMangasPage', () => {
  let component: PruebaMangasPage;
  let fixture: ComponentFixture<PruebaMangasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PruebaMangasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
