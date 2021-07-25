import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { AuthService } from '@/app/auth/auth.service';
import { ApiClient } from '@/app/helpers/api-client';
import { ApiCompanyService } from '@/app/helpers/api/api-company.service';
import { MainService } from '@/app/main/main.service';
import { selectFileDialog } from '@/app/main/window/shared/forms/file-dialog';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';
import { PortaLAATDataImagies, PortalAATDataInfo } from '../model';

@Component({
  selector: 'app-portal-aat-pictures',
  templateUrl: './portal-aat-pictures.component.pug',
  styleUrls: ['./portal-aat-pictures.component.sass']
})
export class PortalAatPicturesComponent implements OnInit {

  images: PortaLAATDataImagies[];
  selectedImage: PortaLAATDataImagies;
  portalAATData: PortalAATDataInfo;
  isLoading: Observable<boolean>;
  isLessImageCount: boolean;
  isInvalidDelete: boolean;

  constructor(
    private apiCompany: ApiCompanyService,
    private apiClient: ApiClient,
    private loaderService: LoaderService,
    private authService: AuthService,
    private mainService: MainService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
    this.isLessImageCount = true;
  }

  @Loading(LoaderType.LOAD)
  public async init(): Promise<void> {
    this.portalAATData = await this.apiCompany.getPortalAATData().toPromise();
    this.images = this.portalAATData.images;
    this.images.map( item => item.id = Number(item.ci_id));
    this.selectedImage = this.images[0];
    this.validateImageCount();
  }

  validateImageCount(): void {
    this.isLessImageCount = this.images.length < 5;
  }

  @Loading(LoaderType.LOAD)
  public async save(): Promise<void> {
    this.portalAATData.images = this.images;
    await this.apiCompany.putPortalAATData({...this.portalAATData}).toPromise();
  }

  public selectImage(item: PortaLAATDataImagies): void {
    this.selectedImage = item;
    this.images.map( (l, index) => {
      l.ci_isMain = index === this.images.indexOf(item) ? true : false;
    });
  }

  public async uploadImg(): Promise<void> {
    const file = await selectFileDialog('image/x-png,image/gif,image/jpeg');
    if (!file) {
      return;
    }
    this.uploadingFile(file);
  }

  @Loading(LoaderType.LOAD)
  public async uploadingFile(file: File): Promise<void> {
    const imageType = 'austriaAT';
    const isMain = '0';
    const sortOrder = 'a0';
    const { customerId } = this.authService.getQueryParams();
    const db = this.mainService.getCompanyDetails().dbName;

    await this.apiClient
      .uploadOperationPicture(String(customerId), file, db, imageType, isMain, sortOrder)
      .toPromise();
    this.init();
  }

  @Loading(LoaderType.LOAD)
  public async deleteImg(): Promise<void> {
    if ( this.images.length < 6 ) {
      this.isInvalidDelete = true;
      setTimeout(() => {
        this.isInvalidDelete = false;
      }, 3000);
      return;
    }
    this.images[this.images.indexOf(this.selectedImage)].deleted = true;
    this.portalAATData.images = this.images;
    await this.apiCompany.putPortalAATData({...this.portalAATData}).toPromise();

    this.images = this.images.filter( item => item !== this.selectedImage);
    if (this.selectedImage && this.selectedImage.ci_isMain) {
      this.images[0].ci_isMain = true;
    }
    this.selectedImage = this.images[0];
  }

  public async imageItemsSorted(): Promise<void> {
    if (this.images.length > 0) {
      this.images.forEach((image, index) => {
        image.ci_sortOrder = 'a' + index.toString();
      });
    }
  }

  ngOnInit(): void {
    this.init();
  }

}
