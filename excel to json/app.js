const excelToJson = require('convert-excel-to-json')

const result = excelToJson({
    sourceFile: 'Assessment Framework for DDCC_V1.xlsm',
    sheets: [{
        name: 'Org and Product details',
        columnToKey: {
            B: 'Development ID',
            D: 'Category',
            E: 'Sub-category',
            F: 'Question',
            G: 'Input-option'
        }
    }]
})
result['Org and Product details'].shift()
result['Org and Product details'].shift()

console.log(result['Org and Product details'])