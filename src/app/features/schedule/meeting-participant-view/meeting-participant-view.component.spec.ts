import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingParticipantViewComponent } from './meeting-participant-view.component';

describe('MeetingParticipantViewComponent', () => {
  let component: MeetingParticipantViewComponent;
  let fixture: ComponentFixture<MeetingParticipantViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingParticipantViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeetingParticipantViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
