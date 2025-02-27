import { Component, OnInit } from '@angular/core';
import { Meeting } from '../../../../model/meeting';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetingService } from '../../../service/meeting/meeting.service';
import { NotificationService } from '../../../service/meeting/notification.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-meeting-participant-view',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './meeting-participant-view.component.html',
  styleUrl: './meeting-participant-view.component.scss'
})
export class MeetingParticipantViewComponent implements OnInit {
  meeting: Meeting | null = null;
  isLoading = true;
  declineReason = '';
  showDeclineForm = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private meetingService: MeetingService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadMeeting();
  }

  loadMeeting(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/dashboard/schedule']);
      return;
    }

    this.isLoading = true;
    this.meetingService.getMeetingById(Number(id)).subscribe(
      meeting => {
        this.meeting = meeting;
        this.isLoading = false;
      },
      error => {
        this.notificationService.showError('Không thể tải thông tin cuộc họp');
        this.isLoading = false;
        this.router.navigate(['/dashboard/schedule']);
      }
    );
  }

  acceptInvitation(): void {
    if (!this.meeting) return;

    this.isLoading = true;
    this.meetingService.updateAttendanceStatus(this.meeting.id, 'accept').subscribe(
      () => {
        this.notificationService.showSuccess('Đã xác nhận tham gia cuộc họp');
        this.isLoading = false;
        this.loadMeeting(); // Reload to get updated status
      },
      error => {
        this.notificationService.showError('Không thể cập nhật trạng thái tham gia');
        this.isLoading = false;
      }
    );
  }

  toggleDeclineForm(): void {
    this.showDeclineForm = !this.showDeclineForm;
    this.declineReason = '';
  }

  declineInvitation(): void {
    if (!this.meeting) return;

    this.isLoading = true;
    this.meetingService.updateAttendanceStatus(this.meeting.id, 'decline', this.declineReason).subscribe(
      () => {
        this.notificationService.showSuccess('Đã từ chối tham gia cuộc họp');
        this.isLoading = false;
        this.showDeclineForm = false;
        this.loadMeeting(); // Reload to get updated status
      },
      error => {
        this.notificationService.showError('Không thể cập nhật trạng thái tham gia');
        this.isLoading = false;
      }
    );
  }

  downloadAttachment(attachmentId: number): void {
    this.meetingService.downloadAttachment(attachmentId).subscribe(
      blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attachment-${attachmentId}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error => {
        this.notificationService.showError('Không thể tải tài liệu');
      }
    );
  }

  submitComment(): void {
    // Implementation for submitting comments
  }

  registerForSpeaking(): void {
    // Implementation for registering to speak
  }

  getMeetingStatusClass(): string {
    if (!this.meeting) return '';

    switch (this.meeting.status) {
      case 'scheduled': return 'status-scheduled';
      case 'in-progress': return 'status-in-progress';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  getMeetingStatusText(): string {
    if (!this.meeting) return '';

    switch (this.meeting.status) {
      case 'scheduled': return 'Đã lên lịch';
      case 'in-progress': return 'Đang diễn ra';
      case 'completed': return 'Đã hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return this.meeting.status;
    }
  }

  getMyAttendanceStatus(): string {
    if (!this.meeting) return '';

    // In a real app, you would get the current user's ID and find their status
    // For demo, we'll just return a fixed status
    return 'pending';
  }

  goBack(): void {
    this.router.navigate(['/dashboard/schedule']);
  }

  isOfficeFile(filename: string): boolean {
    return filename.match(/\.(doc|docx|xls|xlsx|ppt|pptx|pdf)$/i) !== null;
  }
}
