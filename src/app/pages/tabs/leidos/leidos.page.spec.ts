import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeidosPage } from './leidos.page';

describe('LeidosPage', () => {
  let component: LeidosPage;
  let fixture: ComponentFixture<LeidosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LeidosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
