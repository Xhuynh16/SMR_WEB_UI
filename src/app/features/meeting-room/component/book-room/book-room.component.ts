import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Equipment, MeetingRoom } from '../../../../../model/room.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetingRoomService } from '../../../../service/meeting/meeting-room.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-room',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './book-room.component.html',
  styleUrl: './book-room.component.scss'
})
export class BookRoomComponent implements OnInit {
  room: MeetingRoom | null = null;
  bookingForm: FormGroup;
  isSubmitting = false;
  isCheckingAvailability = false;
  isAvailable = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomService: MeetingRoomService,
    private fb: FormBuilder
  ) {
    this.bookingForm = this.fb.group({
      subject: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      attendeesCount: ['', [Validators.required, Validators.min(1)]],
      requiredEquipment: [[]],
      requestedBy: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const roomId = Number(this.route.snapshot.paramMap.get('id'));

    if (roomId) {
      this.roomService.getRoomById(roomId).subscribe(room => {
        this.room = room || null;

        if (!room) {
          this.router.navigate(['/dashboard/meeting-rooms']);
        } else if (room.status !== 'available') {
          this.isAvailable = false;
        }
      });
    } else {
      this.router.navigate(['/dashboard/meeting-rooms']);
    }
  }

  get workingEquipment(): Equipment[] {
    return this.room?.equipment.filter(e => e.status === 'working') || [];
  }

  checkAvailability(): void {
    if (this.bookingForm.invalid) {
      this.markFormGroupTouched(this.bookingForm);
      return;
    }

    this.isCheckingAvailability = true;

    // Simulate checking availability
    setTimeout(() => {
      this.isCheckingAvailability = false;
      this.isAvailable = true;
    }, 1000);
  }

  onSubmit(): void {
    if (this.bookingForm.invalid) {
      this.markFormGroupTouched(this.bookingForm);
      return;
    }

    if (!this.room) {
      return;
    }

    this.isSubmitting = true;

    const formValue = this.bookingForm.value;

    // Combine date and time
    const startDateTime = this.combineDateTime(formValue.startDate, formValue.startTime);
    const endDateTime = this.combineDateTime(formValue.endDate, formValue.endTime);

    const booking = {
      roomId: this.room.id,
      subject: formValue.subject,
      startTime: startDateTime,
      endTime: endDateTime,
      attendeesCount: formValue.attendeesCount,
      requiredEquipment: formValue.requiredEquipment,
      requestedBy: formValue.requestedBy,
      status: 'confirmed' as 'pending' | 'confirmed' | 'cancelled'
    };

    this.roomService.bookRoom(booking).subscribe(
      result => {
        this.isSubmitting = false;
        this.router.navigate(['/dashboard/meeting-rooms']);
      },
      error => {
        this.isSubmitting = false;
        console.error('Error booking room:', error);
      }
    );
  }

  cancel(): void {
    this.router.navigate(['/dashboard/meeting-rooms']);
  }

  private combineDateTime(date: string, time: string): Date {
    const dateObj = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);

    dateObj.setHours(hours, minutes, 0, 0);

    return dateObj;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  toggleEquipment(equipmentId: number, event: any): void {
    const isChecked = event.target.checked;
    const equipmentControl = this.bookingForm.get('requiredEquipment');

    if (!equipmentControl) return;

    const currentValue = equipmentControl.value || [];

    if (isChecked) {
      equipmentControl.setValue([...currentValue, equipmentId]);
    } else {
      equipmentControl.setValue(
        currentValue.filter((id: number) => id !== equipmentId)
      );
    }
  }
}