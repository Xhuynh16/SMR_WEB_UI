import { Component, OnInit } from '@angular/core';
import { MeetingRoom } from '../../../../../model/room.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetingRoomService } from '../../../../service/meeting/meeting-room.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-issue',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './report-issue.component.html',
  styleUrl: './report-issue.component.scss'
})
export class ReportIssueComponent implements OnInit {
  room: MeetingRoom | null = null;
  reportForm: FormGroup;
  isSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomService: MeetingRoomService,
    private fb: FormBuilder
  ) {
    this.reportForm = this.fb.group({
      type: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      reportedBy: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const roomId = Number(this.route.snapshot.paramMap.get('id'));

    if (roomId) {
      this.roomService.getRoomById(roomId).subscribe(room => {
        this.room = room || null;

        if (!room) {
          this.router.navigate(['/dashboard/meeting-rooms']);
        }
      });
    } else {
      this.router.navigate(['/dashboard/meeting-rooms']);
    }
  }

  onSubmit(): void {
    if (this.reportForm.invalid) {
      this.markFormGroupTouched(this.reportForm);
      return;
    }

    if (!this.room) {
      return;
    }

    this.isSubmitting = true;

    const formValue = this.reportForm.value;

    const issue = {
      roomId: this.room.id,
      type: formValue.type,
      description: formValue.description,
      reportedBy: formValue.reportedBy
    };

    this.roomService.reportIssue(issue).subscribe(
      result => {
        this.isSubmitting = false;
        this.router.navigate(['/dashboard/meeting-rooms']);
      },
      error => {
        this.isSubmitting = false;
        console.error('Error reporting issue:', error);
      }
    );
  }

  cancel(): void {
    this.router.navigate(['/dashboard/meeting-rooms']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}
