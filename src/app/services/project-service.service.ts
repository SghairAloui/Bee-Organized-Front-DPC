import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginServerService } from './login-server.service';
import { Project } from '../model/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectServiceService {
  private _refreshNeeded$ = new Subject<void>();
  BaseUrl = 'http://localhost:9999';

  constructor(private _http: HttpClient, private authProvider: LoginServerService, ) {}

  get refreshNeeded$() {
    return this._refreshNeeded$.asObservable();
  }

  getProjectsByAuthenticatedUser(): Observable<Project[]> {
    const { token, role } = this.authProvider.getSession();
    const userEmail = localStorage.getItem('user'); 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, 
      'Content-Type': 'application/json'
    });

    const requestOptions = { headers: headers };

    let endpoint = '';
    if (role === 'Membre_ROLE') {
      endpoint = 'user/' + userEmail;
    } else if (role === 'ChefScrum_ROLE') {
      endpoint = ''+ userEmail;
    }

    return this._http.get<Project[]>(`${this.BaseUrl}/project/${endpoint}`, requestOptions);
  }

  saveProject(project: Project) {
    const { token } = this.authProvider.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const requestOptions = { headers: headers };
    return this._http.post(`${this.BaseUrl}/project`, project, requestOptions).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }
  updateUser(project: Project, id : any) {
    const { token } = this.authProvider.getSession();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const requestOptions = { headers: headers };
    return this._http
      .put(`${this.BaseUrl}/project/${id}`, project, requestOptions)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
        })
      );
  }
  getProjectById(id: any): Observable<Project> {
    const url = `${this.BaseUrl}/project/project/${id}`;
    return this._http.get<Project>(url);
  }
  deleteProject(id: any): Observable<any> {
    const { token } = this.authProvider.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const requestOptions = { headers: headers };
    return this._http.delete(`${this.BaseUrl}/project/${id}`, requestOptions).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }

}
