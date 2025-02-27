import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem, MenuService } from '../../service/menu/menu.service';
import { AuthService } from '../../service/system-manager/auth.service';
import { GetMenuChildrenPipe } from '../../shared/pipes/get-menu-children.pipe';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, GetMenuChildrenPipe],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  @ViewChild('userProfileRef') userProfileRef!: ElementRef;
  menuItems: MenuItem[];
  activeMenu$ = this.menuService.activeMenu$;
  currentUser = this.authService.getCurrentUser();
  isMenuCollapsed = false;
  isUserMenuOpen = false;

  constructor(
    private menuService: MenuService,
    private authService: AuthService
  ) {
    this.menuItems = this.menuService.getMenuItems();
  }

  setActiveMenu(title: string) {
    this.menuService.setActiveMenu(title);
  }

  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  logout() {
    this.authService.logout();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.userProfileRef.nativeElement.contains(event.target)) {
      this.isUserMenuOpen = false;
    }
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  getRouteForMenuItem(menuItem: string): string[] {
    // Map menu items to routes
    switch (menuItem) {
      case 'Quản lý phòng họp':
        return ['/dashboard/meeting-rooms'];
      case 'Lên lịch họp':
        return ['/dashboard/schedule'];
      case 'Quản lý người tham gia':
        return ['/dashboard/participants'];
      case 'Báo cáo và thống kê':
        return ['/dashboard/reports'];
      // Add more cases for other menu items as needed
      default:
        return ['/dashboard'];
    }
  }
}
