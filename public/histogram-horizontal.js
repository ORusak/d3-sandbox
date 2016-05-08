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
	  .rangeBands([0, height], '.1')
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
	  .range([0, width])
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

	//  Bar
	let barGroup = canvas.selectAll('.bars')
	  .data(data)
	  .enter().append('g')
	  .attr('class', '.bars')
	  .attr('transform', (d) => `translate(0, ${keyScale(d.name)})`)

	barGroup.selectAll('.bar')
	  .data((d) => {
	    return keyRectDomain.map((key) => d[key])
	  })
	  .enter().append('rect')
	  .attr('class', 'bar')
	  .attr('transform', function (d, i) {
	    return 'translate(' + valueScale(Math.min(0, d)) + ',' + keyScaleRect(keyRectDomain[i]) + ')'
	  })
	  .attr('width', function (d) { return Math.abs(valueScale(d) - valueScale(0)) })
	  .attr('height', keyScaleRect.rangeBand())
	  .attr('fill', (d, i) => color(keyRectDomain[i]))

	barGroup.selectAll('text')
	  .data((d) => {
	    return keyRectDomain.map((key) => d[key])
	  })
	  .enter().append('text')
	  .attr('transform', function (d, i) {
	    return 'translate(' + valueScale(d) + ',' + (keyScaleRect(keyRectDomain[i]) + keyScaleRect.rangeBand() / 2) + ')'
	  })
	  .attr('dx', (d) => {
	    return d < 0 ? '-1.0em' : '1.0em'
	  })
	  .attr('dy', '.33em')
	  .style('fill', '#000')
	  .style('text-anchor', 'middle')
	  .style('font-size', '10pt')
	  .text((d) => d)
	})()


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlzdG9ncmFtLWhvcml6b250YWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMDYwNjhlZTZkZGU2N2Y2ZmU3ZmU/ZjAyZSIsIndlYnBhY2s6Ly8vLi9hcHAvaGlzdG9ncmFtLWdyb3VwLWhvcml6b250YWwuanMiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCAwNjA2OGVlNmRkZTY3ZjZmZTdmZVxuICoqLyIsIi8qKlxuICogQ3JlYXRlZCBieSBSdXNhayBPbGVnIG9uIDIyLjA0LjIwMTYuXG4gKi9cblxuLyogZ2xvYmFsIGQzKi9cbihmdW5jdGlvbiAoKXtcbmxldCBkYXRhID0gW1xuICB7bmFtZTogJ0EnLCB2YWx1ZTogJzE1JywgdmFsdWUxOiAnLTEwJ30sXG4gIHtuYW1lOiAnQicsIHZhbHVlOiAnLTIwJywgdmFsdWUxOiAnLTIwJ30sXG4gIHtuYW1lOiAnQycsIHZhbHVlOiAnNDAnLCB2YWx1ZTE6ICctNDAnfSxcbiAge25hbWU6ICdEJywgdmFsdWU6ICctMTUnLCB2YWx1ZTE6ICctMTAnfSxcbiAge25hbWU6ICdFJywgdmFsdWU6ICc2MCcsIHZhbHVlMTogJy02MCd9LFxuICB7bmFtZTogJ0YnLCB2YWx1ZTogJzMwJywgdmFsdWUxOiAnLTMwJ31cbl1cblxubGV0IG1hcmdpbiA9IHt0b3A6IDIwLCBsZWZ0OiAzMCwgYm90dG9tOiA0MCwgcmlnaHQ6IDMwfVxubGV0IHdpZHRoID0gNTAwIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHRcbmxldCBoZWlnaHQgPSA0MDAgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbVxuXG4vLyAgaW5pdCBkYXRhXG5kYXRhLmZvckVhY2goKGQpID0+IHtcbiAgZC52YWx1ZSA9ICtkLnZhbHVlXG4gIGQudmFsdWUxID0gK2QudmFsdWUxXG59KVxuXG5sZXQgY29sb3IgPSBkMy5zY2FsZS5jYXRlZ29yeTEwKClcblxubGV0IGtleVNjYWxlID0gZDMuc2NhbGUub3JkaW5hbCgpXG4gIC5yYW5nZUJhbmRzKFswLCBoZWlnaHRdLCAnLjEnKVxuICAuZG9tYWluKGRhdGEubWFwKChkKSA9PiBkLm5hbWUpKVxubGV0IGtleVJlY3REb21haW4gPSBPYmplY3Qua2V5cyhkYXRhWzBdKS5maWx0ZXIoKGtleSkgPT4ga2V5ICE9PSAnbmFtZScpXG5sZXQga2V5U2NhbGVSZWN0ID0gZDMuc2NhbGUub3JkaW5hbCgpXG4gIC5yYW5nZUJhbmRzKFswLCBrZXlTY2FsZS5yYW5nZUJhbmQoKV0pXG4gIC5kb21haW4oa2V5UmVjdERvbWFpbilcblxubGV0IHZhbHVlRG9tYWluID0gZDMuZXh0ZW50KGRhdGEucmVkdWNlKCh2YWx1ZXMsIHJvdywgaW5kZXgpID0+IHtcbiAga2V5UmVjdERvbWFpbi5mb3JFYWNoKChjb2wpID0+IHZhbHVlcy5wdXNoKGRhdGFbaW5kZXhdW2NvbF0pKVxuICByZXR1cm4gdmFsdWVzXG59LCBbXSkpXG5sZXQgdmFsdWVTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG4gIC5yYW5nZShbMCwgd2lkdGhdKVxuICAuZG9tYWluKHZhbHVlRG9tYWluKVxuXG4vLyAgQ2FudmFzXG5sZXQgc3ZnID0gZDMuc2VsZWN0KCcuY29udGFpbmVyJykuYXBwZW5kKCdzdmcnKVxuICAuYXR0cignd2lkdGgnLCB3aWR0aCArIG1hcmdpbi5sZWZ0ICsgbWFyZ2luLnJpZ2h0KVxuICAuYXR0cignaGVpZ2h0JywgaGVpZ2h0ICsgbWFyZ2luLnRvcCArIG1hcmdpbi5ib3R0b20pXG5cbmxldCBjYW52YXMgPSBzdmcuYXBwZW5kKCdnJylcbiAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHttYXJnaW4ubGVmdH0sJHttYXJnaW4udG9wfSlgKVxuXG4vLyAgQXhpcyBYIGFuZCBZXG5sZXQgYXhpc1ggPSBkMy5zdmcuYXhpcygpLnNjYWxlKHZhbHVlU2NhbGUpXG4gIC5vcmllbnQoJ2JvdHRvbScpXG5cbmxldCBheGlzWSA9IGQzLnN2Zy5heGlzKCkuc2NhbGUoa2V5U2NhbGUpXG4gIC5vcmllbnQoJ2xlZnQnKVxuICAudGlja1NpemUoMClcbiAgLnRpY2tQYWRkaW5nKDIwKVxuXG5jYW52YXMuYXBwZW5kKCdnJylcbiAgLmF0dHIoJ2NsYXNzJywgJ3ZhbHVlIGF4aXMnKVxuICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCR7aGVpZ2h0fSlgKVxuICAuY2FsbChheGlzWClcblxuY2FudmFzLmFwcGVuZCgnZycpXG4gIC5hdHRyKCdjbGFzcycsICdrZXkgYXhpcycpXG4gIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknKVxuICAuY2FsbChheGlzWSlcblxuLy8gIEJhclxubGV0IGJhckdyb3VwID0gY2FudmFzLnNlbGVjdEFsbCgnLmJhcnMnKVxuICAuZGF0YShkYXRhKVxuICAuZW50ZXIoKS5hcHBlbmQoJ2cnKVxuICAuYXR0cignY2xhc3MnLCAnLmJhcnMnKVxuICAuYXR0cigndHJhbnNmb3JtJywgKGQpID0+IGB0cmFuc2xhdGUoMCwgJHtrZXlTY2FsZShkLm5hbWUpfSlgKVxuXG5iYXJHcm91cC5zZWxlY3RBbGwoJy5iYXInKVxuICAuZGF0YSgoZCkgPT4ge1xuICAgIHJldHVybiBrZXlSZWN0RG9tYWluLm1hcCgoa2V5KSA9PiBkW2tleV0pXG4gIH0pXG4gIC5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG4gIC5hdHRyKCdjbGFzcycsICdiYXInKVxuICAuYXR0cigndHJhbnNmb3JtJywgZnVuY3Rpb24gKGQsIGkpIHtcbiAgICByZXR1cm4gJ3RyYW5zbGF0ZSgnICsgdmFsdWVTY2FsZShNYXRoLm1pbigwLCBkKSkgKyAnLCcgKyBrZXlTY2FsZVJlY3Qoa2V5UmVjdERvbWFpbltpXSkgKyAnKSdcbiAgfSlcbiAgLmF0dHIoJ3dpZHRoJywgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIE1hdGguYWJzKHZhbHVlU2NhbGUoZCkgLSB2YWx1ZVNjYWxlKDApKSB9KVxuICAuYXR0cignaGVpZ2h0Jywga2V5U2NhbGVSZWN0LnJhbmdlQmFuZCgpKVxuICAuYXR0cignZmlsbCcsIChkLCBpKSA9PiBjb2xvcihrZXlSZWN0RG9tYWluW2ldKSlcblxuYmFyR3JvdXAuc2VsZWN0QWxsKCd0ZXh0JylcbiAgLmRhdGEoKGQpID0+IHtcbiAgICByZXR1cm4ga2V5UmVjdERvbWFpbi5tYXAoKGtleSkgPT4gZFtrZXldKVxuICB9KVxuICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAuYXR0cigndHJhbnNmb3JtJywgZnVuY3Rpb24gKGQsIGkpIHtcbiAgICByZXR1cm4gJ3RyYW5zbGF0ZSgnICsgdmFsdWVTY2FsZShkKSArICcsJyArIChrZXlTY2FsZVJlY3Qoa2V5UmVjdERvbWFpbltpXSkgKyBrZXlTY2FsZVJlY3QucmFuZ2VCYW5kKCkgLyAyKSArICcpJ1xuICB9KVxuICAuYXR0cignZHgnLCAoZCkgPT4ge1xuICAgIHJldHVybiBkIDwgMCA/ICctMS4wZW0nIDogJzEuMGVtJ1xuICB9KVxuICAuYXR0cignZHknLCAnLjMzZW0nKVxuICAuc3R5bGUoJ2ZpbGwnLCAnIzAwMCcpXG4gIC5zdHlsZSgndGV4dC1hbmNob3InLCAnbWlkZGxlJylcbiAgLnN0eWxlKCdmb250LXNpemUnLCAnMTBwdCcpXG4gIC50ZXh0KChkKSA9PiBkKVxufSkoKVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2FwcC9oaXN0b2dyYW0tZ3JvdXAtaG9yaXpvbnRhbC5qc1xuICoqIG1vZHVsZSBpZCA9IDBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMVxuICoqLyJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OyIsInNvdXJjZVJvb3QiOiIifQ==