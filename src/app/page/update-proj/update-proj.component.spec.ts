import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProjComponent } from './update-proj.component';

describe('UpdateProjComponent', () => {
  let component: UpdateProjComponent;
  let fixture: ComponentFixture<UpdateProjComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateProjComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateProjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
