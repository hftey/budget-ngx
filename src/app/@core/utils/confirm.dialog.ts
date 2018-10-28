import {Component, Input} from "@angular/core";
import {NbDialogRef} from "@nebular/theme";

@Component({
    selector: 'nb-dialog-confirm-delete',
    template: `
    <nb-card [style.width.px]="300" [style.height.px]="200">
      <nb-card-header>{{ title }}</nb-card-header>
      <nb-card-body>
        {{ message }}
      </nb-card-body>
      <nb-card-footer>
        <button nbButton class="btn-xsmall" (click)="cancel()">Cancel</button>
        <button nbButton class="btn-xsmall" status="primary" (click)="ok()">OK</button>
      </nb-card-footer>
    </nb-card>
  `,
})
export class NbShowcaseDialogComponent {
    @Input() title: string;
    @Input() message: string;

    constructor(protected ref: NbDialogRef<NbShowcaseDialogComponent>) {
    }

    ok() {
        this.ref.close(true);
    }

    cancel() {
        this.ref.close(false);
    }
}

