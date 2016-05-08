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
	  .rangeBands([0, width], '.1')
	  .domain(data.map((d) => d.name))

	let getMaxValue = (dataValue) => {
	  return dataValue[dataValue.length - 1].reduce((max, d) => {
	    let summary = Math.abs(d.y + d.y0)
	    return summary > max ? summary : max
	  }, 0)
	}

	let valueDomain = [ -getMaxValue(dataValueNegative), getMaxValue(dataValuePositive) ]
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
	    return `translate(${keyScale(d.x)},${valueScale(d.y + d.y0)})`
	  })
	  .attr('width', keyScale.rangeBand())
	  .attr('height', function (d) { return Math.abs(valueScale(d.y) - valueScale(0)) })

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
	    return `translate(${keyScale(d.x)},${valueScale(d.y0)})`
	  })
	  .attr('width', keyScale.rangeBand())
	  .attr('height', function (d) { return Math.abs(valueScale(d.y) - valueScale(0)) })
	  .attr('title', 'Привет')

	let TextGroupNegative = canvas.selectAll('.layer_negative_text')
	  .data(dataStackNegative)
	  .enter().append('g')
	  .attr('class', 'layer_negative_text')
	  .attr('transform', 'translate(0, 0)')

	let textData = dataStackNegative[dataStackNegative.length - 1].concat(dataStackPositive[dataStackPositive.length - 1])
	TextGroupNegative.selectAll('text')
	  .data(textData)
	  .enter().append('text')
	  .attr('transform', function (d) {
	    return 'translate(' + (keyScale(d.x) + keyScale.rangeBand() / 2) + ',' + valueScale(d.y + d.y0) + ')'
	  })
	  .attr('dy', (d) => {
	    return d.y < 0 ? '1.0em' : '-0.3em'
	  })
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlzdG9ncmFtLXN0YWNrLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIDA2MDY4ZWU2ZGRlNjdmNmZlN2ZlP2YwMmUqIiwid2VicGFjazovLy8uL2FwcC9oaXN0b2dyYW0tc3RhY2suanMiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCAwNjA2OGVlNmRkZTY3ZjZmZTdmZVxuICoqLyIsIi8qKlxuICogQ3JlYXRlZCBieSBSdXNhayBPbGVnIG9uIDIyLjA0LjIwMTYuXG4gKi9cblxuLyogZ2xvYmFsIGQzKi9cbihmdW5jdGlvbiAoKXtcbmxldCBkYXRhID0gW1xuICB7bmFtZTogJ0EnLCB2YWx1ZTogJzE1JywgdmFsdWUxOiAnLTEwJ30sXG4gIHtuYW1lOiAnQicsIHZhbHVlOiAnLTIwJywgdmFsdWUxOiAnLTIwJ30sXG4gIHtuYW1lOiAnQycsIHZhbHVlOiAnNDAnLCB2YWx1ZTE6ICc0MCd9LFxuICB7bmFtZTogJ0QnLCB2YWx1ZTogJy0xNScsIHZhbHVlMTogJy0xMCd9LFxuICB7bmFtZTogJ0UnLCB2YWx1ZTogJzYwJywgdmFsdWUxOiAnLTYwJ30sXG4gIHtuYW1lOiAnRicsIHZhbHVlOiAnMzAnLCB2YWx1ZTE6ICctMzAnfVxuXVxuXG5sZXQgbWFyZ2luID0ge3RvcDogMjAsIGxlZnQ6IDMwLCBib3R0b206IDQwLCByaWdodDogMzB9XG5sZXQgd2lkdGggPSA1MDAgLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodFxubGV0IGhlaWdodCA9IDQwMCAtIG1hcmdpbi50b3AgLSBtYXJnaW4uYm90dG9tXG5cbi8vICBpbml0IGRhdGFcbmRhdGEuZm9yRWFjaCgoZCkgPT4ge1xuICBkLnZhbHVlID0gK2QudmFsdWVcbiAgZC52YWx1ZTEgPSArZC52YWx1ZTFcbn0pXG5cbmxldCBkYXRhS2V5ID0gT2JqZWN0LmtleXMoZGF0YVswXSkuZmlsdGVyKChrKSA9PiBrICE9PSAnbmFtZScpXG5sZXQgZGF0YVZhbHVlUG9zaXRpdmUgPSBbXVxubGV0IGRhdGFWYWx1ZU5lZ2F0aXZlID0gW11cbmRhdGFLZXkuZm9yRWFjaCgoY29sKSA9PiB7XG4gIGxldCBuZWdhdGl2ZUxheWVyID0gW11cbiAgbGV0IHBvc2l0aXZlTGF5ZXIgPSBbXVxuXG4gIGRhdGEuZm9yRWFjaCgocm93KSA9PiB7XG4gICAgcG9zaXRpdmVMYXllci5wdXNoKHtcbiAgICAgIHg6IHJvdy5uYW1lLFxuICAgICAgeTogTWF0aC5tYXgoMCwgcm93W2NvbF0pXG4gICAgfSlcbiAgICBuZWdhdGl2ZUxheWVyLnB1c2goe1xuICAgICAgeDogcm93Lm5hbWUsXG4gICAgICB5OiBNYXRoLm1pbigwLCByb3dbY29sXSlcbiAgICB9KVxuICB9KVxuXG4gIGRhdGFWYWx1ZVBvc2l0aXZlLnB1c2gocG9zaXRpdmVMYXllcilcbiAgZGF0YVZhbHVlTmVnYXRpdmUucHVzaChuZWdhdGl2ZUxheWVyKVxufSlcblxuLy8gIGluaXQgbGF5b3V0XG5sZXQgc3RhY2sgPSBkMy5sYXlvdXQuc3RhY2soKVxubGV0IGRhdGFTdGFja1Bvc2l0aXZlID0gc3RhY2soZGF0YVZhbHVlUG9zaXRpdmUpXG5sZXQgZGF0YVN0YWNrTmVnYXRpdmUgPSBzdGFjayhkYXRhVmFsdWVOZWdhdGl2ZSlcblxuLy8gIGluaXQgc2NhbGVcbmxldCBjb2xvciA9IGQzLnNjYWxlLmNhdGVnb3J5MTAoKVxubGV0IGtleVNjYWxlID0gZDMuc2NhbGUub3JkaW5hbCgpXG4gIC5yYW5nZUJhbmRzKFswLCB3aWR0aF0sICcuMScpXG4gIC5kb21haW4oZGF0YS5tYXAoKGQpID0+IGQubmFtZSkpXG5cbmxldCBnZXRNYXhWYWx1ZSA9IChkYXRhVmFsdWUpID0+IHtcbiAgcmV0dXJuIGRhdGFWYWx1ZVtkYXRhVmFsdWUubGVuZ3RoIC0gMV0ucmVkdWNlKChtYXgsIGQpID0+IHtcbiAgICBsZXQgc3VtbWFyeSA9IE1hdGguYWJzKGQueSArIGQueTApXG4gICAgcmV0dXJuIHN1bW1hcnkgPiBtYXggPyBzdW1tYXJ5IDogbWF4XG4gIH0sIDApXG59XG5cbmxldCB2YWx1ZURvbWFpbiA9IFsgLWdldE1heFZhbHVlKGRhdGFWYWx1ZU5lZ2F0aXZlKSwgZ2V0TWF4VmFsdWUoZGF0YVZhbHVlUG9zaXRpdmUpIF1cbmxldCB2YWx1ZVNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcbiAgLnJhbmdlKFtoZWlnaHQsIDBdKVxuICAuZG9tYWluKHZhbHVlRG9tYWluKVxuXG4vLyAgQ2FudmFzXG5sZXQgc3ZnID0gZDMuc2VsZWN0KCcuY29udGFpbmVyJykuYXBwZW5kKCdzdmcnKVxuICAuYXR0cignd2lkdGgnLCB3aWR0aCArIG1hcmdpbi5sZWZ0ICsgbWFyZ2luLnJpZ2h0KVxuICAuYXR0cignaGVpZ2h0JywgaGVpZ2h0ICsgbWFyZ2luLnRvcCArIG1hcmdpbi5ib3R0b20pXG5cbmxldCBjYW52YXMgPSBzdmcuYXBwZW5kKCdnJylcbiAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHttYXJnaW4ubGVmdH0sJHttYXJnaW4udG9wfSlgKVxuXG4vLyAgQXhpcyBYIGFuZCBZXG5sZXQgYXhpc1ggPSBkMy5zdmcuYXhpcygpLnNjYWxlKGtleVNjYWxlKVxuICAub3JpZW50KCdib3R0b20nKVxuICAudGlja1NpemUoMClcbiAgLnRpY2tQYWRkaW5nKDIwKVxuXG5sZXQgYXhpc1kgPSBkMy5zdmcuYXhpcygpLnNjYWxlKHZhbHVlU2NhbGUpXG4gIC5vcmllbnQoJ2xlZnQnKVxuXG5jYW52YXMuYXBwZW5kKCdnJylcbiAgLmF0dHIoJ2NsYXNzJywgJ2tleSBheGlzJylcbiAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwke2hlaWdodH0pYClcbiAgLmNhbGwoYXhpc1gpXG5cbmNhbnZhcy5hcHBlbmQoJ2cnKVxuICAuYXR0cignY2xhc3MnLCAndmFsdWUgYXhpcycpXG4gIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknKVxuICAuY2FsbChheGlzWSlcblxuLy8gIExheWVyc1xubGV0IGJhckdyb3VwUG9zaXRpdmUgPSBjYW52YXMuc2VsZWN0QWxsKCcubGF5ZXInKVxuICAuZGF0YShkYXRhU3RhY2tQb3NpdGl2ZSlcbiAgLmVudGVyKCkuYXBwZW5kKCdnJylcbiAgLmF0dHIoJ2NsYXNzJywgJ2xheWVyJylcbiAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwgMCknKVxuICAuYXR0cignZmlsbCcsIChkLCBpKSA9PiBjb2xvcihpKSlcblxuLy8gIEJhcnNcbmJhckdyb3VwUG9zaXRpdmUuc2VsZWN0QWxsKCcuYmFyJylcbiAgLmRhdGEoKGQpID0+IGQpXG4gIC5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG4gIC5hdHRyKCdjbGFzcycsICdiYXInKVxuICAuYXR0cigndHJhbnNmb3JtJywgZnVuY3Rpb24gKGQpIHtcbiAgICByZXR1cm4gYHRyYW5zbGF0ZSgke2tleVNjYWxlKGQueCl9LCR7dmFsdWVTY2FsZShkLnkgKyBkLnkwKX0pYFxuICB9KVxuICAuYXR0cignd2lkdGgnLCBrZXlTY2FsZS5yYW5nZUJhbmQoKSlcbiAgLmF0dHIoJ2hlaWdodCcsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBNYXRoLmFicyh2YWx1ZVNjYWxlKGQueSkgLSB2YWx1ZVNjYWxlKDApKSB9KVxuXG4vLyAgTGF5ZXJzXG5sZXQgYmFyR3JvdXBOZWdhdGl2ZSA9IGNhbnZhcy5zZWxlY3RBbGwoJy5sYXllcl9uZWdhdGl2ZScpXG4gIC5kYXRhKGRhdGFTdGFja05lZ2F0aXZlKVxuICAuZW50ZXIoKS5hcHBlbmQoJ2cnKVxuICAuYXR0cignY2xhc3MnLCAnbGF5ZXJfbmVnYXRpdmUnKVxuICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLCAwKScpXG4gIC5hdHRyKCdmaWxsJywgKGQsIGkpID0+IGNvbG9yKGkpKVxuXG4vLyAgQmFyc1xuYmFyR3JvdXBOZWdhdGl2ZS5zZWxlY3RBbGwoJy5iYXInKVxuICAuZGF0YSgoZCkgPT4gZClcbiAgLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgLmF0dHIoJ2NsYXNzJywgJ2JhcicpXG4gIC5hdHRyKCd0cmFuc2Zvcm0nLCBmdW5jdGlvbiAoZCkge1xuICAgIHJldHVybiBgdHJhbnNsYXRlKCR7a2V5U2NhbGUoZC54KX0sJHt2YWx1ZVNjYWxlKGQueTApfSlgXG4gIH0pXG4gIC5hdHRyKCd3aWR0aCcsIGtleVNjYWxlLnJhbmdlQmFuZCgpKVxuICAuYXR0cignaGVpZ2h0JywgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIE1hdGguYWJzKHZhbHVlU2NhbGUoZC55KSAtIHZhbHVlU2NhbGUoMCkpIH0pXG4gIC5hdHRyKCd0aXRsZScsICfQn9GA0LjQstC10YInKVxuXG5sZXQgVGV4dEdyb3VwTmVnYXRpdmUgPSBjYW52YXMuc2VsZWN0QWxsKCcubGF5ZXJfbmVnYXRpdmVfdGV4dCcpXG4gIC5kYXRhKGRhdGFTdGFja05lZ2F0aXZlKVxuICAuZW50ZXIoKS5hcHBlbmQoJ2cnKVxuICAuYXR0cignY2xhc3MnLCAnbGF5ZXJfbmVnYXRpdmVfdGV4dCcpXG4gIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsIDApJylcblxubGV0IHRleHREYXRhID0gZGF0YVN0YWNrTmVnYXRpdmVbZGF0YVN0YWNrTmVnYXRpdmUubGVuZ3RoIC0gMV0uY29uY2F0KGRhdGFTdGFja1Bvc2l0aXZlW2RhdGFTdGFja1Bvc2l0aXZlLmxlbmd0aCAtIDFdKVxuVGV4dEdyb3VwTmVnYXRpdmUuc2VsZWN0QWxsKCd0ZXh0JylcbiAgLmRhdGEodGV4dERhdGEpXG4gIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gIC5hdHRyKCd0cmFuc2Zvcm0nLCBmdW5jdGlvbiAoZCkge1xuICAgIHJldHVybiAndHJhbnNsYXRlKCcgKyAoa2V5U2NhbGUoZC54KSArIGtleVNjYWxlLnJhbmdlQmFuZCgpIC8gMikgKyAnLCcgKyB2YWx1ZVNjYWxlKGQueSArIGQueTApICsgJyknXG4gIH0pXG4gIC5hdHRyKCdkeScsIChkKSA9PiB7XG4gICAgcmV0dXJuIGQueSA8IDAgPyAnMS4wZW0nIDogJy0wLjNlbSdcbiAgfSlcbiAgLnN0eWxlKCdmaWxsJywgJyMwMDAnKVxuICAuc3R5bGUoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG4gIC5zdHlsZSgnZm9udC1zaXplJywgJzEwcHQnKVxuICAudGV4dCgoZCkgPT4ge1xuICAgIGxldCB2YWx1ZSA9IGQueSArIGQueTBcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyAnJyA6IHZhbHVlXG4gIH0pXG59KSgpXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYXBwL2hpc3RvZ3JhbS1zdGFjay5qc1xuICoqIG1vZHVsZSBpZCA9IDBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMlxuICoqLyJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OzsiLCJzb3VyY2VSb290IjoiIn0=