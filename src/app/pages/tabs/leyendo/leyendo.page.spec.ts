import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeyendoPage } from './leyendo.page';

describe('LeyendoPage', () => {
  let component: LeyendoPage;
  let fixture: ComponentFixture<LeyendoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LeyendoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
