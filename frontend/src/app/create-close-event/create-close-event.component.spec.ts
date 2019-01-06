import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCloseEventComponent } from './create-close-event.component';

describe('CreateCloseEventComponent', () => {
  let component: CreateCloseEventComponent;
  let fixture: ComponentFixture<CreateCloseEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCloseEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCloseEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
