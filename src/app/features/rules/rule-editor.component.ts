// features/rules/rule-editor.component.ts
import { Component, inject, Input } from '@angular/core';
 
//import { ValidationService } from '../../shared/validation.service';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // 👈 Add this line
import { EngineAdapterService } from '../../shared/engineAdapterService';


@Component({
  selector: 'rule-editor',
  standalone: true,
  imports: [FormsModule, MonacoEditorModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './rule-editor.component.html'
})
export class RuleEditorComponent {

  @Input() rule: any;


  engineAdapterService = inject(EngineAdapterService)

  error: string | null = null;

  monacoOptions = {
   // theme: 'vs-dark',
    theme: 'vs-light',
    language: 'javascript',
    automaticLayout: true
  }; 

  constructor( ) {}

  validate() {
 //   this.error = this.v.validate(this.rule.expression);
  }

  fix() {
    // need to save back and resort the rules for the table
    alert('fix me')
  }


  save() {
    this.engineAdapterService.updateRulesTable()
  }
}