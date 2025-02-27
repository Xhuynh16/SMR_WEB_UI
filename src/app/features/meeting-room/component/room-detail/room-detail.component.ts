import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MeetingRoom, RoomStatus } from '../../../../../model/room.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-room-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './room-detail.component.html',
  styleUrl: './room-detail.component.scss'
})
export class RoomDetailComponent {
  @Input() room: MeetingRoom | null = null;
  @Output() close = new EventEmitter<void>();

  constructor(private router: Router) { }

  closeDetail(): void {
    this.close.emit();
  }

  bookRoom(): void {
    if (this.room) {
      this.router.navigate(['/dashboard/meeting-rooms/room', this.room.id, 'book']);
    }
  }

  reportIssue(): void {
    if (this.room) {
      this.router.navigate(['/dashboard/meeting-rooms/room', this.room.id, 'report']);
    }
  }

  viewMaintenanceHistory(): void {
    if (this.room) {
      this.router.navigate(['/dashboard/meeting-rooms/room', this.room.id, 'maintenance']);
    }
  }

  getRoomStatusClass(status: RoomStatus): string {
    switch (status) {
      case RoomStatus.AVAILABLE:
        return 'available';
      case RoomStatus.OCCUPIED:
        return 'occupied';
      case RoomStatus.MAINTENANCE:
        return 'maintenance';
      default:
        return '';
    }
  }

  getRoomStatusText(status: RoomStatus): string {
    switch (status) {
      case RoomStatus.AVAILABLE:
        return 'Trống';
      case RoomStatus.OCCUPIED:
        return 'Đang sử dụng';
      case RoomStatus.MAINTENANCE:
        return 'Bảo trì';
      default:
        return 'Không xác định';
    }
  }

  getEquipmentStatusClass(status: string): string {
    switch (status) {
      case 'working':
        return 'working';
      case 'broken':
        return 'broken';
      case 'maintenance':
        return 'maintenance';
      default:
        return '';
    }
  }

  getEquipmentStatusText(status: string): string {
    switch (status) {
      case 'working':
        return 'Hoạt động tốt';
      case 'broken':
        return 'Hỏng';
      case 'maintenance':
        return 'Đang bảo trì';
      default:
        return 'Không xác định';
    }
  }
}