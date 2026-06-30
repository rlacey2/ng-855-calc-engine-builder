// app.component.ts
import { ChangeDetectorRef, Component, effect, inject } from '@angular/core';

import { RulesTableComponent } from './features/rules/rules-table.component';
import { RuleEditorComponent } from './features/rules/rule-editor.component';
import { DependencyGraphComponent } from './features/graph/dependency-graph.component';
import { scenarioSet, scenarioKeys } from './core/engine/scenarios'
import { DataT3Component } from './features/data/datat3.component';

import { EngineAdapterService } from './shared/engineAdapterService';
import { MonacoDiffEditorComponent } from "./features/MonacoEditor/MonacoDiffEditor.component";
import { JsonPipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { TraceViewerComponent } from "./features/trace/trace-viewer.component";
import { MonacoOptionsService } from './features/MonacoEditor/MonacoOptionsService';
import { MonacoEditorModule } from "ngx-monaco-editor-v2";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    JsonPipe,
    RulesTableComponent,
    RuleEditorComponent,
    DataT3Component,
    MonacoDiffEditorComponent,
    MatExpansionModule,
    DependencyGraphComponent,
    TraceViewerComponent,
    MonacoEditorModule,
    MatFormFieldModule,
    FormsModule,
    MatTabsModule

  ],
  templateUrl: './app.html'
})

export class AppComponent {

  cd = inject(ChangeDetectorRef)
  engineAdapterService = inject(EngineAdapterService)
  monacoOptionsService = inject(MonacoOptionsService)

  // rules = signal<any[]>([]);
  // selected = signal<any>(null);

  editorDefaultOptions = this.monacoOptionsService.editorDefaultOptions

  rules: any = this.engineAdapterService.rules // this is a signal reference
  selected = this.engineAdapterService.selected

  scenarios: any = this.engineAdapterService.scenarios()

  testRules: any

  t3FormFG
  t3dataFG
  originalModel: any
  modifiedModel: any

  panelStates: boolean[] = [false, true, false, false, false];

  //options = { scenario: 'New' }
  options = { scenario: 'scenario_03' }

  rulesMonaco: string = '{}';

  scenarioKeys = scenarioKeys

  refreshGraph = { v: "qwerty "}

  constructor() {

    console.log('constructor')

    effect(() => {
      console.log('effect()->rules()')
      const currentJsonObject = this.engineAdapterService.rules()
      // Pretty-print with 2-space indentation
      this.rulesMonaco = JSON.stringify(currentJsonObject, null, 2);
    });


    effect(() => {
      console.log('effect()->dataInputs()')
      const data = this.engineAdapterService.dataInputs()
      if (data.details  || data.header) {

        // value of current is going to the editor as string
        this.t3dataFG.patchValue({ "current": JSON.stringify(data, null, 2) })
      }
    });


    // const rulesToUse = scenarioSet.sequentialSteps2
    // const rulesToUse = scenarioSet.scenario_01.rules
    const rulesToUse = scenarioSet.New.rules

    let sortedRules = this.engineAdapterService.setRulesAgenda(rulesToUse)

    this.engineAdapterService.engineInitialise(sortedRules)

    // the rules are separate form the engine that will consume them
    // i.e. the DSL is used to create the execution of rules that meet the syntax

    this.t3FormFG = this.engineAdapterService.get_t3FormFG()
    this.t3dataFG = this.engineAdapterService.get_t3dataFG()

    let originalDataState = this.engineAdapterService.get_t3dataFG()

    this.originalModel = this.engineAdapterService.originalModel  // no () on the signal yet
    this.modifiedModel = this.engineAdapterService.modifiedModel  // no () on the signal yet

    this.onScenarioChange()
  }

  add() {
    this.engineAdapterService.add()
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
  
  run() {
    this.engineAdapterService.calculate()
  }

  render($event: Event) {
    $event.stopPropagation() // 
    this.refreshGraph = {v : crypto.randomUUID() }
    this.cd.detectChanges()
   // this.engineAdapterService.render()

  }

  patch($event: Event) {
    $event.stopPropagation() // in the panel header so do not want to toggle the panel
    this.engineAdapterService.patch()
  }

  calculate($event: Event) {
    $event.stopPropagation() // in the panel header so do not want to toggle the panel
    this.engineAdapterService.calculate()
    this.panelStates[3] = true
  }

  onScenarioChange() {
    console.log(this.options.scenario)
    this.engineAdapterService.onScenarioChange(this.options.scenario)
  }

}

