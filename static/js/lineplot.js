function prepareLinePlot(data, xlabel, ylabel, title) {
	// data = JSON.parse(data);
	let y = Object.values(data.Y),
		domX = [0, y.length],
		domY = [0, +d3.max(y) * 1.2],
		knee = data['knee'];

	drawLinePlot(domX, domY, y, knee, xlabel, ylabel, title);
}

function drawLinePlot(domX, domY, data, knee, xlabel, ylabel, title){


 	const chart = d3.select("#chart"),
            svg = d3.select("svg");

	yScale.range([height, 0]).domain(domY);
	xScale.range([0, width]).domain(domX);

	chart.append('g')
		.call(d3.axisLeft(yScale));

	chart.append('g')
		.attr('transform', `translate(0, ${height})`)
		.call(d3.axisBottom(xScale));

  // Define the line
  	let line = d3.line()
				  .x((d,i) => xScale(i+1))
				  .y((d) => yScale(d));

	// Add the valueline path.
	chart.append("path")
		.data([data])
		.attr("d", line)
		.style("fill", "none")
		.style("stroke", "steelblue")
		.style("stroke-width", "2px");

	chart.append('circle')
		.attr("class"   ,"circle")
		.attr('cx',xScale(knee+1))
		.attr('cy',yScale(data[knee]))
		.attr('r',5)
		.style("fill", "red");

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