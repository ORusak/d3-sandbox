/**
 * Created by Rusak Oleg on 22.04.2016.
 */

/* global d3*/
let data = [
  {name: 'A', value: '15', value1: '-10'},
  {name: 'B', value: '-20', value1: '-20'},
  {name: 'C', value: '40', value1: '-40'},
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

let color = d3.scale.category10()

let keyScale = d3.scale.ordinal()
  .rangeBands([0, width], '.1')
  .domain(data.map((d) => d.name))
let keyRectDomain = Object.keys(data[0]).filter((key) => key !== 'name')
let keyScaleRect = d3.scale.ordinal()
  .rangeBands([0, keyScale.rangeBand()])
  .domain(keyRectDomain)

let valueDomain = d3.extent(data.reduce((values, row, index) => {
  keyRectDomain.forEach((col) => values.push(data[index][col]))
  return values
}, []))
let valueScale = d3.scale.linear()
  .range([height, 0])
  .domain(valueDomain)

//  Canvas
let svg = d3.select('.container').append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)

let canvas = svg.append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`)

//  Axis X and Y
let axisX = d3.svg.axis().scale(keyScale)
  .orient('bottom')
  .tickSize(0)
  .tickPadding(20)

let axisY = d3.svg.axis().scale(valueScale)
  .orient('left')

canvas.append('g')
  .attr('class', 'key axis')
  .attr('transform', `translate(0,${height})`)
  .call(axisX)

canvas.append('g')
  .attr('class', 'value axis')
  .attr('transform', 'translate(0,0)')
  .call(axisY)

//  Bar
let barGroup = canvas.selectAll('.bars')
  .data(data)
  .enter().append('g')
  .attr('class', '.bars')
  .attr('transform', (d) => `translate(${keyScale(d.name)}, 0)`)

barGroup.selectAll('.bar')
  .data((d) => {
    return keyRectDomain.map((key) => d[key])
  })
  .enter().append('rect')
  .attr('class', 'bar')
  .attr('transform', function (d, i) {
    return 'translate(' + keyScaleRect(keyRectDomain[i]) + ',' + valueScale(Math.max(0, d)) + ')'
  })
  .attr('height', 0)
  .transition()
  .duration(2000)
  .attr('width', keyScaleRect.rangeBand())
  .attr('height', function (d) { return Math.abs(valueScale(d) - valueScale(0)) })
  .attr('fill', (d, i) => color(keyRectDomain[i]))

barGroup.selectAll('text')
  .data((d) => {
    return keyRectDomain.map((key) => d[key])
  })
  .enter().append('text')
  .attr('transform', function (d, i) {
    return 'translate(' + (keyScaleRect(keyRectDomain[i]) + keyScaleRect.rangeBand() / 2) + ',' + valueScale(d) + ')'
  })
  .attr('dy', (d) => {
    return d < 0 ? '1.0em' : '-0.3em'
  })
  .style('fill', '#000')
  .style('text-anchor', 'middle')
  .style('font-size', '10pt')
  .text((d) => d)
