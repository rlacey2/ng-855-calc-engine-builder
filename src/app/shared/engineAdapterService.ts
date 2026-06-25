import { inject, Injectable, signal } from "@angular/core";
import { Rule } from "../core/engine/types";
import { t3FormFGService } from "./t3FormFGService";


// acts a bridge between the components in the engine builder


@Injectable({ providedIn: 'root' })
export class EngineAdapterService {

    t3FormFGService = inject(t3FormFGService)

    public rules = signal<any[]>([]);
    public selected = signal<any>(null);

    t3FormFG = this.t3FormFGService.getT3FormFG();


  setRulesAgenda(rulesToUse : Rule[])   {
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


updateRulesTable() {
    this.setRulesAgenda(this.rules())
}

get_t3FormFG() {
   return this.t3FormFG
}


}