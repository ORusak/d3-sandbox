/**
 * Created by Rusak Oleg on 22.04.2016.
 */

/* global d3*/
let data = [
  {name: 'A', value: '15', value1: '-10'},
  {name: 'B', value: '-20', value1: '-20'},
  {name: 'C', value: '40', value1: '40'},
  {name: 'D', value: '-15', value1: '-10'},
  {name: 'E', value: '60', value1: '-60'},
  {name: 'F', value: '30', value1: '-30'}
]

let margin = {top: 20, left: 30, bottom: 40, right: 30}
let width = 500 - margin.left - margin.right
let height = 400 - margin.top - margin.bottom

//  init data
data.forEach((d) => {
  d.value = +d.value
  d.value1 = +d.value1
})

let dataKey = Object.keys(data[0]).filter((k) => k !== 'name')
let dataValuePositive = []
let dataValueNegative = []
dataKey.forEach((col) => {
  let negativeLayer = []
  let positiveLayer = []

  data.forEach((row) => {
    positiveLayer.push({
      x: row.name,
      y: Math.max(0, row[col])
    })
    negativeLayer.push({
      x: row.name,
      y: Math.min(0, row[col])
    })
  })

  dataValuePositive.push(positiveLayer)
  dataValueNegative.push(negativeLayer)
})

//  init layout
let stack = d3.layout.stack()
let dataStackPositive = stack(dataValuePositive)
let dataStackNegative = stack(dataValueNegative)

//  init scale
let color = d3.scale.category10()
let keyScale = d3.scale.ordinal()
  .rangeBands([0, height], '.1')
  .domain(data.map((d) => d.name))

let getMaxValue = (dataValue) => {
  return dataValue[dataValue.length - 1].reduce((max, d) => {
    let summary = Math.abs(d.y + d.y0)
    return summary > max ? summary : max
  }, 0)
}

let valueDomain = [ -getMaxValue(dataValueNegative), getMaxValue(dataValuePositive) ]
let valueScale = d3.scale.linear()
  .range([width, 0])
  .domain(valueDomain)

//  Canvas
let svg = d3.select('.container').append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)

let canvas = svg.append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`)

//  Axis X and Y
let axisX = d3.svg.axis().scale(valueScale)
  .orient('bottom')

let axisY = d3.svg.axis().scale(keyScale)
  .orient('left')
  .tickSize(0)
  .tickPadding(20)

canvas.append('g')
  .attr('class', 'value axis')
  .attr('transform', `translate(0,${height})`)
  .call(axisX)

canvas.append('g')
  .attr('class', 'key axis')
  .attr('transform', 'translate(0,0)')
  .call(axisY)

//  Layers
let barGroupPositive = canvas.selectAll('.layer')
  .data(dataStackPositive)
  .enter().append('g')
  .attr('class', 'layer')
  .attr('transform', 'translate(0, 0)')
  .attr('fill', (d, i) => color(i))

//  Bars
barGroupPositive.selectAll('.bar')
  .data((d) => d)
  .enter().append('rect')
  .attr('class', 'bar')
  .attr('transform', function (d) {
    return `translate(${valueScale(d.y + d.y0)},${keyScale(d.x)})`
  })
  .attr('width', function (d) { return Math.abs(valueScale(d.y) - valueScale(0)) })
  .attr('height', keyScale.rangeBand())

//  Layers
let barGroupNegative = canvas.selectAll('.layer_negative')
  .data(dataStackNegative)
  .enter().append('g')
  .attr('class', 'layer_negative')
  .attr('transform', 'translate(0, 0)')
  .attr('fill', (d, i) => color(i))

//  Bars
barGroupNegative.selectAll('.bar')
  .data((d) => d)
  .enter().append('rect')
  .attr('class', 'bar')
  .attr('transform', function (d) {
    return `translate(${valueScale(d.y0)},${keyScale(d.x)})`
  })
  .attr('width', function (d) { return Math.abs(valueScale(d.y) - valueScale(0)) })
  .attr('height', keyScale.rangeBand())
  .attr('title', 'Привет')

let TextGroupNegative = canvas.selectAll('.layer_negative_text')
  .data(dataStackNegative)
  .enter().append('g')
  .attr('class', 'layer_negative_text')
  .attr('transform', 'translate(0, 0)')

//  Text
let textData = dataStackNegative[dataStackNegative.length - 1].concat(dataStackPositive[dataStackPositive.length - 1])
TextGroupNegative.selectAll('text')
  .data(textData)
  .enter().append('text')
  .attr('transform', function (d) {
    return 'translate(' + valueScale(d.y + d.y0) + ',' + (keyScale(d.x) + keyScale.rangeBand() / 2) + ')'
  })
  .attr('dx', (d) => {
    return d.y < 0 ? '1.0em' : '-1.0em'
  })
  .attr('dy', '.33em')
  .style('fill', '#000')
  .style('text-anchor', 'middle')
  .style('font-size', '10pt')
  .text((d) => {
    let value = d.y + d.y0
    return value === 0 ? '' : value
  })

