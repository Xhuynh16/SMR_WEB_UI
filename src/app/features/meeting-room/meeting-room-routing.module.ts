import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeetingRoomLayoutComponent } from './component/meeting-room-layout/meeting-room-layout.component';
import { RoomDetailComponent } from './component/room-detail/room-detail.component';
import { BookRoomComponent } from './component/book-room/book-room.component';
import { ReportIssueComponent } from './component/report-issue/report-issue.component';
import { MaintenanceHistoryComponent } from './component/maintenance-history/maintenance-history.component';



const routes: Routes = [
    {
        path: '',
        component: MeetingRoomLayoutComponent
    },
    {
        path: 'room/:id',
        component: RoomDetailComponent
    },
    {
        path: 'room/:id/book',
        component: BookRoomComponent
    },
    {
        path: 'room/:id/report',
        component: ReportIssueComponent
    },
    {
        path: 'room/:id/maintenance',
        component: MaintenanceHistoryComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MeetingRoomRoutingModule { } 