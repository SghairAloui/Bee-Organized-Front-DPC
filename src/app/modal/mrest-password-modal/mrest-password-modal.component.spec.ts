import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrestPasswordModalComponent } from './mrest-password-modal.component';

describe('MrestPasswordModalComponent', () => {
  let component: MrestPasswordModalComponent;
  let fixture: ComponentFixture<MrestPasswordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MrestPasswordModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MrestPasswordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
