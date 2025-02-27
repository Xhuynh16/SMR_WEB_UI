import { Component, OnInit } from '@angular/core';
import { Meeting } from '../../../../model/meeting';
import { Router } from '@angular/router';
import { MeetingService } from '../../../service/meeting/meeting.service';
import { NotificationService } from '../../../service/meeting/notification.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-meeting-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './meeting-list.component.html',
  styleUrl: './meeting-list.component.scss'
})
export class MeetingListComponent implements OnInit {
  meetings: Meeting[] = [];
  filteredMeetings: Meeting[] = [];
  isLoading = true;

  // Filter options
  viewMode: 'all' | 'upcoming' | 'past' | 'created' | 'invited' = 'upcoming';
  searchQuery = '';

  constructor(
    private router: Router,
    private meetingService: MeetingService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadMeetings();
  }

  loadMeetings(): void {
    this.isLoading = true;
    this.meetingService.getMeetings().subscribe(
      meetings => {
        this.meetings = meetings;
        this.applyFilters();
        this.isLoading = false;
      },
      error => {
        this.notificationService.showError('Không thể tải danh sách cuộc họp');
        this.isLoading = false;
      }
    );
  }

  applyFilters(): void {
    let result = [...this.meetings];

    // Apply view mode filter
    const now = new Date();

    switch (this.viewMode) {
      case 'upcoming':
        result = result.filter(m => new Date(m.startTime) > now);
        break;
      case 'past':
        result = result.filter(m => new Date(m.startTime) < now);
        break;
      case 'created':
        // In a real app, you would filter by the current user's ID
        result = result.filter(m => m.createdBy === 1); // Assuming current user ID is 1
        break;
      case 'invited':
        // In a real app, you would filter by meetings where the current user is a participant
        result = result.filter(m => m.createdBy !== 1); // Assuming current user ID is 1
        break;
    }

    // Apply search query filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      result = result.filter(m =>
        m.subject.toLowerCase().includes(query) ||
        m.location.name.toLowerCase().includes(query) ||
        m.organizer.fullName.toLowerCase().includes(query)
      );
    }

    this.filteredMeetings = result;
  }

  setViewMode(mode: 'all' | 'upcoming' | 'past' | 'created' | 'invited'): void {
    this.viewMode = mode;
    this.applyFilters();
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.applyFilters();
  }

  createMeeting(): void {
    this.router.navigate(['/dashboard/schedule/create']);
  }

  viewMeeting(id: number): void {
    this.router.navigate(['/dashboard/schedule/detail', id]);
  }

  getMeetingStatusClass(status: string): string {
    switch (status) {
      case 'scheduled': return 'status-scheduled';
      case 'in-progress': return 'status-in-progress';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  getMeetingStatusText(status: string): string {
    switch (status) {
      case 'scheduled': return 'Đã lên lịch';
      case 'in-progress': return 'Đang diễn ra';
      case 'completed': return 'Đã hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  }

  formatTimeRange(startTime: Date, endTime: Date): string {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const startDate = start.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
    const startTimeStr = start.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const endTimeStr = end.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    return `${startDate}, ${startTimeStr} - ${endTimeStr}`;
  }
}