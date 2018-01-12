/* import {Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewChild} from '@angular/core';
import {FileService} from "./file.service";
import {FileObject} from "../../file";
import {Subject} from "rxjs";

@Component({
  selector: 'image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css'],
  providers: [FileService]
})
export class ImageUploadComponent implements OnInit, OnChanges {


  @Input() elementId: string = "";
  @Input() value: FileObject[];
  @Input() multiple: boolean;
  @Input() label: string;
  @Input() description: string;
  @Input() limit: number = 1;
  @Output() onUpload = new EventEmitter<FileObject>();
  @Output() onDelete = new EventEmitter<FileObject>();
  @ViewChild("fileInput") fileInput;


  constructor(private fileService: FileService) {

  }


  files: FileObject[] = [];

  images = [];
  errorMessage: string = null;
  didSetValue: boolean = false;

  ngOnInit() {

  }


  ngOnChanges() {

    if (this.value && this.value.length && this.value[0] && !this.didSetValue) {

      this.files = this.value;
      this.didSetValue = true;
    }
  }

  onDeleteFile(index) {

    let file = this.files[index];
    if (file) {

      this.fileService.delete(file.id).subscribe(res => {
        this.files.splice(index, 1);
        this.onDelete.emit(file);
      }, err => {
        let errObj = err.json();
        if (typeof errObj !== "undefined" && errObj.error) {
          this.errorMessage = errObj.error.message;
        } else {
          this.errorMessage = "An error";
        }

      })

    }

  }

  uploading: boolean = false;


  onFileChange(input) {

    this.uploading = true;
    let fi = this.fileInput.nativeElement;

    if (fi.files && fi.files[0]) {

      for (let fileToUpload of fi.files) {


        let validation = this.fileService.validateFile(fileToUpload);
        if (!validation) {
          this.errorMessage = "File type is not valid or too large.";
          input.value = null;
          this.fileInput.nativeElement.value = null;
          this.uploading = false;

        } else {

          this.fileService.upload(fileToUpload).subscribe(file => {

            this.uploading = false;

            this.files.push(file);
            this.onUpload.emit(file);
            input.value = null;
            this.fileInput.nativeElement.value = null;

          }, err => {
            console.log(err);
            this.uploading = false;
            this.errorMessage = "Unable upload file.";
            input.value = null;
            this.fileInput.nativeElement.value = null;
          });
        }


      }


    }


  }


} */