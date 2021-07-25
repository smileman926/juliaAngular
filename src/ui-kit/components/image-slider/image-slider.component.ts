import { PictureEntity } from '@/app/main/window/shared/image-selector/models';
import { Component, OnInit, Input, ViewChild, Output, EventEmitter, SimpleChanges, OnChanges, ElementRef } from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { SwiperComponent } from 'ngx-useful-swiper';
import { SwiperOptions } from 'swiper';
import { NavigationOptions } from 'swiper/types/components/navigation';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.sass']
})
export class ImageSliderComponent implements OnInit, OnChanges {
  @ViewChild('usefulSwiper', {static: false}) usefulSwiper: SwiperComponent;

  @Input() images: PictureEntity[];
  @Input() deletable = true;
  @Input() sortable = true;
  @Input() showTagField: boolean;
  @Input() navigation: NavigationOptions | boolean = {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  };
  @Input() spaceBetween = 30;
  @Input() slidesPerView: number | 'auto' = 'auto';
  @Input() centeredSlides = false;
  @Input() grabCursor = false;
  @Input() loop = false;

  @Input() removeSlide: EventEmitter<number>;
  @Input() slideTo: EventEmitter<number>;
  @Input() rebuildSlider: EventEmitter<void>;
  @Input() newImageAdded: EventEmitter<void>;

  @Output() deleteImage = new EventEmitter<{image: PictureEntity, index: number}>();
  @Output() saveImage = new EventEmitter<{image: PictureEntity, index: number}>();

  private browserName: string;

  public config: SwiperOptions;
  public nextButtonDisabled = false;
  public prevButtonDisabled = true;
  public nextButtonHidden = true;
  public prevButtonHidden = true;

  constructor(
    private el: ElementRef,
  ) { }

  private setSlideButtons(activeIndex?: number) {
    if (this.images.length <= 1) {
      this.prevButtonDisabled = false;
      this.nextButtonDisabled = false;
      this.nextButtonHidden = true;
      this.prevButtonHidden = true;
      return;
    }
    this.nextButtonHidden = false;
    this.prevButtonHidden = false;
    if (activeIndex !== null && activeIndex !== undefined) {
      this.prevButtonDisabled = (activeIndex === 0);
      this.nextButtonDisabled = (activeIndex === this.images.length - 1);
    }
  }

  private getBrowserName(): string {
    const agent = window.navigator.userAgent.toLowerCase();
    if (agent.indexOf('edge') > -1) {
      return 'edge';
    }
    if (agent.indexOf('opr') > -1 && !!(<any>window).opr) {
      return 'opera';
    }
    if (agent.indexOf('chrome') > -1 && !!(<any>window).chrome) {
      return 'chrome';
    }
    if (agent.indexOf('trident') > -1) {
      return 'ie';
    }
    if (agent.indexOf('firefox') > -1) {
      return 'firefox';
    }
    if (agent.indexOf('safari') > -1) {
      return 'safari';
    }
    return 'other';
  }

  nextImage() {
    this.usefulSwiper.swiper.slideNext();
  }

  prevImage() {
    this.usefulSwiper.swiper.slidePrev();
  }

  save(image: PictureEntity, index: number) {
    this.saveImage.emit({image: image, index: index});
  }

  onSlideTo(index: number) {
    this.usefulSwiper.swiper.update();
    this.usefulSwiper.swiper.slideTo(index);
  }

  onRemoveSlide(index: number) {
    this.usefulSwiper.swiper.removeSlide(index);
    this.usefulSwiper.swiper.update();
  }

  /*
  Fixes firefox issues
   */
  setSlidesWidth(waiting?: number) {
    if (!this.browserName) {
      this.browserName = this.getBrowserName();
    }
    if (this.browserName === 'firefox') {
      const container = this.el.nativeElement;
      const wrapperWidth = container.querySelector('.swiper-wrapper') ? container.querySelector('.swiper-wrapper').clientWidth : 0;
      if (wrapperWidth > 0) {
        const imageItems = [...container.querySelectorAll('.image-item')];
        for (let i = 0; i < imageItems.length; i++) {
          const img = imageItems[i];
          if ((img as HTMLElement).clientWidth === 0) {
            waiting = waiting ? waiting + 1 : 1;
            if (waiting < 20) {
              setTimeout(() => {
                this.setSlidesWidth(waiting);
              }, 200);
            }
            break;
          } else {
            if ((img as HTMLElement).clientWidth > 0) {
              ((img as HTMLElement).parentElement as HTMLElement).style.width = (((img as HTMLElement).clientWidth / wrapperWidth) * 100) + '%';
            }
            if (this.usefulSwiper && this.usefulSwiper.swiper) {
              this.usefulSwiper.swiper.updateSlides();
            }
          }
        }
      }
    }
  }

  ngOnInit() {
    const that = this;
    // possible solutions: https://swiperjs.com/demos
    this.config = {
      initialSlide: 0,
      slidesPerView: this.slidesPerView,
      centeredSlides: this.centeredSlides,
      spaceBetween: this.spaceBetween,
      grabCursor: this.grabCursor,
      loop: this.loop,
      navigation: this.navigation,
      on: {
        resize: function() {
          that.setSlidesWidth();
        },
        init: function () {
          that.setSlidesWidth();
          setTimeout(() => {
            that.setSlideButtons();
          });
        },
        update: function (swiper) {
          that.setSlidesWidth();
          if (swiper.hasOwnProperty('activeIndex')) {
            that.setSlideButtons(swiper.activeIndex);
          }
        },
        slideChange: function(swiper) {
          if (swiper.hasOwnProperty('activeIndex')) {
            that.setSlideButtons(swiper.activeIndex);
          }
        }
      }
    };

    this.removeSlide.pipe(untilDestroyed(this)).subscribe((index) => {
      this.onRemoveSlide(index);
    });

    this.slideTo.pipe(untilDestroyed(this)).subscribe((index) => {
      this.onSlideTo(index);
    });

    this.rebuildSlider.pipe(untilDestroyed(this)).subscribe(() => {
      setTimeout(() => {
        this.usefulSwiper.swiper.update();
      }, 500);
    });

    this.newImageAdded.pipe(untilDestroyed(this)).subscribe(() => {
      setTimeout(() => {
        this.onSlideTo(0);
      }, 300);

    });
  }

  ngOnDestroy(): void {}

  ngOnChanges({images}: SimpleChanges): void {
    if (images && !images.firstChange && this.usefulSwiper) {
      this.usefulSwiper.swiper.update();
    }
  }

}
