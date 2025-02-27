import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ScheduleRoutingModule } from './schedule-routing.module';
import { CreateMeetingComponent } from './create-meeting/create-meeting.component';
import { MeetingDetailComponent } from './meeting-detail/meeting-detail.component';
import { MeetingParticipantViewComponent } from './meeting-participant-view/meeting-participant-view.component';
import { MeetingListComponent } from './meeting-list/meeting-list.component';
import { ParticipantSelectorComponent } from './participant-selector/participant-selector.component';
import { RecurringMeetingFormComponent } from './recurring-meeting-form/recurring-meeting-form.component';
import { TimeSuggestionComponent } from './time-suggestion/time-suggestion.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { MeetingService } from '../../service/meeting/meeting.service';
import { ParticipantService } from '../../service/meeting/participant.service';
import { NotificationService } from '../../service/meeting/notification.service';



@NgModule({
    declarations: [

    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        ScheduleRoutingModule,
        CreateMeetingComponent,
        MeetingDetailComponent,
        MeetingParticipantViewComponent,
        MeetingListComponent,
        ParticipantSelectorComponent,
        RecurringMeetingFormComponent,
        TimeSuggestionComponent,
        FileUploadComponent
    ],
    providers: [
        MeetingService,
        ParticipantService,
        NotificationService
    ]
})
export class ScheduleModule { }