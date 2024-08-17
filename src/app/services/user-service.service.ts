import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { User } from '../modal/user';
import { ApiResponse } from '../modal/api-response';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private stompClient: any;
  private _refreshNeeded$ = new Subject<void>();
  private baseUrl = 'http://localhost:9999';

  constructor(private _http: HttpClient) {
    this.initializeWebSocketConnection();
  }

  private initializeWebSocketConnection() {
    const socket = new SockJS(`http://localhost:9999/stomp-endpoint`);
    this.stompClient = Stomp.over(socket);
    this.stompClient.debug = null; // Disable debugging

    this.stompClient.connect({}, this.onConnect, this.onError);
  }

  private onConnect = () => {
    console.log('Connected to WebSocket server');
    // Additional logic on successful connection if needed
  };

  private onError = (error: any) => {
    console.error('WebSocket connection error', error);
    // Retry logic or user notification
  };

  subscribe(topic: string, callback: any): any {
    return this.stompClient.subscribe(`/topic/${topic}`, (frame: any) => {
      callback(JSON.parse(frame.body));
    });
  }

  send(app: string, data: any) {
    this.stompClient.send(`/app/${app}`, {}, JSON.stringify(data));
  }

  get refreshNeeded$() {
    return this._refreshNeeded$.asObservable();
  }

  getAllUsers(): Observable<User[]> {
    return this._http.get<User[]>(`${this.baseUrl}/users`);
  }

  getUserById(idUser: any): Observable<User> {
    return this._http.get<User>(`${this.baseUrl}/users/${idUser}`);
  }

  updateUserById(user: User, idUser: any): Observable<User> {
    return this._http.put<User>(`${this.baseUrl}/users/update-user/${idUser}`, user).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }

  deleteUserById(idUser: any): Observable<any> {
    return this._http.delete<any>(`${this.baseUrl}/users/${idUser}`).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }

  currentUser(): Observable<User> {
    const email = localStorage.getItem('user');
    return this._http.get<User>(`${this.baseUrl}/email?email=${email}`);
  }

  getAllUsersExceptCurrentUser(): Observable<ApiResponse> {
    const currentUser = this.currentUser1();
    return this._http.get<ApiResponse>(
      `${this.baseUrl}/except/${currentUser.userId}`
    );
  }

  getConversationIdByUser1IdAndUser2Id(user1Id: number, user2Id: number): Observable<ApiResponse> {
    return this._http.get<ApiResponse>(`${this.baseUrl}/conversation/id`, {
      params: { user1Id: user1Id.toString(), user2Id: user2Id.toString() }
    });
  }

  currentUser1(): User {
    return JSON.parse(localStorage.getItem('user1') || '{}');
  }
}
