// features/rules/rule-editor.component.ts
import { Component, Input } from '@angular/core';
 
//import { ValidationService } from '../../shared/validation.service';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';


import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // 👈 Add this line


@Component({
  selector: 'rule-editor',
  standalone: true,
  imports: [FormsModule, MonacoEditorModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './rule-editor.component.html'
})
export class RuleEditorComponent {

  @Input() rule: any;

  error: string | null = null;

  opts = {
   // theme: 'vs-dark',
        theme: 'vs-light',
    language: 'javascript',
    automaticLayout: true
  }; 

  constructor( ) {}

  validate() {
 //   this.error = this.v.validate(this.rule.expression);
  }
}