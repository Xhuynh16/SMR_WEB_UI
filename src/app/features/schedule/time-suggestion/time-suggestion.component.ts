import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Participant } from '../../../../model/participant';
import { MeetingService } from '../../../service/meeting/meeting.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
interface TimeSlot {
  date: Date;
  startTime: string;
  endTime: string;
  availableParticipants: number;
  totalParticipants: number;
}
@Component({
  selector: 'app-time-suggestion',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './time-suggestion.component.html',
  styleUrl: './time-suggestion.component.scss'
})
export class TimeSuggestionComponent implements OnInit {
  @Input() participants: Participant[] = [];
  @Output() timeSelected = new EventEmitter<{ startDate: string, startTime: string, endDate: string, endTime: string }>();

  suggestedTimeSlots: TimeSlot[] = [];
  isLoading = false;

  constructor(private meetingService: MeetingService) { }

  ngOnInit(): void {
    this.getSuggestedTimeSlots();
  }

  getSuggestedTimeSlots(): void {
    if (this.participants.length === 0) {
      return;
    }

    this.isLoading = true;
    const participantIds = this.participants.map(p => p.id);

    this.meetingService.getSuggestedTimeSlots(participantIds).subscribe(
      timeSlots => {
        this.suggestedTimeSlots = timeSlots;
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching suggested time slots:', error);
        this.isLoading = false;

        // Fallback with dummy data for demo
        this.generateDummyTimeSlots();
      }
    );
  }

  selectTimeSlot(slot: TimeSlot): void {
    const date = this.formatDate(slot.date);
    const [startHour, startMinute] = slot.startTime.split(':');
    const [endHour, endMinute] = slot.endTime.split(':');

    const startDate = new Date(slot.date);
    const endDate = new Date(slot.date);

    this.timeSelected.emit({
      startDate: date,
      startTime: slot.startTime,
      endDate: date,
      endTime: slot.endTime
    });
  }

  getAvailabilityPercentage(slot: TimeSlot): number {
    return (slot.availableParticipants / slot.totalParticipants) * 100;
  }

  getAvailabilityClass(slot: TimeSlot): string {
    const percentage = this.getAvailabilityPercentage(slot);
    if (percentage === 100) return 'excellent';
    if (percentage >= 75) return 'good';
    if (percentage >= 50) return 'fair';
    return 'poor';
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private generateDummyTimeSlots(): void {
    // Generate dummy time slots for demo purposes
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    this.suggestedTimeSlots = [
      {
        date: tomorrow,
        startTime: '09:00',
        endTime: '10:00',
        availableParticipants: this.participants.length,
        totalParticipants: this.participants.length
      },
      {
        date: tomorrow,
        startTime: '14:00',
        endTime: '15:00',
        availableParticipants: Math.floor(this.participants.length * 0.8),
        totalParticipants: this.participants.length
      },
      {
        date: dayAfterTomorrow,
        startTime: '10:00',
        endTime: '11:00',
        availableParticipants: Math.floor(this.participants.length * 0.9),
        totalParticipants: this.participants.length
      },
      {
        date: dayAfterTomorrow,
        startTime: '15:00',
        endTime: '16:00',
        availableParticipants: Math.floor(this.participants.length * 0.7),
        totalParticipants: this.participants.length
      }
    ];
  }
}
