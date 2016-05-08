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
/***/ function(module, exports) {

	/**
	 * Created by Rusak Oleg on 22.04.2016.
	 */

	/* global d3*/
	(function (){
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
	})()




/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlzdG9ncmFtLXN0YWNrLWhvcml6b250YWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMDYwNjhlZTZkZGU2N2Y2ZmU3ZmU/ZjAyZSoqIiwid2VicGFjazovLy8uL2FwcC9oaXN0b2dyYW0tc3RhY2staG9yaXpvbnRhbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDA2MDY4ZWU2ZGRlNjdmNmZlN2ZlXG4gKiovIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IFJ1c2FrIE9sZWcgb24gMjIuMDQuMjAxNi5cbiAqL1xuXG4vKiBnbG9iYWwgZDMqL1xuKGZ1bmN0aW9uICgpe1xubGV0IGRhdGEgPSBbXG4gIHtuYW1lOiAnQScsIHZhbHVlOiAnMTUnLCB2YWx1ZTE6ICctMTAnfSxcbiAge25hbWU6ICdCJywgdmFsdWU6ICctMjAnLCB2YWx1ZTE6ICctMjAnfSxcbiAge25hbWU6ICdDJywgdmFsdWU6ICc0MCcsIHZhbHVlMTogJzQwJ30sXG4gIHtuYW1lOiAnRCcsIHZhbHVlOiAnLTE1JywgdmFsdWUxOiAnLTEwJ30sXG4gIHtuYW1lOiAnRScsIHZhbHVlOiAnNjAnLCB2YWx1ZTE6ICctNjAnfSxcbiAge25hbWU6ICdGJywgdmFsdWU6ICczMCcsIHZhbHVlMTogJy0zMCd9XG5dXG5cbmxldCBtYXJnaW4gPSB7dG9wOiAyMCwgbGVmdDogMzAsIGJvdHRvbTogNDAsIHJpZ2h0OiAzMH1cbmxldCB3aWR0aCA9IDUwMCAtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0XG5sZXQgaGVpZ2h0ID0gNDAwIC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b21cblxuLy8gIGluaXQgZGF0YVxuZGF0YS5mb3JFYWNoKChkKSA9PiB7XG4gIGQudmFsdWUgPSArZC52YWx1ZVxuICBkLnZhbHVlMSA9ICtkLnZhbHVlMVxufSlcblxubGV0IGRhdGFLZXkgPSBPYmplY3Qua2V5cyhkYXRhWzBdKS5maWx0ZXIoKGspID0+IGsgIT09ICduYW1lJylcbmxldCBkYXRhVmFsdWVQb3NpdGl2ZSA9IFtdXG5sZXQgZGF0YVZhbHVlTmVnYXRpdmUgPSBbXVxuZGF0YUtleS5mb3JFYWNoKChjb2wpID0+IHtcbiAgbGV0IG5lZ2F0aXZlTGF5ZXIgPSBbXVxuICBsZXQgcG9zaXRpdmVMYXllciA9IFtdXG5cbiAgZGF0YS5mb3JFYWNoKChyb3cpID0+IHtcbiAgICBwb3NpdGl2ZUxheWVyLnB1c2goe1xuICAgICAgeDogcm93Lm5hbWUsXG4gICAgICB5OiBNYXRoLm1heCgwLCByb3dbY29sXSlcbiAgICB9KVxuICAgIG5lZ2F0aXZlTGF5ZXIucHVzaCh7XG4gICAgICB4OiByb3cubmFtZSxcbiAgICAgIHk6IE1hdGgubWluKDAsIHJvd1tjb2xdKVxuICAgIH0pXG4gIH0pXG5cbiAgZGF0YVZhbHVlUG9zaXRpdmUucHVzaChwb3NpdGl2ZUxheWVyKVxuICBkYXRhVmFsdWVOZWdhdGl2ZS5wdXNoKG5lZ2F0aXZlTGF5ZXIpXG59KVxuXG4vLyAgaW5pdCBsYXlvdXRcbmxldCBzdGFjayA9IGQzLmxheW91dC5zdGFjaygpXG5sZXQgZGF0YVN0YWNrUG9zaXRpdmUgPSBzdGFjayhkYXRhVmFsdWVQb3NpdGl2ZSlcbmxldCBkYXRhU3RhY2tOZWdhdGl2ZSA9IHN0YWNrKGRhdGFWYWx1ZU5lZ2F0aXZlKVxuXG4vLyAgaW5pdCBzY2FsZVxubGV0IGNvbG9yID0gZDMuc2NhbGUuY2F0ZWdvcnkxMCgpXG5sZXQga2V5U2NhbGUgPSBkMy5zY2FsZS5vcmRpbmFsKClcbiAgLnJhbmdlQmFuZHMoWzAsIGhlaWdodF0sICcuMScpXG4gIC5kb21haW4oZGF0YS5tYXAoKGQpID0+IGQubmFtZSkpXG5cbmxldCBnZXRNYXhWYWx1ZSA9IChkYXRhVmFsdWUpID0+IHtcbiAgcmV0dXJuIGRhdGFWYWx1ZVtkYXRhVmFsdWUubGVuZ3RoIC0gMV0ucmVkdWNlKChtYXgsIGQpID0+IHtcbiAgICBsZXQgc3VtbWFyeSA9IE1hdGguYWJzKGQueSArIGQueTApXG4gICAgcmV0dXJuIHN1bW1hcnkgPiBtYXggPyBzdW1tYXJ5IDogbWF4XG4gIH0sIDApXG59XG5cbmxldCB2YWx1ZURvbWFpbiA9IFsgLWdldE1heFZhbHVlKGRhdGFWYWx1ZU5lZ2F0aXZlKSwgZ2V0TWF4VmFsdWUoZGF0YVZhbHVlUG9zaXRpdmUpIF1cbmxldCB2YWx1ZVNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcbiAgLnJhbmdlKFt3aWR0aCwgMF0pXG4gIC5kb21haW4odmFsdWVEb21haW4pXG5cbi8vICBDYW52YXNcbmxldCBzdmcgPSBkMy5zZWxlY3QoJy5jb250YWluZXInKS5hcHBlbmQoJ3N2ZycpXG4gIC5hdHRyKCd3aWR0aCcsIHdpZHRoICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQpXG4gIC5hdHRyKCdoZWlnaHQnLCBoZWlnaHQgKyBtYXJnaW4udG9wICsgbWFyZ2luLmJvdHRvbSlcblxubGV0IGNhbnZhcyA9IHN2Zy5hcHBlbmQoJ2cnKVxuICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke21hcmdpbi5sZWZ0fSwke21hcmdpbi50b3B9KWApXG5cbi8vICBBeGlzIFggYW5kIFlcbmxldCBheGlzWCA9IGQzLnN2Zy5heGlzKCkuc2NhbGUodmFsdWVTY2FsZSlcbiAgLm9yaWVudCgnYm90dG9tJylcblxubGV0IGF4aXNZID0gZDMuc3ZnLmF4aXMoKS5zY2FsZShrZXlTY2FsZSlcbiAgLm9yaWVudCgnbGVmdCcpXG4gIC50aWNrU2l6ZSgwKVxuICAudGlja1BhZGRpbmcoMjApXG5cbmNhbnZhcy5hcHBlbmQoJ2cnKVxuICAuYXR0cignY2xhc3MnLCAndmFsdWUgYXhpcycpXG4gIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsJHtoZWlnaHR9KWApXG4gIC5jYWxsKGF4aXNYKVxuXG5jYW52YXMuYXBwZW5kKCdnJylcbiAgLmF0dHIoJ2NsYXNzJywgJ2tleSBheGlzJylcbiAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwwKScpXG4gIC5jYWxsKGF4aXNZKVxuXG4vLyAgTGF5ZXJzXG5sZXQgYmFyR3JvdXBQb3NpdGl2ZSA9IGNhbnZhcy5zZWxlY3RBbGwoJy5sYXllcicpXG4gIC5kYXRhKGRhdGFTdGFja1Bvc2l0aXZlKVxuICAuZW50ZXIoKS5hcHBlbmQoJ2cnKVxuICAuYXR0cignY2xhc3MnLCAnbGF5ZXInKVxuICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLCAwKScpXG4gIC5hdHRyKCdmaWxsJywgKGQsIGkpID0+IGNvbG9yKGkpKVxuXG4vLyAgQmFyc1xuYmFyR3JvdXBQb3NpdGl2ZS5zZWxlY3RBbGwoJy5iYXInKVxuICAuZGF0YSgoZCkgPT4gZClcbiAgLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgLmF0dHIoJ2NsYXNzJywgJ2JhcicpXG4gIC5hdHRyKCd0cmFuc2Zvcm0nLCBmdW5jdGlvbiAoZCkge1xuICAgIHJldHVybiBgdHJhbnNsYXRlKCR7dmFsdWVTY2FsZShkLnkgKyBkLnkwKX0sJHtrZXlTY2FsZShkLngpfSlgXG4gIH0pXG4gIC5hdHRyKCd3aWR0aCcsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBNYXRoLmFicyh2YWx1ZVNjYWxlKGQueSkgLSB2YWx1ZVNjYWxlKDApKSB9KVxuICAuYXR0cignaGVpZ2h0Jywga2V5U2NhbGUucmFuZ2VCYW5kKCkpXG5cbi8vICBMYXllcnNcbmxldCBiYXJHcm91cE5lZ2F0aXZlID0gY2FudmFzLnNlbGVjdEFsbCgnLmxheWVyX25lZ2F0aXZlJylcbiAgLmRhdGEoZGF0YVN0YWNrTmVnYXRpdmUpXG4gIC5lbnRlcigpLmFwcGVuZCgnZycpXG4gIC5hdHRyKCdjbGFzcycsICdsYXllcl9uZWdhdGl2ZScpXG4gIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsIDApJylcbiAgLmF0dHIoJ2ZpbGwnLCAoZCwgaSkgPT4gY29sb3IoaSkpXG5cbi8vICBCYXJzXG5iYXJHcm91cE5lZ2F0aXZlLnNlbGVjdEFsbCgnLmJhcicpXG4gIC5kYXRhKChkKSA9PiBkKVxuICAuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuICAuYXR0cignY2xhc3MnLCAnYmFyJylcbiAgLmF0dHIoJ3RyYW5zZm9ybScsIGZ1bmN0aW9uIChkKSB7XG4gICAgcmV0dXJuIGB0cmFuc2xhdGUoJHt2YWx1ZVNjYWxlKGQueTApfSwke2tleVNjYWxlKGQueCl9KWBcbiAgfSlcbiAgLmF0dHIoJ3dpZHRoJywgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIE1hdGguYWJzKHZhbHVlU2NhbGUoZC55KSAtIHZhbHVlU2NhbGUoMCkpIH0pXG4gIC5hdHRyKCdoZWlnaHQnLCBrZXlTY2FsZS5yYW5nZUJhbmQoKSlcbiAgLmF0dHIoJ3RpdGxlJywgJ9Cf0YDQuNCy0LXRgicpXG5cbmxldCBUZXh0R3JvdXBOZWdhdGl2ZSA9IGNhbnZhcy5zZWxlY3RBbGwoJy5sYXllcl9uZWdhdGl2ZV90ZXh0JylcbiAgLmRhdGEoZGF0YVN0YWNrTmVnYXRpdmUpXG4gIC5lbnRlcigpLmFwcGVuZCgnZycpXG4gIC5hdHRyKCdjbGFzcycsICdsYXllcl9uZWdhdGl2ZV90ZXh0JylcbiAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwgMCknKVxuXG4vLyAgVGV4dFxubGV0IHRleHREYXRhID0gZGF0YVN0YWNrTmVnYXRpdmVbZGF0YVN0YWNrTmVnYXRpdmUubGVuZ3RoIC0gMV0uY29uY2F0KGRhdGFTdGFja1Bvc2l0aXZlW2RhdGFTdGFja1Bvc2l0aXZlLmxlbmd0aCAtIDFdKVxuVGV4dEdyb3VwTmVnYXRpdmUuc2VsZWN0QWxsKCd0ZXh0JylcbiAgLmRhdGEodGV4dERhdGEpXG4gIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gIC5hdHRyKCd0cmFuc2Zvcm0nLCBmdW5jdGlvbiAoZCkge1xuICAgIHJldHVybiAndHJhbnNsYXRlKCcgKyB2YWx1ZVNjYWxlKGQueSArIGQueTApICsgJywnICsgKGtleVNjYWxlKGQueCkgKyBrZXlTY2FsZS5yYW5nZUJhbmQoKSAvIDIpICsgJyknXG4gIH0pXG4gIC5hdHRyKCdkeCcsIChkKSA9PiB7XG4gICAgcmV0dXJuIGQueSA8IDAgPyAnMS4wZW0nIDogJy0xLjBlbSdcbiAgfSlcbiAgLmF0dHIoJ2R5JywgJy4zM2VtJylcbiAgLnN0eWxlKCdmaWxsJywgJyMwMDAnKVxuICAuc3R5bGUoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG4gIC5zdHlsZSgnZm9udC1zaXplJywgJzEwcHQnKVxuICAudGV4dCgoZCkgPT4ge1xuICAgIGxldCB2YWx1ZSA9IGQueSArIGQueTBcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyAnJyA6IHZhbHVlXG4gIH0pXG59KSgpXG5cblxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2FwcC9oaXN0b2dyYW0tc3RhY2staG9yaXpvbnRhbC5qc1xuICoqIG1vZHVsZSBpZCA9IDBcbiAqKiBtb2R1bGUgY2h1bmtzID0gM1xuICoqLyJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OyIsInNvdXJjZVJvb3QiOiIifQ==