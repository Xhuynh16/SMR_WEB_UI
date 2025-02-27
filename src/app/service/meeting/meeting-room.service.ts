import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { IssueReport, MaintenanceRecord, MeetingRoom, RoomBooking, RoomStatus } from '../../../model/room.model';


@Injectable({
  providedIn: 'root'
})
export class MeetingRoomService {
  // Mock data for rooms
  private rooms: MeetingRoom[] = [
    {
      id: 1,
      name: 'Phòng họp A101',
      status: RoomStatus.AVAILABLE,
      capacity: 10,
      location: { floor: 1, x: 100, y: 150 },
      equipment: [
        { id: 1, name: 'Máy chiếu', status: 'working' },
        { id: 2, name: 'Hệ thống âm thanh', status: 'working' },
        { id: 3, name: 'Bảng tương tác', status: 'working' }
      ],
      description: 'Phòng họp nhỏ phù hợp cho các cuộc họp nhóm',
      imageUrl: 'assets/images/room-a101.jpg'
    },
    {
      id: 2,
      name: 'Phòng họp B205',
      status: RoomStatus.OCCUPIED,
      capacity: 20,
      location: { floor: 2, x: 200, y: 180 },
      equipment: [
        { id: 1, name: 'Máy chiếu', status: 'working' },
        { id: 2, name: 'Hệ thống âm thanh', status: 'working' },
        { id: 3, name: 'Hệ thống hội nghị truyền hình', status: 'working' },
        { id: 4, name: 'Bảng tương tác', status: 'maintenance' }
      ],
      description: 'Phòng họp trung bình phù hợp cho các cuộc họp phòng ban',
      imageUrl: 'assets/images/room-b205.jpg'
    },
    {
      id: 3,
      name: 'Phòng họp C310',
      status: RoomStatus.MAINTENANCE,
      capacity: 50,
      location: { floor: 3, x: 300, y: 220 },
      equipment: [
        { id: 1, name: 'Máy chiếu', status: 'broken' },
        { id: 2, name: 'Hệ thống âm thanh', status: 'working' },
        { id: 3, name: 'Hệ thống hội nghị truyền hình', status: 'working' },
        { id: 4, name: 'Bảng tương tác', status: 'working' },
        { id: 5, name: 'Hệ thống điều hòa', status: 'maintenance' }
      ],
      description: 'Phòng họp lớn phù hợp cho các cuộc họp toàn công ty',
      imageUrl: 'assets/images/room-c310.jpg'
    }
  ];

  private roomsSubject = new BehaviorSubject<MeetingRoom[]>(this.rooms);

  constructor() { }

  getRooms(): Observable<MeetingRoom[]> {
    return this.roomsSubject.asObservable();
  }

  getRoomById(id: number): Observable<MeetingRoom | undefined> {
    return this.getRooms().pipe(
      map(rooms => rooms.find(room => room.id === id))
    );
  }

  updateRoomStatus(roomId: number, status: RoomStatus): Observable<boolean> {
    const roomIndex = this.rooms.findIndex(room => room.id === roomId);
    if (roomIndex !== -1) {
      this.rooms[roomIndex].status = status;
      this.roomsSubject.next([...this.rooms]);
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }

  bookRoom(booking: Omit<RoomBooking, 'id'>): Observable<RoomBooking> {
    const newBooking: RoomBooking = {
      ...booking,
      id: Math.floor(Math.random() * 1000)
    };

    // In a real app, you would save this to a database
    // For now, we'll just update the room status
    this.updateRoomStatus(booking.roomId, RoomStatus.OCCUPIED);

    return of(newBooking).pipe(delay(500));
  }

  reportIssue(issue: Omit<IssueReport, 'id' | 'reportedAt' | 'status'>): Observable<IssueReport> {
    const newIssue: IssueReport = {
      ...issue,
      id: Math.floor(Math.random() * 1000),
      reportedAt: new Date(),
      status: 'new'
    };

    // In a real app, you would save this to a database
    return of(newIssue).pipe(delay(500));
  }

  getMaintenanceHistory(roomId: number): Observable<MaintenanceRecord[]> {
    // Mock maintenance history
    const history: MaintenanceRecord[] = [
      {
        id: 1,
        roomId: roomId,
        date: new Date(2023, 5, 15),
        type: 'cleaning',
        description: 'Vệ sinh định kỳ',
        performedBy: 'Nguyễn Văn A',
        status: 'completed'
      },
      {
        id: 2,
        roomId: roomId,
        date: new Date(2023, 6, 10),
        type: 'repair',
        description: 'Sửa chữa máy chiếu',
        performedBy: 'Trần Văn B',
        status: 'completed'
      },
      {
        id: 3,
        roomId: roomId,
        date: new Date(2023, 7, 5),
        type: 'inspection',
        description: 'Kiểm tra hệ thống âm thanh',
        performedBy: 'Lê Thị C',
        status: 'completed'
      }
    ];

    return of(history).pipe(delay(300));
  }

  filterRooms(filters: {
    status?: RoomStatus,
    minCapacity?: number,
    equipment?: string[]
  }): Observable<MeetingRoom[]> {
    return this.getRooms().pipe(
      map(rooms => rooms.filter(room => {
        let match = true;

        if (filters.status && room.status !== filters.status) {
          match = false;
        }

        if (filters.minCapacity && room.capacity < filters.minCapacity) {
          match = false;
        }

        if (filters.equipment && filters.equipment.length > 0) {
          const hasAllEquipment = filters.equipment.every(eq =>
            room.equipment.some(e => e.name.toLowerCase().includes(eq.toLowerCase()) && e.status === 'working')
          );
          if (!hasAllEquipment) {
            match = false;
          }
        }

        return match;
      }))
    );
  }
}