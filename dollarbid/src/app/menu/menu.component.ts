import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {LoginComponent} from '../login/login.component';
import {RegisterComponent} from '../register/register.component';
import {UserService} from '../User/user.service';
import {LoadingComponent} from '../loading/loading.component';
import { CookieService } from 'ngx-cookie';
declare var $: any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  dialogResult;
  isLogin: boolean;
  username: string;
  chainUrl: string;
  userAddr: string;
  loadingDialog: any;
  _cookieUser: string;
  requestCount = 0;
  apiUrl: any;
  private timer;

  constructor(public dialog: MatDialog,
              private userService: UserService,
              private _cookieService: CookieService) { }

  ngOnInit() {

    console.log('document width: ' + document.body.clientWidth);
    this.chainUrl = this.userService.getChainUrl();
    this.apiUrl = this.userService.getApiUrl();
    this.getLoginStatus();
    this._cookieUser = this._cookieService.get('username');
    console.log('reading cookie: ' + this._cookieUser);
    if (this._cookieUser) {
      console.log('cookie user get');
      this.CookieLogin(this._cookieUser);
    } else {
      console.log('cookie is empty');
    }
  }
  CookieLogin (username: string) {
    $.ajax({
      url: this.apiUrl + '/user/username?username=' + username,
      usrSvc: this.userService,
      instance: this,
      dataType: 'json',
      method: 'GET',
      success: function(data) {
        if (data.username) {
          console.log('获得用户信息： ');
          console.log(data);
          this.usrSvc.setUserAddress(data.useraddress);
          this.usrSvc.setUsername(data.username);
          this.instance.setLoginStatus(data.username);
        } else {
          console.log(data);
        }
      },
      error: function(xhr) {
        // read again
      }
    });
  }
  setLoginStatus(username: string) {
    this.isLogin = true;
    this.username = username;
    this.userService.setLoginSucceed();
  }
  openLogin() {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '300px',
      data: 'This text is passed into the dialog!'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      this.dialogResult = result;
      this.isLogin = this.userService.getLoginStatus();
      this.username = this.userService.getUsername();
    });
  }
  exit() {
    this.userService.logout();
    this.isLogin = this.userService.getLoginStatus();
    this._cookieService.remove('username');
    console.log('清除cookie: ' + this._cookieService.get('username'));
  }
  openLoading () {
    this.loadingDialog = this.dialog.open(LoadingComponent, {
      width: '250px',
      data: '加载区块链...',
      disableClose: true,
    });
    this.loadingDialog.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      this.dialogResult = result;
    });
  }
  closeLoading() {
    this.loadingDialog.close();
  }
  openPerson(option: number) {
    this.openLoading();
    this.userAddr = this.userService.getUserAddress();
    console.log(this.userAddr);
    // 预读数据

    // 获取余额
    this.requestCount++;
    $.ajax({
      url: this.chainUrl + '/getBalance?from=' + this.userAddr,
      usrSvc: this.userService,
      instance: this,
      dataType: 'json',
      method: 'GET',
      success: function(data) {
        this.instance.requestCount--;
        if (data.status === '200') {
          console.log('账户余额： ' + data.data.balance);
          this.usrSvc.setUserBalance(data.data.balance);
        } else {
          console.log(data);
          return 0;
        }
      },
      error: function(xhr) {
        // read again
      }
    });

    // 获取参与的游戏列表
    if ( option === 1) {
      this.userService.clearJoinedList();
      this.requestCount++;
      $.ajax({
        url: this.chainUrl + '/gamelist?from=' + this.userAddr,
        usrSvc: this.userService,
        option: option,
        instance: this,
        dataType: 'json',
        method: 'GET',
        success: function (data) {
          this.instance.requestCount--;
          if (data.status === '200') {
            console.log('参与的游戏列表：');
            console.log(data.data.gameIDs);
            for (let i = 0; i < data.data.gameIDs[0].length; i++) {
              this.instance.requestCount++;

              this.instance.getGameDetailJoined(data.data.gameIDs[0][i], data.data.gameIDs[1][i], data.data.gameIDs[2][i]);

            }
            // this.usrSvc.setUserBalance(data.data.balance);
          } else {
            console.log(data);
            return 0;
          }
        },
        error: function (xhr) {
          alert('error:' + JSON.stringify(xhr));
        }
      });
    }
    //获取发起的游戏列表
    if ( option === 2) {
      this.userService.clearPublishedList();
      this.requestCount++;
      $.ajax({
        url: this.chainUrl + '/mygames?from=' + this.userAddr,
        usrSvc: this.userService,
        option: option,
        instance: this,
        dataType: 'json',
        method: 'GET',
        success: function (data) {
          this.instance.requestCount--;
          if (data.status === '200') {
            console.log('发起的游戏列表：');
            console.log(data.data.gameIDs);
            for (let i = 0; i < data.data.gameIDs.length; i++) {
              this.instance.requestCount++;
              if (option === 2) {
                this.instance.getGameDetail(data.data.gameIDs[i], option);
              }
            }
            // this.usrSvc.setUserBalance(data.data.balance);
          } else {
            console.log(data);
            return 0;
          }
        },
        error: function (xhr) {
          alert('error:' + JSON.stringify(xhr));
        }
      });
    }
    //打开个人中心
    this.openPersonDialog(option);
  }
  getGameDetail (gameID: any, option: number) {
    $.ajax({
      url: this.chainUrl + '/getgame?gameID=' + gameID,
      usrSvc: this.userService,
      option: option,
      instance: this,
      dataType: 'json',
      method: 'GET',
      success: function(data) {
        this.instance.requestCount--;
        if (data.status === '200') {
          console.log('option: ' + option);
          if ( option === 1) {
            console.log('获取参与的游戏详情：' + gameID);
            console.log(data.data.result);
            this.usrSvc.addToJoinedList(data.data.result);
          }
          if (option === 2 ) {
            console.log('获取发起的游戏详情：' + gameID);
            data.data.result.push(gameID);
            console.log(data.data.result);
            this.usrSvc.addToPublishedList(data.data.result);
          }
          //console.log('requests left: ' + this.instance.requestCount);
          return data.data.result;
          // this.usrSvc.setUserBalance(data.data.balance);
        } else {
          console.log(data);
          return 0;
        }
      },
      error: function(xhr) {
        alert('error:' + JSON.stringify(xhr)); }
    });
  }
  getGameDetailJoined (gameID: any, myBet: any, bonus: any) {
    $.ajax({
      url: this.chainUrl + '/getgame?gameID=' + gameID,
      usrSvc: this.userService,

      instance: this,
      dataType: 'json',
      method: 'GET',
      success: function(data) {
        this.instance.requestCount--;
        if (data.status === '200') {
            console.log('获取参与的游戏详情：' + gameID);
            data.data.result.push(myBet);
          data.data.result.push(bonus);
            console.log(data.data.result);
            this.usrSvc.addToJoinedList(data.data.result);
          //console.log('requests left: ' + this.instance.requestCount);
          return data.data.result;
          // this.usrSvc.setUserBalance(data.data.balance);
        } else {
          console.log(data);
          return 0;
        }
      },
      error: function(xhr) {
        alert('error:' + JSON.stringify(xhr)); }
    });
  }
  openPersonDialog(option: number) {
    let height = '100%';
    let width = '100%';
    if (option === 0) {
      height = '440px';
      width = '300px';
    }
    this.timer = setInterval(() => {
      if (this.requestCount === 0) {
        //this.count = 0;
        clearInterval(this.timer);
        console.log('个人中心初始化完成');
        this.closeLoading();
        // const dialogRef = this.dialog.open(PersonComponent, {
        //   width: width,
        //   height: height,
        //   data: option,
        // });
        // dialogRef.afterClosed().subscribe(result => {
        //   console.log(`Dialog closed: ${result}`);
        //   this.dialogResult = result;
        // });
        // console.log(this.usrSvc.getJoinedList());
      }
    }, 500);

  }
  openRegister() {
    const dialogRef = this.dialog.open(RegisterComponent, {
      width: '400px',
      data: 'This text is passed into the dialog!'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      this.dialogResult = result;
      this.isLogin = this.userService.getLoginStatus();
      this.username = this.userService.getUsername();
    });
  }
  // openCharge() {
  //   const dialogRef = this.dialog.open(ChargeComponent, {
  //     width: '80%',
  //     height: '80%',
  //     data: 'This text is passed into the dialog!'
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(`Dialog closed: ${result}`);
  //     this.dialogResult = result;
  //   });
  // }
  // openHelp(option: number) {
  //   const dialogRef = this.dialog.open(HelpComponent, {
  //     width: '80%',
  //     height: '80%',
  //     data: option,
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(`Dialog closed: ${result}`);
  //     this.dialogResult = result;
  //   });
  // }
  getLoginStatus() {
    this.timer = setInterval(() => {
      this.isLogin = this.userService.getLoginStatus();
      this.username = this.userService.getUsername();
    }, 1000);
  }

}
