function drawScatterMatrix(data, xlabel, ylabel, title) {
    const chart = d3.select("#chart"),
            svg = d3.select('svg');

    let size_v = 165,
        size_h = 270,
        size = 165,
        padding = 20;

    let xAxis = d3.axisTop().scale(xScale).ticks(6),
        yAxis = d3.axisLeft().scale(yScale).ticks(6);

    xScale.range([padding / 2, size_h - padding / 2]);
    yScale.range([size_v - padding / 2, padding / 2]);

    chart.append('g');

    chart.append('g')
        .attr('transform', `translate(0, ${height})`);

    let domain = {},
        features = d3.keys(data);

    features.forEach(function (feat) {
        domain[feat] = d3.extent(Object.values(data[feat]));
    });
    // console.log(data);
    // console.log(domain);

    chart.selectAll(".x.axis")
        .data(features)
        .enter()
        .append("g")
        .attr("class", "x axis")
        .attr("transform", (d, i) => `translate(${(features.length - i - 1) * size_h},0)`)
        .each(function (d) {
            xScale.domain(domain[d]);
            d3.select(this).call(xAxis);
        });

    chart.selectAll(".y.axis")
        .data(features)
        .enter()
        .append("g")
        .attr("class", "y axis")
        .attr("transform", (d, i) => `translate(0, ${i * size_v})`)
        .each(function (d) {
            yScale.domain(domain[d]);
            d3.select(this).call(yAxis);
        });

    // console.log(cross(features, features));

    chart.selectAll(".cell")
        .data(cross(features, features))
        .enter()
        .append("g")
        .attr("class", "cell")
        .attr("transform", (d) => `translate(${(features.length - d.i - 1) * size_h},${d.j * size_v})`)
        .each(plot);

    function plot(p) {
		var cell = d3.select(this);
		xScale.domain(domain[p.x]);
		yScale.domain(domain[p.y]);

		// console.log(data[p.x]);

		cell.append("rect")
			.attr("class", "frame")
			.attr("x", padding / 2)
			.attr("y", padding / 2)
			.attr("width", size_h - padding)
			.attr("height", size_v - padding)
            .style("fill", "none")
            .style("storke", "#aaa");

		cell.selectAll("circle")
			.data(Object.values(data[p.x]))
			.enter()
			.append("circle")
			.attr("cx",(d, i) => xScale(d))
			.attr("cy",(d, i) => yScale(data[p.y][i]))
			.attr("r", 1.5)
			.style("fill", "steelblue");
    }

    // title
    svg.append('text')
        .attr('x', width / 2 + margin)
        .attr('y', 15)
        .attr('text-anchor', 'middle')
        .attr('class', 'title')
        .text(title);

}


function cross(a, b) {
	var c = [], n = a.length, m = b.length, i, j;
	for (i = -1; ++i < n;)
	    for (j = -1; ++j < m;)
	        c.push({x: a[i], i: i, y: b[j], j: j});
	return c;
}

