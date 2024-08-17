import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserServiceService } from 'src/app/services/user-service.service';
import { SharedService } from 'src/app/utilities/shared.service';

@Component({
  selector: 'app-update-user-modal',
  templateUrl: './update-user-modal.component.html',
  styleUrls: ['./update-user-modal.component.css']
})
export class UpdateUserModalComponent implements  OnInit {
  validateForm!: FormGroup;
  assignedUsers: string[] = [];
  @Input() user?: any;

  constructor(
    private sharedService: SharedService,
    private userService: UserServiceService,
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private router: Router,
    private route: ActivatedRoute,

  ) {
  }

  ngOnInit(): void {
    this.initForm();
    this.getUser();

  }

  initForm(): void {
    this.validateForm = this.fb.group({

      name: [this.user?.name, [Validators.required]],
      userEmail: [this.user?.userEmail, [Validators.required]],
      userRole: [this.user?.userRole, [Validators.required]],
      userCity: [this.user?.userCity],
  
    });

  }

  ngOnChanges() {
    if (this.user) {
      this.validateForm = this.fb.group({
        name: [this.user?.name, [Validators.required]],
        userEmail: [this.user?.userEmail, [Validators.required]],
        userRole: [this.user?.userRole, [Validators.required]],
        userCity: [this.user?.userCity],
      });
    
    }
  }

  public loading: boolean = false;

  submitForm(): void {
    if (this.validateForm.valid) {
      this.loading = true;
  
      const idUser = this.route.snapshot.paramMap.get('idUser');
  
  
      this.userService.updateUserById(this.validateForm.value, idUser ).subscribe(
        (res) => {
          this.notification.create(
            'success',
            "Modification de utilisateur ",
            'Utilisateur a été modifié avec succès!',
            { nzPlacement: 'bottomLeft' }
          );
          this.loading = false;
          this.user = this.validateForm.value;
          this.router.navigate(['/utilisateurs']);
        },
        (err) => {
          this.notification.create(
            'error',
            "Modification d'un projet ",
            'Veuillez vérifier les données de utilisateur SVP!',
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
  getUser(): void {
    const idUser = this.route.snapshot.paramMap.get('idUser');
    this.userService.getUserById(idUser)

      .subscribe(user => {
        this.user = user;
        console.log('user:', this.user);
        this.initForm(); 
      });
  }
}