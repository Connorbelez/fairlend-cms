const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')

const source = fs.readFileSync(require.resolve('./calculator-core.js'), 'utf8')
const context = { Intl, console }
context.globalThis = context
vm.runInNewContext(source, context)
const { calculate, money, validateInputs } = context.DrawflowPrototype

const sample = {
  budget: 1250000,
  capital: 290000,
  rate: 9.25,
  fee: 500,
  reserve: 25000,
  startDate: '2026-03-16',
  completionDate: '2026-10-30',
}

assert.equal(money(12840), '$12,840')
assert.equal(Object.keys(validateInputs(sample)).length, 0)
assert.ok(validateInputs({ ...sample, rate: 0 }).rate)
assert.ok(validateInputs({ ...sample, completionDate: '2026-01-01' }).completionDate)

const result = calculate(sample)
assert.equal(Math.round(result.baseCost), 53280)
assert.equal(Math.round(result.drawCost), 40440)
assert.equal(Math.round(result.difference), 12840)
assert.equal(result.baseFeasible, false)
assert.equal(result.drawFeasible, true)
assert.ok(calculate({ ...sample, rate: 12 }).difference > result.difference)
assert.ok(calculate({ ...sample, fee: 6000 }).difference < 0)
assert.equal(calculate({ ...sample, capital: 100000 }).drawFeasible, false)

console.log('DrawFlow prototype logic: 12 assertions passed')
