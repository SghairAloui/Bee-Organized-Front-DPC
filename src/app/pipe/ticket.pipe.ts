import { Pipe, PipeTransform } from "@angular/core";
import { TicketFilter, TicketResponse } from "../model/ticket";

@Pipe({
    name: 'companyPipe',
    pure: false,
  })
  export class TicketPipe implements PipeTransform {
    transform(
      companies: TicketResponse[] | undefined,
      filter: TicketFilter
    ): TicketResponse[] | undefined {
    console.log(companies)
      let newticket = companies?.filter((ticket: any) => {
        console.log(filter)
      
       if(filter.statutTicket!='' && filter.users!='' &&filter.users!=null){
        return (
          ticket.statutTicket?.toLowerCase().includes(filter.statutTicket?.toLowerCase())&&
          (ticket.utilisateur?.id==filter.users)  
        );
       } else if(filter.statutTicket!='' && (filter.users=='' || filter.users==null )){
        return (
          ticket.statutTicket?.toLowerCase().includes(filter.statutTicket?.toLowerCase())
        );
       }else if(filter.statutTicket=='' && (filter.users==''||filter.users==null)){
        return ticket;
       }
       else if( (filter.users!=''|| filter.users!=null )&& filter.statutTicket==''){
        return (ticket.utilisateur?.id==filter.users)
       }
      });
      return newticket?.reverse() || undefined;
    }
  }
  