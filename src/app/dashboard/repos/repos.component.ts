import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-repos',
  templateUrl: './repos.component.html',
  styleUrls: ['./repos.component.scss']
})
export class ReposComponent implements OnInit {

  selectedFileName: string;
  selectedFile: any;
  repos: Array<any>;
  data: any;
  constructor(private apiService: ApiService,
    private ts: ToastrService) {
    const self = this;
    self.repos = [];
    self.data = {};
  }

  ngOnInit() {
    const self = this;
    self.getRepos();
  }

  onUrlChange(url: string) {
    const self = this;
    if (url && url.trim()) {
      const seg = url.split('/');
      self.data.name = seg[seg.length - 1].replace('.git', '');
    }
  }

  saveRepo() {
    const self = this;
    self.apiService.post('repos', self.data).subscribe((res: any) => {
      self.data = {};
      self.getRepos();
      self.ts.success('Repo saved successfully', 'Success');
    }, err => {
      const message = err.error && err.error.message ? err.error.message : 'Unable to save Repo';
      self.ts.error(message, 'Error');
    });
  }

  deleteRepo(id: string) {
    const self = this;
    self.apiService.delete('repos?id=' + id).subscribe((res: any) => {
      self.data = {};
      self.getRepos();
      self.ts.success('Repo deleted successfully', 'Success');
    }, err => {
      const message = err.error && err.error.message ? err.error.message : 'Unable to delete Repo';
      self.ts.error(message, 'Error');
    });
  }

  getRepos() {
    const self = this;
    self.apiService.get('repos').subscribe((res: any) => {
      self.repos = res;
    }, err => {
      const message = err.error && err.error.message ? err.error.message : 'Unable to fetch Repos';
      self.ts.error(message, 'Error');
    });
  }

}
