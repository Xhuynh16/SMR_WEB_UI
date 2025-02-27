import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { error } from 'console';
import { Observable } from 'rxjs';
import { Meeting, MeetingCreateRequest } from '../../../../model/meeting';
import { Participant } from '../../../../model/participant';
import { Router, ActivatedRoute } from '@angular/router';
import { MeetingService } from '../../../service/meeting/meeting.service';
import { ParticipantService } from '../../../service/meeting/participant.service';
import { MeetingRoomService } from '../../../service/meeting/meeting-room.service';
import { NotificationService } from '../../../service/meeting/notification.service';
import { MeetingRoom } from '../../../../model/room.model';
import { RecurringMeetingFormComponent } from "../recurring-meeting-form/recurring-meeting-form.component";
import { ParticipantSelectorComponent } from "../participant-selector/participant-selector.component";
import { TimeSuggestionComponent } from "../time-suggestion/time-suggestion.component";
;

@Component({
  selector: 'app-create-meeting',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RecurringMeetingFormComponent, ParticipantSelectorComponent, TimeSuggestionComponent],
  templateUrl: './create-meeting.component.html',
  styleUrl: './create-meeting.component.scss'
})
export class CreateMeetingComponent implements OnInit {
  meetingForm!: FormGroup;
  isRecurring = false;
  showSuggestions = false;
  availableRooms: MeetingRoom[] = [];
  availableParticipants: Participant[] = [];
  selectedParticipants: Participant[] = [];
  selectedFiles: File[] = [];
  isLoading = false;
  isEditMode = false;
  meetingId?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private meetingService: MeetingService,
    private participantService: ParticipantService,
    private roomService: MeetingRoomService,
    private notificationService: NotificationService
  ) {
    this.meetingForm = this.fb.group({
      subject: ['', Validators.required],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endDate: ['', Validators.required],
      endTime: ['', Validators.required],
      location: ['', Validators.required],
      chairperson: ['', Validators.required],
      secretary: [''],
      content: [''],
      isRecurring: [false]
    });

    // Listen for changes to the isRecurring control
    this.meetingForm.get('isRecurring')?.valueChanges.subscribe(value => {
      this.isRecurring = value;
      if (value) {
        this.meetingForm.addControl('frequency', this.fb.control('weekly', Validators.required));
        this.meetingForm.addControl('weekDays', this.fb.control([]));
        this.meetingForm.addControl('monthDay', this.fb.control(1));
        this.meetingForm.addControl('endRecurringDate', this.fb.control('', Validators.required));
      } else {
        this.meetingForm.removeControl('frequency');
        this.meetingForm.removeControl('weekDays');
        this.meetingForm.removeControl('monthDay');
        this.meetingForm.removeControl('endRecurringDate');
      }
    });
  }

  ngOnInit(): void {
    // Kiểm tra xem có phải mode edit không
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.meetingId = +id;
      this.loadMeetingData(this.meetingId);
    } else {
      this.loadAvailableRooms();
      this.loadAvailableParticipants();
    }
  }

  private loadMeetingData(id: number): void {
    this.isLoading = true;
    this.meetingService.getMeetingById(id).subscribe(
      meeting => {
        // Cập nhật form với dữ liệu cuộc họp
        this.meetingForm.patchValue({
          subject: meeting.subject,
          startDate: this.formatDate(meeting.startTime),
          startTime: this.formatTime(meeting.startTime),
          endDate: this.formatDate(meeting.endTime),
          endTime: this.formatTime(meeting.endTime),
          location: meeting.location.id,
          chairperson: meeting.organizer.id,
          secretary: meeting.secretary?.id || '',
          content: meeting.content,
          isRecurring: meeting.recurring ? true : false
        });

        // Cập nhật danh sách người tham gia
        this.selectedParticipants = meeting.participants;

        // Cập nhật thông tin cuộc họp định kỳ nếu có
        if (meeting.recurring) {
          this.meetingForm.patchValue({
            frequency: meeting.recurring.frequency,
            weekDays: meeting.recurring.weekDays,
            monthDay: meeting.recurring.monthDay,
            endRecurringDate: this.formatDate(new Date(meeting.recurring.endDate))
          });
        }

        // Cập nhật danh sách tài liệu đính kèm
        if (meeting.attachments) {
          this.selectedFiles = meeting.attachments.map(att => new File([], att.name, {
            type: att.type
          }));
        }

        this.isLoading = false;
      },
      error => {
        this.notificationService.showError('Không thể tải thông tin cuộc họp');
        this.isLoading = false;
      }
    );
  }

  private formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  private formatTime(date: Date): string {
    return new Date(date).toTimeString().split(' ')[0].substr(0, 5);
  }

  loadAvailableRooms(): void {
    this.roomService.getRooms().subscribe(rooms => {
      this.availableRooms = rooms.filter(room => room.status === 'available');
    });
  }

  loadAvailableParticipants(): void {
    this.participantService.getAllParticipants().subscribe(participants => {
      this.availableParticipants = participants;
    });
  }

  onParticipantSelected(participants: Participant[]): void {
    this.selectedParticipants = participants;
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check file size (max 50MB)
      if (file.size <= 50 * 1024 * 1024) {
        this.selectedFiles.push(file);
      } else {
        this.notificationService.showError('File size exceeds 50MB limit');
      }
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  suggestTime(): void {
    this.showSuggestions = true;
    // Logic to suggest available time slots based on participants' schedules
  }

  saveMeeting(sendInvitation: boolean = false): void {
    if (this.meetingForm.invalid) {
      this.markFormGroupTouched(this.meetingForm);
      return;
    }

    this.isLoading = true;
    const formValue = this.meetingForm.value;

    // Create meeting object
    const meetingRequest: MeetingCreateRequest = {
      subject: formValue.subject,
      startDate: formValue.startDate,
      startTime: formValue.startTime,
      endDate: formValue.endDate,
      endTime: formValue.endTime,
      locationId: formValue.location,
      organizerId: formValue.chairperson,
      secretaryId: formValue.secretary || undefined,
      content: formValue.content,
      participantIds: this.selectedParticipants.map(p => Number(p.id)),
      attachments: this.selectedFiles,
      isRecurring: formValue.isRecurring,
      recurring: formValue.isRecurring ? {
        frequency: formValue.frequency,
        weekDays: formValue.weekDays,
        monthDay: formValue.monthDay,
        endDate: formValue.endRecurringDate
      } : undefined
    };

    // Upload files and create meeting
    this.uploadFiles().subscribe(fileIds => {
      this.meetingService.createMeeting(meetingRequest).subscribe(
        createdMeeting => {
          this.isLoading = false;
          if (sendInvitation) {
            this.sendInvitations(createdMeeting.id);
          }
          this.notificationService.showSuccess('Meeting created successfully');
          this.router.navigate(['/dashboard/schedule/detail', createdMeeting.id]);
        },
        error => {
          this.isLoading = false;
          this.notificationService.showError('Failed to create meeting');
        }
      );
    });
  }

  uploadFiles(): Observable<string[]> {
    return this.meetingService.uploadFiles(this.selectedFiles);
  }

  sendInvitations(meetingId: number): void {
    this.meetingService.resendInvitations(meetingId).subscribe(
      () => this.notificationService.showSuccess('Invitations sent successfully'),
      error => this.notificationService.showError('Failed to send invitations')
    );
  }

  cancel(): void {
    this.router.navigate(['/dashboard/schedule']);
  }

  private combineDateTime(date: string, time: string): Date {
    const dateObj = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);
    dateObj.setHours(hours, minutes);
    return dateObj;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  hasKnownFileExtension(filename: string): boolean {
    return /\.(doc|docx|xls|xlsx|ppt|pptx|pdf)$/i.test(filename);
  }

  onTimeSelected(timeSlot: { startTime: string, endTime: string }) {
    const startDateTime = new Date(timeSlot.startTime);
    const endDateTime = new Date(timeSlot.endTime);

    this.meetingForm.patchValue({
      startDate: startDateTime.toISOString().split('T')[0],
      startTime: startDateTime.toTimeString().slice(0, 5),
      endDate: endDateTime.toISOString().split('T')[0],
      endTime: endDateTime.toTimeString().slice(0, 5)
    });
  }
}
