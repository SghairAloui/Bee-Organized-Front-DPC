import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { LoginServerService } from 'src/app/services/login-server.service';

@Component({
  selector: 'app-mrest-password-modal',
  templateUrl: './mrest-password-modal.component.html',
  styleUrls: ['./mrest-password-modal.component.css']
})
export class MrestPasswordModalComponent implements OnInit {
 
  @Input() isVisible: boolean = false;
  @Output() handleVisible: EventEmitter<any> = new EventEmitter<any>();
  public loading: boolean = false;
  validateForm!: FormGroup;
  selectedValue = null;
  userEmail: string = '';
  resetPasswordToken : string = '';
  newPassword : string = '';
  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private authProvider: LoginServerService,
    private route: ActivatedRoute,
  ) {}
  ngOnInit(): void {
    
    this.validateForm = this.fb.group({
      userEmail : ["", [Validators.required]],
      newPassword : ["", [Validators.required]],
      resetPasswordToken: ["", [Validators.required]],
     });
 
     
   }
     
  handleCancel(): void {
    this.handleVisible.emit();
  }
  submitForm() {
    if (this.validateForm.valid) {
      this.loading = true;
  
  console.log(this.validateForm.value)
  const userData = { ...this.validateForm.value };


  
      this.authProvider.resetPassword(userData).subscribe(
        (res) => {
          this.notification.create(
            'success',
            "mot de passe recuperer",
            'Votre mot de passe a été réinitialisé avec succès!',
            { nzPlacement: 'bottomLeft' }
          );
          this.loading = false;
          console.log(res , userData);
          this.handleCancel();
        },
        (err) => {
          this.notification.create(
            'error',
            'Erreur',
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
    this.validateForm.reset()
  }
}