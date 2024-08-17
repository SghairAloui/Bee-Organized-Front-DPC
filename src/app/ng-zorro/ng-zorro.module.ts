import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzNotificationModule } from 'ng-zorro-antd/notification';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NzFormModule,
    NzLayoutModule,

    NzFormModule,
    NzButtonModule,
    NzCollapseModule,
    ReactiveFormsModule,
    NzInputModule,
    NzTableModule,
    NzSelectModule,
    NgApexchartsModule,
    NzDropDownModule,
    NzModalModule,
    NzBreadCrumbModule,
    NzUploadModule,
    NzNotificationModule,
  ],
})
export class NgZorroModule {}
