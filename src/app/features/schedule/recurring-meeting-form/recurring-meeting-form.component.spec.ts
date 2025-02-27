import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringMeetingFormComponent } from './recurring-meeting-form.component';

describe('RecurringMeetingFormComponent', () => {
  let component: RecurringMeetingFormComponent;
  let fixture: ComponentFixture<RecurringMeetingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecurringMeetingFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecurringMeetingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
