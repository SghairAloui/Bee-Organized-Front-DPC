import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Task } from 'src/app/model/task';
import { User } from 'src/app/model/user';
import { TaskServiceService } from 'src/app/services/task-service.service';
import { UserServiceService } from 'src/app/services/user-service.service';
import { ActivatedRoute } from '@angular/router';
import { dateRangeValidator } from './validator';

@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./add-ticket.component.css']
})
export class AddTicketComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Output() handleVisible: EventEmitter<any> = new EventEmitter<any>();
  @Input() projectId!: number;
  public loading: boolean = false;
  validateForm!: FormGroup;
  selectedValue = null;
  @Input() user?: any;
  public ticketint?: Task;
  public assignedUser?: User[];
  users: User[] = [];
  
  constructor(
    private fb: FormBuilder,
    private ticketProvider: TaskServiceService,
    private notification: NzNotificationService,
    private userProvider: UserServiceService,
    private route: ActivatedRoute,
  ) {}
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.projectId = params['projectId'];
    });
    
    this.validateForm = this.fb.group({
      title: ["", [Validators.required]],
      description: ["", [Validators.required]],
      startDate: ["", [Validators.required]],
      endDate: ["", [Validators.required]],
      assignedUser: ["", [Validators.required]],
      project: [this.projectId],
      status: ['NEW'],
    }, { validator: dateRangeValidator('startDate', 'endDate') });

    this.getAllUser();
  }
  
  getAllUser() {
    this.userProvider.getAllUsers().subscribe((users: User[]) => (
      this.users = users.reverse()
    ));
  }
  
  handleCancel(): void {
    this.handleVisible.emit();
  }
  
  submitForm() {
    if (this.validateForm.valid) {
      this.loading = true;
      
      let ticketData = { ...this.validateForm.value };
      const projectId = this.projectId;
      
      ticketData.project = { id: projectId };
      
      let id = this.validateForm.value.users;
      delete ticketData.users;
      
      this.ticketProvider.saveTask(id, ticketData).subscribe(
        (res) => {
          this.notification.create(
            'success',
            "Ticket Ajoutée",
            'Ticket a été créé avec succès!',
            { nzPlacement: 'bottomLeft' }
          );
          this.loading = false;
          this.handleCancel();
        },
        (err) => {
          this.notification.create(
            'error',
            "Création de votre ticket",
            'Veuillez vérifier vos données!',
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
  
  ngOnDestroy(){
    this.validateForm.reset();
  }
}
