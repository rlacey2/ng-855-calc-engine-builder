/*
"scenario_01": {
    "rules": [],
      data: { header: {}, details: {}}
},
*/



export const scenarioSet: any =
{

  "New": {
    "rules": [],
    "data": { header: {}, details: [] }
  },

  "scenario_01": {

    "rules":
      [
        { "id": "d_1", "type": "calculation", "scope": "row", "target": "subTotal", "expression": "qty * price", "priority": 1 },
        { "id": "d_2", "type": "calculation", "scope": "row", "target": "subTotal", "expression": "subTotal * -1", "priority": 2, "when": "subTotal > 20" },
        { "id": "d_3", "type": "calculation", "scope": "row", "target": "subTotal", "expression": "9.99", "priority": 3, "when": "subTotal < 0" },
        { "id": "d_4", "type": "calculation", "scope": "row", "target": "subTotal", "expression": "subTotal / 3", "priority": 4 },
        { "id": "d_5", "type": "calculation", "scope": "row", "target": "subTotal", "expression": "subTotal / 3", "priority": 5 },
        { "id": "h_total", "type": "aggregation", "scope": "header", "target": "total", "expression": "rows.reduce((s,r)=>s+r.subTotal,0)", "priority": 2 }
      ],

    "data": {
      "header": {
        "scenario_01": 0,
        "subTotal": 0,
        "vatTotal": 0,
        "discountTotal": 0,
        "discountTotalB": 0,
        "commissionTotal": 0,
        "grandTotal": 0,
        "total": 0,
        "vatRate": 0.2,
        "discountRate": 0.09,
        "commissionRate": 0.07
      },
      "details": [
        {
          "qty": 2,
          "price": 10.99,
          "subTotal": 0,
          "discount": 0,
          "vat": 0,
          "total": 0,
          "string1": "alpha",
          "string2": "beta",
          "result": ""
        },
        {
          "qty": 5,
          "price": 6.88,
          "subTotal": 0,
          "discount": 0,
          "vat": 0,
          "total": 0,
          "string1": "alpha",
          "string2": "alpha",
          "result": ""
        }
      ]
    }

  },

  "scenario_02": {

    "rules":
      [
        // sequential stored out of order to prove priority works as a sort value
        { "id": "d_1", "type": "calculation", "scope": "row", "target": "subTotal", "expression": "qty * price * xyz * aa * bb", "priority": 1 },
        { "id": "d_2", "type": "calculation", "scope": "row", "target": "subTotal", "expression": "subTotal * -1", "priority": 3, "when": "subTotal > 20" },
        { "id": "d_3", "type": "calculation", "scope": "row", "target": "subTotal", "expression": "9.99", "priority": 2, "when": "subTotal < 0" },
        { "id": "d_4", "type": "calculation", "scope": "row", "target": "subTotal", "expression": "subTotal / 3", "priority": 5 },
        { "id": "h_001", "type": "aggregation", "scope": "header", "target": "total", "expression": "rows.reduce((s,r)=>s+r.subTotal,0)", "priority": 2 }
      ]
    ,

    "data": {
      "header": {
        "scenario_02": 0,

        "subTotal": 0,
        "vatTotal": 0,
        "discountTotal": 0,
        "discountTotalB": 0,
        "commissionTotal": 0,
        "grandTotal": 0,
        "total": 0,
        "vatRate": 0.2,
        "discountRate": 0.09,
        "commissionRate": 0.07
      },
      "details": [
        {
          "xyz": .20,
          "qty": 2,
          "price": 10.99,
          "subTotal": 0,
          "discount": 0,
          "vat": 0,
          "total": 0,
          "string1": "alpha",
          "string2": "beta",
          "result": "",
          "extras": [{ "aa": 11, "bb": 22 }]

        },
        {
          "xyz": .20,
          "qty": 5,
          "price": 6.88,
          "subTotal": 0,
          "discount": 0,
          "vat": 0,
          "total": 0,
          "string1": "alpha",
          "string2": "alpha",
          "result": "",
          "extras": [{ "aa": 11, "bb": 22 }]

        }
      ]
    }
  },


  "scenario_03": {

    "rules":
      [
        // sequential stored out of order to prove priority works as a sort value
        { "id": "d_1", "type": "calculation", "scope": "row", "target": "subTotal", "expression": "aa * bb *qty * price * xyz", "priority": 1 },
      ]
    ,

    "data": {
      "header": {
        "scenario_03": 0,

        "subTotal": 0,
        "vatTotal": 0,
        "discountTotal": 0,
        "discountTotalB": 0,
        "commissionTotal": 0,
        "grandTotal": 0,
        "total": 0,
        "vatRate": 0.2,
        "discountRate": 0.09,
        "commissionRate": 0.07
      },
      "details": [
        {
          "xyz": 1,
          "qty": 2,
          "price": 4,
          "subTotal": 0,
          "discount": 0,
          "vat": 0,
          "total": 0,
          "string1": "alpha",
          "string2": "beta",
          "result": "",
          "extras": [{ "aa": 2, "bb": 2 }]

        },
        {
          "xyz": 3,
          "qty": 3,
          "price": 3,
          "subTotal": 0,
          "discount": 0,
          "vat": 0,
          "total": 0,
          "string1": "alpha",
          "string2": "alpha",
          "result": "",
          "extras": [{ "aa": 2, "bb": 2 }]

        }
      ]
    }
  },



}

export const scenarioKeys: string[] = Object.keys(scenarioSet);

const zzz = {
  "sequentialSteps3": [
    // just to prove it's supported no priority falls back to id order?
    { "id": "d_1", "type": "calculation", "scope": "row", "target": "subTotal", "expression": "qty * price" },
    { "id": "d_2", "type": "calculation", "scope": "row", "target": "subTotal", "expression": "subTotal * -1", "when": "subTotal > 20" },
    { "id": "d_3", "type": "calculation", "scope": "row", "target": "subTotal", "expression": "9.99", "when": "subTotal < 0" },
    { "id": "d_4", "type": "calculation", "scope": "row", "target": "subTotal", "expression": "subTotal / 3" },
    { "id": "d_5", "type": "calculation", "scope": "row", "target": "subTotal", "expression": "subTotal / 3" },
    { "id": "h_total", "type": "aggregation", "scope": "header", "target": "total", "expression": "rows.reduce((s,r)=>s+r.subTotal,0)", "priority": 2 }
  ],
  "sequentialSteps4": [
    // just to prove it's supported no priority falls back to id order?
    { "id": "d_91", "type": "calculation", "scope": "row", "target": "subTotal", "expression": "qty * price" },
    { "id": "d_55", "type": "calculation", "scope": "row", "target": "subTotal", "expression": "subTotal / 3" },
    { "id": "d_82", "type": "calculation", "scope": "row", "target": "subTotal", "expression": "subTotal * -1", "when": "subTotal > 20" },
    { "id": "d_73", "type": "calculation", "scope": "row", "target": "9.99", "expression": "subTotal < 0" },
    { "id": "d_64", "type": "calculation", "scope": "row", "target": "subTotal", "expression": "subTotal / 3" },
    { "id": "d_55", "type": "calculation", "scope": "row", "target": "subTotal", "expression": "subTotal / 3" },
    { "id": "h_total", "type": "aggregation", "scope": "header", "target": "total", "expression": "rows.reduce((s,r)=>s+r.subTotal,0)", "priority": 2 }
  ],
  "mad1": [
    { "id": "d_1", "type": "calculation", "scope": "row", "target": "subTotal", "expression": "qty * price", "priority": 1 },
    { "id": "d_2", "type": "calculation", "scope": "row", "target": "discount", "expression": "(qty * price) * discountRate", "priority": 2 },
    { "id": "d_3", "type": "calculation", "scope": "row", "target": "vat", "expression": "(qty * price) * vatRate", "priority": 2 },
    { "id": "h_total", "type": "aggregation", "scope": "header", "target": "total", "expression": "rows.reduce((s,r)=>s+r.subTotal,0)", "priority": 2 },
    { "id": "h_discount", "type": "aggregation", "scope": "header", "target": "discountTotal", "expression": "rows.reduce((s,r)=>s+r.discount,0)", "priority": 2 },
    { "id": "h_discount", "type": "calculation", "scope": "header", "target": "discountTotalB", "expression": "total * discountRate", "priority": 3 },
    { "id": "h_grandTotal", "type": "aggregation", "scope": "header", "target": "grandTotal", "expression": "rows.reduce((sum, r) => sum + r.subTotal, 0)" },
    { "id": "dad", "type": "calculation", "scope": "row", "target": "discount", "expression": "subTotal * discountRate * (-1)", "when": "subTotal > 20", "priority": 3 },
    { "id": "dfdr3", "type": "calculation", "scope": "row", "target": "vat", "expression": "vat * vat", "when": "subTotal > 20", "priority": 4 },
    { "id": "dfdr4", "type": "calculation", "scope": "row", "target": "result", "expression": "string1 < string2", "priority": 4 }
  ]
}