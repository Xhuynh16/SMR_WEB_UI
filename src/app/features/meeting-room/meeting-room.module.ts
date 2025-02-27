import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MeetingRoomLayoutComponent } from './component/meeting-room-layout/meeting-room-layout.component';
import { RoomMapComponent } from './component/room-map/room-map.component';
import { RoomListComponent } from './component/room-list/room-list.component';
import { RoomDetailComponent } from './component/room-detail/room-detail.component';
import { BookRoomComponent } from './component/book-room/book-room.component';
import { ReportIssueComponent } from './component/report-issue/report-issue.component';
import { MaintenanceHistoryComponent } from './component/maintenance-history/maintenance-history.component';
import { MeetingRoomRoutingModule } from './meeting-room-routing.module';

@NgModule({
    declarations: [

    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MeetingRoomRoutingModule,
        MeetingRoomLayoutComponent,
        RoomMapComponent,
        RoomListComponent,
        RoomDetailComponent,
        BookRoomComponent,
        ReportIssueComponent,
        MaintenanceHistoryComponent
    ]
})
export class MeetingRoomModule { } 