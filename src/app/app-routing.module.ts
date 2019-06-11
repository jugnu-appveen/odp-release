import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ImagesComponent } from './dashboard/images/images.component';
import { ContainersComponent } from './dashboard/containers/containers.component';
import { ReleaseComponent } from './dashboard/release/release.component';
import { HotfixComponent } from './dashboard/hotfix/hotfix.component';
import { ReposComponent } from './dashboard/repos/repos.component';
import { ConfigComponent } from './dashboard/config/config.component';
import { TasksComponent } from './dashboard/tasks/tasks.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard', component: DashboardComponent, children: [
      { path: '', pathMatch: 'full', redirectTo: 'images' },
      { path: 'images', component: ImagesComponent },
      // { path: 'containers', component: ContainersComponent },
      { path: 'release', component: ReleaseComponent },
      { path: 'hotfix', component: HotfixComponent },
      { path: 'tasks', component: TasksComponent },
      { path: 'repos', component: ReposComponent },
      { path: 'config', component: ConfigComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
