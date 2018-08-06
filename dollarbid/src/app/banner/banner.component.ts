import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog} from '@angular/material';
import {LoginComponent} from '../login/login.component';
@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
  dialogResult;


  constructor(public dialog: MatDialog) {



  }









  ngOnInit() {
  }
  openDialog() {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '300px',
      data: 'This text is passed into the dialog!'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      this.dialogResult = result;
    });
  }
}
