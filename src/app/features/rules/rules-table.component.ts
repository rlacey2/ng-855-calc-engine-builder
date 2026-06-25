// features/rules/rules-table.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Rule } from '../../core/engine/types';

@Component({
  selector: 'rules-table',
  standalone: true,
  templateUrl: './rules-table.component.html' 
})
export class RulesTableComponent {
  @Input() rules: Rule[] = [];
  @Input() selectedId?: string;

  @Output() select = new EventEmitter<Rule>();
  @Output() add = new EventEmitter<void>();
}