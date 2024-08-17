import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import { TiketComponent } from './page/tiket/tiket.component';
import { AddTicketComponent } from './modal/add-ticket/add-ticket.component';
import { LoginPageComponent } from './page/login-page/login-page.component';
import { AddNewUserComponent } from './page/add-new-user/add-new-user.component';
import { UsersComponent } from './page/users/users.component';
import { ProjectComponent } from './page/project/project.component';
import { AddNewProjectComponent } from './page/add-new-project/add-new-project.component';
import { UpdateProjectComponent } from './page/update-project/update-project.component';
import { UpdateUserComponent } from './page/update-user/update-user.component';
import { ProfileComponent } from './page/profile/profile.component';
import { EquipeComponent } from './page/equipe/equipe.component';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  {
    path: 'tickets',
    children: [
    { path: ':projectId', component: TiketComponent },
      { path: 'ajout', component: AddTicketComponent },
    ],
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'chat',
    component: ChatComponent
  },
  {
    path: 'ajout',
    component: AddNewUserComponent
  },
  {
    path: 'utilisateurs',
    children: [
      { path: '', component: UsersComponent },
      { path: 'ajout', component: AddNewUserComponent },
      {path: 'modification/:idUser', component: UpdateUserComponent}
    ],
  },
  {
    path: 'projects',
    children: [
      { path: '', component: ProjectComponent },
      { path: 'ajout', component: AddNewProjectComponent },
      {path: 'modification/:id', component: UpdateProjectComponent}
    ],
  },

  {
    path: 'profile',
    children: [
      { path: '', component: ProfileComponent },
  
    ],
  },

  {
    path: 'equipe',
    children: [
      { path: '', component: EquipeComponent },
  
    ],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  { 
    path: '**', 
    redirectTo: '/login' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
