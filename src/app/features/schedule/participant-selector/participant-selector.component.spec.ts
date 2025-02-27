import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantSelectorComponent } from './participant-selector.component';

describe('ParticipantSelectorComponent', () => {
  let component: ParticipantSelectorComponent;
  let fixture: ComponentFixture<ParticipantSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParticipantSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
