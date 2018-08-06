import { Component, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {MatDialogRef} from '@angular/material';
import {UserService} from '../User/user.service';
import { MatSnackBar} from '@angular/material';
import {AppComponent} from '../app.component';
import {LoadingComponent} from '../loading/loading.component';
import { CookieService } from 'ngx-cookie';
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  myurl: string;
  apiUrl: string;
  succeed: boolean;
  usernameFalse = false;
  passwordFalse: false;
  loadingDialog: any;
  constructor(public thisDialogRef: MatDialogRef<LoginComponent>,
              private userService: UserService,
              public snackBar: MatSnackBar,
              public dialog: MatDialog,
              private _cookieService: CookieService) { }
  hide = true;
  ngOnInit() {
    //this.username = 'super';
    this.apiUrl = this.userService.getApiUrl();
    this.myurl = this.apiUrl + '/login?user=' + this.username + '&password=' + this.password;
    this.succeed = true;
    this.username = '';
    this.password = '';
  }
  switch() {
    this.usernameFalse = !this.usernameFalse;
  }
  openLoading () {
    this.loadingDialog = this.dialog.open(LoadingComponent, {
      width: '350px',
      data: '区块链用户验证,请稍候...',
      disableClose: true,
    });
    this.loadingDialog.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      //this.dialogResult = result;
    });
  }
  closeLoading() {
    this.loadingDialog.close();
  }
  LoginIf() {
    if (this.username === '') {
      this.snackBar.open('请输入用户名', '', {
        duration: 3000,
        //horizontalPosition: 'left',
        verticalPosition: 'top',
      });
    } else if (this.password === '') {
      this.snackBar.open('请输入密码', '', {
        duration: 3000,
        //horizontalPosition: 'left',
        verticalPosition: 'top',
      });
    } else {
      this.Login();
    }
  }
  Login() {
    console.log('开始登陆验证');
    this.openLoading();
    this.myurl = this.apiUrl + '/login?user=' + this.username + '&password=' + this.password;
    $.ajax({
      url: this.myurl,
      suc: this.userService,
      diag: this.thisDialogRef,
      user: this.username,
      nameFalse: this.usernameFalse,
      pwdFalse: this.passwordFalse,
      snackBar: this.snackBar,
      instance: this,
      dataType: 'json',
      method: 'POST',
      success: function(data) {
        // this.snackBar.open('登陆中', '请稍候', {
        //   duration: 3000,
        //   //horizontalPosition: 'left',
        //   verticalPosition: 'top',
        // });
        if (data.msg) {
          console.log(data);
          this.instance.closeLoading();
          if (data.err === 1) {
            this.nameFalse = true;
            this.usernameFalse = true;
            console.log('username false: ' + this.usernameFalse);
            //alert('用户名不存在， 请重试！');
            this.snackBar.open('用户不存在', '请重试', {
              duration: 3000,
              //horizontalPosition: 'left',
              verticalPosition: 'top',
            });
          }
          if (data.err === 2) {
            this.pwdFalse = true;
            this.instance.closeLoading();
            console.log('password false: ' + this.usernameFalse);
            //alert('密码错误， 请重试！');
            this.snackBar.open('密码错误', '请重试', {
              duration: 3000,
              //horizontalPosition: 'left',
              verticalPosition: 'top',
            });
          }
        } else {
          console.log('登陆成功， 获取用户信息');
          console.log(data);
          $.ajax({
            url: 'http://47.104.136.172/getBalance?from=' + data.useraddress,
            userData: data,
            usrSvc: this.suc,
            snackBar: this.snackBar,
            diag: this.diag,
            instance: this.instance,
            dataType: 'json',
            method: 'GET',
            success: function(data) {
              this.instance.closeLoading();
              if (data.status === '200'){
                this.instance._cookieService.put('username', this.userData.username);
                console.log('cookie set: ' + this.instance._cookieService.get('username'));
                console.log('用户余额: ' + data.data.balance);
                this.usrSvc.setUserBalance(data.data.balance);
                this.usrSvc.setLoginSucceed();
                this.usrSvc.setUsername(this.userData.username);
                this.usrSvc.setEmail(this.userData.email);
                this.usrSvc.setPhone(this.userData.phone);
                this.usrSvc.setUserAddress(this.userData.useraddress);
                this.snackBar.open('登陆成功', '欢迎回来！', {
                  duration: 1000,
                  //horizontalPosition: 'left',
                  verticalPosition: 'top',
                });
                this.diag.close('登陆成功， 关闭登陆窗口');
              } else {
                this.instance.closeLoading();
                console.log(data);
                return 0;
              }
            },
            error: function(xhr) {
              this.instance.closeLoading();
              console.log('登陆中，获取余额出错:' + JSON.stringify(xhr));
              this.snackBar.open('网络超时', '请重试', {
                duration: 1000,
                //horizontalPosition: 'left',
                verticalPosition: 'top',
              });
            }
          });

          //console.log(this.suc.getUsername());
        }
      },
      error: function(xhr) {
        this.instance.closeLoading();
         console.log('error:' + JSON.stringify(xhr));
        this.snackBar.open('网络超时', '请重试', {
          duration: 1000,
          //horizontalPosition: 'left',
          verticalPosition: 'top',
        });
      }
    });

    this.usernameFalse = true;
  }
  onCloseCancel() {
    this.thisDialogRef.close('Cancel');
  }
}
