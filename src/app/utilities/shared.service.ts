import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  isCollapsed = false;
  menu = false;
  title = new BehaviorSubject<string>('')
  constructor() {}

  setMenu(value: boolean) {
    this.menu = value;
  }

  setTitle(title : string){
    this.title.next(title)
  }

  title$(){
    return this.title.asObservable()
  }

  getMenu() {
    return this.menu;
  }

  setCollapsed(value: boolean) {
    this.isCollapsed = value;
  }
  getCollapsed() {
    return this.isCollapsed;
  }
}
