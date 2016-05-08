/**
 * Created by Rusak Oleg on 07.05.2016.
 */

/* global d3*/

let RoundChart = require('./round-chart.js')
let Histogram = require('./histogram.js')

let margin = {top: 50, left: 30, bottom: 40, right: 30}
let width = 500 - margin.left - margin.right
let height = 400 - margin.top - margin.bottom

let data = [
  {name: 'A', value: '15', value1: '40', value2: '10'},
  {name: 'B', value: '20', value1: '50', value2: '20'},
  {name: 'C', value: '40', value1: '110', value2: '40'},
  {name: 'D', value: '15', value1: '5', value2: '10'},
  {name: 'E', value: '60', value1: '20', value2: '60'},
  {name: 'F', value: '30', value1: '70', value2: '30'}
]
data = dataInit(data)

let color = d3.scale.category10()

let roundChar = new RoundChart(data[0], color, width, height, margin)
roundChar.draw()

addCallText(roundChar, 'Mouse over!')

let histogram = new Histogram(data, color, width, height, margin)
histogram.callbackBarMouseClick = handlerMouseClick
histogram.draw()

addCallText(histogram, 'Mouse click!')

//  Function wasteland-------------------------

function handlerMouseClick () {
  let event = d3.event
  let groupRectangle = d3.select(event.target.parentNode)
  //  get first element in sample
  let dataGroupRectangle = groupRectangle.data()[0]

  roundChar.updateData(dataGroupRectangle)
}

function dataInit () {
  return data.map((row) => {
    let values = Object.keys(row).filter((key) => key !== 'name').map((key) => +row[key])
    let total = values.reduce((total, value) => total + value, 0)
    return {
      name: row.name,
      values: values,
      total: total
    }
  })
}

function addCallText (graphic, text) {
  let canvas = graphic.canvas
  canvas.append('text')
    .attr('x', graphic.width / 2)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .text(text)
}
