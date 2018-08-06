import { Component, OnInit } from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {LoginComponent} from '../login/login.component';
import { UserService} from '../User/user.service';
import {LoadingComponent} from '../loading/loading.component';
import {CookieService} from "ngx-cookie";

declare var $: any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  dialogResult;
  isLogin: boolean;
  username: string;
  chainUrl: string;
  disabled_publish = false;
  loginDialog: any;
  loadingDialog: any;
  apiUrl: any;
  _cookieUser: string;
  private timer;
  //dialogRef = this.dialog;
  constructor(public dialog: MatDialog,
              private userService: UserService,
              private _cookieService: CookieService,
              public snackBar: MatSnackBar) { }

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

  closeLogin () {
    this.loginDialog.close();
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
  togglePublishBtn () {
    this.disabled_publish = !this.disabled_publish;
    console.log('toggle publish button' + this.disabled_publish);
  }
  publish() {
    let isLogin = this.userService.getLoginStatus();
    if (isLogin) {
      this.openDialogPublish();
    } else {
      this.snackBar.open('您还未登陆', '请先登陆', {
        duration: 3000,
        //horizontalPosition: 'left',
        verticalPosition: 'top',
      });
      this.Login();
    }

  }
  openDialogPublish() {
    this.togglePublishBtn();
    this.openLoading();
    $.ajax({
      url: this.chainUrl + '/getBalance?from=' + this.userService.getUserAddress(),
      // disabled_publish: this.disabled_publish,
      instance: this,
      // usrSvc: this.usrSvc,
      dialog: this.dialog,
      dataType: 'json',
      method: 'GET',
      success: function(data) {
        // console.log('enable publish button');
        // this.toggle();
        this.instance.togglePublishBtn();
        this.instance.closeLoading();
        if (data.status === '200') {
          console.log('发布游戏，账户余额: ' + data.data.balance);
          this.instance.usrSvc.setUserBalance(data.data.balance);
          console.log(`初始化发布窗口`);
          // const dialogRef = this.dialog.open(PublishComponent, {
          //   width: '600px',
          //   data: '',
          // });
          // dialogRef.afterClosed().subscribe(result => {
          //   console.log(`关闭发布窗口`);
          //   //this.dialogResult = result;
          // });
        } else {
          console.log(data);
          return 0;
        }
      },
      error: function(xhr) {
        alert('error:' + JSON.stringify(xhr)); }
    });

  }
  Login() {
    this.loginDialog = this.dialog.open(LoginComponent, {
      width: '100%',
      data: 'This text is passed into the dialog!'
    });
    this.loginDialog.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      this.dialogResult = result;
    });
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
  getLoginStatus() {
    this.timer = setInterval(() => {
      this.isLogin = this.userService.getLoginStatus();
      this.username = this.userService.getUsername();
    }, 1000);
  }
}
