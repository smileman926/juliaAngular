import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import { FormControl, FormGroup } from '@angular/forms';

import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MainService } from '@/app/main/main.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { environment } from '@/environments/environment';
import { PICTURE_PROVIDER, PictureService } from './injection';
import { PictureEntity } from './models';

import { WindowsService } from '@/app/main/window/windows.service';

export enum LoaderType {
  IMAGE_SELECTOR = 'image-selector'
}

const maxFileSize: number = 10 * 1024 * 1024;

@Component({
  selector: 'app-category-images-selector',
  templateUrl: './pictures.component.pug',
  styleUrls: ['./pictures.component.sass']
})
export class PicturesComponent<T> implements OnChanges, OnInit, OnDestroy {
  @ViewChild('newPictureTooltip', { static: false }) private newPictureTooltip: NgbTooltip;
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  @Input() params!: T; // entity id
  @Input() showTagField: boolean;

  @Input() deletable = true;
  @Input() sortable = true;

  @Output() saved = new EventEmitter();

  enabledSlider = true;
  pictures: PictureEntity[];
  sortOrderControl = new FormControl(1);
  imageTagControl = new FormControl('');
  form: FormGroup;
  isLoading: Observable<boolean>;
  removeSlide = new EventEmitter<number>();
  slideTo = new EventEmitter<number>();
  updateSlider = new EventEmitter<void>();
  newImageAdded = new EventEmitter<void>();

  private selectedFiles = new BehaviorSubject<FileList | null>(null);
  public selectedFiles$ = this.selectedFiles.asObservable();
  private progressInfos = [];
  private message = '';

  constructor(
    @Inject(PICTURE_PROVIDER) private pictureService: PictureService<T>,
    private modal: ModalService,
    private loaderService: LoaderService,
    private mainService: MainService,
    private windowsService: WindowsService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.IMAGE_SELECTOR);
    this.form = new FormGroup({
      sortOrder: this.sortOrderControl,
      tag: this.imageTagControl
    });
  }

  @Loading(LoaderType.IMAGE_SELECTOR)
  async loadPictures(): Promise<void> {
    const firstLoad = !this.pictures;
    this.pictures = await this.pictureService.getPictures(this.params).pipe(
      map(list =>
        [...list].map(item => ({ ...item, path: environment.mediaUrl + item.path})).sort(
          (a, b) =>
            a.sortOrder - b.sortOrder ||
            b.id - a.id)
        )
    ).toPromise();
    if (this.pictures && this.pictures.length > 0) {
      this.enabledSlider = true;
      this.sortOrderCorrection();
      this.sortable = this.pictures.length > 1;
    } else {
      this.enabledSlider = false;
    }
    if (!firstLoad) {
      this.updateSlider.emit();
    }
  }

  private sortOrderCorrection() {
    if (this.pictures) {
      this.pictures.forEach((image, i) => {
        image.sortOrder = (i + 1);
      });
    }
  }

  public toggleSelectFiles() {
    this.fileInput.nativeElement.click();
  }

  public selectFiles(event) {
    this.progressInfos = [];
    this.selectedFiles.next(event.target.files);
  }

  @Loading(LoaderType.IMAGE_SELECTOR)
  private async uploadFiles() {
    this.message = '';
    if (this.newPictureTooltip) {
      this.newPictureTooltip.close();
    }
    if (!!this.selectedFiles.getValue()) {
      const selectedFiles: FileList = this.selectedFiles.getValue() as FileList;
      const files = Array.from(selectedFiles);
      let validFiles = true;
      for (const file of files) {
        if (file.size >= maxFileSize) {
          validFiles = false;
        }
      }
      if (!validFiles) {
        this.modal.openSimpleText('BackEnd_WikiLanguage.EGP_MSGImgTooBigHeader', 'BackEnd_WikiLanguage.EGP_MSGImgTooBig');
        return;
      }
      const dbName = this.mainService.getCompanyDetails().dbName;
      if (files.length > 0) {
        await Promise.all(
          files.map((file) => this.pictureService.uploadPicture(this.params, file, dbName).toPromise())
        );
        await this.loadPictures();
        this.newImageAdded.emit();
        this.saved.emit();
      }
    }
  }

  @Loading(LoaderType.IMAGE_SELECTOR)
  async saveImage(data: {image: PictureEntity, index: number}): Promise<void> {
    if (data.index >= 0 &&
      data.index < this.pictures.length &&
      (data.image.sortOrder - 1) >= 0 &&
      (data.image.sortOrder - 1) < this.pictures.length
    ) {
      arrayMove(this.pictures, data.index, (data.image.sortOrder - 1));
      this.sortOrderCorrection();
    }

    await Promise.all(
      this.pictures.map(pic => this.pictureService.updatePicture(this.params, pic).toPromise())
    ).then(() => {
      this.saved.emit();
      this.slideTo.emit((data.image.sortOrder - 1) >= 0 ? (data.image.sortOrder - 1) : 0);
    });
  }

  async deleteImage(data: {image: PictureEntity, index: number}): Promise<void> {
    const confirmed = await this.modal.openConfirm(
      'BackEnd_WikiLanguage.CS_ConfirmDeleteACSMessageHeader',
      'BackEnd_WikiLanguage.EGP_MSGDeletePic'
    );
    if (confirmed) {
      this.newPictureTooltip.close();
      await this.confirmDeletion(data.image).then(() => {
        this.pictures = this.pictures.filter(p => p.id !== data.image.id);
        if (this.pictures && this.pictures.length < 1) {
          this.enabledSlider = false;
        } else {
          this.sortable = this.pictures.length > 1;
          this.sortOrderCorrection();
        }
        this.saved.emit();
      });
    }
  }

  @Loading(LoaderType.IMAGE_SELECTOR)
  async confirmDeletion(image: PictureEntity): Promise<void> {
    await this.pictureService.deletePicture(this.params, image.id).toPromise();
  }

  ngOnInit(): void {
    this.selectedFiles$.pipe(untilDestroyed(this)).subscribe(() => {
      this.uploadFiles().catch();
    });
    this.windowsService.activeWindowResized.pipe(untilDestroyed(this)).subscribe(() => {
      this.updateSlider.emit();
    });
  }

  ngOnChanges({ params, activeWindow }: SimpleChanges): void {
    if (params && params.previousValue !== params.currentValue) {
      this.loadPictures().catch();
    }
  }

  ngOnDestroy(): void {}
}

function arrayMove(arr, fromIndex, toIndex) {
  const element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}
