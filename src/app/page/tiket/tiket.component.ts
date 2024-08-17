import { Component, OnInit } from '@angular/core';
import { DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CdkDragDrop, transferArrayItem  } from '@angular/cdk/drag-drop';
import { NzSelectModule } from 'ng-zorro-antd/select'; // Import du module NzSelectModule
import { AddTicketComponent } from '../../modal/add-ticket/add-ticket.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TicketFilter, TicketResponse } from '../../model/ticket';
import { SharedService } from '../../utilities/shared.service';
import { TicketPipe } from 'src/app/pipe/ticket.pipe';
import { TaskServiceService } from 'src/app/services/task-service.service';
import { Task } from 'src/app/model/task';
import { User } from 'src/app/model/user';
import { UserServiceService } from 'src/app/services/user-service.service';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { LoginServerService } from 'src/app/services/login-server.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';


@Component({
  selector: 'app-tiket',
 
  templateUrl: './tiket.component.html',
  styleUrls: ['./tiket.component.css']
})
export class TiketComponent implements OnInit{
  public isVisible= false
  public tickets?:Task[];
  public filtredTicket: TicketFilter;
  public filter: TicketFilter;
  public assignedUser?: User[];


  constructor(
    private taskService: TaskServiceService,
    private userProvider: UserServiceService,
    private modal: NzModalService,
    private ticketPipe:TicketPipe,
    private route: ActivatedRoute,
    private authProvider: LoginServerService,
    private notification: NzNotificationService,
    private sharedService : SharedService) {
      this.filtredTicket = new TicketFilter ();
    this.filter = new TicketFilter();}
    public filtredTickets?: Task[];

  public ticket_New : any = []
  public ticket_Pending : any  
  public ticket_Blocked : any  
  public ticket_Finished : any 
  listOfData: any = [] 
  initTicket(){
    this.ticket_New = []
    this.ticket_Pending  = []
    this.ticket_Blocked  = []
    this.ticket_Finished  = []
  }

  ngOnInit(): void {
   
    this.route.params.subscribe(params => {
      const projectId = params['projectId'];
      this.getAllTasks(projectId);
      this.getAllUser();
      // Call the service method with projectId
     
   });
   

    const cards = Array.from(document.querySelectorAll('.card'));
 for (const card of cards) {
   console.log(card.textContent);
 }
  }
  getAllUser() {
    this.userProvider
      .getAllUsers()
      .subscribe((assignedUser: User[]) => (
        
        this.assignedUser = assignedUser.reverse().filter(u=>u.delete==false)
     
      
      ));
      console.log(this.assignedUser)
  }
  getAllTasks(projectId: string): void {
    const projectIdNumber: number = parseInt(projectId, 10);
    this.taskService
      .getTasksByProjectId(projectId)
      .subscribe((tickets: Task[]) => {
        this.tickets = tickets; // Assign fetched tickets to the component property
        // Also, handle the tickets based on their status if necessary
        // For example:
        this.ticket_New = this.tickets.filter(ticket => ticket.status === 'NEW');
        this.ticket_Pending = this.tickets.filter(ticket => ticket.status === 'PENDING');
        this.ticket_Blocked = this.tickets.filter(ticket => ticket.status === 'BLOQUED');
        this.ticket_Finished = this.tickets.filter(ticket => ticket.status === 'FINISHED');
        
        // Similarly, handle other ticket statuses
      }, (error) => {
        console.error('Error fetching tickets:', error); // Log any errors to the console for debugging
      });
  }
  
  showModal(){
    this.isVisible = true
  }
  
  getColumn(statut: string): TicketResponse[] {
    switch (statut) {
      case 'NEW':
        return this.ticket_New;
      case 'PENDING':
        return this.ticket_Pending;
      case 'BLOQUED':
        return this.ticket_Blocked;
      case 'FINISHED':
        return this.ticket_Finished;
      default:
        return [];
    }
  }
  handleCancel(){
    this.isVisible = false
  }
  isChefScrum(): boolean {
    return this.authProvider.getSession().role === 'ChefScrum_ROLE';
  }

  isMember(): boolean {
    return this.authProvider.getSession().role === 'Membre_ROLE';
  }
 
  drop(event: CdkDragDrop<Task[]>) {
   
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      // Update the status of the moved task
      const movedTask = event.container.data[event.currentIndex];
      let newStatus = '';
  
      if (event.container.id.includes('New')) {
        newStatus = 'NEW';
      } else if (event.container.id.includes('Pending')) {
        newStatus = 'PENDING';
      } else if (event.container.id.includes('BLOQUED')) {
        newStatus = 'BLOQUED';
      } else if (event.container.id.includes('Finished')) {
        newStatus = 'FINISHED';
      }
  
      movedTask.status = newStatus;
      this.updateTicketStatus(movedTask);
    }
  }
  
  updateTicketStatus(task: Task) {
    this.taskService.updateTicket(task).subscribe(
      updatedTask => {
        console.log('Task updated successfully', updatedTask);
      },
      error => {
        console.error('Error updating task', error);
      }
    );
  }
  
  updateTicket(tickets : any , prev : any ){
    let stat = ""
    console.log(tickets)
    prev && prev[0]
        stat = prev[0]?.status
    
      tickets.map((ticket : Task, index : number)=>{
        let newTick ={...ticket, status : tickets[index +1]?.status || tickets[0]?.status}
        this.taskService.updateTicket(ticket).subscribe(()=>{})
      })
  }
  // showDeleteConfirm(id: number): void {
  //   this.modal.confirm({
  //     nzTitle: 'Êtes vous sure!',
  //     nzContent: '<b style="color: red;">Supprimer cette Ticket?</b>',
  //     nzOkText: 'Oui',
  //     nzCancelText: 'Non',
  //     nzOkType: 'primary',
  //     nzOkDanger: true,
  //     nzOnOk: () => {
  //       this.taskService.deleteTicket(id).subscribe(
  //         (res) => {
  //           this.notification.create(
  //             'success',
  //             "Suppression d'une ticket ",
  //             'Ticket à été supprimé avec succées!',
  //             { nzPlacement: 'topRight' }
  //           );
  //         },
  //         (err) => {
  //           this.notification.create(
  //             'error',
  //             "Suppression d'une ticket ",
  //             'Impossible de supprimer cette ticket',
  //             { nzPlacement: 'topRight' }
  //           );
  //         }
  //       );
  //     },

  //     nzOnCancel: () => console.log('Cancel'),
  //   });
  // }
  deleteItem(id: any) {
    this.taskService.deleteTask(id).subscribe(
      response => {
        console.log('Suppression réussie', response);
        // Mettre à jour la liste d'éléments ou l'interface utilisateur si nécessaire
        this.tickets = this.tickets?.filter(ticket => ticket.id !== id);
        // Display the success notification
        this.notification.create(
          'success',
          'Tâche supprimée!',
          'Votre tâche a été supprimée avec succès.',
          { nzPlacement: 'bottomLeft' }
        );
      },
      error => {
        console.error('Erreur lors de la suppression', error);
      }
    );
  }

  showSuccess() {
    this.notification.create(
      'success',
      'Tâche validée!',
      'Votre tâche a été validée avec succès.',
      { nzPlacement: 'bottomLeft' }

    );  }

    showRefus() {
      this.notification.create(
        'error',
        'Tâche non validée!',
        'Votre tâche a été refusée.',
        { nzPlacement: 'bottomLeft' }
  
      );  }


      ajouterCmntr(){
        this.notification.create(
          'success',
          'Commentaire ajouter !',
          'Votre commentaire a été ajouter avec succès.',
          { nzPlacement: 'bottomLeft' }
    
        ); 

      }

}
