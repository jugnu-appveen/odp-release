import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements OnInit {

  imageList: Array<any>;
  constructor(private apiService: ApiService) {
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
}
