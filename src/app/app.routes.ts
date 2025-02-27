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
            {
                path: 'schedule',
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./features/schedule/meeting-list/meeting-list.component')
                            .then(m => m.MeetingListComponent)
                    },
                    {
                        path: 'create',
                        loadComponent: () => import('./features/schedule/create-meeting/create-meeting.component')
                            .then(m => m.CreateMeetingComponent)
                    },
                    {
                        path: 'detail/:id',
                        loadComponent: () => import('./features/schedule/meeting-detail/meeting-detail.component')
                            .then(m => m.MeetingDetailComponent)
                    },
                    {
                        path: 'participant-view/:id',
                        loadComponent: () => import('./features/schedule/meeting-participant-view/meeting-participant-view.component')
                            .then(m => m.MeetingParticipantViewComponent)
                    },
                    {
                        path: 'edit/:id',
                        loadComponent: () => import('./features/schedule/create-meeting/create-meeting.component')
                            .then(m => m.CreateMeetingComponent)
                    }
                ]
            }
        ]
    }
];
