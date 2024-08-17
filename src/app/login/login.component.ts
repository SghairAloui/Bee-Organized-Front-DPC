import { Component, Input, OnInit } from '@angular/core';

import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { LoginServerService } from '../services/login-server.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-login',
  
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  public isVisible= false
  passwordVisible = false;
  public validateForm!: FormGroup;
  userEmail: string = ''; 
  public loading: boolean = false;
  password?: string;
  constructor(
    private fb: FormBuilder,
    private authProvider: LoginServerService,
    private notification: NzNotificationService,
    private router: Router,
    private modalService: NzModalService
  ) {}
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userEmail: [
        '',
        [
          Validators.email,
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],

      userPassword: ['', [Validators.required]],
    });
    if (this.authProvider.isAuthenticate()) {
      this.router.navigate(['/']);
    }
  }
  submitForm(): void {
    if (this.validateForm.valid) {
      this.loading = true;
  
      let auth = { ...this.validateForm.value };
      this.authProvider.Authenticate(auth.userEmail, auth.userPassword).subscribe(
        (res: any) => {
          this.loading = false;

          
          // Check if user is authenticated
          if (this.authProvider.isAuthenticate()) {
            // Get the role from localStorage
            const role = localStorage.getItem('_sid');
            // Redirect based on role
            switch (role) {
              case 'ADMIN_ROLE':
                this.router.navigate(['/utilisateurs']);
                break;
              case 'Membre_ROLE':
              case 'ChefScrum_ROLE':
                this.router.navigate(['/projects']);
                break;
              default:
                // Handle other roles or no role scenario
                console.error('Unknown role or no role found.');
                break;
            }
               // Show Ant Design notification for successful login
          this.notification.create(
            'success',
            'Connexion réussie!',
            'Vous vous êtes connecté avec succès.',
            { nzPlacement: 'bottomLeft' }

          );
          }
        },
        (err: any) => {
          this.loading = false;
          this.notification.create(
            'error',
            'Authentification échouée!',
            'Veuillez vérifier vos informations de identification',
            { nzPlacement: 'bottomLeft' ,
            nzDuration: 10000, // Durée de 5 secondes

            }
          );
        }
      );
    } else {
      // Handle form validation errors
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  openModalAndSendRequest(userEmail: string): void {
    this.sendPasswordResetRequest(this.validateForm.get('userEmail')?.value);
    this.isVisible = true

  }
  sendPasswordResetRequest(userEmail: string): void {
   
    this.authProvider.generateResetPasswordToken(userEmail).subscribe(
      (response: any) => {
        console.log('Demande de réinitialisation envoyée avec succès', response);
      },
      (error: any) => {
        console.error('Erreur lors de l\'envoi de la demande de réinitialisation', error);
        // Gérer les erreurs si nécessaire
      }
    );
  }
  handleCancel(){
    this.isVisible = false
  }
}

  


