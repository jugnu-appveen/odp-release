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
    }, dismiss => {
      self.selectedImage = null;
      self.customTag = null;
    });
  }

  triggerTag() {
    const self = this;
    self.apiService.put('image/tag/' + self.selectedImage.Id.substr(7, 12), {
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
    }, dismiss => {
      self.selectedImage = null;
    });
  }

  triggerDelete() {
    const self = this;
    self.apiService.delete('image/' + self.selectedImage.Id.substr(7, 12))
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
    }, dismiss => {
      self.selectedImage = null;
    });
  }

  triggerDownload() {
    const self = this;
    const imageId = self.selectedImage.Id.substr(7, 12);
    const filename = self.customTag || self.selectedImage.RepoTags[0].split(':').join('_');
    const ele = document.createElement('a');
    ele.href = 'http://localhost:4000/api/image/export/' + imageId
      + '?filename=' + filename;
    ele.target = '_blank';
    document.body.appendChild(ele);
    ele.click();
    ele.remove();
  }

  onTagChange(tag: string) {
    const self = this;
    self.customTag = tag;
  }
}
