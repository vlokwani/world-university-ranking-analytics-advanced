
function prepareScatterPlot(data, xlabel, ylabel, title) {
	// data = JSON.parse(data);
	let x = Object.values(data.X),
		y = Object.values(data.Y),
		domX = [+d3.min(x) * 1.1, +d3.max(x) * 1.1],
		domY = [+d3.min(y) * 1.2, +d3.max(y) * 1.2];

	drawScatterPlot(domX, domY, x, y, xlabel, ylabel, title);
}

function drawScatterPlot(domX, domY, dataX, dataY, xlabel, ylabel, title) {

	const chart = d3.select("#chart"),
            svg = d3.select('svg');

	console.log(svg);

	yScale.range([height, 0]).domain(domY);
	xScale.range([0, width]).domain(domX);

	chart.append('g')
		.call(d3.axisLeft(yScale));

	chart.append('g')
		.attr('transform', `translate(0, ${height})`)
		.call(d3.axisBottom(xScale));

	chart.selectAll()
        .data(dataY)
        .enter()
        .append('circle')
        .attr('cx', (d, i) => xScale(dataX[i]))
        .attr('cy', d => yScale(d))
        .attr('r', 2.5)
        .style('fill', 'steelblue');

    svg.append('text')
        .attr('x', -(height / 2) - margin)
        .attr('y', margin / 3.4)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .attr('class', 'labels')
        .text(ylabel);

        // title
    svg.append('text')
        .attr('x', width / 2 + margin)
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .attr('class', 'title')
        .text(title);

        // label for x-axis
    svg.append('text')
        .attr('x', width / 2 + margin)
        .attr('y', 2*margin + height - 10) // - the overflow
        .attr('text-anchor', 'middle')
        .attr('class', 'labels')
        .text(xlabel);
}