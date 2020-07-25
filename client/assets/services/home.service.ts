import { Injectable,Output,EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HomeService {


  @Output() dato=new EventEmitter();

  constructor() { }

  pasarDato(dato){
    this.dato.emit(dato);
  }
}
