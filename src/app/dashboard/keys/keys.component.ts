import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-keys',
  templateUrl: './keys.component.html',
  styleUrls: ['./keys.component.scss']
})
export class KeysComponent implements OnInit {

  selectedFileName: string;
  selectedFile: any;
  keys: Array<string>;
  constructor(private apiService: ApiService) {
    const self = this;
    self.keys = [];
  }

  ngOnInit() {
    const self = this;
    self.getKeys();
  }

  onChange(event: any) {
    const self = this;
    if (event.target.files && event.target.files[0]) {
      self.selectedFileName = event.target.files[0].name;
      self.selectedFile = event.target.files[0];
    }
  }

  uploadKey() {
    const self = this;
    const formData = new FormData();
    formData.set('file', self.selectedFile);
    self.apiService.post('keys', formData).subscribe(res => {
      self.selectedFileName = null;
      self.selectedFile = null;
      self.getKeys();
    }, err => {
      self.selectedFileName = null;
      self.selectedFile = null;
    });
  }

  deleteKey(id: string) {
    const self = this;
    self.apiService.delete('keys?id=' + id).subscribe((res: any) => {
      self.getKeys();
    }, err => { });
  }

  getKeys() {
    const self = this;
    self.apiService.get('keys').subscribe((res: any) => {
      self.keys = res;
    }, err => { });
  }
}
