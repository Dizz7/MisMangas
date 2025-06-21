import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CertPage } from './cert.page';

describe('CertPage', () => {
  let component: CertPage;
  let fixture: ComponentFixture<CertPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CertPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
