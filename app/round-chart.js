/**
 * Created by Rusak Oleg on 22.04.2016.
 */

/* global d3*/

(function (){
let margin = {top: 20, left: 30, bottom: 40, right: 30}
let width = 500 - margin.left - margin.right
let height = 400 - margin.top - margin.bottom

let data = [
  {name: 'A', value: '15', value1: '40', value2: '10'},
  {name: 'B', value: '20', value1: '50', value2: '20'},
  {name: 'C', value: '50', value1: '110', value2: '40'},
  {name: 'D', value: '15', value1: '5', value2: '10'},
  {name: 'E', value: '35', value1: '20', value2: '60'},
  {name: 'F', value: '70', value1: '70', value2: '30'}
]

//  init data
data = data.map((row) => {
  let values = Object.keys(row).filter((key) => key !== 'name').map((key) => +row[key])
  let total = values.reduce((total, value) => total + value, 0)
  return {
    name: row.name,
    values: values,
    total: total
  }
})

console.log(data)

let color = d3.scale.category10()
let arc, svgCircle, arcLabel
let pie = d3.layout.pie()
  .sort(null)

let drawRoundChar = function (dataRow) {
  let radius = Math.min(width, height) / 2

  arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0)
  let arcLarger = d3.svg.arc()
    .outerRadius(radius)
    .innerRadius(0)

  arcLabel = d3.svg.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40)

  let pie = d3.layout.pie()
    .sort(null)

  //  Canvas
  svgCircle = d3.select('.container').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('class', 'container')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  let tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')

  let arcs = svgCircle.selectAll('.arc')
    .data(pie(dataRow.values))
    .enter().append('g')
    .attr('class', 'arc')
    .on('mouseover', (element) => {
      let event = d3.event
      let arcTarget = d3.select(event.target)

      arcTarget.on('mousemove', handlerMouseMove.bind(this, tooltip))
        .transition()
        .duration(400)
        .attr('d', arcLarger)

      tooltip
        .style('top', (event.pageY) + 'px')
        .style('left', (event.pageX) + 'px')
        .html(`Value: ${element.value}`)
        .transition()
        .duration(300)
        .style('opacity', 1)
    }, false)
    .on('mouseout', () => {
      let event = d3.event

      let arcTarget = d3.select(event.target)
      arcTarget.on('mousemove', null)
        .transition()
        .duration(300)
        .attr('d', arc)

      tooltip
        .transition()
        .duration(300)
        .style('opacity', 0)
    })

  arcs.append('path')
    .attr('d', arc)
    .each(function (d) { this._current = d })
    .style('fill', (d, i) => color(i))

  arcs.append('text').attr('transform', (d) => `translate(${arcLabel.centroid(d)})`)
    .attr('dy', '.35em')
    .text((d) => d.data)
    .style('fill', '#fff')
}

let drawHistogram = function (data) {
  let keyScale = d3.scale.ordinal()
    .rangeBands([0, width], '.1')
    .domain(data.map((d) => d.name))
  let keyRectDomain = data[0].values.map((value, i) => i)
  let keyScaleRect = d3.scale.ordinal()
    .rangeBands([0, keyScale.rangeBand()])
    .domain(keyRectDomain)

  let valueDomainMax = d3.max(data.reduce((values, row) => {
    return values.concat(row.values)
  }, []))
  let valueScale = d3.scale.linear()
    .range([height, 0])
    .domain([0, valueDomainMax])

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
      return d.values
    })
    .enter().append('rect')
    .on('click', () => {
      let event = d3.event
      let groupRectangle = d3.select(event.target.parentNode)
      let dataGroupRectangle = groupRectangle.data()[0]

      svgCircle.selectAll('.arc')
        .data(pie(dataGroupRectangle.values))

      svgCircle.selectAll('path').data(pie(dataGroupRectangle.values))
        .transition()
        .duration(300)
        .attrTween('d', arcTween)

      svgCircle.selectAll('text').data(pie(dataGroupRectangle.values))
        .attr('transform', (d) => `translate(${arcLabel.centroid(d)})`)
        .attr('dy', '.35em')
        .text((d) => d.data)
        .style('fill', '#fff')
    })
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
      return d.values
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

  function arcTween (a) {
    var i = d3.interpolate(this._current, a)
    this._current = i(0)
    return (t) => arc(i(t))
  }
}

drawRoundChar(data[0])
drawHistogram(data)

function handlerMouseMove (tooltip) {
  let event = d3.event

  tooltip
    .style({
      top: event.pageY + 'px',
      left: event.pageX + 'px'
    })
}
})()


