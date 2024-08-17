import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {  User } from 'src/app/model/user';
import { LoginServerService } from 'src/app/services/login-server.service';
import { UserServiceService } from 'src/app/services/user-service.service';
import { SharedService } from 'src/app/utilities/shared.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public users: User[] = []; // Initialize users as an empty array
  userName: string | null = null; // Variable to store the email
  userEmail:string | null = null;
  userCity:string | null = null;

  


  constructor(
    private userProvider: UserServiceService,
    private authProvider: LoginServerService,
    private sharedService: SharedService,
    private notification: NzNotificationService,

    private router: Router
  ) {
    sharedService.setTitle('Liste des utilisateurs');
  }

  ngOnInit(): void {
    this.getAllUsers();
    this.loadUserName();
    this.loadUserEmail();
    this.loadUserCity();
  }

  private getAllUsers() {
    this.userProvider.getAllUsers().subscribe(
      (users: User[]) => {
        // Store fetched users in the component property
        this.users = users.reverse();
        console.log(this.users);
      },
      error => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    );
  }

  navigateToModification(user: User) {
    const selectedUserId = user.userId; 
    this.router.navigate(['utilisateurs/modification', selectedUserId]);
  }

  deleteItem(idUser: number) {
    this.userProvider.deleteUserById(idUser).subscribe(
      response => {
        console.log('Suppression réussie', response);
        // Remove the deleted user from the users array
        this.users = this.users.filter(user => user.userId !== idUser);
      },
      error => {
        console.error('Erreur lors de la suppression', error);
      }
    );
  }

  private loadUserName(): void {
    // Assuming 'email' is stored in localStorage under a key named 'email'
    const userName = localStorage.getItem('name');
    this.userName = userName;
  }

  private loadUserEmail(): void {
    // Assuming 'email' is stored in localStorage under a key named 'email'
    const userEmail = localStorage.getItem('user');
    this.userEmail = userEmail;
  }

  private loadUserCity(): void {
    // Assuming 'email' is stored in localStorage under a key named 'email'
    const userCity = localStorage.getItem('userCity');
    this.userCity = userCity;
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

  
