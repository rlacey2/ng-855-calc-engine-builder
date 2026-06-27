// app.component.ts
import { Component, inject, signal } from '@angular/core';

import { RulesTableComponent } from './features/rules/rules-table.component';
import { RuleEditorComponent } from './features/rules/rule-editor.component';
import { TestRunnerComponent } from './features/test/test-runner.component';
import { DependencyGraphComponent } from './features/graph/dependency-graph.component';

import { ruleSet } from './core/engine/rules'

import { DataT3Component } from './features/data/datat3.component';
import { Rule } from './core/engine/types';
import { EngineAdapterService } from './shared/engineAdapterService';
import { MonacoDiffEditorComponent } from "./features/MonacoEditor/MonacoDiffEditor.component";
import { JsonPipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { TraceViewerComponent } from "./features/trace/trace-viewer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    JsonPipe,
    RulesTableComponent,
    RuleEditorComponent,
    TestRunnerComponent,
    //  DependencyGraphComponent
    DataT3Component,
    MonacoDiffEditorComponent,
    MatExpansionModule,
    DependencyGraphComponent,
    TraceViewerComponent
],
  templateUrl: './app.html'
})

export class AppComponent {

  engineAdapterService = inject(EngineAdapterService)

  // rules = signal<any[]>([]);
  // selected = signal<any>(null);

  rules = this.engineAdapterService.rules
  selected = this.engineAdapterService.selected

  testRules: any

  t3FormFG 
  t3dataFG 
  originalModel: any 
  modifiedModel: any  

panelStates: boolean[] = [true, false, true, false, false];

  constructor() {

    console.log('constructor')
    const rulesToUse = ruleSet.sequentialSteps2
    let sortedRules = this.engineAdapterService.setRulesAgenda(rulesToUse)

   // const rulesAsString = JSON.stringify(rulesToUse)

    this.engineAdapterService.engineInitialise(sortedRules)


    // the rules are separate form the engine that will consume them
    // i.e. the DSL is used to create the execution of rules that meet the syntax


     this.t3FormFG = this.engineAdapterService.get_t3FormFG()
     this.t3dataFG = this.engineAdapterService.get_t3dataFG()

  // let x =  { "id": "h_total", "type": "aggregation", "scope": "header", "target": "total", "expression": "rows.reduce((s,r)=>s+r.subTotal,0)", "priority": 2 }
    let y =  { "id": "h_total22", "type": "aggregation", "scope": "header", "target": "total", "expression": "rows.reduce((s,r)=>s+r.subTotal,0)", "priority": 2 }
    
    let originalDataState = this.engineAdapterService.get_t3dataFG()

  //  originalModel: DiffEditorModel =   this.jsonDiff ({ "id": "h_total", "type": "aggregation", "scope": "header", "target": "total", "expression": "rows.reduce((s,r)=>s+r.subTotal,0)", "priority": 2 })
   
 //modifiedModel: DiffEditorModel =   this.jsonDiff ({ "id": "h_total", "type": "aggregation", "scope": "header", "target": "total", "expression": "rows.reduce((s,r)=>s+r.subTotal,0)", "priority": 2 })

 console.log('ffffffffffffffffffffffff')

//JSON.parse(this.t3dataFG.getRawValue().current)
   // this.engineAdapterService.setDiffOriginal( originalDataState.getRawValue().current )
   // this.engineAdapterService.setDiffModified(y)

   this.originalModel = this.engineAdapterService.originalModel  // no () on the signal yet
   this.modifiedModel = this.engineAdapterService.modifiedModel  // no () on the signal yet

  //  console.log(this.originalModel())

  }


  add() {
    this.rules.update(r => [...r, {
      id: crypto.randomUUID().split("-")[0],
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


  sortRules(rules: Rule[]): Rule[] {

    // helper function
    const sortedInput = [...rules].sort((a, b) => {
      const pA = 1000 + (a.priority ?? 999);
      const pB = 1000 + (b.priority ?? 999);
      // if (pA !== pB) return pA - pB;

      const kA = `${a.scope}:${a.target}:${pA}`;
      const kB = `${b.scope}:${b.target}:${pB}`;
      return kA.localeCompare(kB);
    });

    return sortedInput


    /*
      return [...rules].sort((a, b) => {
        // 1. Sort by target alphabetically
        const targetComparison = a.target.localeCompare(b.target);
        
        // 2. If targets are different, return the comparison result
        if (targetComparison !== 0) {
          return targetComparison;
        }
        
        // 3. If targets are identical, sort by priority ascending
        return a.priority - b.priority;
      });
    */

  }

  run() {
    this.engineAdapterService.runExecution()
   // this.engine = this.engineAdapterService.engine
  }
}

