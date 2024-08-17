import { EStatutticket } from "./EStatutticket";


export class Ticket {
    id?: number;
    nomTicket?: string;
    dateCreation?: Date;
    duree?: number;
    statutTicket?: EStatutticket;
    description?: string;

    datePremierTicket?: Date;
    type?:String;
    static reverse: any;
}
export interface TicketResponse {
    id : number;
    nomTicket : string;
    dateCreation : Date;
    duree : number;
    statutTicket : String;
    description : string;

    actif:boolean;
    type:String;
    datePremierTicket: Date;


}
export class TicketFilter {
    nomTicket: string = '';
    description:  string = '' ;
    users: string='' ;
    statutTicket: string= '';
}
    
  
