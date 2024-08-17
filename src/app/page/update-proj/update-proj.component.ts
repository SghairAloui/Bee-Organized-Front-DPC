import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { User } from 'src/app/model/user';
import { ProjectServiceService } from 'src/app/services/project-service.service';
import { UserServiceService } from 'src/app/services/user-service.service';
import { SharedService } from 'src/app/utilities/shared.service';

@Component({
  selector: 'app-update-proj',
  templateUrl: './update-proj.component.html',
  styleUrls: ['./update-proj.component.css']
})
export class UpdateProjComponent implements  OnInit {
  validateForm!: FormGroup;
  users: User[] = []; // Ensure that User type is used here
  assignedUsers: string[] = [];
  @Input() project?: any;

  constructor(
    private sharedService: SharedService,
    private projectService: ProjectServiceService,
    private userService: UserServiceService,
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private router: Router,
    private route: ActivatedRoute,

  ) {
  }

  ngOnInit(): void {
    this.initForm();
    this.getUsers();
    this.getProject();
    

    
    this.getUsers();
  }

  initForm(): void {
    this.validateForm = this.fb.group({

      title: [this.project?.title, [Validators.required]],
      description: [this.project?.description, [Validators.required]],
      scrumMaster: [this.project?.scrumMaster, [Validators.required]],
      assignedUsers: [this.project?.assignedUsers],
      startDate: [this.project?.startDate, [Validators.required]],
      endDate: [this.project?.endDate, [Validators.required]],
      status: ['CREATED'],
      tasks: [this.project?.tasks],
    });

  }

  ngOnChanges() {
    if (this.project) {
      this.validateForm = this.fb.group({
        title: [this.project?.title, [Validators.required]],
        description: [this.project?.description],
        scrumMaster: [this.project?.scrumMaster, [Validators.required]],
        assignedUsers: [this.project?.assignedUsers],
        startDate: [this.project?.startDate, [Validators.required]],
        endDate: [this.project?.endDate, [Validators.required]],
        status: ['CREATED'],
        tasks: [this.project?.tasks],
      });
    
    }
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
  
      const id = this.route.snapshot.paramMap.get('id');
  
  
      this.projectService.updateUser(this.validateForm.value, id ).subscribe(
        (res) => {
          this.notification.create(
            'success',
            "Modification de projet ",
            'Projet a été modifié avec succès!',
            { nzPlacement: 'bottomLeft' }
          );
          this.loading = false;
          this.project = this.validateForm.value;
          this.router.navigate(['/projects']);
        },
        (err) => {
          this.notification.create(
            'error',
            "Modification d'un projet ",
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
  getProject(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.projectService.getProjectById(id)

      .subscribe(project => {
        this.project = project;
        console.log('Projects:', this.project);
        this.initForm(); 
      });
  }
}