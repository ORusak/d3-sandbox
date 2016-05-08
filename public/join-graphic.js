/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Rusak Oleg on 07.05.2016.
	 */
	
	/* global d3*/
	
	let RoundChart = __webpack_require__(1)
	let Histogram = __webpack_require__(2)
	
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


/***/ },
/* 1 */
/***/ function(module, exports) {

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
	
	    let handlerMouseOverArc = this.handlerMouseOver.bind(this, tooltip, this.arcLarger, this.data)
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
	
	  handlerMouseOver (tooltip, arcLarger, data, element) {
	    let event = d3.event
	    let arcTarget = d3.select(event.target)
	
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


/***/ },
/* 2 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);
//# sourceMappingURL=join-graphic.js.map