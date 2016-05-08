/**
 * Created by Rusak Oleg on 07.05.2016.
 */

/* global d3*/

class Histogram {
  constructor (data, color, width, height, margin) {
    this.data = data

    this.keyScale = d3.scale.ordinal()
      .rangeBands([0, width], '.1')
      .domain(data.map((d) => d.name))

    let keyRectDomain = data[0].values.map((value, i) => i)
    this.keyScaleRect = d3.scale.ordinal()
      .rangeBands([0, this.keyScale.rangeBand()])
      .domain(keyRectDomain)
    this.keyRectDomain = keyRectDomain

    let valueDomainMax = d3.max(data.reduce((values, row) => {
      return values.concat(row.values)
    }, []))
    this.valueScale = d3.scale.linear()
      .range([height, 0])
      .domain([0, valueDomainMax])

    this.color = color
    this.height = height
    this.width = width
    this.margin = margin

    this.callbackBarMouseClick  = null
  }

  draw () {
    let margin = this.margin
    //  Canvas
    let canvas = d3.select('.container').append('svg')
      .attr('width', this.width + margin.left + margin.right)
      .attr('height', this.height + margin.top + margin.bottom)
    this.canvas = canvas

    let histogramContainer = canvas.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .attr('class', 'histogram-container')

    //  Axis X and Y
    let axisX = d3.svg.axis().scale(this.keyScale)
      .orient('bottom')
      .tickSize(0)
      .tickPadding(20)

    let axisY = d3.svg.axis().scale(this.valueScale)
      .orient('left')

    histogramContainer.append('g')
      .attr('class', 'key axis')
      .attr('transform', `translate(0,${this.height})`)
      .call(axisX)

    histogramContainer.append('g')
      .attr('class', 'value axis')
      .attr('transform', 'translate(0,0)')
      .call(axisY)

    //  Bar
    let barGroup = histogramContainer.selectAll('.bars')
      .data(this.data)
      .enter().append('g')
      .attr('class', '.bars')
      .attr('transform', (d) => `translate(${this.keyScale(d.name)}, 0)`)

    barGroup.selectAll('.bar')
      .data((d) => {
        return d.values
      })
      .enter().append('rect')
      .on('click', this.handlerBarMouseClick.bind(this))
      .attr('class', 'bar')
      .attr('transform', (d, i) => {
        return 'translate(' + this.keyScaleRect(this.keyRectDomain[i]) + ',' + this.valueScale(Math.max(0, d)) + ')'
      })
      .attr('height', 0)
      .transition()
      .duration(2000)
      .attr('width', this.keyScaleRect.rangeBand())
      .attr('height', (d) => {
        return Math.abs(this.valueScale(d) - this.valueScale(0))
      })
      .attr('fill', (d, i) => this.color(this.keyRectDomain[i]))

    barGroup.selectAll('text')
      .data((d) => {
        return d.values
      })
      .enter().append('text')
      .attr('transform', (d, i) => {
        return 'translate(' + (this.keyScaleRect(this.keyRectDomain[i]) +
          this.keyScaleRect.rangeBand() / 2) + ',' +
          this.valueScale(d) + ')'
      })
      .attr('dy', (d) => {
        return d < 0 ? '1.0em' : '-0.3em'
      })
      .style('fill', '#000')
      .style('text-anchor', 'middle')
      .style('font-size', '10pt')
      .text((d) => d)
  }

  handlerBarMouseClick () {
    if (this.callbackBarMouseClick) {
      this.callbackBarMouseClick()
    }
  }
}

module.exports = Histogram
