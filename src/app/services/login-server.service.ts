import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { User } from 'src/app/model/user';
@Injectable({
  providedIn: 'root'
})
export class LoginServerService {
  BaseUrl = 'http://localhost:9999';
    isloggedIn: boolean = false;
  public userInfo?: any;
  private _refreshNeeded$ = new Subject<void>();

  constructor(
    private _http: HttpClient,
    private cookie: CookieService,
    private router: Router,
  ) { }
  get refreshNeeded$() {
    return this._refreshNeeded$.asObservable();
  }
  Authenticate(userEmail: string, userPassword: string): Observable<any> {
    return this._http.post(`${this.BaseUrl}/signin`, { userEmail, userPassword }).pipe(
      tap((res: any) => {
        console.log("Authentication Response:", res);
        if (res.accessToken) {
          console.log("Token:", res.accessToken);
          console.log("Role:", res.roles[0]);
          localStorage.setItem('user', userEmail);
          localStorage.setItem('userId', res.userId);
          localStorage.setItem('name',res.name);
          localStorage.setItem('userCity',res.userCity);


          localStorage.setItem('presence', res.accessToken);
          localStorage.setItem('_sid', res.roles[0]);
        } else {
          console.error("Access token not found in the response.");
        }
      })
    );
  
  
  }
  
  
  
  storeToken(token: string, role: string) {
    /*  this.cookie.set('presence', token, { secure: true });
    this.cookie.set('_sid', role, { secure: true }); */
    console.log("Token:", token);
  console.log("Role:", role);
    localStorage.setItem('presence', token);
    localStorage.setItem('_sid', role);
  }
  saveAccountUser(user: any) {
    const { token } = this.getSession();
    console.log("Token:", token);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    const requestOptions = { headers: headers };
    
    return this._http.post(
      `${this.BaseUrl}/signup`,
      user,
      requestOptions 
    ).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }

  
  getSession() {
    /* return {
      token: this.cookie.get('presence'),
      role: this.cookie.get('role'),
    }; */
    return {
      token: localStorage.getItem('presence')?.toString(),
      role: localStorage.getItem('_sid')?.toString(),
    };
  }

  isTokenExpired() {
    const { token } = this.getSession();
    if (token) {
      const expiry = JSON.parse(atob(token.split('.')[1])).exp;
      return expiry * 1000 <= Date.now();
    }
    return false;
  }

  // !! cookie -> localStorage
  isAuthenticate() {
    /* if (this.cookie.get('presence') && this.cookie.get('_sid')) {
      return true;
    } else {
      return false;
    } */

    if (localStorage.getItem('presence') && localStorage.getItem('_sid')) {
      return true;
    } else {
      return false;
    }
  }
  logout() {
    /*  this.cookie.deleteAll(); */
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  generateResetPasswordToken(userEmail: string): Observable<any> {
    return this._http.post<any>(`${this.BaseUrl}/generate/${userEmail}`, null);
  }
  resetPassword(userData: any): Observable<boolean> {
    const url = `${this.BaseUrl}/reset-password`;
    console.log("Reset Password URL:", url);
  
    // Envoyer la requête HTTP POST avec les paramètres nécessaires
    return this._http.post<boolean>(url, userData);
  }

  currentUser(): Observable<User> {
    const email = JSON.parse(localStorage.getItem('user1') || '{}');
    return this._http.get<User>(`${this.BaseUrl}/email?email=${email}`);
  }
  
}

