import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingRoomLayoutComponent } from './meeting-room-layout.component';

describe('MeetingRoomLayoutComponent', () => {
  let component: MeetingRoomLayoutComponent;
  let fixture: ComponentFixture<MeetingRoomLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingRoomLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeetingRoomLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
