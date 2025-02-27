import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Participant } from '../../../../model/participant';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-participant-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './participant-selector.component.html',
  styleUrl: './participant-selector.component.scss'
})
export class ParticipantSelectorComponent implements OnInit {
  @Input() availableParticipants: Participant[] = [];
  @Output() participantsSelected = new EventEmitter<Participant[]>();

  searchControl = new FormControl('');
  filteredParticipants: Participant[] = [];
  selectedParticipants: Participant[] = [];

  activeTab: 'individual' | 'group' | 'department' | 'guest' = 'individual';

  constructor() { }

  ngOnInit(): void {
    this.filteredParticipants = [...this.availableParticipants];

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.filterParticipants(value || '');
      });
  }

  filterParticipants(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredParticipants = [...this.availableParticipants];
      return;
    }

    searchTerm = searchTerm.toLowerCase();
    this.filteredParticipants = this.availableParticipants.filter(participant =>
      participant.fullName.toLowerCase().includes(searchTerm) ||
      participant.email.toLowerCase().includes(searchTerm) ||
      (participant.department?.toLowerCase() || '').includes(searchTerm)
    );
  }

  selectParticipant(participant: Participant): void {
    if (!this.isParticipantSelected(participant)) {
      this.selectedParticipants.push(participant);
      this.participantsSelected.emit(this.selectedParticipants);
    }
  }

  removeParticipant(participant: Participant): void {
    this.selectedParticipants = this.selectedParticipants.filter(p => p.id !== participant.id);
    this.participantsSelected.emit(this.selectedParticipants);
  }

  isParticipantSelected(participant: Participant): boolean {
    return this.selectedParticipants.some(p => p.id === participant.id);
  }

  setActiveTab(tab: 'individual' | 'group' | 'department' | 'guest'): void {
    this.activeTab = tab;
  }

  selectGroup(groupId: number): void {
    // Logic to select all participants in a group
    const groupParticipants = this.availableParticipants.filter(p => p.groupId === groupId);
    groupParticipants.forEach(participant => {
      if (!this.isParticipantSelected(participant)) {
        this.selectedParticipants.push(participant);
      }
    });
    this.participantsSelected.emit(this.selectedParticipants);
  }

  selectDepartment(department: string): void {
    // Logic to select all participants in a department
    const departmentParticipants = this.availableParticipants.filter(p => p.department === department);
    departmentParticipants.forEach(participant => {
      if (!this.isParticipantSelected(participant)) {
        this.selectedParticipants.push(participant);
      }
    });
    this.participantsSelected.emit(this.selectedParticipants);
  }

  addGuest(email: string, name: string): void {
    // Logic to add an external guest
    if (email && name) {
      const guestParticipant: Participant = {
        id: `guest-${Date.now()}`, // Temporary ID for guests
        fullName: name,
        email: email,
        department: 'Khách mời',
        isGuest: true
      };

      this.selectedParticipants.push(guestParticipant);
      this.participantsSelected.emit(this.selectedParticipants);
    }
  }
}

