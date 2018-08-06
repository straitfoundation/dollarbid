import { Component, OnInit } from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {LoginComponent} from '../login/login.component';
import { UserService} from '../User/user.service';
import {LoadingComponent} from '../loading/loading.component';

declare var $: any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  dialogResult;
  chainUrl: string;
  disabled_publish = false;
  loginDialog: any;
  loadingDialog: any;
  //dialogRef = this.dialog;
  constructor(public dialog: MatDialog,
              private usrSvc: UserService,
              public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.chainUrl = this.usrSvc.getChainUrl();
    // this.openLoading();
  }
  Login() {
    this.loginDialog = this.dialog.open(LoginComponent, {
      width: '300px',
      data: 'This text is passed into the dialog!'
    });
    this.loginDialog.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      this.dialogResult = result;
    });
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
  Publish() {
    let isLogin = this.usrSvc.getLoginStatus();
    if (isLogin) {
      this.openDialogPublish();
    } else {
      this.snackBar.open('您还未登陆', '请先登陆', {
        duration: 5000,
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
      url: this.chainUrl + '/getBalance?from=' + this.usrSvc.getUserAddress(),
      // disabled_publish: this.disabled_publish,
      instance: this,
      usrSvc: this.usrSvc,
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
          this.usrSvc.setUserBalance(data.data.balance);
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

}
