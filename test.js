var ascii = require("ascii-table")
const AsciiTable = require("ascii-table/ascii-table")
a = ["a", 'k']
b = ["a", "fr", "ko"]
var table = new AsciiTable
table.setHeading("a","b")
for(let i=0; i<=Math.max(a.length, b.length)-1; i++){
    table.addRow(a[i], b[i])
}
console.log(table.render())