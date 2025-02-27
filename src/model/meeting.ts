import { Participant } from "./participant";


export interface Meeting {
    id: number;
    subject: string;
    startTime: Date;
    endTime: Date;
    location: {
        id: number;
        name: string;
        floor: string;
    };
    organizer: {
        id: number;
        fullName: string;
        email: string;
    };
    secretary?: {
        id: number;
        fullName: string;
        email: string;
    };
    content?: string;
    attachments?: {
        id: number;
        name: string;
        size: number;
        type: string;
    }[];
    participants: Participant[];
    status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
    createdBy: number;
    createdAt: Date;
    updatedAt: Date;
    recurring?: {
        frequency: 'daily' | 'weekly' | 'monthly';
        weekDays?: number[];
        monthDay?: number;
        endDate: Date;
    };
}

export interface MeetingCreateRequest {
    subject: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    locationId: number;
    organizerId: number;
    secretaryId?: number;
    content?: string;
    participantIds: number[];
    attachments?: File[];
    isRecurring: boolean;
    recurring?: {
        frequency: 'daily' | 'weekly' | 'monthly';
        weekDays?: number[];
        monthDay?: number;
        endDate: string;
    };
}