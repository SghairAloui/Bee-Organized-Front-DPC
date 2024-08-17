import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { User } from 'src/app/model/user'; // Make sure to import the User model
import { ProjectServiceService } from 'src/app/services/project-service.service';
import { UserServiceService } from 'src/app/services/user-service.service';
import { SharedService } from 'src/app/utilities/shared.service';
import { endDateAfterStartDateValidator } from './Validator';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {
  validateForm!: FormGroup;
  users: User[] = []; // Ensure that User type is used here
  assignedUsers: string[] = [];

  constructor(
    private sharedService: SharedService,
    private projectService: ProjectServiceService,
    private userService: UserServiceService,
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private router: Router
  ) {
    sharedService.setTitle('Liste des projets');
  }

  ngOnInit(): void {
    this.getUsers();

    this.validateForm = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      scrumMaster: ['', [Validators.required]],
      assignedUsers: [[]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      status: ['CREATED'],
      tasks: [[]],
    }, { validators: endDateAfterStartDateValidator() });

    this.getUsers();
  }

  public loading: boolean = false;

  getUsers(): void {
    this.userService.getAllUsers().subscribe(
      (users: User[]) => {
        this.users = users; // Populate users array
        console.log('Users:', this.users);
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      this.loading = true;
  
      const userData = {
        ...this.validateForm.value,
      };
  
      console.log('Form Data:', userData);
  
      this.projectService.saveProject(userData).subscribe(
        (res) => {
          this.notification.create(
            'success',
            "Création d'un projet ",
            'Projet a été créé avec succès!',
            { nzPlacement: 'bottomLeft' }
          );
          this.loading = false;
          this.router.navigate(['/projects']);
        },
        (err) => {
          this.notification.create(
            'error',
            "Création d'un projet ",
            'Veuillez vérifier les données de projet SVP!',
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
  
  handleChange(event: any): void {
    // Extract the selected options from the event
    const selectedOptions = event.target.selectedOptions;
  
    // Extract the values of selected users (email addresses)
    const selectedUserEmails = [];
    for (let i = 0; i < selectedOptions.length; i++) {
      selectedUserEmails.push(selectedOptions.item(i).value);
    }
  
    // Update the form with the selected user emails
    this.validateForm.patchValue({
      assignedUsers: selectedUserEmails
    });
  }
}
