import { Component, OnInit } from '@angular/core';
import { LoginServerService } from '../services/login-server.service';
import { UserServiceService } from '../services/user-service.service'; // Adjust the path as necessary
import { User } from '../modal/user'; // Adjust the path as necessary
import { NzNotificationService } from 'ng-zorro-antd/notification';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;

  userEmail: string | null = null; // Variable to store the email


  constructor(private authProvider: LoginServerService,private userService: UserServiceService,private notification: NzNotificationService) { }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadUserEmail();


  }

  isAdmin(): boolean {
    return this.authProvider.getSession().role === 'ADMIN_ROLE';
  }

  isMember(): boolean {
    return this.authProvider.getSession().role === 'Membre_ROLE';
  }

  isChefScrum(): boolean {
    return this.authProvider.getSession().role === 'ChefScrum_ROLE';
  }

  handleLogout(): void {
    this.authProvider.logout();
  }
  private loadUserEmail(): void {
    // Assuming 'email' is stored in localStorage under a key named 'email'
    const userEmail = localStorage.getItem('name');
    this.userEmail = userEmail;
  }
private loadCurrentUser(): void {
  this.userService.currentUser().subscribe({
    next: (user: User) => {
      console.log(user); // Log the user object
      this.currentUser = user;
    },
    error: (err) => console.error('Failed to load current user', err)
  });
}

ajouterCmntr(){
  this.notification.create(
    'success',
    'Mot de passe changée !',
    'Votre mot de passe a été changer avec succès.',
    { nzPlacement: 'bottomLeft' }

  ); 

}


}
