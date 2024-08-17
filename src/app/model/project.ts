export interface Project {
    id: number;
    title: string;
    description: string;
    scrumMaster: string;
    assignedUsers: [];
    startDate: Date;
    endDate: Date; 
    status: string; 
    tasks: Task[]; 
}
export interface Task {
    id: number;
    title: string;
    description: string;
    assignedUser: string;
    startDate: Date; 
    endDate: Date; 
    status: string; 
    project: Project; 
}

  
