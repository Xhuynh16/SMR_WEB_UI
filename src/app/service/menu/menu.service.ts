import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface MenuItem {
  title: string;
  icon: string;
  children?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuItems: MenuItem[] = [
    {
      title: 'Quản lý cuộc họp',
      icon: 'fas fa-calendar-alt',
      children: [
        'Quản lý phòng họp',
        'Lên lịch họp',
        'Quản lý người tham gia',
        'Báo cáo và thống kê'
      ]
    },
    {
      title: 'Truyền thông đa phương tiện',
      icon: 'fas fa-calendar-alt',
      children: [
        'Họp trực tuyến',
        'Chia sẻ nội dung',
        'Tương tác trong cuộc họp',
        'Ghi lại cuộc họp'
      ]
    },
    {
      title: 'Trí tuệ nhân tạo và Tự động hóa',
      icon: 'fas fa-calendar-alt',
      children: [
        'Trợ lý ảo thông minh',
        'Dịch đa ngôn ngữ',
        'Xử lý nội dung thông minh'
      ]
    },
    {
      title: 'Quản lý thiết bị',
      icon: 'fas fa-calendar-alt',
      children: [
        'Điều khiển thiết bị thông minh',
        'Quản lý thiết bị họp',
        'Giám sát hệ thống'
      ]
    },
    {
      title: 'Lưu trữ và Bảo mật',
      icon: 'fas fa-calendar-alt',
      children: [
        'Quản lý kho lưu trữ',
        'Bảo mật và quyền truy cập',
        'Sao lưu và phục hồi'
      ]
    }
  ];

  private activeMenuSubject = new BehaviorSubject<string>('Quản lý cuộc họp');
  activeMenu$ = this.activeMenuSubject.asObservable();

  getMenuItems(): MenuItem[] {
    return this.menuItems;
  }

  setActiveMenu(title: string) {
    this.activeMenuSubject.next(title);
  }
}
