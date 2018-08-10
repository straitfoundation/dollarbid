import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BidService {

  constructor() { }
}
export interface Element {
  name: string;
  desc: string;
  price: number;
  progress: number;
  id: number;
  img: string;
  endDate: string;

}

const ELEMENT_DATA: Element[] = [
  {id: 1, name: '不动产', desc: 'house 1000m2', img: './assets/house.jpeg', price: 1000, progress: 800, endDate:'2018-9-10'},
  {id: 1, name: '劳斯莱斯', desc: 'luxury car', img: './assets/car.jpeg', price: 9000, progress: 2900, endDate:'2018-9-10'},
];
