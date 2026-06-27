// features/test/test-runner.component.ts
import { Component, inject, Input, signal } from '@angular/core';

import { Rule } from '../../core/engine/types';
import { CalcEngineConfig } from '../../core/engine/types';
import { CalcEngine } from '../../core/engine/calc-engine';
import { JsonPipe } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { TraceViewerComponent } from "../trace/trace-viewer.component";
import { DependencyGraphComponent } from "../graph/dependency-graph.component";
import { EngineAdapterService } from '../../shared/engineAdapterService';

@Component({
  selector: 'test-runner',
  standalone: true,
  templateUrl: './test-runner.component.html',
  imports: [
    //  JsonPipe,
    TraceViewerComponent, DependencyGraphComponent],

})
export class TestRunnerComponent {

  @Input() rules: Rule[] = [];
  @Input() t3FormFG: FormGroup | undefined;

  engineAdapterService = inject(EngineAdapterService)

 // outputTrace = signal<any>(null);

  outputTrace = this.engineAdapterService.outputTrace

  testData = {
    // 🔴 should come from your t3FormData defaults

    // or specific test data if that is not available
  };

  engineConfig: CalcEngineConfig = {
    rounding: 4,
    roundingMode: 'final-only',
    debug: true
  }


  // engine = createEngine(this.rules, this.engineConfig);

  // engine = new CalcEngine(this.rules, this.engineConfig) // prepare the engine's internals

  engine: any;

  constructor() {
    console.log('wire in rules for specific event')
  }

  run() {
    this.engineAdapterService.runExecution()
    this.engine = this.engineAdapterService.engine
  }
}