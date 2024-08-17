import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Role, User } from 'src/app/model/user';
import { UserServiceService } from 'src/app/services/user-service.service';
import { SharedService } from 'src/app/utilities/shared.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  public users?: User[];
  public roles?: Role[];
  selectedUserId: any | null = null;
  selectedUserName: string | null = null;

  constructor(
    private userProvider: UserServiceService,
    private sharedService: SharedService,
    private router: Router
  ) {
    sharedService.setTitle('Liste des utilisateurs');
  }

  ngOnInit(): void {
    this.userProvider.refreshNeeded$.subscribe(() => {
      this.getAllUsers();
    });
    this.getAllUsers();
  }

  private getAllUsers() {
    this.userProvider.getAllUsers().subscribe((users: User[]) => {
      this.users = users.reverse();
      console.log(this.users);
    });
  }

  navigateToModification(user: User) {
    this.selectedUserId = user.userId;
    this.router.navigate(['utilisateurs/modification', this.selectedUserId]);
  }

  setSelectedUserId(userId: number | undefined, userName: string | undefined) {
    if (userId !== undefined) {
      this.selectedUserId = userId;
      this.selectedUserName = userName ?? null;
    } else {
      this.selectedUserId = null;
      this.selectedUserName = null;
    }
  }

  confirmDelete() {
    if (this.selectedUserId !== null) {
      this.deleteItem(this.selectedUserId);
    }
  }

  deleteItem(idUser: number) {
    this.userProvider.deleteUserById(idUser).subscribe(
      response => {
        console.log('Suppression réussie', response);
        // Mettre à jour la liste d'éléments ou l'interface utilisateur si nécessaire
        this.users = this.users?.filter(user => user.userId !== idUser);
      },
      error => {
        console.error('Erreur lors de la suppression', error);
      }
    );
  }
}
