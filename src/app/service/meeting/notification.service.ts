import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor() { }

  showSuccess(message: string): void {
    Swal.fire({
      title: 'Thành công',
      text: message,
      icon: 'success'
    });
  }

  showError(message: string): void {
    Swal.fire({
      title: 'Lỗi',
      text: message,
      icon: 'error'
    });
  }

  showWarning(message: string): void {
    Swal.fire({
      title: 'Cảnh báo',
      text: message,
      icon: 'warning'
    });
  }

  showInfo(message: string): void {
    Swal.fire({
      title: 'Thông tin',
      text: message,
      icon: 'info'
    });
  }

  showConfirmation(message: string, confirmCallback: () => void, cancelCallback?: () => void): void {
    Swal.fire({
      title: 'Xác nhận',
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#1a73e8',
      cancelButtonColor: '#dc3545'
    }).then((result) => {
      if (result.isConfirmed) {
        confirmCallback();
      } else if (cancelCallback) {
        cancelCallback();
      }
    });
  }
}