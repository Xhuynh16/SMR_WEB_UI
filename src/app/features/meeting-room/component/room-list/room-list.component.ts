import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MeetingRoom, RoomStatus } from '../../../../../model/room.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.scss'
})
export class RoomListComponent {
  @Input() rooms: MeetingRoom[] = [];
  @Output() roomSelected = new EventEmitter<MeetingRoom>();

  sortField: 'name' | 'status' | 'capacity' = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;

  constructor() { }

  selectRoom(room: MeetingRoom): void {
    this.roomSelected.emit(room);
  }

  sortRooms(field: 'name' | 'status' | 'capacity'): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }

  getSortedRooms(): MeetingRoom[] {
    return [...this.rooms].sort((a, b) => {
      let comparison = 0;

      switch (this.sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'capacity':
          comparison = a.capacity - b.capacity;
          break;
      }

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  getPaginatedRooms(): MeetingRoom[] {
    const sorted = this.getSortedRooms();
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return sorted.slice(startIndex, startIndex + this.itemsPerPage);
  }

  getTotalPages(): number {
    return Math.ceil(this.rooms.length / this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
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

  getEquipmentSummary(room: MeetingRoom): string {
    if (room.equipment.length === 0) {
      return 'Không có thiết bị';
    }

    const workingEquipment = room.equipment.filter(e => e.status === 'working');

    if (workingEquipment.length <= 2) {
      return workingEquipment.map(e => e.name).join(', ');
    } else {
      return `${workingEquipment[0].name}, ${workingEquipment[1].name}, +${workingEquipment.length - 2}`;
    }
  }
}
