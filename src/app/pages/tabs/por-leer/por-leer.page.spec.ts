import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PorLeerPage } from './por-leer.page';

describe('PorLeerPage', () => {
  let component: PorLeerPage;
  let fixture: ComponentFixture<PorLeerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PorLeerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
