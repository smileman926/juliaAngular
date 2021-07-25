import { UpsellingModalLabels } from '@/ui-kit/components/modals/upselling-modal/models';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-upselling-modal-success',
  templateUrl: './upselling-modal-success.component.html',
  styleUrls: ['./upselling-modal-success.component.sass']
})
export class UpsellingModalSuccessComponent {

  @Input() labels: UpsellingModalLabels;

  constructor() { }

}
