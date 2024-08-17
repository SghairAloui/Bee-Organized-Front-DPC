import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CommonModule, registerLocaleData } from '@angular/common';
import { NzDropDownModule, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { LoginComponent } from './login/login.component';
import { AddUserModalComponent } from './modal/add-user-modal/add-user-modal.component';
import { TiketComponent } from './page/tiket/tiket.component';
import { UsersComponent } from './page/users/users.component';
import { AddTicketComponent } from './modal/add-ticket/add-ticket.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzBreadcrumb } from 'ng-zorro-antd/breadcrumb/breadcrumb';
import { CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { AddNewUserComponent } from './page/add-new-user/add-new-user.component';
import { LoginPageComponent } from './page/login-page/login-page.component';
import { TicketPipe } from './pipe/ticket.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroModule } from './ng-zorro/ng-zorro.module';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { ProjectComponent } from './page/project/project.component';
import { AddProjectComponent } from './modal/add-project/add-project.component';
import { AddNewProjectComponent } from './page/add-new-project/add-new-project.component';
import { UserOutline} from '@ant-design/icons-angular/icons';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { UpdateUserComponent } from './page/update-user/update-user.component';
import { UpdateProjectComponent } from './page/update-project/update-project.component';
import { UpdateTicketComponent } from './modal/update-ticket/update-ticket.component';
import { UpdateProjComponent } from './page/update-proj/update-proj.component';
import { UpdateUserModalComponent } from './modal/update-user-modal/update-user-modal.component';
import { MrestPasswordModalComponent } from './modal/mrest-password-modal/mrest-password-modal.component';
import { ProfileComponent } from './page/profile/profile.component';
import { EquipeComponent } from './page/equipe/equipe.component';
import { ChatComponent } from './chat/chat.component';
import { BetterDatePipe } from './better-date.pipe';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { fr_FR } from 'ng-zorro-antd/i18n';
import fr from '@angular/common/locales/fr';

registerLocaleData(fr);


@NgModule({
  declarations: [
     AppComponent,
     HeaderComponent,
     AddUserModalComponent,
     TiketComponent,
     AddTicketComponent,
     LoginComponent,
     UsersComponent,
     AddNewUserComponent,
     LoginPageComponent,
     ProjectComponent,
     AddProjectComponent,
     AddNewProjectComponent,
     UpdateUserComponent,
     UpdateProjectComponent,
     UpdateTicketComponent,
     UpdateProjComponent,
     UpdateUserModalComponent,
     MrestPasswordModalComponent,
     ProfileComponent,
     EquipeComponent,
     ChatComponent,
     BetterDatePipe,
   
     

    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgZorroModule,
    NzFormModule,
    NzButtonModule,
    NzTabsModule,
    NzEmptyModule,
    NzSwitchModule,
    ReactiveFormsModule,
    NzInputModule,
    NzTableModule,
    NzSelectModule,
    NgApexchartsModule,
    NzDropDownModule,
    NzModalModule,
    NzBreadCrumbModule,
    NzNotificationModule,
    NzDrawerModule,
    NzLayoutModule,
    NzMenuModule,
    NzProgressModule,
    DragDropModule,
    NzUploadModule,
    MatInputModule,
    CommonModule,
    NzIconModule.forChild([UserOutline]),
    
    
    
   
    
    
    
  ],
  providers: [     FormBuilder,
    TicketPipe,
    { provide: NZ_I18N, useValue: fr_FR }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
