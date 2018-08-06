import { Component, OnInit } from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';

import {UserService} from '../User/user.service';

import {LoadingComponent} from '../loading/loading.component';

import {LoginComponent} from '../login/login.component';
import {Element} from "./bid.service";
declare var $: any;

@Component({
  selector: 'app-bid',
  templateUrl: './bid.component.html',
  styleUrls: ['./bid.component.css']
})
export class BidComponent implements OnInit {
  more: boolean;
  bet_txt: string;
  chainUrl: string;
  requestCount: number;
  loadingDialog: any;
  private timer;
  goods = [
    {id: 1, name: '英国白金汉宫', desc: '白金汉宫（Buckingham Palace）是英国君主位于伦敦的主要寝宫及办公处。宫殿坐落在威斯敏斯特，是国家庆典和王室欢迎礼举行场地之一，也是一处重要的旅游景点。', img: './assets/house.jpeg', price: 1000, progress: 600, endDate:'2018-9-10'},
    {id: 1, name: '劳斯莱斯', desc: '2018款劳斯莱斯全新幻影第八代产品,全新铝制奢华架构打造,车身整备质量降低,刚性增强30%', img: './assets/car.jpeg', price: 9000, progress: 2900, endDate:'2018-9-10'},
    {id: 1, name: '巴黎埃菲尔铁塔', desc: '埃菲尔铁塔（法语：La Tour Eiffel；英语：the Eiffel Tower）矗立在塞纳河南岸法国巴黎的战神广场，于1889年建成', img: './assets/aifier.jpeg', price: 1000, progress: 690, endDate:'2018-9-10'},
    {id: 1, name: '法拉利458', desc: '法拉利458 Italia是一款中后置8缸双门跑车，在2009年法兰克福车展上推出，标志着法拉利（Ferrari）在其原有中后置发动机跑车的基础上实现了重大飞跃', img: './assets/f458.jpeg', price: 9000, progress: 2900, endDate:'2018-9-10'},
    {id: 1, name: '悉尼歌剧院', desc: '悉尼歌剧院（Sydney Opera House），位于悉尼市区北部，是悉尼市地标建筑物，由丹麦建筑师约恩·乌松（Jorn Utzon）设计，一座贝壳形屋顶下方是结合剧院和厅室的水上综合建筑', img: './assets/sydney.jpeg', price: 1000, progress: 550, endDate:'2018-9-10'},

  ];


  constructor(public dialog: MatDialog,
              private userService: UserService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.more = true;
    this.bet_txt = '抢购';
    this.chainUrl = this.userService.getChainUrl();
  }
  openLoading () {
    this.loadingDialog = this.dialog.open(LoadingComponent, {
      width: '250px',
      data: '加载区块链...',
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
  openWhenLogin () {
    const isLogin = this.userService.getLoginStatus();
    if (isLogin) {
      this.open_worldcup();
    } else {
      this.snackBar.open('您还未登陆', '请先登陆', {
        duration: 2000,
        //horizontalPosition: 'left',
        verticalPosition: 'top',
      });
      this.openLogin();
    }
  }
  open_worldcup() {
    this.userService.clearAllGameList();
    this.requestCount = 0;
    this.openLoading();
    //get all games
    $.ajax({
      url: this.chainUrl + '/allgames',
      instance: this,
      dataType: 'json',
      method: 'GET',
      success: function (data) {
        //this.instance.requestCount--;
        if (data.status === '200') {
          console.log('最大游戏id：' + data.data.maxGameID);
          this.instance.open_worldcup_dialog();
          const game_count = data.data.maxGameID ;
          for (let i = 0; i < game_count; i++) {
            this.instance.requestCount++;

              this.instance.getGameDetail(i);



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
  open_worldcup_dialog() {
    this.timer = setInterval(() => {
      if (this.requestCount === 0) {
        //this.count = 0;
        clearInterval(this.timer);
        console.log('获取全部游戏信息完成');
        this.closeLoading();
        const clientWidth = document.body.clientWidth;
        var width;
        if (clientWidth > 1024) {
          width = '850px';
        } else {
          width = '90%';
        }
        // const dialogRef = this.dialog.open(WorldcupComponent, {
        //   width: width,
        //   height: '80%',
        //   data: 'This text is passed into the dialog!'
        // });
        // dialogRef.afterClosed().subscribe(result => {
        //   console.log(`Dialog closed: ${result}`);
        //   // this.dialogResult = result;
        // });
        // console.log(this.usrSvc.getJoinedList());
      }
    }, 500);
  }
  getGameDetail (gameID: any) {
    $.ajax({
      url: this.chainUrl + '/getgame?gameID=' + gameID,
      usrSvc: this.userService,
      instance: this,
      dataType: 'json',
      method: 'GET',
      success: function(data) {
        this.instance.requestCount--;
        if (data.status === '200') {
            console.log('获取全部游戏详情之：' + gameID);
            data.data.result.push(gameID);
            console.log(data.data.result);
            this.instance.getUsername(data.data.result);


        } else {
          console.log(data);
          return 0;
        }
      },
      error: function(xhr) {
        alert('error:' + JSON.stringify(xhr)); }
    });
  }
  getUsername(game: any) {

    // http://47.95.116.38:9998/user?userAddr=0x9e3b54263a4Aac9cac25E282191775fb28ab0aB8

      let userAddr = game[0];
      //console.log(userAddr);
      $.ajax({
        url: this.userService.getApiUrl() + '/user?userAddr=' + userAddr,
        usrSvc: this.userService,
        instance: this,
        dataType: 'json',
        method: 'GET',
        success: function(data) {
          if (data.username) {
            console.log('获取用户名：' + data.username);
            game.push(data.username);
            console.log(game);
            this.usrSvc.addToAllGameList(game);
          } else {
            console.log(data);
            return 0;
          }
        },
        error: function(xhr) {
          alert('error:' + JSON.stringify(xhr)); }
      });

  }
  // openDialog_3d() {
  //   const dialogRef = this.dialog.open(R3dComponent, {
  //     width: '70%',
  //     height: '80%',
  //     data: 'This text is passed into the dialog!'
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(`Dialog closed: ${result}`);
  //     // this.dialogResult = result;
  //   });
  // }
  // openDialog_113() {
  //   const dialogRef = this.dialog.open(R113Component, {
  //     width: '70%',
  //     height: '80%',
  //     data: 'This text is passed into the dialog!'
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(`Dialog closed: ${result}`);
  //     // this.dialogResult = result;
  //   });
  // }
  // openDialog_draw() {
  //   const dialogRef = this.dialog.open(GameDrawComponent, {
  //     width: '70%',
  //     height: '80%',
  //     data: 'This text is passed into the dialog!'
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(`Dialog closed: ${result}`);
  //     // this.dialogResult = result;
  //   });
  // }
  // openHelp(option: number) {
  //   const dialogRef = this.dialog.open(HelpComponent, {
  //     width: '80%',
  //     height: '40%',
  //     data: option,
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(`Dialog closed: ${result}`);
  //    // this.dialogResult = result;
  //   });
  // }
  openLogin() {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '100%',
      data: 'This text is passed into the dialog!'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      //this.dialogResult = result;
      //this.isLogin = this.userService.getLoginStatus();
      //this.username = this.userService.getUsername();
    });
  }
  round(progress: number) {
    return Math.round(progress);
  }
}
