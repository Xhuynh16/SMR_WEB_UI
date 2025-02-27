import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MeetingRoom, RoomStatus } from '../../../../../model/room.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-room-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './room-map.component.html',
  styleUrl: './room-map.component.scss'
})
export class RoomMapComponent implements OnChanges {
  @Input() rooms: MeetingRoom[] = [];
  @Output() roomSelected = new EventEmitter<MeetingRoom>();

  floorPlans: { floor: number, rooms: MeetingRoom[] }[] = [];
  selectedFloor = 1;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rooms']) {
      this.organizeRoomsByFloor();
    }
  }

  organizeRoomsByFloor(): void {
    // Group rooms by floor
    const floorMap = new Map<number, MeetingRoom[]>();

    this.rooms.forEach(room => {
      const floor = room.location.floor;
      if (!floorMap.has(floor)) {
        floorMap.set(floor, []);
      }
      floorMap.get(floor)?.push(room);
    });

    // Convert map to array
    this.floorPlans = Array.from(floorMap.entries())
      .map(([floor, rooms]) => ({ floor, rooms }))
      .sort((a, b) => a.floor - b.floor);

    // Set default selected floor
    if (this.floorPlans.length > 0 && !this.floorPlans.some(fp => fp.floor === this.selectedFloor)) {
      this.selectedFloor = this.floorPlans[0].floor;
    }
  }

  selectFloor(floor: number): void {
    this.selectedFloor = floor;
  }

  selectRoom(room: MeetingRoom): void {
    this.roomSelected.emit(room);
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

  getRoomStatusIcon(status: RoomStatus): string {
    switch (status) {
      case RoomStatus.AVAILABLE:
        return 'fa-check-circle';
      case RoomStatus.OCCUPIED:
        return 'fa-users';
      case RoomStatus.MAINTENANCE:
        return 'fa-tools';
      default:
        return 'fa-question-circle';
    }
  }
}
