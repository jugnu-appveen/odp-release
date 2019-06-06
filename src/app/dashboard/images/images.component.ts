import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { NgbModal, NgbModalRef, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements OnInit {

  @ViewChild('tagImageEle') tagImageEle: TemplateRef<HTMLElement>;
  @ViewChild('deleteImageEle') deleteImageEle: TemplateRef<HTMLElement>;
  @ViewChild('downloadImageEle') downloadImageEle: TemplateRef<HTMLElement>;
  imageList: Array<any>;
  selectedImage: any;
  customTag: string;
  seletedTag: string;
  code: string;
  private tagImageEleRef: NgbModalRef;
  private deleteImageEleRef: NgbModalRef;
  private downloadImageEleRef: NgbModalRef;
  constructor(private apiService: ApiService,
    private modalService: NgbModal,
    private toolTipConfig: NgbTooltipConfig) {
    const self = this;
    self.imageList = [];
    self.toolTipConfig.container = 'body';
  }

  ngOnInit() {
    const self = this;
    self.getImages();
  }

  getImages() {
    const self = this;
    self.apiService.get('image').subscribe((res: any) => {
      self.imageList = res;
    }, err => {

    });
  }

  newTag(image: any) {
    const self = this;
    self.selectedImage = image;
    self.tagImageEleRef = self.modalService.open(self.tagImageEle, { centered: true });
    self.tagImageEleRef.result.then(close => {
      self.selectedImage = null;
      self.customTag = null;
      self.code = null;
    }, dismiss => {
      self.selectedImage = null;
      self.customTag = null;
      self.code = null;
    });
  }

  triggerTag() {
    const self = this;
    self.apiService.put('image/tag?id=' + self.selectedImage.Id.substr(7, 12) + '&token=' + self.code, {
      tag: self.customTag
    }).subscribe(res => {
      self.tagImageEleRef.close(true);
    }, err => { });
  }

  deleteImg(image: any) {
    const self = this;
    self.selectedImage = image;
    self.deleteImageEleRef = self.modalService.open(self.deleteImageEle, { centered: true });
    self.deleteImageEleRef.result.then(close => {
      self.selectedImage = null;
      self.code = null;
    }, dismiss => {
      self.selectedImage = null;
      self.code = null;
    });
  }

  triggerDelete() {
    const self = this;
    self.apiService.delete('image?id=' + self.selectedImage.Id.substr(7, 12) + '&token=' + self.code)
      .subscribe(res => {
        self.deleteImageEleRef.close(true);
      }, err => { });
  }

  downloadImage(image: any) {
    const self = this;
    self.selectedImage = image;
    self.downloadImageEleRef = self.modalService.open(self.downloadImageEle, { centered: true });
    self.downloadImageEleRef.result.then(close => {
      self.selectedImage = null;
      self.seletedTag = null;
      self.code = null;
    }, dismiss => {
      self.selectedImage = null;
      self.seletedTag = null;
      self.code = null;
    });
  }

  triggerDownload() {
    const self = this;
    const imageId = self.selectedImage.Id.substr(7, 12);
    const filename = self.seletedTag.split(':').join('_');
    const ele = document.createElement('a');
    ele.href = 'http://localhost:4000/api/image/export?id=' + imageId
      + '&filename=' + filename + '&tag=' + self.seletedTag + '&token=' + self.code;
    ele.target = '_blank';
    document.body.appendChild(ele);
    ele.click();
    ele.remove();
    self.downloadImageEleRef.close(true);
  }

  onTagChange(tag: string) {
    const self = this;
    self.seletedTag = tag;
  }
}
