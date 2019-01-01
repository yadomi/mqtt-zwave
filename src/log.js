const chalk = require('chalk')

const ucfirst = s => s && s[0].toUpperCase() + s.slice(1)

const colors = {
  info: 'blue',
  error: 'red',
  warning: 'yellow',
  success: 'green'
}

module.exports = (from, level, ...args) => {
  const color = colors[level]
  console.log(chalk[color](`[${from.toUpperCase()}] ${ucfirst(level)}:`), ...args)
}