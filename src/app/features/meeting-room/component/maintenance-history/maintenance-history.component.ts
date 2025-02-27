import { Component, OnInit } from '@angular/core';
import { MaintenanceRecord, MeetingRoom } from '../../../../../model/room.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetingRoomService } from '../../../../service/meeting/meeting-room.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-maintenance-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './maintenance-history.component.html',
  styleUrl: './maintenance-history.component.scss'
})
export class MaintenanceHistoryComponent implements OnInit {
  room: MeetingRoom | null = null;
  maintenanceRecords: MaintenanceRecord[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomService: MeetingRoomService
  ) { }

  ngOnInit(): void {
    const roomId = Number(this.route.snapshot.paramMap.get('id'));

    if (roomId) {
      this.roomService.getRoomById(roomId).subscribe(room => {
        this.room = room || null;

        if (!room) {
          this.router.navigate(['/dashboard/meeting-rooms']);
        } else {
          this.loadMaintenanceHistory(roomId);
        }
      });
    } else {
      this.router.navigate(['/dashboard/meeting-rooms']);
    }
  }

  loadMaintenanceHistory(roomId: number): void {
    this.isLoading = true;

    this.roomService.getMaintenanceHistory(roomId).subscribe(
      records => {
        this.maintenanceRecords = records;
        this.isLoading = false;
      },
      error => {
        console.error('Error loading maintenance history:', error);
        this.isLoading = false;
      }
    );
  }

  getMaintenanceTypeText(type: string): string {
    switch (type) {
      case 'cleaning':
        return 'Vệ sinh';
      case 'repair':
        return 'Sửa chữa';
      case 'inspection':
        return 'Kiểm tra';
      default:
        return type;
    }
  }

  getMaintenanceStatusText(status: string): string {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'pending':
        return 'Đang chờ';
      case 'scheduled':
        return 'Đã lên lịch';
      default:
        return status;
    }
  }

  getMaintenanceStatusClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'completed';
      case 'pending':
        return 'pending';
      case 'scheduled':
        return 'scheduled';
      default:
        return '';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/meeting-rooms']);
  }
}