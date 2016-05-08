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


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlzdG9ncmFtLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIDA2MDY4ZWU2ZGRlNjdmNmZlN2ZlIiwid2VicGFjazovLy8uL2FwcC9oaXN0b2dyYW0tZ3JvdXAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCAwNjA2OGVlNmRkZTY3ZjZmZTdmZVxuICoqLyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IFJ1c2FrIE9sZWcgb24gMjIuMDQuMjAxNi5cclxuICovXHJcblxyXG4vKiBnbG9iYWwgZDMqL1xyXG5sZXQgZGF0YSA9IFtcclxuICB7bmFtZTogJ0EnLCB2YWx1ZTogJzE1JywgdmFsdWUxOiAnLTEwJ30sXHJcbiAge25hbWU6ICdCJywgdmFsdWU6ICctMjAnLCB2YWx1ZTE6ICctMjAnfSxcclxuICB7bmFtZTogJ0MnLCB2YWx1ZTogJzQwJywgdmFsdWUxOiAnLTQwJ30sXHJcbiAge25hbWU6ICdEJywgdmFsdWU6ICctMTUnLCB2YWx1ZTE6ICctMTAnfSxcclxuICB7bmFtZTogJ0UnLCB2YWx1ZTogJzYwJywgdmFsdWUxOiAnLTYwJ30sXHJcbiAge25hbWU6ICdGJywgdmFsdWU6ICczMCcsIHZhbHVlMTogJy0zMCd9XHJcbl1cclxuXHJcbmxldCBtYXJnaW4gPSB7dG9wOiAyMCwgbGVmdDogMzAsIGJvdHRvbTogNDAsIHJpZ2h0OiAzMH1cclxubGV0IHdpZHRoID0gNTAwIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHRcclxubGV0IGhlaWdodCA9IDQwMCAtIG1hcmdpbi50b3AgLSBtYXJnaW4uYm90dG9tXHJcblxyXG4vLyAgaW5pdCBkYXRhXHJcbmRhdGEuZm9yRWFjaCgoZCkgPT4ge1xyXG4gIGQudmFsdWUgPSArZC52YWx1ZVxyXG4gIGQudmFsdWUxID0gK2QudmFsdWUxXHJcbn0pXHJcblxyXG5sZXQgY29sb3IgPSBkMy5zY2FsZS5jYXRlZ29yeTEwKClcclxuXHJcbmxldCBrZXlTY2FsZSA9IGQzLnNjYWxlLm9yZGluYWwoKVxyXG4gIC5yYW5nZUJhbmRzKFswLCB3aWR0aF0sICcuMScpXHJcbiAgLmRvbWFpbihkYXRhLm1hcCgoZCkgPT4gZC5uYW1lKSlcclxubGV0IGtleVJlY3REb21haW4gPSBPYmplY3Qua2V5cyhkYXRhWzBdKS5maWx0ZXIoKGtleSkgPT4ga2V5ICE9PSAnbmFtZScpXHJcbmxldCBrZXlTY2FsZVJlY3QgPSBkMy5zY2FsZS5vcmRpbmFsKClcclxuICAucmFuZ2VCYW5kcyhbMCwga2V5U2NhbGUucmFuZ2VCYW5kKCldKVxyXG4gIC5kb21haW4oa2V5UmVjdERvbWFpbilcclxuXHJcbmxldCB2YWx1ZURvbWFpbiA9IGQzLmV4dGVudChkYXRhLnJlZHVjZSgodmFsdWVzLCByb3csIGluZGV4KSA9PiB7XHJcbiAga2V5UmVjdERvbWFpbi5mb3JFYWNoKChjb2wpID0+IHZhbHVlcy5wdXNoKGRhdGFbaW5kZXhdW2NvbF0pKVxyXG4gIHJldHVybiB2YWx1ZXNcclxufSwgW10pKVxyXG5sZXQgdmFsdWVTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXHJcbiAgLnJhbmdlKFtoZWlnaHQsIDBdKVxyXG4gIC5kb21haW4odmFsdWVEb21haW4pXHJcblxyXG4vLyAgQ2FudmFzXHJcbmxldCBzdmcgPSBkMy5zZWxlY3QoJy5jb250YWluZXInKS5hcHBlbmQoJ3N2ZycpXHJcbiAgLmF0dHIoJ3dpZHRoJywgd2lkdGggKyBtYXJnaW4ubGVmdCArIG1hcmdpbi5yaWdodClcclxuICAuYXR0cignaGVpZ2h0JywgaGVpZ2h0ICsgbWFyZ2luLnRvcCArIG1hcmdpbi5ib3R0b20pXHJcblxyXG5sZXQgY2FudmFzID0gc3ZnLmFwcGVuZCgnZycpXHJcbiAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHttYXJnaW4ubGVmdH0sJHttYXJnaW4udG9wfSlgKVxyXG5cclxuLy8gIEF4aXMgWCBhbmQgWVxyXG5sZXQgYXhpc1ggPSBkMy5zdmcuYXhpcygpLnNjYWxlKGtleVNjYWxlKVxyXG4gIC5vcmllbnQoJ2JvdHRvbScpXHJcbiAgLnRpY2tTaXplKDApXHJcbiAgLnRpY2tQYWRkaW5nKDIwKVxyXG5cclxubGV0IGF4aXNZID0gZDMuc3ZnLmF4aXMoKS5zY2FsZSh2YWx1ZVNjYWxlKVxyXG4gIC5vcmllbnQoJ2xlZnQnKVxyXG5cclxuY2FudmFzLmFwcGVuZCgnZycpXHJcbiAgLmF0dHIoJ2NsYXNzJywgJ2tleSBheGlzJylcclxuICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCR7aGVpZ2h0fSlgKVxyXG4gIC5jYWxsKGF4aXNYKVxyXG5cclxuY2FudmFzLmFwcGVuZCgnZycpXHJcbiAgLmF0dHIoJ2NsYXNzJywgJ3ZhbHVlIGF4aXMnKVxyXG4gIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknKVxyXG4gIC5jYWxsKGF4aXNZKVxyXG5cclxuLy8gIEJhclxyXG5sZXQgYmFyR3JvdXAgPSBjYW52YXMuc2VsZWN0QWxsKCcuYmFycycpXHJcbiAgLmRhdGEoZGF0YSlcclxuICAuZW50ZXIoKS5hcHBlbmQoJ2cnKVxyXG4gIC5hdHRyKCdjbGFzcycsICcuYmFycycpXHJcbiAgLmF0dHIoJ3RyYW5zZm9ybScsIChkKSA9PiBgdHJhbnNsYXRlKCR7a2V5U2NhbGUoZC5uYW1lKX0sIDApYClcclxuXHJcbmJhckdyb3VwLnNlbGVjdEFsbCgnLmJhcicpXHJcbiAgLmRhdGEoKGQpID0+IHtcclxuICAgIHJldHVybiBrZXlSZWN0RG9tYWluLm1hcCgoa2V5KSA9PiBkW2tleV0pXHJcbiAgfSlcclxuICAuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxyXG4gIC5hdHRyKCdjbGFzcycsICdiYXInKVxyXG4gIC5hdHRyKCd0cmFuc2Zvcm0nLCBmdW5jdGlvbiAoZCwgaSkge1xyXG4gICAgcmV0dXJuICd0cmFuc2xhdGUoJyArIGtleVNjYWxlUmVjdChrZXlSZWN0RG9tYWluW2ldKSArICcsJyArIHZhbHVlU2NhbGUoTWF0aC5tYXgoMCwgZCkpICsgJyknXHJcbiAgfSlcclxuICAuYXR0cignaGVpZ2h0JywgMClcclxuICAudHJhbnNpdGlvbigpXHJcbiAgLmR1cmF0aW9uKDIwMDApXHJcbiAgLmF0dHIoJ3dpZHRoJywga2V5U2NhbGVSZWN0LnJhbmdlQmFuZCgpKVxyXG4gIC5hdHRyKCdoZWlnaHQnLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gTWF0aC5hYnModmFsdWVTY2FsZShkKSAtIHZhbHVlU2NhbGUoMCkpIH0pXHJcbiAgLmF0dHIoJ2ZpbGwnLCAoZCwgaSkgPT4gY29sb3Ioa2V5UmVjdERvbWFpbltpXSkpXHJcblxyXG5iYXJHcm91cC5zZWxlY3RBbGwoJ3RleHQnKVxyXG4gIC5kYXRhKChkKSA9PiB7XHJcbiAgICByZXR1cm4ga2V5UmVjdERvbWFpbi5tYXAoKGtleSkgPT4gZFtrZXldKVxyXG4gIH0pXHJcbiAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcclxuICAuYXR0cigndHJhbnNmb3JtJywgZnVuY3Rpb24gKGQsIGkpIHtcclxuICAgIHJldHVybiAndHJhbnNsYXRlKCcgKyAoa2V5U2NhbGVSZWN0KGtleVJlY3REb21haW5baV0pICsga2V5U2NhbGVSZWN0LnJhbmdlQmFuZCgpIC8gMikgKyAnLCcgKyB2YWx1ZVNjYWxlKGQpICsgJyknXHJcbiAgfSlcclxuICAuYXR0cignZHknLCAoZCkgPT4ge1xyXG4gICAgcmV0dXJuIGQgPCAwID8gJzEuMGVtJyA6ICctMC4zZW0nXHJcbiAgfSlcclxuICAuc3R5bGUoJ2ZpbGwnLCAnIzAwMCcpXHJcbiAgLnN0eWxlKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxyXG4gIC5zdHlsZSgnZm9udC1zaXplJywgJzEwcHQnKVxyXG4gIC50ZXh0KChkKSA9PiBkKVxyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYXBwL2hpc3RvZ3JhbS1ncm91cC5qc1xuICoqIG1vZHVsZSBpZCA9IDBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OyIsInNvdXJjZVJvb3QiOiIifQ==