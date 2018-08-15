import { Component, OnInit } from '@angular/core';
import { FileUploader} from "ng2-file-upload";
import {MatDialogRef} from '@angular/material';


@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.css']
})
export class PublishComponent implements OnInit {
  public uploader:FileUploader = new FileUploader({
    url: "http://localhost:3000/ng2/uploadFile",
    method: "POST",
    itemAlias: "uploadedfile"
  });
  file_name: any;
  file: File;
  imageData: any[] = [];
  not_select: boolean;
  good_desc: string;
  good_name: string;
  constructor(public thisDialogRef: MatDialogRef<PublishComponent>) { }

  ngOnInit() {
    this.file_name = '未选择文件';
    this.not_select = true;
  }
  selectImage(){
    document.getElementById('upload_btn').click();

  }
  uploadImage(){
    this.uploader.queue[this.uploader.queue.length-1].upload();
  }
  selectFile(event) {
    console.log(this.uploader.queue.length);
    // 打印文件选择名称
    // console.log(event.target.value);
    // let file = event.target.files[0];
    this.file = this.uploader.queue[this.uploader.queue.length-1]._file;
    // console.log('选择的文件名： ' + file.name);
    // console.log('选择的文件大小： ' + file.size);
    // console.log('选择的文件类型： ' + file.type);
    // console.log(this.file.rawFile);
    // this.file_name = this.file.name;
    let reader = new FileReader();
    let image = this.imageData;
    reader.readAsDataURL(this.file);
    reader.onload = function () {
      console.log(this.result);
      image.push(this.result);
    };
    this.not_select = false;
  }
  close(){
    this.thisDialogRef.close();
  }
  clear(){
    this.good_desc = '';
  }
}
