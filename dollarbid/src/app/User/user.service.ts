import { Injectable } from '@angular/core';


@Injectable()

export class UserService {
  isLogin: boolean;
  username: string;
  phone: string;
  email: string;
  address: string;
  balance: any;
  chainUrl = 'http://47.104.136.172';
  apiUrl = 'http://47.95.116.38:9998';
  gameListJoined = [];
  gameListPublished = [];
  allGameList = [];
  //private userUrl = 'http://localhost:9998/user/username?username=admin';
  //private localUrl = '/app/test.json';

  constructor() {}

  // getUserInfo(): Observable<User> {
  //   return this.http.get(this.userUrl);
  // }

  getApiUrl () {
    return this.apiUrl;
  }

  getChainUrl(){
    return this.chainUrl;
  }

  setUserBalance(balance: any): void {
    this.balance = balance;
  }
  getUserBalance(): any {
    return this.balance;
  }
  setLoginSucceed(): void {
    this.isLogin = true;
  }
  setUserAddress(address: string): void {
    this.address = address;
  }
  getUserAddress(): string {
    return this.address;
  }
  setUsername(username: string): void {
    this.username = username;
  }
  getUsername(): string {
    return this.username;
  }
  setPhone(phone: string): void {
    this.phone = phone;
  }
  getPhone(): string {
    return this.phone;
  }
  setEmail(email: string): void {
    this.email = email;
  }
  getEmail(): string {
    return this.email;
  }
  logout(): void {
    this.isLogin = false;
    this.username = null;
    this.address = null;
    this.balance = 0;
  }
  getLoginStatus(): boolean {
    return this.isLogin;
  }
  addToJoinedList(game: any) {
    this.gameListJoined.push(game);
  }
  getJoinedList() {
    return this.gameListJoined;
  }
  clearJoinedList() {
    this.gameListJoined = [];
  }
  addToPublishedList(game: any) {
    this.gameListPublished.push(game);
  }
  getPublishedList() {
    return this.gameListPublished;
  }
  clearPublishedList(){
    this.gameListPublished = [];
  }
  getAllGameList() {
    return this.allGameList;
  }
  addToAllGameList(game: any) {
    this.allGameList.push(game);
  }
  clearAllGameList() {
    this.allGameList = [];
  }
}
