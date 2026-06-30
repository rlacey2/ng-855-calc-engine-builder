// features/graph/dependency-graph.component.ts
import { Component, Input, AfterViewInit, ElementRef, SimpleChanges, inject } from '@angular/core';
//  Works perfectly with TypeScript
import { Network } from 'vis-network';
import { DataSet } from 'vis-data'; // If you need DataSet, it lives here now
import { Rule } from '../../core/engine/types';

@Component({
  selector: 'dependency-graph',
  standalone: true,
  templateUrl: './dependency-graph.component.html'
})
export class DependencyGraphComponent {
 
  @Input() rulesByScope: { header: any[]; row: any[] } = { header: [], row: [] };
  @Input() headerSample: any  // the sample row fields that rules work on
  @Input() detailsSample: any     // the sample header data fields that rules work on

  private el = inject(ElementRef)
  constructor() {

    //  this.render()
  }

  /*
  ngAfterViewInit() {
    this.render();
  } 
*/
  ngOnChanges(changes: SimpleChanges) {
    //  this.render(); 
    console.log('ngOnChanges')
    if (changes['rulesByScope'] && changes['rulesByScope'].currentValue) {
      this.render(this.headerSample, this.detailsSample);
    }
  }

 
private getNodeStyle(type: string) {

  switch (type) {
    case 'row':
      return { background: '#3b82f6', border: '#1d4ed8' }; // blue
    case 'extras':
      return { background: '#a855f7', border: '#6b21a8' }; // purple
    case 'header':
      return { background: '#22c55e', border: '#166534' }; // green
    case 'calc':
      return { background: '#f59e0b', border: '#b45309' }; // orange
    default:
      return { background: '#9ca3af', border: '#4b5563' }; // gray
  }
}


  zzrender() {
    console.log('render()')
    // if (!this.rules?.length) return;

        // 1. Initialize vis-data collections
    const nodes = new DataSet<any>();
    const edges = new DataSet<any>();
    const container = this.el.nativeElement.firstChild;

    if (!this.rulesByScope?.header.length && !this.rulesByScope?.row.length) {
       // clear any previous graph and return
       new Network(container, { nodes, edges }, {});
      return
    }
 
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
        console.log("FIX THIS TO BE DYNAMIC PER rule")
        const possibleVars = ['qty', 'price', 'subTotal', 'rows', 'xyz'];

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
/*
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
*/
    

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

    const options = {
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

private buildFieldRegistry(header: any, sampleDetail: any) {

  const registry = {
    detail: {} as Record<string, true>,
    extras: {} as Record<string, true>,
    header: {} as Record<string, true>
  };

 // const sampleRow = this.rows?.[0];
console.log('buildFieldRegistry')
  if (sampleDetail) {

    Object.keys(sampleDetail).forEach(k => {
      if (k !== 'extras') {
        registry.detail[k] = true;
      }
    });

    // extras is an array of json objects, where the attribute is dyamic 

    for (const item of sampleDetail.extras) {
  for (const k in item) {
    if (Object.prototype.hasOwnProperty.call(item, k)) {
      registry.extras[k] = true;
    }
  }
}
    /*
    if (sampleDetail.extras) {

      Object.keys(sampleDetail.extras).forEach(k => {
        registry.extras[k] = true;
      });
    }
    */
  }

  if (header) {
    Object.keys(header).forEach(k => {
      registry.header[k] = true;
    });
  }

  return registry;
}

private resolveFieldSource(
  field: string,
  ctx: 'row' | 'header',
  registry: any
): 'row' | 'extras' | 'header' | 'calc' {

// discover the source/context of a field

  // 1. Row execution context
  if (ctx === 'row') {

    if (registry.detail[field]) return 'row';   // nb cf detail vs row which is aka attendee

    if (registry.extras[field]) return 'extras';

    if (registry.header[field]) return 'header';

  }

  // 2. Header execution context
  if (ctx === 'header') {

    // Header can read header first
    if (registry.header[field]) return 'header';

    // Then row aggregates
    if (registry.detail[field]) return 'row';

    // Extras only if explicitly referenced (rare but possible)
    if (registry.extras[field]) return 'extras';
  }

  return 'calc';
}




  render(header: any, sampleRow: any) {
    console.log('render()')
    // if (!this.rules?.length) return;

        // 1. Initialize vis-data collections
    const nodes = new DataSet<any>();
    const edges = new DataSet<any>();
    const container = this.el.nativeElement.firstChild;

    if (!this.rulesByScope?.header.length && !this.rulesByScope?.row.length) {
       // clear any previous graph and return
       new Network(container, { nodes, edges }, {});
      return
    }

    const registry = this.buildFieldRegistry(header, sampleRow)
 
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
 
const sampleRow = this.rulesByScope.row[0] || {}; // assume available
const header = this.rulesByScope?.header || [];

console.log("FIX THIS TO BE DYNAMIC PER rule")
const possibleVars = ['qty', 'price', 'subTotal', 'rows', 'xyz'];

possibleVars.forEach((variable) => {

  const parsedInExpression = rule.expression.includes(variable);
  const parsedInCondition = rule.when && rule.when.includes(variable);

  if (parsedInExpression || parsedInCondition) {

    const sourceType = this.resolveFieldSource(variable, rule.scope, registry);

    // 🟣 SPECIAL: aggregation from rows → header
    if (variable === 'rows' && lastUpdatedBy['subTotal']) {
      edges.update({
        from: lastUpdatedBy['subTotal'],
        to: rule.id,
        label: 'row data stream',
        arrows: 'to',
        dashes: true
      });
      return;
    }

    // 🔁 Standard dependency (already calculated)
    if (lastUpdatedBy[variable]) {
      edges.update({
        from: lastUpdatedBy[variable],
        to: rule.id,
        label: variable,
        arrows: 'to'
      });
    }

    // 🌱 Root input node (NOW COLOURED)
    else {

      const inputNodeId = `input_${variable}`;

      nodes.update({
        id: inputNodeId,
        label: `${variable}\n(${sourceType})`,
        shape: sourceType === 'extras' ? 'dot' : 'database',
        color: this.getNodeStyle(sourceType),
        font: { size: 12 }
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

     /*
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
*/
    

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

    const options = {
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