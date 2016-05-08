/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam9pbi1ncmFwaGljLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIDA2MDY4ZWU2ZGRlNjdmNmZlN2ZlP2YwMmUqKioiLCJ3ZWJwYWNrOi8vLy4vYXBwL2pvaW4tZ3JhcGhpYy5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvcm91bmQtY2hhcnQuanMiLCJ3ZWJwYWNrOi8vLy4vYXBwL2hpc3RvZ3JhbS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDA2MDY4ZWU2ZGRlNjdmNmZlN2ZlXG4gKiovIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgUnVzYWsgT2xlZyBvbiAwNy4wNS4yMDE2LlxyXG4gKi9cclxuXHJcbi8qIGdsb2JhbCBkMyovXHJcblxyXG5sZXQgUm91bmRDaGFydCA9IHJlcXVpcmUoJy4vcm91bmQtY2hhcnQuanMnKVxyXG5sZXQgSGlzdG9ncmFtID0gcmVxdWlyZSgnLi9oaXN0b2dyYW0uanMnKVxyXG5cclxubGV0IG1hcmdpbiA9IHt0b3A6IDUwLCBsZWZ0OiAzMCwgYm90dG9tOiA0MCwgcmlnaHQ6IDMwfVxyXG5sZXQgd2lkdGggPSA1MDAgLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodFxyXG5sZXQgaGVpZ2h0ID0gNDAwIC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b21cclxuXHJcbmxldCBkYXRhID0gW1xyXG4gIHtuYW1lOiAnQScsIHZhbHVlOiAnMTUnLCB2YWx1ZTE6ICc0MCcsIHZhbHVlMjogJzEwJ30sXHJcbiAge25hbWU6ICdCJywgdmFsdWU6ICcyMCcsIHZhbHVlMTogJzUwJywgdmFsdWUyOiAnMjAnfSxcclxuICB7bmFtZTogJ0MnLCB2YWx1ZTogJzQwJywgdmFsdWUxOiAnMTEwJywgdmFsdWUyOiAnNDAnfSxcclxuICB7bmFtZTogJ0QnLCB2YWx1ZTogJzE1JywgdmFsdWUxOiAnNScsIHZhbHVlMjogJzEwJ30sXHJcbiAge25hbWU6ICdFJywgdmFsdWU6ICc2MCcsIHZhbHVlMTogJzIwJywgdmFsdWUyOiAnNjAnfSxcclxuICB7bmFtZTogJ0YnLCB2YWx1ZTogJzMwJywgdmFsdWUxOiAnNzAnLCB2YWx1ZTI6ICczMCd9XHJcbl1cclxuZGF0YSA9IGRhdGFJbml0KGRhdGEpXHJcblxyXG5sZXQgY29sb3IgPSBkMy5zY2FsZS5jYXRlZ29yeTEwKClcclxuXHJcbmxldCByb3VuZENoYXIgPSBuZXcgUm91bmRDaGFydChkYXRhWzBdLCBjb2xvciwgd2lkdGgsIGhlaWdodCwgbWFyZ2luKVxyXG5yb3VuZENoYXIuZHJhdygpXHJcblxyXG5hZGRDYWxsVGV4dChyb3VuZENoYXIsICdNb3VzZSBvdmVyIScpXHJcblxyXG5sZXQgaGlzdG9ncmFtID0gbmV3IEhpc3RvZ3JhbShkYXRhLCBjb2xvciwgd2lkdGgsIGhlaWdodCwgbWFyZ2luKVxyXG5oaXN0b2dyYW0uY2FsbGJhY2tCYXJNb3VzZUNsaWNrID0gaGFuZGxlck1vdXNlQ2xpY2tcclxuaGlzdG9ncmFtLmRyYXcoKVxyXG5cclxuYWRkQ2FsbFRleHQoaGlzdG9ncmFtLCAnTW91c2UgY2xpY2shJylcclxuXHJcbi8vICBGdW5jdGlvbiB3YXN0ZWxhbmQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5mdW5jdGlvbiBoYW5kbGVyTW91c2VDbGljayAoKSB7XHJcbiAgbGV0IGV2ZW50ID0gZDMuZXZlbnRcclxuICBsZXQgZ3JvdXBSZWN0YW5nbGUgPSBkMy5zZWxlY3QoZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUpXHJcbiAgLy8gIGdldCBmaXJzdCBlbGVtZW50IGluIHNhbXBsZVxyXG4gIGxldCBkYXRhR3JvdXBSZWN0YW5nbGUgPSBncm91cFJlY3RhbmdsZS5kYXRhKClbMF1cclxuXHJcbiAgcm91bmRDaGFyLnVwZGF0ZURhdGEoZGF0YUdyb3VwUmVjdGFuZ2xlKVxyXG59XHJcblxyXG5mdW5jdGlvbiBkYXRhSW5pdCAoKSB7XHJcbiAgcmV0dXJuIGRhdGEubWFwKChyb3cpID0+IHtcclxuICAgIGxldCB2YWx1ZXMgPSBPYmplY3Qua2V5cyhyb3cpLmZpbHRlcigoa2V5KSA9PiBrZXkgIT09ICduYW1lJykubWFwKChrZXkpID0+ICtyb3dba2V5XSlcclxuICAgIGxldCB0b3RhbCA9IHZhbHVlcy5yZWR1Y2UoKHRvdGFsLCB2YWx1ZSkgPT4gdG90YWwgKyB2YWx1ZSwgMClcclxuICAgIHJldHVybiB7XHJcbiAgICAgIG5hbWU6IHJvdy5uYW1lLFxyXG4gICAgICB2YWx1ZXM6IHZhbHVlcyxcclxuICAgICAgdG90YWw6IHRvdGFsXHJcbiAgICB9XHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkQ2FsbFRleHQgKGdyYXBoaWMsIHRleHQpIHtcclxuICBsZXQgY2FudmFzID0gZ3JhcGhpYy5jYW52YXNcclxuICBjYW52YXMuYXBwZW5kKCd0ZXh0JylcclxuICAgIC5hdHRyKCd4JywgZ3JhcGhpYy53aWR0aCAvIDIpXHJcbiAgICAuYXR0cigneScsIDIwKVxyXG4gICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXHJcbiAgICAudGV4dCh0ZXh0KVxyXG59XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9hcHAvam9pbi1ncmFwaGljLmpzXG4gKiogbW9kdWxlIGlkID0gMFxuICoqIG1vZHVsZSBjaHVua3MgPSA0XG4gKiovIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IFJ1c2FrIE9sZWcgb24gMjIuMDQuMjAxNi5cbiAqL1xuXG4vKiBnbG9iYWwgZDMqL1xuXG5jbGFzcyBSb3VuZENoYXJ0IHtcbiAgY29uc3RydWN0b3IgKGRhdGFSb3csIGNvbG9yLCB3aWR0aCwgaGVpZ2h0LCBtYXJnaW4pIHtcbiAgICBsZXQgcmFkaXVzID0gTWF0aC5taW4od2lkdGgsIGhlaWdodCkgLyAyXG5cbiAgICB0aGlzLmRhdGEgPSBkYXRhUm93XG4gICAgdGhpcy5hcmMgPSBkMy5zdmcuYXJjKClcbiAgICAgIC5vdXRlclJhZGl1cyhyYWRpdXMgLSAxMClcbiAgICAgIC5pbm5lclJhZGl1cygwKVxuICAgIHRoaXMuYXJjTGFyZ2VyID0gZDMuc3ZnLmFyYygpXG4gICAgICAub3V0ZXJSYWRpdXMocmFkaXVzKVxuICAgICAgLmlubmVyUmFkaXVzKDApXG4gICAgdGhpcy5hcmNMYWJlbCA9IGQzLnN2Zy5hcmMoKVxuICAgICAgLm91dGVyUmFkaXVzKHJhZGl1cyAtIDQwKVxuICAgICAgLmlubmVyUmFkaXVzKHJhZGl1cyAtIDQwKVxuICAgIHRoaXMucGllID0gZDMubGF5b3V0LnBpZSgpXG4gICAgICAuc29ydChudWxsKVxuICAgIHRoaXMuY29sb3IgPSBjb2xvclxuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0XG4gICAgdGhpcy53aWR0aCA9IHdpZHRoXG4gICAgdGhpcy5tYXJnaW4gPSBtYXJnaW5cblxuICAgIHRoaXMucGllQ29udGFpbmVyID0gbnVsbFxuICAgIHRoaXMuY2FudmFzID0gbnVsbFxuICB9XG5cbiAgZHJhdyAoKSB7XG4gICAgbGV0IG1hcmdpbiA9IHRoaXMubWFyZ2luXG4gICAgLy8gIENhbnZhc1xuICAgIGxldCBjYW52YXMgPSBkMy5zZWxlY3QoJy5jb250YWluZXInKS5hcHBlbmQoJ3N2ZycpXG4gICAgICAuYXR0cignd2lkdGgnLCB0aGlzLndpZHRoICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQpXG4gICAgICAuYXR0cignaGVpZ2h0JywgdGhpcy5oZWlnaHQgKyBtYXJnaW4udG9wICsgbWFyZ2luLmJvdHRvbSlcbiAgICB0aGlzLmNhbnZhcyA9IGNhbnZhc1xuXG4gICAgbGV0IHBpZUNvbnRhaW5lciA9IGNhbnZhc1xuICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAncGllLWNvbnRhaW5lcicpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgkeyh0aGlzLndpZHRoIC8gMil9LCR7KHRoaXMuaGVpZ2h0IC8gMikgKyBtYXJnaW4ubGVmdH0pYClcblxuICAgIHRoaXMucGllQ29udGFpbmVyID0gcGllQ29udGFpbmVyXG5cbiAgICBsZXQgdG9vbHRpcCA9IGQzLnNlbGVjdCgnYm9keScpLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyKCdjbGFzcycsICd0b29sdGlwJylcblxuICAgIGxldCBoYW5kbGVyTW91c2VPdmVyQXJjID0gdGhpcy5oYW5kbGVyTW91c2VPdmVyLmJpbmQodGhpcywgdG9vbHRpcCwgdGhpcy5hcmNMYXJnZXIpXG4gICAgbGV0IGhhbmRsZXJNb3VzZU91dEFyYyA9IHRoaXMuaGFuZGxlck1vdXNlT3V0LmJpbmQodGhpcywgdG9vbHRpcCwgdGhpcy5hcmMpXG4gICAgbGV0IGFyY3MgPSBwaWVDb250YWluZXIuc2VsZWN0QWxsKCcuYXJjJylcbiAgICAgIC5kYXRhKHRoaXMucGllKHRoaXMuZGF0YS52YWx1ZXMpKVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdhcmMnKVxuICAgICAgLm9uKCdtb3VzZW92ZXInLCBoYW5kbGVyTW91c2VPdmVyQXJjLCBmYWxzZSlcbiAgICAgIC5vbignbW91c2VvdXQnLCBoYW5kbGVyTW91c2VPdXRBcmMpXG5cbiAgICBhcmNzLmFwcGVuZCgncGF0aCcpXG4gICAgICAuYXR0cignZCcsIHRoaXMuYXJjKVxuICAgICAgLmVhY2goZnVuY3Rpb24gKGQpIHsgdGhpcy5fY3VycmVudCA9IGQgfSlcbiAgICAgIC5zdHlsZSgnZmlsbCcsIChkLCBpKSA9PiB0aGlzLmNvbG9yKGkpKVxuXG4gICAgYXJjcy5hcHBlbmQoJ3RleHQnKS5hdHRyKCd0cmFuc2Zvcm0nLCAoZCkgPT4gYHRyYW5zbGF0ZSgke3RoaXMuYXJjTGFiZWwuY2VudHJvaWQoZCl9KWApXG4gICAgICAuYXR0cignZHknLCAnLjM1ZW0nKVxuICAgICAgLnRleHQoKGQpID0+IGQuZGF0YSlcbiAgICAgIC5zdHlsZSgnZmlsbCcsICcjZmZmJylcbiAgfVxuXG4gIHVwZGF0ZURhdGEgKGRhdGFSb3cpIHtcbiAgICBsZXQgcGllQ29udGFpbmVyID0gdGhpcy5waWVDb250YWluZXJcbiAgICAvLyAgY2hlY2sgd2hhdCBkcmF3IG1ldGhvZCBjYWxsZWQgYmVmb3JlXG4gICAgaWYgKCFwaWVDb250YWluZXIpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMuZGF0YSA9IGRhdGFSb3dcbiAgICBsZXQgZGF0YSA9IGRhdGFSb3cudmFsdWVzXG4gICAgbGV0IHBpZSA9IGQzLmxheW91dC5waWUoKVxuICAgICAgLnNvcnQobnVsbClcblxuICAgIHBpZUNvbnRhaW5lci5zZWxlY3RBbGwoJy5hcmMnKVxuICAgICAgLmRhdGEocGllKGRhdGEpKVxuXG4gICAgbGV0IGFyYyA9IHRoaXMuYXJjXG4gICAgcGllQ29udGFpbmVyLnNlbGVjdEFsbCgncGF0aCcpLmRhdGEocGllKGRhdGEpKVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmR1cmF0aW9uKDMwMClcbiAgICAgIC5hdHRyVHdlZW4oJ2QnLCBmdW5jdGlvbiAoYSkge1xuICAgICAgICBsZXQgaSA9IGQzLmludGVycG9sYXRlKHRoaXMuX2N1cnJlbnQsIGEpXG4gICAgICAgIHRoaXMuX2N1cnJlbnQgPSBpKDApXG4gICAgICAgIHJldHVybiAodCkgPT4gYXJjKGkodCkpXG4gICAgICB9KVxuXG4gICAgcGllQ29udGFpbmVyLnNlbGVjdEFsbCgndGV4dCcpLmRhdGEocGllKGRhdGEpKVxuICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCkgPT4gYHRyYW5zbGF0ZSgke3RoaXMuYXJjTGFiZWwuY2VudHJvaWQoZCl9KWApXG4gICAgICAuYXR0cignZHknLCAnLjM1ZW0nKVxuICAgICAgLnRleHQoKGQpID0+IGQuZGF0YSlcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kdXJhdGlvbig4MDApXG4gICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKVxuICB9XG5cbiAgaGFuZGxlck1vdXNlTW92ZSAodG9vbHRpcCkge1xuICAgIGxldCBldmVudCA9IGQzLmV2ZW50XG5cbiAgICB0b29sdGlwXG4gICAgICAuc3R5bGUoe1xuICAgICAgICB0b3A6IGV2ZW50LnBhZ2VZICsgJ3B4JyxcbiAgICAgICAgbGVmdDogZXZlbnQucGFnZVggKyAncHgnXG4gICAgICB9KVxuICB9XG5cbiAgaGFuZGxlck1vdXNlT3ZlciAodG9vbHRpcCwgYXJjTGFyZ2VyLCBlbGVtZW50KSB7XG4gICAgbGV0IGV2ZW50ID0gZDMuZXZlbnRcbiAgICBsZXQgYXJjVGFyZ2V0ID0gZDMuc2VsZWN0KGV2ZW50LnRhcmdldClcbiAgICBsZXQgZGF0YSA9IHRoaXMuZGF0YVxuXG4gICAgYXJjVGFyZ2V0Lm9uKCdtb3VzZW1vdmUnLCB0aGlzLmhhbmRsZXJNb3VzZU1vdmUuYmluZChudWxsLCB0b29sdGlwKSlcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kdXJhdGlvbig0MDApXG4gICAgICAuYXR0cignZCcsIGFyY0xhcmdlcilcblxuICAgIHRvb2x0aXBcbiAgICAgIC5zdHlsZSgndG9wJywgKGV2ZW50LnBhZ2VZKSArICdweCcpXG4gICAgICAuc3R5bGUoJ2xlZnQnLCAoZXZlbnQucGFnZVgpICsgJ3B4JylcbiAgICAgIC5odG1sKGBWYWx1ZTogJHtlbGVtZW50LnZhbHVlfVxuICAgICAgQ29sdW1uOiAke2RhdGEubmFtZX1cbiAgICAgIFRvdGFsOiAke2RhdGEudG90YWx9YClcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kdXJhdGlvbigzMDApXG4gICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKVxuICB9XG5cbiAgaGFuZGxlck1vdXNlT3V0ICh0b29sdGlwLCBhcmMpIHtcbiAgICBsZXQgZXZlbnQgPSBkMy5ldmVudFxuXG4gICAgbGV0IGFyY1RhcmdldCA9IGQzLnNlbGVjdChldmVudC50YXJnZXQpXG4gICAgYXJjVGFyZ2V0Lm9uKCdtb3VzZW1vdmUnLCBudWxsKVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmR1cmF0aW9uKDMwMClcbiAgICAgIC5hdHRyKCdkJywgYXJjKVxuXG4gICAgdG9vbHRpcFxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmR1cmF0aW9uKDMwMClcbiAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSb3VuZENoYXJ0XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYXBwL3JvdW5kLWNoYXJ0LmpzXG4gKiogbW9kdWxlIGlkID0gMVxuICoqIG1vZHVsZSBjaHVua3MgPSA0XG4gKiovIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IFJ1c2FrIE9sZWcgb24gMDcuMDUuMjAxNi5cbiAqL1xuXG4vKiBnbG9iYWwgZDMqL1xuXG5jbGFzcyBIaXN0b2dyYW0ge1xuICBjb25zdHJ1Y3RvciAoZGF0YSwgY29sb3IsIHdpZHRoLCBoZWlnaHQsIG1hcmdpbikge1xuICAgIHRoaXMuZGF0YSA9IGRhdGFcblxuICAgIHRoaXMua2V5U2NhbGUgPSBkMy5zY2FsZS5vcmRpbmFsKClcbiAgICAgIC5yYW5nZUJhbmRzKFswLCB3aWR0aF0sICcuMScpXG4gICAgICAuZG9tYWluKGRhdGEubWFwKChkKSA9PiBkLm5hbWUpKVxuXG4gICAgbGV0IGtleVJlY3REb21haW4gPSBkYXRhWzBdLnZhbHVlcy5tYXAoKHZhbHVlLCBpKSA9PiBpKVxuICAgIHRoaXMua2V5U2NhbGVSZWN0ID0gZDMuc2NhbGUub3JkaW5hbCgpXG4gICAgICAucmFuZ2VCYW5kcyhbMCwgdGhpcy5rZXlTY2FsZS5yYW5nZUJhbmQoKV0pXG4gICAgICAuZG9tYWluKGtleVJlY3REb21haW4pXG4gICAgdGhpcy5rZXlSZWN0RG9tYWluID0ga2V5UmVjdERvbWFpblxuXG4gICAgbGV0IHZhbHVlRG9tYWluTWF4ID0gZDMubWF4KGRhdGEucmVkdWNlKCh2YWx1ZXMsIHJvdykgPT4ge1xuICAgICAgcmV0dXJuIHZhbHVlcy5jb25jYXQocm93LnZhbHVlcylcbiAgICB9LCBbXSkpXG4gICAgdGhpcy52YWx1ZVNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcbiAgICAgIC5yYW5nZShbaGVpZ2h0LCAwXSlcbiAgICAgIC5kb21haW4oWzAsIHZhbHVlRG9tYWluTWF4XSlcblxuICAgIHRoaXMuY29sb3IgPSBjb2xvclxuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0XG4gICAgdGhpcy53aWR0aCA9IHdpZHRoXG4gICAgdGhpcy5tYXJnaW4gPSBtYXJnaW5cblxuICAgIHRoaXMuY2FsbGJhY2tCYXJNb3VzZUNsaWNrICA9IG51bGxcbiAgfVxuXG4gIGRyYXcgKCkge1xuICAgIGxldCBtYXJnaW4gPSB0aGlzLm1hcmdpblxuICAgIC8vICBDYW52YXNcbiAgICBsZXQgY2FudmFzID0gZDMuc2VsZWN0KCcuY29udGFpbmVyJykuYXBwZW5kKCdzdmcnKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy53aWR0aCArIG1hcmdpbi5sZWZ0ICsgbWFyZ2luLnJpZ2h0KVxuICAgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMuaGVpZ2h0ICsgbWFyZ2luLnRvcCArIG1hcmdpbi5ib3R0b20pXG4gICAgdGhpcy5jYW52YXMgPSBjYW52YXNcblxuICAgIGxldCBoaXN0b2dyYW1Db250YWluZXIgPSBjYW52YXMuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7bWFyZ2luLmxlZnR9LCR7bWFyZ2luLnRvcH0pYClcbiAgICAgIC5hdHRyKCdjbGFzcycsICdoaXN0b2dyYW0tY29udGFpbmVyJylcblxuICAgIC8vICBBeGlzIFggYW5kIFlcbiAgICBsZXQgYXhpc1ggPSBkMy5zdmcuYXhpcygpLnNjYWxlKHRoaXMua2V5U2NhbGUpXG4gICAgICAub3JpZW50KCdib3R0b20nKVxuICAgICAgLnRpY2tTaXplKDApXG4gICAgICAudGlja1BhZGRpbmcoMjApXG5cbiAgICBsZXQgYXhpc1kgPSBkMy5zdmcuYXhpcygpLnNjYWxlKHRoaXMudmFsdWVTY2FsZSlcbiAgICAgIC5vcmllbnQoJ2xlZnQnKVxuXG4gICAgaGlzdG9ncmFtQ29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAna2V5IGF4aXMnKVxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwke3RoaXMuaGVpZ2h0fSlgKVxuICAgICAgLmNhbGwoYXhpc1gpXG5cbiAgICBoaXN0b2dyYW1Db250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICd2YWx1ZSBheGlzJylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknKVxuICAgICAgLmNhbGwoYXhpc1kpXG5cbiAgICAvLyAgQmFyXG4gICAgbGV0IGJhckdyb3VwID0gaGlzdG9ncmFtQ29udGFpbmVyLnNlbGVjdEFsbCgnLmJhcnMnKVxuICAgICAgLmRhdGEodGhpcy5kYXRhKVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICcuYmFycycpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQpID0+IGB0cmFuc2xhdGUoJHt0aGlzLmtleVNjYWxlKGQubmFtZSl9LCAwKWApXG5cbiAgICBiYXJHcm91cC5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgLmRhdGEoKGQpID0+IHtcbiAgICAgICAgcmV0dXJuIGQudmFsdWVzXG4gICAgICB9KVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgIC5vbignY2xpY2snLCB0aGlzLmhhbmRsZXJCYXJNb3VzZUNsaWNrLmJpbmQodGhpcykpXG4gICAgICAuYXR0cignY2xhc3MnLCAnYmFyJylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCwgaSkgPT4ge1xuICAgICAgICByZXR1cm4gJ3RyYW5zbGF0ZSgnICsgdGhpcy5rZXlTY2FsZVJlY3QodGhpcy5rZXlSZWN0RG9tYWluW2ldKSArICcsJyArIHRoaXMudmFsdWVTY2FsZShNYXRoLm1heCgwLCBkKSkgKyAnKSdcbiAgICAgIH0pXG4gICAgICAuYXR0cignaGVpZ2h0JywgMClcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kdXJhdGlvbigyMDAwKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy5rZXlTY2FsZVJlY3QucmFuZ2VCYW5kKCkpXG4gICAgICAuYXR0cignaGVpZ2h0JywgKGQpID0+IHtcbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKHRoaXMudmFsdWVTY2FsZShkKSAtIHRoaXMudmFsdWVTY2FsZSgwKSlcbiAgICAgIH0pXG4gICAgICAuYXR0cignZmlsbCcsIChkLCBpKSA9PiB0aGlzLmNvbG9yKHRoaXMua2V5UmVjdERvbWFpbltpXSkpXG5cbiAgICBiYXJHcm91cC5zZWxlY3RBbGwoJ3RleHQnKVxuICAgICAgLmRhdGEoKGQpID0+IHtcbiAgICAgICAgcmV0dXJuIGQudmFsdWVzXG4gICAgICB9KVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCwgaSkgPT4ge1xuICAgICAgICByZXR1cm4gJ3RyYW5zbGF0ZSgnICsgKHRoaXMua2V5U2NhbGVSZWN0KHRoaXMua2V5UmVjdERvbWFpbltpXSkgK1xuICAgICAgICAgIHRoaXMua2V5U2NhbGVSZWN0LnJhbmdlQmFuZCgpIC8gMikgKyAnLCcgK1xuICAgICAgICAgIHRoaXMudmFsdWVTY2FsZShkKSArICcpJ1xuICAgICAgfSlcbiAgICAgIC5hdHRyKCdkeScsIChkKSA9PiB7XG4gICAgICAgIHJldHVybiBkIDwgMCA/ICcxLjBlbScgOiAnLTAuM2VtJ1xuICAgICAgfSlcbiAgICAgIC5zdHlsZSgnZmlsbCcsICcjMDAwJylcbiAgICAgIC5zdHlsZSgndGV4dC1hbmNob3InLCAnbWlkZGxlJylcbiAgICAgIC5zdHlsZSgnZm9udC1zaXplJywgJzEwcHQnKVxuICAgICAgLnRleHQoKGQpID0+IGQpXG4gIH1cblxuICBoYW5kbGVyQmFyTW91c2VDbGljayAoKSB7XG4gICAgaWYgKHRoaXMuY2FsbGJhY2tCYXJNb3VzZUNsaWNrKSB7XG4gICAgICB0aGlzLmNhbGxiYWNrQmFyTW91c2VDbGljaygpXG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSGlzdG9ncmFtXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYXBwL2hpc3RvZ3JhbS5qc1xuICoqIG1vZHVsZSBpZCA9IDJcbiAqKiBtb2R1bGUgY2h1bmtzID0gNFxuICoqLyJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDdkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Iiwic291cmNlUm9vdCI6IiJ9