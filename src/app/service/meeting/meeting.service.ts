import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Meeting, MeetingCreateRequest } from '../../../model/meeting';
import { Participant } from '../../../model/participant';
import { environment } from '../../../environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private apiUrl = `${environment.apiUrl}/meetings`;
  private mockMeetings: Meeting[] = [
    {
      id: 1,
      subject: 'Họp kế hoạch quý 1/2024',
      startTime: new Date('2024-01-15T09:00:00'),
      endTime: new Date('2024-01-15T10:30:00'),
      location: {
        id: 1,
        name: 'Phòng họp A',
        floor: 'Tầng 2'
      },
      organizer: {
        id: 1,
        fullName: 'Nguyễn Văn A',
        email: 'nguyenvana@company.com'
      },
      secretary: {
        id: 2,
        fullName: 'Trần Thị B',
        email: 'tranthib@company.com'
      },
      content: 'Thảo luận kế hoạch kinh doanh Q1/2024',
      attachments: [
        {
          id: 1,
          name: 'Kế hoạch Q1.docx',
          size: 250000,
          type: 'application/docx'
        }
      ],
      participants: [
        {
          id: '3',
          fullName: 'Lê Văn C',
          email: 'levanc@company.com',
          department: 'Phòng Kinh doanh',
          position: 'Trưởng phòng',
          isGuest: false
        }
      ],
      status: 'scheduled',
      createdBy: 1,
      createdAt: new Date('2024-01-10T08:00:00'),
      updatedAt: new Date('2024-01-10T08:00:00')
    }
  ];

  constructor(private http: HttpClient) { }

  getMeetings(): Observable<Meeting[]> {
    return of(this.mockMeetings).pipe(delay(500));
  }

  getMeetingById(id: number): Observable<Meeting> {
    const meeting = this.mockMeetings.find(m => m.id === id);
    return of(meeting!).pipe(delay(500));
  }

  createMeeting(meetingData: MeetingCreateRequest): Observable<Meeting> {
    const newMeeting: Meeting = {
      id: this.mockMeetings.length + 1,
      subject: meetingData.subject,
      startTime: new Date(`${meetingData.startDate}T${meetingData.startTime}`),
      endTime: new Date(`${meetingData.endDate}T${meetingData.endTime}`),
      location: {
        id: 1,
        name: 'Phòng họp A',
        floor: 'Tầng 2'
      },
      organizer: {
        id: 1,
        fullName: 'Nguyễn Văn A',
        email: 'nguyenvana@company.com'
      },
      participants: [],
      status: 'scheduled',
      createdBy: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.mockMeetings.push(newMeeting);
    return of(newMeeting).pipe(delay(500));
  }

  updateMeeting(id: number, meetingData: MeetingCreateRequest): Observable<Meeting> {
    const formData = new FormData();

    // Add meeting data (same as create)
    // ...

    return this.http.put<Meeting>(`${this.apiUrl}/${id}`, formData);
  }

  deleteMeeting(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cancelMeeting(meetingId: number, reason: string): Observable<any> {
    const meetingIndex = this.mockMeetings.findIndex(m => m.id === meetingId);
    if (meetingIndex !== -1) {
      this.mockMeetings[meetingIndex].status = 'cancelled';
    }
    return of({ success: true, message: 'Đã hủy cuộc họp' }).pipe(
      delay(1000)
    );
  }

  closeMeeting(meetingId: number): Observable<any> {
    const meetingIndex = this.mockMeetings.findIndex(m => m.id === meetingId);
    if (meetingIndex !== -1) {
      this.mockMeetings[meetingIndex].status = 'completed';
    }
    return of({ success: true, message: 'Đã đóng phiên họp' }).pipe(
      delay(1000)
    );
  }

  resendInvitations(meetingId: number): Observable<any> {
    return of({ success: true, message: 'Đã gửi lại thư mời thành công' }).pipe(
      delay(1000)
    );
  }

  updateAttendanceStatus(meetingId: number, status: 'accept' | 'decline', reason?: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${meetingId}/attendance`, { status, reason });
  }

  downloadAttachment(attachmentId: number): Observable<Blob> {
    const dummyBlob = new Blob(['Dummy file content'], { type: 'application/octet-stream' });
    return of(dummyBlob).pipe(delay(500));
  }

  getSuggestedTimeSlots(participantIds: string[]): Observable<any[]> {
    const mockTimeSlots = [
      {
        date: new Date(),
        startTime: '09:00',
        endTime: '10:00',
        availableParticipants: participantIds.length,
        totalParticipants: participantIds.length
      }
    ];
    return of(mockTimeSlots).pipe(delay(500));
  }

  getAvailableParticipants(): Observable<Participant[]> {
    return this.http.get<Participant[]>(`${environment.apiUrl}/participants`);
  }

  exportMeetingToPdf(id: number): Observable<Blob> {
    const mockPdfBlob = new Blob(['Fake PDF content'], { type: 'application/pdf' });
    return of(mockPdfBlob).pipe(
      delay(1000)
    );
  }

  downloadMeetingReport(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/report`, { responseType: 'blob' });
  }

  uploadFiles(files: File[]): Observable<string[]> {
    const fileIds = files.map((_, index) => `file-${index + 1}`);
    return of(fileIds).pipe(delay(500));
  }
}