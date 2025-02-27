import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSuggestionComponent } from './time-suggestion.component';

describe('TimeSuggestionComponent', () => {
  let component: TimeSuggestionComponent;
  let fixture: ComponentFixture<TimeSuggestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeSuggestionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimeSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
