import { NumberInputDirective } from '@/ui-kit/directives/number-input.directive';
import { Component, ContentChild } from '@angular/core';

@Component({
  selector: 'app-number-input-controls',
  templateUrl: './number-input-controls.component.html',
  styleUrls: ['./number-input-controls.component.sass']
})
export class NumberInputControlsComponent {

  @ContentChild(NumberInputDirective, {static: true}) input: NumberInputDirective;

}
