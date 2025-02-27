import { Component, OnInit } from '@angular/core';
import { MeetingRoom, RoomStatus } from '../../../../../model/room.model';
import { MeetingRoomService } from '../../../../service/meeting/meeting-room.service';
import { RoomMapComponent } from "../room-map/room-map.component";
import { RoomListComponent } from "../room-list/room-list.component";
import { RoomDetailComponent } from "../room-detail/room-detail.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-meeting-room-layout',
  standalone: true,
  imports: [RoomMapComponent, RoomListComponent, RoomDetailComponent, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './meeting-room-layout.component.html',
  styleUrl: './meeting-room-layout.component.scss'
})
export class MeetingRoomLayoutComponent implements OnInit {
  rooms: MeetingRoom[] = [];
  filteredRooms: MeetingRoom[] = [];
  selectedRoom: MeetingRoom | null = null;
  isMapView = true;

  // Filter options
  statusFilter: RoomStatus | null = null;
  capacityFilter: number | null = null;
  equipmentFilter: string[] = [];
  searchQuery = '';

  constructor(private roomService: MeetingRoomService) { }

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.roomService.getRooms().subscribe(rooms => {
      this.rooms = rooms;
      this.applyFilters();
    });
  }

  toggleView(): void {
    this.isMapView = !this.isMapView;
  }

  selectRoom(room: MeetingRoom): void {
    this.selectedRoom = room;
  }

  closeDetail(): void {
    this.selectedRoom = null;
  }

  applyFilters(): void {
    let filters: any = {};

    if (this.statusFilter) {
      filters.status = this.statusFilter;
    }

    if (this.capacityFilter) {
      filters.minCapacity = this.capacityFilter;
    }

    if (this.equipmentFilter.length > 0) {
      filters.equipment = this.equipmentFilter;
    }

    this.roomService.filterRooms(filters).subscribe(rooms => {
      // Apply search query filter locally
      if (this.searchQuery) {
        this.filteredRooms = rooms.filter(room =>
          room.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          room.description?.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      } else {
        this.filteredRooms = rooms;
      }
    });
  }

  resetFilters(): void {
    this.statusFilter = null;
    this.capacityFilter = null;
    this.equipmentFilter = [];
    this.searchQuery = '';
    this.applyFilters();
  }

  toggleEquipmentFilter(equipment: string): void {
    if (this.equipmentFilter.includes(equipment)) {
      this.equipmentFilter = this.equipmentFilter.filter(e => e !== equipment);
    } else {
      this.equipmentFilter.push(equipment);
    }
    this.applyFilters();
  }
}
