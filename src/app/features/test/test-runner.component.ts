// features/test/test-runner.component.ts
import { Component, Input, signal } from '@angular/core';
 
import { Rule } from '../../core/engine/types';
import { CalcEngineConfig } from '../../core/engine/types';
import { CalcEngine } from '../../core/engine/calc-engine';
import { JsonPipe } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { TraceViewerComponent } from "../trace/trace-viewer.component";

@Component({
  selector: 'test-runner',
  standalone: true,
  templateUrl: './test-runner.component.html',
  imports: [JsonPipe, TraceViewerComponent],
  
})
export class TestRunnerComponent {

  @Input() rules: Rule[] = [];
  @Input() t3FormFG: FormGroup | undefined;

  output = signal<any>(null);

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
    console.log('expects form data')
    // rebuild engine based on current rules
    this.engine = new CalcEngine(this.rules, this.engineConfig) // prepare the engine's internals
    const res = this.engine.recalcAll(this.t3FormFG);

    let trace = this.engine.getTrace()

    this.output.set(trace);

console.log(this.output().length)
    // console.log(this.engine.getTrace());
  }
}