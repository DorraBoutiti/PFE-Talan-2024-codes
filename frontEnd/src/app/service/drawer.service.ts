import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DrawerService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$: Observable<boolean> = this.isOpenSubject.asObservable();

  constructor() { }

  toggleDrawer() {
    this.isOpenSubject.next(!this.isOpenSubject.value);
  }
}
