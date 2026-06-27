// features/test/test-runner.component.ts
import { ChangeDetectorRef, Component, forwardRef, inject, Input, signal } from '@angular/core';

import { JsonPipe } from '@angular/common';
import { FormArray, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { t3FormFGService } from '../../shared/t3FormFGService';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EngineAdapterService } from '../../shared/engineAdapterService';
import { MonacoWrapperComponent } from '../MonacoEditor/MonacoEditor.component';
import { MonacoDiffEditorComponent } from '../MonacoEditor/MonacoDiffEditor.component';

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

  t3FormFGService = inject(t3FormFGService)

  testData = {
    // 🔴 should come from your t3FormData defaults

    // or specific test data if that is not available
  };


  t3data = ''

  t3dataform: FormGroup = this.t3FormFGService.get_t3dataform()

  cd = inject(ChangeDetectorRef)



  monacoOptions: any = {
    theme: 'myCustomTheme',
    //  language: 'html',
    language: 'json',
    roundedSelection: true,
    autoIndent: 'full',
    automaticLayout: true //   Tells Monaco to poll/observe layout resize adjustments
  };


  constructor() {
    console.log('wire in data for specific event')

  }



  editorOptionsStatic: any;

  ngOnInit() {
    /*
  const rawData = this.t3FormFG?.getRawValue();
  // The parameters (null, 2) format the JSON with 2-space indentation

  alert(JSON.stringify(rawData, null, 2))
  this.t3data.current = JSON.stringify(rawData, null, 2); 
 // not needed in this function this.cd.detectChanges();
*/

    // make this static
    this.editorOptionsStatic = this.mergeMonacoOptions({
       language: 'json',
          roundedSelection: true,
    autoIndent: true,
    folding: true,
    showFoldingControls: 'always',
    foldingStrategy: "auto",
    formatOnPaste: true,
    formatOnType: true,
    wordWrap: "on",
    codeLens: false
      });

  
  }

  ngAfterViewInit(): void {
    // setTimeout pushes the execution to the next tick

    setTimeout(() => {
      this.t3dataform = this.t3FormFGService.get_t3dataform()
      const rawData = this.t3FormFG?.getRawValue();
      this.t3data = JSON.stringify(rawData, null, 2);
      this.t3dataform.patchValue({ current: this.t3data }, { emitEvent: false })
      this.engineAdapterService.setDiffOriginal(this.t3data )

      //   console.log(this.t3dataform.getRawValue())
      this.cd.detectChanges();
    });

  }
 
  patch() {
    console.log('patch')
    let newCurrent = this.t3dataform.get('current')?.getRawValue()
    let newJSON = JSON.parse(newCurrent)

    this.t3FormFG =  this.engineAdapterService.generateForm(newJSON)

    let nv = this.t3FormFG?.getRawValue()
    console.log(nv)

    // this.t3dataform.patchValue({ current: newJSON }, { emitEvent: false })
   //  this.t3FormFG?.reset(newJSON, { emitEvent: true })

   // (this.t3FormFG?.get('details') as FormArray).clear() 
/*
   this.t3FormFG?.get('headers')?.setValue(newJSON.header)

   this.t3FormFG?.get('details')?.setValue(newJSON.details)
*/


  }


  mergeMonacoOptions(partialOptions: any) {
    let x = {
      ...this.monacoOptions,
      ...partialOptions
    };
    console.log(x)
    return x
  }

}