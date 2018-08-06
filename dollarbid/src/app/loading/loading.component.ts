import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  label: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit() {
    this.label = this.data;

  }

}
