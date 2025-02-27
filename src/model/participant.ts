export interface Participant {
    id: string;
    fullName: string;
    email: string;
    department?: string;
    position?: string;
    status?: 'accepted' | 'declined' | 'pending';
    declineReason?: string;
    isGuest?: boolean;
    groupId?: number;
}