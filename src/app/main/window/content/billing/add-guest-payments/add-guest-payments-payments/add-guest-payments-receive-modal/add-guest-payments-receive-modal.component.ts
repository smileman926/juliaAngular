import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-guest-payments-receive-modal',
  templateUrl: './add-guest-payments-receive-modal.component.pug',
  styleUrls: ['./add-guest-payments-receive-modal.component.sass']
})
export class AddGuestPaymentsReceiveModalComponent implements OnInit, OnDestroy {

  cancel = new EventEmitter<void>();
  form: FormGroup;
  public type: string;

  constructor() { }

  public init(type: string, emailAddress?: string): void {
    this.type = type;
    this.form = new FormGroup({
      email: new FormControl(emailAddress ? emailAddress : '', [Validators.email, Validators.required])
    });
  }

  public async save(): Promise<{ [field: string]: any}> {
    if (this.form.invalid) {
      return {
        status: false,
        email: null
      };
    } else {
      return {
        status: true,
        email: (this.form.get('email') as FormControl).value
      };
    }
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.cancel.emit();
  }

}
