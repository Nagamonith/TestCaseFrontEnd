import { Injectable,Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LeftbarService {
  private left = new Subject<any>();
  private tree = new Subject<any>();

  setLeftNode(data: any){
    this.left.next({data})
  }
  getLeftNode():Observable<any>{
    return this.left.asObservable();
  }


  setTreeNode(data: any){
    this.tree.next({data})
  }
  getTreeNode():Observable<any>{
    return this.tree.asObservable();
  }

}