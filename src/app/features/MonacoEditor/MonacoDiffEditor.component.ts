import { Component, forwardRef, SimpleChanges, Input, inject, ChangeDetectorRef, Signal, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { DiffEditorModel, MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { FormsModule } from '@angular/forms'; // <-- Import this
import { MonacoOptionsService } from './MonacoOptionsService';
import { EngineAdapterService } from '../../shared/engineAdapterService';
import { JsonPipe } from '@angular/common';

//import { NgxMonacoEditorComponent } from 'ngx-monaco-editor';

@Component({
  selector: 'monaco-diff-editor',
  standalone: true,
  templateUrl: './MonacoDiffEditor.component.html',
  imports: [MonacoEditorModule, FormsModule, JsonPipe],


  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MonacoDiffEditorComponent),
      multi: true
    }
  ]

})

export class MonacoDiffEditorComponent implements ControlValueAccessor {

//  @Input() language: string = 'json';
  //  @Input() originalModel: Signal<string>;
  //  @Input() modifiedModel: Signal<string>;

   originalModel = input<string>('');    // this is for a signal not @Input
   modifiedModel = input<string>('');    // this is for a signal not @Input

  originalDiffEditorModel: DiffEditorModel = this.jsonDiff({}) 
  modifiedDiffEditorModel: DiffEditorModel = this.jsonDiff({}) 

  // originalModel: DiffEditorModel = this.jsonDiff({ "id": "h_total", "type": "aggregation", "scope": "header", "target": "total", "expression": "rows.reduce((s,r)=>s+r.subTotal,0)", "priority": 2 })

  // modifiedModel: DiffEditorModel = this.jsonDiff({ "id": "h_total", "type": "aggregation", "scope": "header", "target": "total", "expression": "rows.reduce((s,r)=>s+r.subTotal,0)", "priority": 2 })

 
  // @Input() message!: Signal<string>;

  cd = inject(ChangeDetectorRef)

  engineAdapterService = inject(EngineAdapterService)
  monacoOptionsService = inject(MonacoOptionsService)

  value: string = '';
  disabled: boolean = false;


  editorOptionsDiff = this.monacoOptionsService.editorOptionsDiff


  // Callbacks registered by Angular Forms
  private onChange: (value: string) => void = () => { };
  private onTouched: () => void = () => { };

  // Intercepts input changes from the parent component
 
  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges')
    console.log(changes)
 this.originalDiffEditorModel  = this.jsonDiff(changes['originalModel'].currentValue ) 
  
    if (changes['originalModel'] &&  changes['originalModel'].firstChange) {
        this.originalDiffEditorModel  = this.jsonDiff(changes['originalModel'].currentValue ) 
    }
    if (changes['modifiedModel'] &&  changes['modifiedModel'].firstChange) {
        this.modifiedDiffEditorModel  = this.jsonDiff(changes['modifiedModel'].currentValue ) 
    }
    
    /*

    if (changes['language'] && !changes['language'].firstChange) {
      this.updateEditorLanguage(changes['language'].currentValue);
    }
      */
  }
    

  // Forces Monaco to re-render with the new language profile
  private updateEditorLanguage(newLanguage: string): void {
    console.log(newLanguage)
    this.editorOptionsDiff = {
      ...this.editorOptionsDiff,
      //   language: newLanguage
    };
  }


  // 1. Writes a new value from the form model to the view
  writeValue(value: any): void {
    this.value = value || '';
    this.cd.markForCheck(); // 👈 Keep the model binding tree refreshed
  }

  // 2. Registers a callback function that should be called when the view changes
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // 3. Registers a callback function that should be called when the control is touched
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

 
    // 4. Sets the disabled state programmatically (Optional)
    setDisabledState(isDisabled: boolean): void {
      this.disabled = isDisabled;
      this.editorOptionsDiff = { ...this.editorOptionsDiff, readOnly: isDisabled };
    }
  
    // Handles updates made inside the editor template
    onValueChange(newValue: string): void {
      this.value = newValue;
      this.onChange(newValue);
      this.onTouched();
    }
  
  

      onEditorInit(editor: any): void {
    // Force Angular to sync the template state immediately when Monaco wakes up

    this.cd.detectChanges();

    /*
    editor.onKeyDown((e: any) => {
      // Check for Ctrl + V (Windows/Linux) or Cmd + V (Mac)
      const isPaste = (e.ctrlKey || e.metaKey) && e.keyCode === 52; // 52 is the KeyCode for 'V'

      if (isPaste) {
        // Wait briefly for the browser clipboard data to hit the editor model
        setTimeout(() => {
          editor.getAction('editor.action.formatDocument').run();
        }, 50);
      }
    });
*/
  }

  jsonDiff(x: object): DiffEditorModel {

    let dataModel: DiffEditorModel = {
      code: JSON.stringify(x, null, 2), // '2' adds spacing and newlines
      language: 'json'
    };
    return dataModel;
  }

}