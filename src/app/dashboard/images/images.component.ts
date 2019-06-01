import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements OnInit {

  @ViewChild('tagImage') tagImage: TemplateRef<HTMLElement>;
  @ViewChild('deleteImage') deleteImage: TemplateRef<HTMLElement>;
  imageList: Array<any>;
  selectedImage: any;
  private tagImageRef: NgbModalRef;
  private deleteImageRef: NgbModalRef;
  constructor(private apiService: ApiService,
    private modalService: NgbModal) {
    const self = this;
    self.imageList = [];
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
    self.tagImageRef = self.modalService.open(self.tagImage, { centered: true });
    self.tagImageRef.result.then(close => {
      self.selectedImage = null;
    }, dismiss => {
      self.selectedImage = null;
    });
  }

  triggerTag() {
    const self = this;
    self.apiService.put('image/tag/' + self.selectedImage.Id.substr(7, 12), {
      tag: '3.0.0'
    }).subscribe(res => {
      console.log(res);
      self.tagImageRef.close(true);
    }, err => { });
  }

  deleteImg(image: any) {
    const self = this;
    self.selectedImage = image;
    self.deleteImageRef = self.modalService.open(self.deleteImage, { centered: true });
    self.deleteImageRef.result.then(close => {
      self.selectedImage = null;
    }, dismiss => {
      self.selectedImage = null;
    });
  }

  triggerDelete() {
    const self = this;
    self.apiService.delete('image/tag/' + self.selectedImage.Id.substr(7, 12))
      .subscribe(res => {
        console.log(res);
        self.deleteImageRef.close(true);
      }, err => { });
  }

  exportImage(image: any) {
    const self = this;
    const ele = document.createElement('a');
    ele.href = 'http://localhost:4000/api/image/export/' + image.Id.substr(7, 12)
      + '?filename=' + image.RepoTags[0].split(':').join('_');
    ele.target = '_blank';
    document.body.appendChild(ele);
    ele.click();
    ele.remove();
  }
}
