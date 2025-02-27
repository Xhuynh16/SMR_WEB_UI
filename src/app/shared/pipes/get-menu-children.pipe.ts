import { Pipe, PipeTransform } from '@angular/core';
import { MenuItem } from '../../service/menu/menu.service';

@Pipe({
    name: 'getMenuChildren',
    standalone: true
})
export class GetMenuChildrenPipe implements PipeTransform {
    transform(activeMenu: string | null, menuItems: MenuItem[]): string[] {
        if (!activeMenu) return [];
        const menuItem = menuItems.find(item => item.title === activeMenu);
        return menuItem?.children || [];
    }
} 