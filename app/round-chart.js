/**
 * Created by Rusak Oleg on 22.04.2016.
 */

/* global d3*/

class RoundChart {
  constructor (dataRow, color, width, height, margin) {
    let radius = Math.min(width, height) / 2

    this.data = dataRow
    this.arc = d3.svg.arc()
      .outerRadius(radius - 10)
      .innerRadius(0)
    this.arcLarger = d3.svg.arc()
      .outerRadius(radius)
      .innerRadius(0)
    this.arcLabel = d3.svg.arc()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40)
    this.pie = d3.layout.pie()
      .sort(null)
    this.color = color
    this.height = height
    this.width = width
    this.margin = margin

    this.pieContainer = null
    this.canvas = null
  }

  draw () {
    let margin = this.margin
    //  Canvas
    let canvas = d3.select('.container').append('svg')
      .attr('width', this.width + margin.left + margin.right)
      .attr('height', this.height + margin.top + margin.bottom)
    this.canvas = canvas

    let pieContainer = canvas
      .append('g')
      .attr('class', 'pie-container')
      .attr('transform', `translate(${(this.width / 2)},${(this.height / 2) + margin.left})`)

    this.pieContainer = pieContainer

    let tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')

    let handlerMouseOverArc = this.handlerMouseOver.bind(this, tooltip, this.arcLarger)
    let handlerMouseOutArc = this.handlerMouseOut.bind(this, tooltip, this.arc)
    let arcs = pieContainer.selectAll('.arc')
      .data(this.pie(this.data.values))
      .enter().append('g')
      .attr('class', 'arc')
      .on('mouseover', handlerMouseOverArc, false)
      .on('mouseout', handlerMouseOutArc)

    arcs.append('path')
      .attr('d', this.arc)
      .each(function (d) { this._current = d })
      .style('fill', (d, i) => this.color(i))

    arcs.append('text').attr('transform', (d) => `translate(${this.arcLabel.centroid(d)})`)
      .attr('dy', '.35em')
      .text((d) => d.data)
      .style('fill', '#fff')
  }

  updateData (dataRow) {
    let pieContainer = this.pieContainer
    //  check what draw method called before
    if (!pieContainer) {
      return
    }

    this.data = dataRow
    let data = dataRow.values
    let pie = d3.layout.pie()
      .sort(null)

    pieContainer.selectAll('.arc')
      .data(pie(data))

    let arc = this.arc
    pieContainer.selectAll('path').data(pie(data))
      .transition()
      .duration(300)
      .attrTween('d', function (a) {
        let i = d3.interpolate(this._current, a)
        this._current = i(0)
        return (t) => arc(i(t))
      })

    pieContainer.selectAll('text').data(pie(data))
      .style('opacity', 0)
      .attr('transform', (d) => `translate(${this.arcLabel.centroid(d)})`)
      .attr('dy', '.35em')
      .text((d) => d.data)
      .transition()
      .duration(800)
      .style('opacity', 1)
  }

  handlerMouseMove (tooltip) {
    let event = d3.event

    tooltip
      .style({
        top: event.pageY + 'px',
        left: event.pageX + 'px'
      })
  }

  handlerMouseOver (tooltip, arcLarger, element) {
    let event = d3.event
    let arcTarget = d3.select(event.target)
    let data = this.data

    arcTarget.on('mousemove', this.handlerMouseMove.bind(null, tooltip))
      .transition()
      .duration(400)
      .attr('d', arcLarger)

    tooltip
      .style('top', (event.pageY) + 'px')
      .style('left', (event.pageX) + 'px')
      .html(`Value: ${element.value}
      Column: ${data.name}
      Total: ${data.total}`)
      .transition()
      .duration(300)
      .style('opacity', 1)
  }

  handlerMouseOut (tooltip, arc) {
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
  }
}

module.exports = RoundChart
