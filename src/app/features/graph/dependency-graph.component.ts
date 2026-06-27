// features/graph/dependency-graph.component.ts
import { Component, Input, AfterViewInit, ElementRef } from '@angular/core';
//  Works perfectly with TypeScript
import { Network } from 'vis-network';
import { DataSet } from 'vis-data'; // If you need DataSet, it lives here now
import { Rule } from '../../core/engine/types';

@Component({
  selector: 'dependency-graph',
  standalone: true,
  templateUrl: './dependency-graph.component.html'
})
export class DependencyGraphComponent  {

  @Input() rules: Rule[] = [];
  @Input() rulesByScope:  { header: [], row: [] }= {header: [], row: [] };

  constructor(private el: ElementRef) { }

  /*
  ngAfterViewInit() {
    this.render();
  } 
*/
  ngOnChanges() {
    this.render(); 
  }

  render() {
    console.log('render()')
   // if (!this.rules?.length) return;

   if (!this.rulesByScope.header.length && !this.rulesByScope.row.length) return;

// 1. Initialize vis-data collections
const nodes = new DataSet<any>();
const edges = new DataSet<any>();

// State map to track the absolute last Rule ID that touched a variable name
const lastUpdatedBy: Record<string, string> = {};

// 2. Helper function to process a ordered block of rules
const processExecutionChain = (rulesList: any[], scopeName: string) => {
  rulesList.forEach((rule) => {
    // A. Generate unique node for this specific rule execution
    nodes.update({
      id: rule.id,
      label: `[${scopeName.toUpperCase()}]\n${rule.id}\nTarget: ${rule.target}`,
      shape: scopeName === 'header' ? 'ellipse' : 'box',
      color: scopeName === 'header' 
        ? { background: '#e7ee23', border: '#b6a23c' }  // header
        : { background: '#e2f0cb', border: '#b5e2fa' }, // details row
      margin: 10
    });

    // B. Detect dependent variables inside this rule
    // (Adjust this list or regex parser based on your compilation tokens)
    const possibleVars = ['qty', 'price', 'subTotal', 'rows'];

    possibleVars.forEach((variable) => {
      const parsedInExpression = rule.expression.includes(variable);
      const parsedInCondition = rule.when && rule.when.includes(variable);

      if (parsedInExpression || parsedInCondition) {
        // Special Case: Header rule aggregation reads "rows.reduce((..., r => r.subTotal))"
        // It depends on the absolute final row calculation step of subTotal
        if (variable === 'rows' && lastUpdatedBy['subTotal']) {
          edges.update({
            from: lastUpdatedBy['subTotal'], // Points to d_5 (the last row step)
            to: rule.id,
            label: 'row data stream',
            arrows: 'to',
            style: 'dash' // Visual cue that it's an aggregation jump
          });
        }
        // Standard Case: Variable has a history in the execution timeline
        else if (lastUpdatedBy[variable]) {
          edges.update({
            from: lastUpdatedBy[variable], // Connects d_2 directly back to d_1
            to: rule.id,
            label: variable,
            arrows: 'to'
          });
        } 
        // Root Input Case: Read from raw input fields (e.g., base qty or price)
        else {
          const inputNodeId = `input_${variable}`;
          nodes.update({ 
            id: inputNodeId, 
            label: `Input:\n${variable}`, 
            shape: 'database',
            color: '#e5e5e5'
          });
          edges.update({ 
            from: inputNodeId, 
            to: rule.id, 
            arrows: 'to' 
          });
        }
      }
    });

    // C. Register this rule as the latest provider for its target variable
    lastUpdatedBy[rule.target] = rule.id;
  });
};

// 3. Execute the pipeline sequentially using your pre-built engine arrays
if (this.rulesByScope?.row) {
  processExecutionChain(this.rulesByScope.row, 'row');
}
if (this.rulesByScope?.header) {
  processExecutionChain(this.rulesByScope.header, 'header');
}





    /* 
     //dependencies are naive:
     const extractDeps = (expr: any) =>
       expr.match(/\b[a-zA-Z_]\w*\b/g) || [];
 */
    const extractDeps = (rule: any) =>
      rule.dependsOn || [];

    for (const rule of this.rules) {

      //    nodes.add({ id: rule.target, label: rule.target });
      // This safely adds or updates the item dynamically
      nodes.update({ id: rule.target, label: rule.target });


      // const deps = extractDeps(rule.expression);
      const deps = extractDeps(rule); // real parser / engine metadata:

      for (const d of deps) {
        nodes.update({ id: d, label: d });
        edges.update({ from: d, to: rule.target });
      }
    }

    const container = this.el.nativeElement.firstChild;

    /*
    const options = {
      layout: {
        hierarchical: {
          direction: 'LR'
        }
      },
      physics: false
    }
*/

    const options =   {
  layout: {
    hierarchical: {
      enabled: true,
      direction: 'LR',        // Left-to-Right layout flows like an execution timeline
      sortMethod: 'directed', // Follows the arrow directions implicitly
      nodeSpacing: 150,
      levelSeparation: 200
    }
  },
  physics: {
    enabled: false            // Turning off physics prevents rules from jumping around
  }
};

    
    new Network(container, { nodes, edges }, options);
  }
}