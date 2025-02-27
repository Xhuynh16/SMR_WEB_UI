import { Component, OnInit } from '@angular/core';
import { Meeting } from '../../../../model/meeting';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetingService } from '../../../service/meeting/meeting.service';
import { NotificationService } from '../../../service/meeting/notification.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-meeting-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './meeting-detail.component.html',
  styleUrl: './meeting-detail.component.scss'
})
export class MeetingDetailComponent implements OnInit {
  meeting: Meeting | null = null;
  isCreator = false;
  isLoading = true;

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
        this.isCreator = this.checkIfCreator(meeting);
        this.isLoading = false;
      },
      error => {
        this.notificationService.showError('Không thể tải thông tin cuộc họp');
        this.isLoading = false;
        this.router.navigate(['/dashboard/schedule']);
      }
    );
  }

  checkIfCreator(meeting: Meeting): boolean {
    // Check if current user is the creator of the meeting
    // This would typically compare the meeting.createdBy with the current user ID
    return true; // For demo purposes
  }

  editMeeting(): void {
    if (this.meeting) {
      this.router.navigate(['/dashboard/schedule/edit', this.meeting.id]);
    }
  }

  cancelMeeting(): void {
    if (!this.meeting) return;

    this.notificationService.showConfirmation(
      'Bạn có chắc chắn muốn hủy cuộc họp này không?',
      () => {
        this.isLoading = true;
        this.meetingService.cancelMeeting(this.meeting!.id, 'Cancelled by organizer').subscribe(
          () => {
            this.notificationService.showSuccess('Đã hủy cuộc họp thành công');
            this.isLoading = false;
            this.loadMeeting();
          },
          error => {
            this.notificationService.showError('Không thể hủy cuộc họp');
            this.isLoading = false;
          }
        );
      }
    );
  }

  resendInvitations(): void {
    if (!this.meeting) return;

    this.isLoading = true;
    this.meetingService.resendInvitations(this.meeting.id).subscribe(
      () => {
        this.notificationService.showSuccess('Đã gửi lại thư mời thành công');
        this.isLoading = false;
      },
      error => {
        this.notificationService.showError('Không thể gửi lại thư mời');
        this.isLoading = false;
      }
    );
  }

  exportToPdf(): void {
    if (!this.meeting) return;

    this.isLoading = true;
    this.meetingService.exportMeetingToPdf(this.meeting.id).subscribe(
      blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cuoc-hop-${this.meeting!.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.isLoading = false;
      },
      error => {
        this.notificationService.showError('Không thể xuất file PDF');
        this.isLoading = false;
      }
    );
  }

  closeMeeting(): void {
    if (!this.meeting) return;

    this.notificationService.showConfirmation(
      'Bạn có chắc chắn muốn đóng phiên họp này không?',
      () => {
        this.isLoading = true;
        this.meetingService.closeMeeting(this.meeting!.id).subscribe(
          () => {
            this.notificationService.showSuccess('Đã đóng phiên họp thành công');
            this.isLoading = false;
            this.loadMeeting();
          },
          error => {
            this.notificationService.showError('Không thể đóng phiên họp');
            this.isLoading = false;
          }
        );
      }
    );
  }

  downloadReport(): void {
    if (!this.meeting) return;

    this.isLoading = true;
    this.meetingService.downloadMeetingReport(this.meeting.id).subscribe(
      blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bao-cao-cuoc-hop-${this.meeting!.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.isLoading = false;
      },
      error => {
        this.notificationService.showError('Không thể tải báo cáo cuộc họp');
        this.isLoading = false;
      }
    );
  }

  confirmAttendance(status: 'accept' | 'decline', reason?: string): void {
    if (!this.meeting) return;

    this.isLoading = true;
    this.meetingService.updateAttendanceStatus(this.meeting.id, status, reason).subscribe(
      () => {
        this.notificationService.showSuccess('Đã cập nhật trạng thái tham gia');
        this.isLoading = false;
        this.loadMeeting(); // Reload to get updated status
      },
      error => {
        this.notificationService.showError('Không thể cập nhật trạng thái tham gia');
        this.isLoading = false;
      }
    );
  }

  getParticipantStatusClass(status: string): string {
    switch (status) {
      case 'accepted': return 'status-accepted';
      case 'declined': return 'status-declined';
      case 'pending': return 'status-pending';
      default: return '';
    }
  }

  getParticipantStatusText(status: string): string {
    switch (status) {
      case 'accepted': return 'Tham gia';
      case 'declined': return 'Từ chối';
      case 'pending': return 'Chờ xác nhận';
      default: return status;
    }
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

  goBack(): void {
    this.router.navigate(['/dashboard/schedule']);
  }

  isOfficeFile(filename: string): boolean {
    return filename.match(/\.(doc|docx|xls|xlsx|ppt|pptx|pdf)$/i) !== null;
  }

  downloadAttachment(attachmentId: number): void {
    this.meetingService.downloadAttachment(attachmentId).subscribe(
      (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    );
  }
}
