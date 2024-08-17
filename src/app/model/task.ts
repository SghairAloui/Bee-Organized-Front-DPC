import { EStatutticket } from "./EStatutticket";

import { Project } from "./project";

export interface Task {
    id?: number;
    title: string;
    description: string;
    assignedUser: string;
    startDate: Date; // Adjust the type based on your needs (e.g., string, Date)
    endDate: Date; // Adjust the type based on your needs (e.g., string, Date)
    status: string; // Adjust the type based on your needs (e.g., string, Enum)
    project: Project; // Assuming Project is another interface you have defined
}

  
