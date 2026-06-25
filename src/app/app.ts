// app.component.ts
import { Component, inject, signal } from '@angular/core';

import { RulesTableComponent } from './features/rules/rules-table.component';
import { RuleEditorComponent } from './features/rules/rule-editor.component';
import { TestRunnerComponent } from './features/test/test-runner.component';
import { DependencyGraphComponent } from './features/graph/dependency-graph.component';

import { ruleSet } from './core/engine/rules'
import { t3FormFGService } from './shared/t3FormFGService';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RulesTableComponent,
    RuleEditorComponent,
    TestRunnerComponent,
    DependencyGraphComponent
],
  templateUrl: './app.html'
})

export class AppComponent {

  rules = signal<any[]>([]);
  selected = signal<any>(null);


  testRules: any

  t3FormFGService = inject(t3FormFGService)

  t3FormFG: any;

  constructor() {

    const rulesAsString = JSON.stringify(ruleSet.sequentialSteps2)

    // the rules are separate form the engine that will produce them
    // i.e. the DSL is used to create the execution of rules that meet the syntax

    this.rules.set(JSON.parse(rulesAsString));

    this.t3FormFG = this.t3FormFGService.getT3FormFG();

  }


  add() {
    this.rules.update(r => [...r, {
      id: crypto.randomUUID(),
      target: '',
      expression: ''
    }]);
  }

  select(r: any) {
    this.selected.set(r);
  }

  export() {
    console.log(JSON.stringify(this.rules()));
  }

  import() {
    const json = prompt('paste json');
    if (json) this.rules.set(JSON.parse(json));
  }
}