d3.csv(data_file, function(error, data) {
	if (error) throw error;

	var domainByFeature = {},
		//traits = d3.keys(data[0]).filter(function(d) { return d !== "species"; }),
		//n = traits.length;
		features = d3.keys(data[0]).slice(1, 4),
		n = features.length;

	features.forEach(function(feature) {
		domainByFeature[feature] = d3.extent(data, function(d) { return d[feature]; });
	});

	var size = width/3;

	const chart = d3.select("#chart"),
		svg = d3.select('svg');

	chart.selectAll('*').remove();

	let yAxis = chart.append('g')
		.call(d3.axisLeft()
			.scale(yScale)
			.ticks(6)
			.tickSize(-size * n));

	let xAxis = chart.append('g')
		.attr('transform', `translate(0, ${height})`)
		.call(d3.axisBottom()
			.scale(xScale)
			.ticks(6)
			.tickSize(size * n));

	let padding = margin;
	
//	xAxis.tickSize(size * n);
//	yAxis.tickSize(-size * n);

	chart.attr("width", size * n + padding)
		.attr("height", size * n + padding)
		.append("g")
		.attr("transform", "translate(" + padding + "," + padding / 2 + ")");

	chart.selectAll(".x.axis")
		.data(features)
		.enter()
		.append("g")
		.attr("class", "x axis")
		.attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
		.each(function(d) { x.domain(domainByFeature[d]); d3.select(this).call(xAxis); });

	svg.selectAll(".y.axis")
		.data(traits)
		.enter().append("g")
		.attr("class", "y axis")
		.attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
		.each(function(d) { y.domain(domainByTrait[d]); d3.select(this).call(yAxis); });

	var cell = svg.selectAll(".cell")
			.data(cross(traits, traits))
			.enter()
			.append("g")
			.attr("class", "cell")
			.attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
			.each(plot);

	// Titles for the diagonal.
	cell.filter(function(d) { return d.i === d.j; })
		.append("text")
		.attr("x", padding)
		.attr("y", padding)
		.attr("dy", ".71em")
		.text(function(d) { return d.x; });

	cell.call(brush);

	function plot(p) {
		var cell = d3.select(this);

		x.domain(domainByTrait[p.x]);
		y.domain(domainByTrait[p.y]);

		cell.append("rect")
			.attr("class", "frame")
			.attr("x", padding / 2)
			.attr("y", padding / 2)
			.attr("width", size - padding)
			.attr("height", size - padding);

		cell.selectAll("circle")
			.data(data)
			.enter().append("circle")
			.attr("cx", function(d) { return x(d[p.x]); })
			.attr("cy", function(d) { return y(d[p.y]); })
			.attr("r", 4)
			.style("fill", function(d) { return color(d.species); });
	}

	// Highlight the selected circles.
	function brushmove(p) {
		var e = brush.extent();
		svg.selectAll("circle").classed("hidden", function(d) {
			return e[0][0] > d[p.x] || d[p.x] > e[1][0]
					|| e[0][1] > d[p.y] || d[p.y] > e[1][1];
		});
	}

	// If the brush is empty, select all circles.
	function brushend() {
		if (brush.empty()) svg.selectAll(".hidden").classed("hidden", false);
	}
});

function cross(a, b) {
	var c = [], n = a.length, m = b.length, i, j;
	for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
	return c;
}
