import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseEventsComponent } from './close-events.component';

describe('CloseEventsComponent', () => {
  let component: CloseEventsComponent;
  let fixture: ComponentFixture<CloseEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
