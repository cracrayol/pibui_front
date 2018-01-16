import { Component } from '@angular/core';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'pbi-spinner',
  templateUrl: 'spinner.component.html',
  styleUrls: ['spinner.component.scss']
})

export class SpinnerComponent {
  public active: boolean;

  constructor(private spinnerService: SpinnerService) {
    spinnerService.status.subscribe((status: boolean) => this.active = status);
  }
}
