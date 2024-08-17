import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { LoginServerService } from './login-server.service';
import { Task } from '../model/task';

@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {
  private _refreshNeeded$ = new Subject<void>();
  BaseUrl = 'http://localhost:9999';

  constructor(private _http: HttpClient, private authProvider: LoginServerService) {}

  get refreshNeeded$() {
    return this._refreshNeeded$.asObservable();
  }

  getAllTasks(): Observable<Task[]> {
    const { token } = this.authProvider.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Add Authorization header
      'Content-Type': 'application/json'
    });

    const requestOptions = { headers: headers };
    return this._http.get<Task[]>(`${this.BaseUrl}/task`, requestOptions); // Specify endpoint for tasks
  }
  
  getTasksByProjectId(projectId: String): Observable<Task[]> {
    const { token } = this.authProvider.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const requestOptions = { headers: headers };
    return this._http.get<Task[]>(`${this.BaseUrl}/task/${projectId}`, requestOptions);
  }
  saveTask(id :any , task: Task): Observable<any> {
    const { token } = this.authProvider.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Add Authorization header
      'Content-Type': 'application/json'
    });
    return this._http.post(`${this.BaseUrl}/task`, task, { headers }); // Specify endpoint for saving tasks
  }
  updateTicket( ticket: Task): Observable<Task> {
    const { token } = this.authProvider.getSession();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const requestOptions = { headers: headers };
    console.log(ticket)
    return this._http.put<Task>(`${this.BaseUrl}/task/update`, ticket,requestOptions);
  }
  deleteTask(id: any): Observable<any> {
    const { token } = this.authProvider.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const requestOptions = { headers: headers };
    return this._http.delete(`${this.BaseUrl}/task/${id}`, requestOptions);
  }
}
