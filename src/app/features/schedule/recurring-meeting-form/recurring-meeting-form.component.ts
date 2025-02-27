import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-recurring-meeting-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './recurring-meeting-form.component.html',
  styleUrl: './recurring-meeting-form.component.scss'
})
export class RecurringMeetingFormComponent implements OnInit {
  @Input() parentForm!: FormGroup;

  weekDays = [
    { value: 1, label: 'Thứ 2' },
    { value: 2, label: 'Thứ 3' },
    { value: 3, label: 'Thứ 4' },
    { value: 4, label: 'Thứ 5' },
    { value: 5, label: 'Thứ 6' },
    { value: 6, label: 'Thứ 7' },
    { value: 0, label: 'Chủ nhật' }
  ];

  monthDays = Array.from({ length: 31 }, (_, i) => i + 1);

  constructor() { }

  ngOnInit(): void { }

  get frequency(): string {
    return this.parentForm.get('frequency')?.value;
  }

  toggleWeekDay(day: number): void {
    const weekDaysControl = this.parentForm.get('weekDays');
    const currentValue = weekDaysControl?.value || [];

    if (currentValue.includes(day)) {
      weekDaysControl?.setValue(currentValue.filter((d: number) => d !== day));
    } else {
      weekDaysControl?.setValue([...currentValue, day]);
    }
  }

  isWeekDaySelected(day: number): boolean {
    const weekDays = this.parentForm.get('weekDays')?.value || [];
    return weekDays.includes(day);
  }
}
