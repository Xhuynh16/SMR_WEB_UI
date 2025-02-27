import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeetingListComponent } from './meeting-list/meeting-list.component';
import { CreateMeetingComponent } from './create-meeting/create-meeting.component';
import { MeetingDetailComponent } from './meeting-detail/meeting-detail.component';
import { MeetingParticipantViewComponent } from './meeting-participant-view/meeting-participant-view.component';



const routes: Routes = [
    {
        path: '',
        component: MeetingListComponent
    },
    {
        path: 'create',
        component: CreateMeetingComponent
    },
    {
        path: 'edit/:id',
        component: CreateMeetingComponent
    },
    {
        path: 'detail/:id',
        component: MeetingDetailComponent
    },
    {
        path: 'view/:id',
        component: MeetingParticipantViewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ScheduleRoutingModule { }