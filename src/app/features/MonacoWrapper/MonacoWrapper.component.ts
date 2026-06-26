import { Component, forwardRef, ViewChild, AfterViewInit, SimpleChanges, Input, inject, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { DiffEditorModel, MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { FormsModule } from '@angular/forms'; // <-- Import this

//import { NgxMonacoEditorComponent } from 'ngx-monaco-editor';

@Component({
  selector: 'monaco-editor-wrapper',
  standalone: true,
  templateUrl: './MonacoWrapper.component.html',
  imports: [MonacoEditorModule, FormsModule],


  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MonacoWrapperComponent),
      multi: true
    }
  ]

})

export class MonacoWrapperComponent implements ControlValueAccessor {
  // @ViewChild(NgxMonacoEditorComponent) editorComponent!: NgxMonacoEditorComponent;

  @Input() language: string = 'json';

  cd = inject(ChangeDetectorRef)


  value: string = '';
  disabled: boolean = false;
  /*
      theme: 'myCustomTheme',
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
  */
  editorOptions = {
    theme: 'vs-dark', language: 'json',
    roundedSelection: true,

    folding: true,
    showFoldingControls: 'always',
    foldingStrategy: "auto",
    formatOnPaste: true, // Requires true to activate auto-formatting on paste
    formatOnType: true,  // Good to have for auto-indentation while typing
    autoIndent: 'full',
    wordWrap: "on",
    codeLens: false,
    readOnly: false
  };



  editorOptionsDiff = {
    theme: 'vs-dark',
    // language: 'json',
    roundedSelection: true,
    folding: true,
    showFoldingControls: 'always',
    foldingStrategy: "auto",
    formatOnPaste: true, // Requires true to activate auto-formatting on paste
    formatOnType: true,  // Good to have for auto-indentation while typing
    autoIndent: 'full',
    wordWrap: "on",
    codeLens: false,
    readOnly: false,
    renderSideBySide: true,
    useInlineViewWhenSpaceIsLimited: false // Forces side-by-side even in small spaces
  };





  originalModel: DiffEditorModel =   this.jsonDiff ({ "id": "h_total", "type": "aggregation", "scope": "header", "target": "total", "expression": "rows.reduce((s,r)=>s+r.subTotal,0)", "priority": 2 })
   
 modifiedModel: DiffEditorModel =   this.jsonDiff ({ "id": "h_total", "type": "aggregation", "scope": "header", "target": "total", "expression": "rows.reduce((s,r)=>s+r.subTotal,0)", "priority": 2 })


  // Callbacks registered by Angular Forms
  private onChange: (value: string) => void = () => { };
  private onTouched: () => void = () => { };

  // Intercepts input changes from the parent component
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['language'] && !changes['language'].firstChange) {
      this.updateEditorLanguage(changes['language'].currentValue);
    }
  }

  // Forces Monaco to re-render with the new language profile
  private updateEditorLanguage(newLanguage: string): void {
    console.log(newLanguage)
    this.editorOptions = {
      ...this.editorOptions,
      language: newLanguage
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
    this.editorOptions = { ...this.editorOptions, readOnly: isDisabled };
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

  }

  jsonDiff(x: object): DiffEditorModel {
 
    let dataModel: DiffEditorModel = {
      code: JSON.stringify(x, null, 2), // '2' adds spacing and newlines
      language: 'json'
    };
    return dataModel;
  }
 
}