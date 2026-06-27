// features/test/test-runner.component.ts
import { ChangeDetectorRef, Component, inject, Input, signal } from '@angular/core';

import { JsonPipe } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { t3FormFGService } from '../../shared/t3FormFGService';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EngineAdapterService } from '../../shared/engineAdapterService';
import { MonacoWrapperComponent } from '../MonacoEditor/MonacoEditor.component';
import { MonacoOptionsService } from '../MonacoEditor/MonacoOptionsService';

@Component({
  selector: 'data-t3',
  standalone: true,
  templateUrl: './datat3.component.html',
  imports: [
    JsonPipe,
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MonacoWrapperComponent],

})

export class DataT3Component {

  @Input() t3FormFG: FormGroup | undefined;

  output = signal<any>(null);

  engineAdapterService = inject(EngineAdapterService)

  monacoOptionsService = inject(MonacoOptionsService)


  t3FormFGService = inject(t3FormFGService)

  testData = {
    // 🔴 should come from your t3FormData defaults

    // or specific test data if that is not available
  };

  t3data = ''

  t3dataFG: FormGroup = this.engineAdapterService.get_t3dataFG()

  cd = inject(ChangeDetectorRef)

  editorOptionsStatic: any;

  constructor() {
    console.log('wire in data for specific event')
  }

  ngOnInit() {
    /*
  const rawData = this.t3FormFG?.getRawValue();
  // The parameters (null, 2) format the JSON with 2-space indentation

  alert(JSON.stringify(rawData, null, 2))
  this.t3data.current = JSON.stringify(rawData, null, 2); 
 // not needed in this function this.cd.detectChanges();
*/

    // make this static
    this.editorOptionsStatic = this.monacoOptionsService.editorDefaultOptions
  }

  ngAfterViewInit(): void {
    // setTimeout pushes the execution to the next tick

    setTimeout(() => {
      this.t3dataFG = this.engineAdapterService.get_t3dataFG()
      const rawData = this.t3FormFG?.getRawValue();
      this.t3data = JSON.stringify(rawData, null, 2);

      // Data Inputs to Rules expects a string, but formatted as JSON
      this.t3dataFG.patchValue({ current: this.t3data }, { emitEvent: false })

      //   this.engineAdapterService.setDiffOriginal(this.t3data )

      //   console.log(this.t3dataFG.getRawValue())
      this.cd.detectChanges();
    });

  }

  patch() {
    console.log('patch')
    // the user has editted the input data and now wants to make the next version for the execution run
    let newCurrent = this.t3dataFG.get('current')?.getRawValue()
    let newJSON = JSON.parse(newCurrent)
    this.engineAdapterService.patch(newJSON)

    return

    .
    /*
    let newCurrent = this.t3dataFG.get('current')?.getRawValue()
    let newJSON = JSON.parse(newCurrent)

    this.t3FormFG = this.engineAdapterService.generateForm(newJSON)

    let nv = this.t3FormFG?.getRawValue()
    console.log(nv)
*/

  }

}