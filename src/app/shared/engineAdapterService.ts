import { inject, Injectable, signal } from "@angular/core";
import { Rule } from "../core/engine/types";
import { t3FormFGService } from "./t3FormFGService";
import { FormGroup } from "@angular/forms";

import { CalcEngineConfig } from '../core/engine/types';
import { CalcEngine } from '../core/engine/calc-engine';

// acts a bridge between the components in the engine builder
// wiring them altogether, a clearing house for the various state(s) needed

@Injectable({ providedIn: 'root' })
export class EngineAdapterService {

  t3FormFGService = inject(t3FormFGService)

  engine: any;

  engineConfig: CalcEngineConfig = {
    rounding: 4,
    roundingMode: 'final-only',
    debug: true
  }


  public rules = signal<any[]>([]);     // rules to populate the table of rules
  public selected = signal<any>(null);  // selected row in the table of rules

  public originalModel = signal<any>(null);
  public modifiedModel = signal<any>(null);

  outputTrace = signal<any>(null);

 

  t3FormFG: FormGroup = this.t3FormFGService.getT3FormFG();

  //t3dataFG: FormGroup

  /*
  originalModel: DiffEditorModel = this.jsonDiff({ "id": "h_total", "type": "aggregation", "scope": "header", "target": "total", "expression": "rows.reduce((s,r)=>s+r.subTotal,0)", "priority": 2 })

  modifiedModel: DiffEditorModel = this.jsonDiff({ "id": "h_total", "type": "aggregation", "scope": "header", "target": "total", "expression": "rows.reduce((s,r)=>s+r.subTotal,0)", "priority": 2 })

  */

  setDiffOriginal(x: any) {
    this.originalModel.set(x)
  }

  setDiffModified(x: any) {
    this.modifiedModel.set(x)
  }

  updateRulesTable() {
    this.setRulesAgenda(this.rules())
  }

  setRulesAgenda(rulesToUse: Rule[]) {
    // sorted list of rules


    //  const rulesAsString = JSON.stringify(rulesToUse )

    // the rules are separate form the engine that will consume them
    // i.e. the DSL is used to create the execution of rules that meet the syntax

    let sortedRules = this.sortRules(rulesToUse)

    // this.rules.set(JSON.parse(rulesAsString));
    this.rules.set(sortedRules);

  }

  sortRules(rules: Rule[]): Rule[] {

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

  get_t3FormFG() {
    this.t3FormFG = this.t3FormFGService.getT3FormFG();
    return this.t3FormFG
  }

  get_t3dataFG() {
    return this.t3FormFGService.get_t3dataFG()
  }

  generateForm(newJSON: any) {
    this.t3FormFG = this.t3FormFGService.generateForm(newJSON)
    return this.t3FormFG
  }


  runExecution() {
    console.log('expects form data')
    // rebuild engine based on current rules
    this.engine = new CalcEngine(this.rules(), this.engineConfig) // prepare the engine's internals

  //  this.t3FormFG = this.engineAdapterService.get_t3FormFG()

    const res = this.engine.recalcAll(this.t3FormFG);

    let trace = this.engine.getTrace()

    this.outputTrace.set(trace);

    console.log(this.outputTrace().length)

  }




}