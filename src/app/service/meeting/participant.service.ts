import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Participant } from '../../../model/participant';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {
  private mockParticipants: Participant[] = [
    {
      id: '1',
      fullName: 'Nguyễn Văn A',
      email: 'nguyenvana@company.com',
      department: 'Phòng Kỹ thuật',
      position: 'Trưởng phòng',
      isGuest: false
    },
    {
      id: '2',
      fullName: 'Trần Thị B',
      email: 'tranthib@company.com',
      department: 'Phòng Kinh doanh',
      position: 'Nhân viên',
      isGuest: false
    },
    {
      id: '3',
      fullName: 'Lê Văn C',
      email: 'levanc@company.com',
      department: 'Ban Giám đốc',
      position: 'Giám đốc',
      isGuest: false
    },
    // Thêm nhiều người tham gia khác...
  ];

  private mockDepartments = [
    { id: 1, name: 'Phòng Kỹ thuật' },
    { id: 2, name: 'Phòng Kinh doanh' },
    { id: 3, name: 'Ban Giám đốc' },
    { id: 4, name: 'Phòng Nhân sự' },
    { id: 5, name: 'Phòng Tài chính' }
  ];

  private mockGroups = [
    { id: 1, name: 'Nhóm Dự án A' },
    { id: 2, name: 'Nhóm Marketing' },
    { id: 3, name: 'Ban Chuyên môn' },
    { id: 4, name: 'Tổ Phát triển' }
  ];

  constructor(private http: HttpClient) { }

  getAllParticipants(): Observable<Participant[]> {
    return of(this.mockParticipants).pipe(delay(500));
  }

  getParticipantById(id: string): Observable<Participant> {
    const participant = this.mockParticipants.find(p => p.id === id);
    return of(participant!).pipe(delay(300));
  }

  searchParticipants(query: string): Observable<Participant[]> {
    const results = this.mockParticipants.filter(p =>
      p.fullName.toLowerCase().includes(query.toLowerCase()) ||
      p.email.toLowerCase().includes(query.toLowerCase()) ||
      (p.department?.toLowerCase() || '').includes(query.toLowerCase())
    );
    return of(results).pipe(delay(300));
  }

  getParticipantsByDepartment(departmentId: number): Observable<Participant[]> {
    const department = this.mockDepartments.find(d => d.id === departmentId);
    if (!department) return of([]);

    const participants = this.mockParticipants.filter(p => p.department === department.name);
    return of(participants).pipe(delay(300));
  }

  getParticipantsByGroup(groupId: number): Observable<Participant[]> {
    // Giả lập logic phân nhóm
    const randomParticipants = this.mockParticipants
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 5) + 2);
    return of(randomParticipants).pipe(delay(300));
  }

  addGuestParticipant(name: string, email: string): Observable<Participant> {
    const newGuest: Participant = {
      id: `guest-${Date.now()}`,
      fullName: name,
      email: email,
      department: 'Khách mời',
      position: 'Khách',
      isGuest: true
    };
    this.mockParticipants.push(newGuest);
    return of(newGuest).pipe(delay(300));
  }

  getDepartments(): Observable<{ id: number, name: string }[]> {
    return of(this.mockDepartments).pipe(delay(300));
  }

  getGroups(): Observable<{ id: number, name: string }[]> {
    return of(this.mockGroups).pipe(delay(300));
  }
}