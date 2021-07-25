import { Observable } from 'rxjs/Observable';
import { UpsellingModalButtonAction, UpsellingModalFooterButton, UpsellingModalLabels, upsellingModalView } from '../models';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'upselling-modal-footer',
  templateUrl: './upselling-modal-footer.component.html',
  styleUrls: ['./upselling-modal-footer.component.sass']
})
export class UpsellingModalFooterComponent {
  @Input() formState = false;
  @Input() view$: Observable<upsellingModalView>;
  @Output() buttonPress = new EventEmitter<UpsellingModalButtonAction>();

  buttons: UpsellingModalFooterButton[];
  labels: UpsellingModalLabels;

  constructor() { }

  init(labels: UpsellingModalLabels, buttons: UpsellingModalFooterButton[]): void {
    this.labels = labels;
    this.buttons = buttons;
  }

}
