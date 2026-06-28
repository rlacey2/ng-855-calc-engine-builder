import { effect, inject, Injectable, signal } from "@angular/core";
import { Rule } from "../core/engine/types";
import { t3FormFGService } from "./t3FormFGService";
import { FormControl, FormGroup } from "@angular/forms";

import { CalcEngineConfig } from '../core/engine/types';
import { CalcEngine } from '../core/engine/calc-engine';
import { scenarioSet } from '../core/engine/scenarios'



// acts a bridge/router/exchange between the components in the engine builder
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

  public dataInputs = signal<any>({});

  public originalModel = signal<any>({});
  public modifiedModel = signal<any>({});

  public rulesByScope = signal<any>({});

  public outputTrace = signal<any>(null);

  // Explicitly types the signal as a key-value dictionary mapping strings to any object
  public scenarios = signal<Record<string, any>>(scenarioSet);
  // public scenarios = signal<ScenarioState>({ rules: [], data: {}});  

  t3FormFG: FormGroup = this.t3FormFGService.getT3FormFG();

  // 1. Initialize the form group to satisfy the TypeScript compiler
  t3dataFG = new FormGroup({
    current: new FormControl('')
  });



  constructor() {
    effect(() => {
      console.log('effect()2->dataInputs()')
      const x = this.dataInputs()
      if (x.details) {
        console.log('mmmmmmmmmmmm')
        //   this.t3FormFG = this.engineAdapterService.get_t3FormFG()
        //   this.t3dataFG = this.engineAdapterService.get_t3dataFG()
      }
    });
  }



  setDiffOriginal(x: any) {
    console.log('setDiffOriginal')
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
    return sortedRules
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
  }

  get_t3FormFG() {
    this.t3FormFG = this.t3FormFGService.getT3FormFG();
    return this.t3FormFG
  }

  get_t3dataFG() { // single control, to allow cheap testing 
    return this.t3dataFG
  }

  generatet3FormFG(newJSON: any) {
    // the form is needed to supply its getRawValue() as the current data inputs to the engine
    this.t3FormFG = this.t3FormFGService.generateForm(newJSON)
    return this.t3FormFG
  }

  engineInitialise(rulesSorted: Rule[]) {
    this.engine = new CalcEngine(rulesSorted, this.engineConfig)
    this.rulesByScope.set(this.engine.get_rulesByScope())
  }

  calculate() {
    console.log('expects form data')
    // rebuild engine based on current rules
    this.engine = new CalcEngine(this.rules(), this.engineConfig) // prepare the engine's internals

    this.originalModel.set({ ...this.t3FormFG.getRawValue() })
    console.log(this.t3FormFG.getRawValue().details[0].subTotal)

    const res = this.engine.recalcAll(this.t3FormFG);

    this.modifiedModel.set({ ...this.t3FormFG.getRawValue() })
    console.log(this.t3FormFG.getRawValue().details[0].subTotal)

    let trace = this.engine.getTrace()

    this.outputTrace.set(trace);

    console.log(this.outputTrace().length)
  }

  patch() {
    console.log('patch')
    // the input data values have changed and are to be patched into the t3Form so next run() will be applied to this data
    // the user has editted the input data and now wants to make the next version for the execution run
    let newCurrent = this.get_t3dataFG().get('current')?.getRawValue()
    let newJSON = JSON.parse(newCurrent)
    this.t3FormFG = this.generatet3FormFG(newJSON)
  }

  add() {

    this.rules.update((r: any) => [...r, {
      id: crypto.randomUUID().split("-")[0], /* highly likely unique */
      target: 'Z',
      expression: '1*1',
      priority: 999
    }]);
  }

  onScenarioChange(scenario: string) {
    console.log('onScenarioChange')

    this.clearPreviousScenario()

    const nextScenario = this.scenarios()[scenario]

    const rules = nextScenario.rules
    const data = nextScenario.data

    let sortedRules = this.setRulesAgenda(rules)

    this.setRulesAgenda(sortedRules)

    this.t3FormFG = this.generatet3FormFG(data)

    this.dataInputs.set(data)

    this.engineInitialise(sortedRules)

  }

  clearPreviousScenario() {

    this.selected.set(null)
    this.generatet3FormFG({ header: {}, details: [] })
    this.rulesByScope.set({ header:[], details:[]})

  }

}
