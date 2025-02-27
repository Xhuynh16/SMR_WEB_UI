export enum RoomStatus {
    AVAILABLE = 'available',
    OCCUPIED = 'occupied',
    MAINTENANCE = 'maintenance'
}

export interface Equipment {
    id: number;
    name: string;
    description?: string;
    status: 'working' | 'broken' | 'maintenance';
}

export interface MeetingRoom {
    id: number;
    name: string;
    status: RoomStatus;
    capacity: number;
    location: {
        floor: number;
        x: number;
        y: number;
    };
    equipment: Equipment[];
    description?: string;
    imageUrl?: string;
}

export interface MaintenanceRecord {
    id: number;
    roomId: number;
    date: Date;
    type: 'cleaning' | 'repair' | 'inspection';
    description: string;
    performedBy: string;
    status: 'completed' | 'pending' | 'scheduled';
}

export interface RoomBooking {
    id: number;
    roomId: number;
    subject: string;
    startTime: Date;
    endTime: Date;
    attendeesCount: number;
    requiredEquipment: number[];
    requestedBy: string;
    status: 'confirmed' | 'pending' | 'cancelled';
}

export interface IssueReport {
    id: number;
    roomId: number;
    type: 'cleaning' | 'equipment' | 'other';
    description: string;
    reportedBy: string;
    reportedAt: Date;
    status: 'new' | 'in-progress' | 'resolved';
}