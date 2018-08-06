import {Component, OnInit, ViewChild} from '@angular/core';
import {LoginComponent} from '../login/login.component';
import {MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {UserService} from '../User/user.service';
import {LoadingComponent} from '../loading/loading.component';
import { CookieService } from 'ngx-cookie';

declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  reg_username: string;
  reg_pwd: string;
  reg_pwd_confirm: string;
  reg_phone: string;
  userAddress: string;
  myurl: string;
  apiUrl: string;
  sms: string;
  coins: any;
  preRegister: boolean;
  userAddr: string;
  loadingDialog: any;
  reg_userAddr: string;
  constructor(public thisDialogRef: MatDialogRef<LoginComponent>,
              private userService: UserService,
              public snackBar: MatSnackBar,
              public dialog: MatDialog,
              private cookieSvc: CookieService) { }

  ngOnInit() {
    this.sms = ' 发送验证码';
    this.apiUrl = this.userService.getApiUrl();
    this.coins = 100 * 100000000;
    this.reg_pwd = '';
    this.reg_pwd_confirm = '';
    this.reg_username = '';
  }
  Close() {
    this.thisDialogRef.close('Close');
  }
  send_sms(){
    this.sms = '发送成功';
  }
  transfer(to: string) {
    const getUserInfoUrl = this.apiUrl + '/user/username?username=';

    //get to address
    $.ajax({
      url: getUserInfoUrl + to,
      instance: this,
      timeout: 120000,
      dataType: 'json',
      method: 'GET',
      success: function(data) {
        if (data.useraddress){
          this.instance.openLoading();
          console.log('to 用户地址: ' + data.useraddress);
          this.instance.toAddress = data.useraddress;
          this.instance.PostToTransfer();
        } else {
          console.log(data);
          this.instance.btn_disabled = false;
          this.instance.snackBar.open('用户 ' + this.instance.to + ' 不存在', '请确认用户名后重试', {
            duration: 3000,
            //horizontalPosition: 'left',
            verticalPosition: 'top',
          });
        }
      },
      error: function(xhr) {
        this.instance.btn_disabled = false;
        this.instance.snackBar.open('网络错误', '请稍后重试', {
          duration: 3000,
          //horizontalPosition: 'left',
          verticalPosition: 'top',
        });
        console.log('error:' + JSON.stringify(xhr)); }
    });
    // http://47.104.136.172/transfer?from=0x22bcca213d04fdf51ff14915a8877172f0b3d8de&to=0x401c4cA06e7E6E2bdCC232600C4c5090976ABe12&value=2200000000
  }
  PostToTransfer(userAddr: string) {
    // this.snackBar.open('新用户注册即送 100 Coins！', '请稍候...', {
    //   //horizontalPosition: 'left',
    //   verticalPosition: 'top',
    // });
    const from = '0x22bcca213d04fdf51ff14915a8877172f0b3d8de';
    const transferURL = this.userService.getChainUrl()
      + '/transfer?from=' + from
      + '&to=' + userAddr
      + '&value=' + this.coins;
    console.log('Post request: ' + transferURL);
    $.ajax({
      url: transferURL,
      timeout: 120000,
      instance: this,
      dataType: 'json',
      method: 'POST',
      success: function(data) {
        if (data.tx) {
          console.log(data);

          this.instance.snackBar.open('新用户赠送 100 Coins 到账！', 'Have Fun!', {
            duration: 3000,
            //horizontalPosition: 'left',
            verticalPosition: 'top',
          });
        } else {
          console.log('error: ' + data);
        }
      },
      error: function(xhr) {
        //this.instance.closeLoading();
        // this.instance.snackBar.open('网络错误', '请联系客服获得赠送Coins', {
        //   duration: 5000,
        //   //horizontalPosition: 'left',
        //   verticalPosition: 'top',
        // });
        console.log('error:' + JSON.stringify(xhr));
      }
    });
  }
  registerIfInfo () {
    let done = true;
    const pwd_ok = (this.reg_pwd !== '') && (this.reg_pwd_confirm !== '') && (this.reg_pwd === this.reg_pwd_confirm);
    if (!pwd_ok) {
      this.snackBar.open('两次密码输入不一致', '请重试', {
        duration: 5000,
        //horizontalPosition: 'left',
        verticalPosition: 'top',
      });
      done = false;
    }
    if((this.reg_pwd === '') && (this.reg_pwd_confirm === '')) {
      this.snackBar.open('密码不能为空', '', {
        duration: 5000,
        //horizontalPosition: 'left',
        verticalPosition: 'top',
      });
    }
    if (this.reg_username === '') {
      this.snackBar.open('请输入用户名', '', {
        duration: 5000,
        //horizontalPosition: 'left',
        verticalPosition: 'top',
      });
      done = false;
    }



    if (done) {
      this.findUserExist();
    }
  }
  getNewAddr(){
    $.ajax({
      url: 'http://47.104.136.172/newuser',
      instance: this,
      userSer: this.userService,
      // username: this.user,
      // snackBar: this.snackBar,
      // dialog: this.diag,
      dataType: 'json',
      method: 'GET',
      success: function(data) {
        if(!data){
          console.log(data);
        } else {
          console.log(data);
          this.instance.reg_userAddr = data;
          console.log('获得地址: ' + this.instance.reg_userAddr + ' 继续注册');
          this.instance.register();
        }
      },
      error: function(xhr) {
        // 导致出错的原因较多，以后再研究
        this.instance.closeLoading();
        this.instance.snackBar.open('网络超时', '请重试', {
          duration: 2000,
          //horizontalPosition: 'left',
          verticalPosition: 'top',
        });
        console.log('error:' + JSON.stringify(xhr)); }
    });
  }
  findUserExist() {
    this.openLoading();
    // http://localhost:9998/user/username?username=super
    $.ajax({
      url: this.userService.getApiUrl() + '/user/username?username=' + this.reg_username,
      usrSvc: this.userService,
      instance: this,
      dataType: 'json',
      method: 'GET',
      success: function(data) {
        if (data.username) {
          this.instance.closeLoading();
          this.instance.snackBar.open('用户名已存在', '请重试', {
            duration: 1000,
            //horizontalPosition: 'left',
            verticalPosition: 'top',
          });
        } else {
          console.log('用户不存在，继续注册-->从区块链中获取新地址');
          this.instance.getNewAddr();
        }
      },
      error: function(xhr) {
        // read again
        this.instance.snackBar.open('网络超时', '请重试', {
          duration: 1000,
          //horizontalPosition: 'left',
          verticalPosition: 'top',
        });
      }
    });
  }
  register() {
    this.myurl = this.apiUrl + '/user/register?username=' + this.reg_username +
      '&password=' + this.reg_pwd +
      '&phone=' + this.reg_phone + '&address=' + this.reg_userAddr;
    $.ajax({
      url: this.myurl,
      instance: this,
      userSvc: this.userService,
      dataType: 'json',
      method: 'POST',
      success: function(data) {
        if(data.msg){
          this.instance.closeLoading();
          console.log(data.msg);
          //alert(data.msg);
          this.instance.snackBar.open(data.msg, '请重试', {
            duration: 5000,
            //horizontalPosition: 'left',
            verticalPosition: 'top',
          });
          this.suc = false;
        } else {
          console.log(data);
          this.userSvc.setLoginSucceed();
          this.userSvc.setUsername(data.username);
          this.userSvc.setEmail(data.email);
          this.userSvc.setPhone(data.phone);
          this.userSvc.setUserAddress(data.useraddress);
          this.instance.thisDialogRef.close();
          this.instance.closeLoading();
          this.instance.cookieSvc.put('username', data.username);
          console.log('注册后更新cookie：' + this.instance.cookieSvc.get('username'));
          this.instance.snackBar.open('注册成功', '登陆中', {
            duration: 1000,
            //horizontalPosition: 'left',
            verticalPosition: 'top',
          });
          this.instance.PostToTransfer(data.useraddress);
        }
      },
      error: function(xhr) {
        // 导致出错的原因较多，以后再研究
        this.instance.closeLoading();
        this.instance.snackBar.open('网络超时', '请重试', {
          duration: 2000,
          //horizontalPosition: 'left',
          verticalPosition: 'top',
        });
        console.log('error:' + JSON.stringify(xhr)); }
    });
  }
  openLoading () {
    this.loadingDialog = this.dialog.open(LoadingComponent, {
      width: '350px',
      data: '新区块链用户注册中',
      disableClose: true,
    });
    this.loadingDialog.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      // this.dialogResult = result;
    });
  }
  closeLoading() {
    this.loadingDialog.close();
  }
}
