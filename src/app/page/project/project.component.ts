import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from 'src/app/model/project';
import { LoginServerService } from 'src/app/services/login-server.service';
import { ProjectServiceService } from 'src/app/services/project-service.service';
import { SharedService } from 'src/app/utilities/shared.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})

export class ProjectComponent implements OnInit {
  
  public projects: Project[] = [];
  public loading: boolean = false;
  selectedProjectId: any | undefined;

  constructor(private projectProvider: ProjectServiceService, private sharedService: SharedService, private router: Router,    private authProvider: LoginServerService
  ) {
    sharedService.setTitle('Liste des projets');
    this.selectedProjectId = undefined;
  }

  ngOnInit(): void {
    this.getAllProjects();
  }
  navigateToModification(project : Project) {
    this.selectedProjectId = project.id; 
    this.router.navigate(['projects/modification', this.selectedProjectId]);
  
  }
  getAllProjects(): void {
    this.projectProvider.getProjectsByAuthenticatedUser().subscribe(
      (projects: Project[]) => {
        this.projects = projects;
        console.log('Projects:', projects);
      },
      (error) => {
        console.error('Error fetching projects:', error);
      }
    );
  }
  isChefScrum(): boolean {
    return this.authProvider.getSession().role === 'ChefScrum_ROLE';
  }

  isMember(): boolean {
    return this.authProvider.getSession().role === 'Membre_ROLE';
  }
  deleteItem(id: any) {
    this.projectProvider.deleteProject(id).subscribe(
      response => {
        console.log('Suppression réussie', response);
        // Mettre à jour la liste d'éléments ou l'interface utilisateur si nécessaire
        this.projects = this.projects?.filter(project => project.id !== id);
      },
      error => {
        console.error('Erreur lors de la suppression', error);
      }
    );
  }
}
