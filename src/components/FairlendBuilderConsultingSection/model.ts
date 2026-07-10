const torontoLuxury2019Inputs = {
  buildAreaSquareFeet: 3_800,
  buildCostPerSquareFoot: 285,
  exitValue: 3_650_000,
  landBasis: 1_450_000,
} as const

const torontoLuxury2019Return =
  torontoLuxury2019Inputs.exitValue -
  torontoLuxury2019Inputs.landBasis -
  torontoLuxury2019Inputs.buildCostPerSquareFoot * torontoLuxury2019Inputs.buildAreaSquareFeet

const torontoLuxury2019Margin = (torontoLuxury2019Return / torontoLuxury2019Inputs.exitValue) * 100

function formatSignedMillions(value: number) {
  const sign = value >= 0 ? '+' : '-'
  return `${sign}$${(Math.abs(value) / 1_000_000).toFixed(2)}M*`
}

export const torontoLuxury2019Model = {
  build: `$${torontoLuxury2019Inputs.buildCostPerSquareFoot}/ft²`,
  buildArea: `${torontoLuxury2019Inputs.buildAreaSquareFeet.toLocaleString('en-CA')} ft²`,
  land: `$${(torontoLuxury2019Inputs.landBasis / 1_000_000).toFixed(2)}M`,
  margin: `${torontoLuxury2019Margin.toFixed(1)}%*`,
  profit: formatSignedMillions(torontoLuxury2019Return),
  sale: `$${(torontoLuxury2019Inputs.exitValue / 1_000_000).toFixed(2)}M`,
} as const
