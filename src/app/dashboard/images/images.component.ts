import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements OnInit {

  @ViewChild('tagImageEle') tagImageEle: TemplateRef<HTMLElement>;
  @ViewChild('deleteImageEle') deleteImageEle: TemplateRef<HTMLElement>;
  @ViewChild('downloadImageEle') downloadImageEle: TemplateRef<HTMLElement>;
  @ViewChild('newImageEle') newImageEle: TemplateRef<HTMLElement>;
  imageList: Array<any>;
  selectedImage: any;
  customTag: string;
  seletedTag: string;
  zipData: any;
  zipDataName: string;
  repoList: Array<any>;
  branchList: Array<string>;
  imageBuildData: any;
  private tagImageEleRef: NgbModalRef;
  private deleteImageEleRef: NgbModalRef;
  private downloadImageEleRef: NgbModalRef;
  private newImageEleRef: NgbModalRef;
  constructor(private apiService: ApiService,
    private ts: ToastrService,
    private modalService: NgbModal,
    private toolTipConfig: NgbTooltipConfig) {
    const self = this;
    self.imageList = [];
    self.repoList = [];
    self.branchList = [];
    self.imageBuildData = {};
    self.toolTipConfig.container = 'body';
  }

  ngOnInit() {
    const self = this;
    self.getImages();
    self.getRepoList();
  }

  getImages() {
    const self = this;
    self.apiService.get('image').subscribe((res: any) => {
      self.imageList = res;
    }, err => {
      const message = err.error && err.error.message ? err.error.message : 'Unable to fetch Images';
      self.ts.error(message, 'Error');
    });
  }

  getRepoList() {
    const self = this;
    self.apiService.get('repos').subscribe((res: any) => {
      self.repoList = res;
    }, err => {
      const message = err.error && err.error.message ? err.error.message : 'Unable to fetch Repos';
      self.ts.error(message, 'Error');
    });
  }

  getBranchList(repo: string) {
    const self = this;
    self.apiService.get('repos/branch?id=' + repo).subscribe((res: any) => {
      self.branchList = res;
    }, err => {
      const message = err.error && err.error.message ? err.error.message : 'Unable to fetch Branch List';
      self.ts.error(message, 'Error');
    });
  }

  newImage() {
    const self = this;
    self.newImageEleRef = self.modalService.open(self.newImageEle, { centered: true });
    self.newImageEleRef.result.then(close => {
      self.zipData = null;
      self.zipDataName = null;
      self.imageBuildData = {};
    }, dismiss => {
      self.zipData = null;
      self.zipDataName = null;
      self.imageBuildData = {};
    });
  }

  triggerNewImage() {
    const self = this;
    self.apiService.put('image/build', self.imageBuildData).subscribe(res => {
      self.newImageEleRef.close(true);
      self.ts.info('Image build request sent', 'Processing');
    }, err => {
      const message = err.error && err.error.message ? err.error.message : 'Unable to build new image';
      self.ts.error(message, 'Error');
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
    self.apiService.put('image/tag?id=' + self.selectedImage.Id.substr(7, 12), {
      tag: self.customTag
    }).subscribe(res => {
      self.tagImageEleRef.close(true);
      self.ts.success('Image tagged successfully', 'Success');
    }, err => {
      const message = err.error && err.error.message ? err.error.message : 'Unable to Tag Image';
      self.ts.error(message, 'Error');
    });
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
    self.apiService.delete('image?id=' + self.selectedImage.Id.substr(7, 12))
      .subscribe(res => {
        self.deleteImageEleRef.close(true);
      }, err => {
        const message = err.error && err.error.message ? err.error.message : 'Unable to delete Image';
        self.ts.error(message, 'Error');
      });
  }

  downloadImage(image: any) {
    const self = this;
    self.selectedImage = image;
    self.downloadImageEleRef = self.modalService.open(self.downloadImageEle, { centered: true });
    self.downloadImageEleRef.result.then(close => {
      self.selectedImage = null;
      self.seletedTag = null;
    }, dismiss => {
      self.selectedImage = null;
      self.seletedTag = null;
    });
  }

  triggerDownload() {
    const self = this;
    const imageId = self.selectedImage.Id.substr(7, 12);
    const filename = self.seletedTag.split(':').join('_');
    const ele = document.createElement('a');
    ele.href = 'http://localhost:4000/api/image/export?id=' + imageId
      + '&filename=' + filename + '&tag=' + self.seletedTag;
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

  onFileChange(event: any) {
    const self = this;
    if (event.target.files && event.target.files[0]) {
      self.zipDataName = event.target.files[0].name;
      self.zipData = event.target.files[0];
    }
  }

  onRepoChange(event: any) {
    const self = this;
    self.getBranchList(self.imageBuildData.repo);
  }
}
