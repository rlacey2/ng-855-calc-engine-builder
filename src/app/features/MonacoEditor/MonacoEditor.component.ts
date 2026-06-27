import { Component, forwardRef,  SimpleChanges, Input, inject, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import {   MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { FormsModule } from '@angular/forms'; // <-- Import this
import { MonacoOptionsService } from './MonacoOptionsService';

//import { NgxMonacoEditorComponent } from 'ngx-monaco-editor';

@Component({
  selector: 'monaco-editor-wrapper',
  standalone: true,
  templateUrl: './MonacoEditor.component.html',
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
  monacoOptionsService = inject(MonacoOptionsService)


  value: string = '';
  disabled: boolean = false;
 

  editorOptions = this.monacoOptionsService.editorOptions
  

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
 
}