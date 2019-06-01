import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ImagesComponent } from './dashboard/images/images.component';
import { ContainersComponent } from './dashboard/containers/containers.component';
import { ApiService } from './api.service';
import { SizePipe } from './pipes/size.pipe';
import { ToCharsPipe } from './pipes/to-chars.pipe';
import { ImageNamePipe } from './pipes/image-name.pipe';
import { from } from 'rxjs';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ImagesComponent,
    ContainersComponent,
    SizePipe,
    ToCharsPipe,
    ImageNamePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [ApiService, SizePipe, ToCharsPipe, ImageNamePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
