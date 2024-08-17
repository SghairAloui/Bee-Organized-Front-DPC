import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { User } from 'src/app/model/user';
import { LoginServerService } from 'src/app/services/login-server.service';
import { UserServiceService } from 'src/app/services/user-service.service';
import { SharedService } from 'src/app/utilities/shared.service';


@Component({
  selector: 'app-add-user-modal',
  
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.css']
})
export class AddUserModalComponent implements OnInit {
  passwordVisible = false;
  public users?: User[];
  validateForm!: FormGroup;
  public user?: User[];

  public loading: boolean = false;
  password?: string;
  constructor(
    private userProvider: UserServiceService,private sharedService : SharedService,
    private fb: FormBuilder,
    private authProvider: LoginServerService,
    private notification: NzNotificationService,
    private router: Router) {
    sharedService.setTitle('Liste des utilisateurs')
  }
  confirmValidator = (control: any): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.validateForm.controls['userPassword'].value) {
      return { confirm: true, error: true };
    }
    return {};
  };
  ngOnInit(): void {
    this.userProvider.refreshNeeded$.subscribe(() => {
      this.getAllUsers();
      console.log('refresh needed');
    });
    this.getAllUsers();
    this.validateForm = this.fb.group({
      name: ['', [Validators.required]],
      userEmail: [
        '',
        [
          Validators.email,
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      userRole: ['', [Validators.required]],
      userCity: ['', [Validators.required]],
      userPassword: ['', [Validators.minLength(6), Validators.required]],
    });
  }
  submitForm() {
    if (this.validateForm.valid) {
      this.loading = true;
  
      const userData = { ...this.validateForm.value };
      console.log('Form Data:', userData); // Log the form data
  
      this.authProvider.saveAccountUser(userData).subscribe(
        (res) => {
          this.notification.create(
            'success',
            "Création d'un utilisateur ",
            'Utilisateur a été créé avec succès!',
            { nzPlacement: 'bottomLeft' }
          );
          this.loading = false;
          this.router.navigate(['/utilisateurs']);
        },
        (err) => {
          this.notification.create(
            'error',
            "Création d'un utilisateur ",
            'Veuillez vérifier vos données SVP!',
            { nzPlacement: 'bottomLeft' }
          );
          this.loading = false;
        }
      );
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  
  

  private getAllUsers() {
    this.userProvider.getAllUsers().subscribe((users: User[]) => {
      this.users = users.reverse();
    });
  }
}
