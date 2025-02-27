import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {
        path: 'dashboard',
        component: MainLayoutComponent,
        children: [
            {
                path: 'meeting-rooms',
                loadChildren: () => import('./features/meeting-room/meeting-room.module').then(m => m.MeetingRoomModule)
            },
            // Các routes con khác
        ]
    }
];
