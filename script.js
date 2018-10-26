let options = {
  width: 920,
  height: 630,
  data: [],
  years: [],
  times: [],
  seconds: [],
  radius: 8,
  margins: {
    top: 130,
    right: 30,
    left: 70,
    bottom: 30,
  },
};

let log = () => {
  console.log('options', options);
};

function getDateObj(time) {
  let obj = new Date(0);
  obj.setMinutes(time.split(':')[0]);
  obj.setSeconds(time.split(':')[1]);
  return obj;
}
document.addEventListener('DOMContentLoaded', e =>
  loadData(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json',
  ),
);

function loadData(url) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      options.data = data;
      options.years = data.map(d => d.Year);
      options.times = data.map(d => getDateObj(d.Time));
      options.seconds = data.map(d => d.Seconds);
    })
    .then(() => {
      log();
      renderGraph();
    });
}

function renderGraph() {
  let svg;
  let legend;
  let xScale;
  let yScale;

  svg = d3
    .select('#graph')
    .append('svg')
    .attr('width', options.width + options.margins.left + options.margins.right)
    .attr('height', options.height + options.margins.top + options.margins.bottom);

  // Appending titles
  svg
    .append('text')
    .text('Doping in Professional Bicycle Racing')
    .attr('id', 'title');

  svg
    .append('text')
    .text("35 Fastest times up Alpe d'Huez")
    .attr('id', 'subtitle');

  // Appending descriptive text
  legend = svg.append('g').attr('id', 'legend');

  legend
    .append('rect')
    .attr('width', '18')
    .attr('height', '18');

  legend
    .append('rect')
    .attr('width', '18')
    .attr('height', '18')
    .classed('doping', true);

  legend.append('text').text('No doping allegations');

  legend
    .append('text')
    .text('Riders with doping allegations')
    .classed('doping', true);

  // Implement Scaling
  xScale = d3
    .scaleLinear()
    .domain([d3.min(options.years) - 1, d3.max(options.years) + 1])
    .range([options.margins.left, options.width + options.margins.left]);

  yScale = d3
    .scaleTime()
    .domain([d3.min(options.times), d3.max(options.times)])
    .range([options.margins.top, options.height + options.margins.top]);

  // Implement Axes
  var xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));

  svg
    .append('g')
    .attr('id', 'x-axis')
    .style('transform', `translateY(${options.height + options.margins.top}px)`)
    .call(xAxis);

  var yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));

  svg
    .append('g')
    .attr('id', 'y-axis')
    .style('transform', `translateX(${options.margins.left}px)`)
    .call(yAxis);

  // Appending dots
  svg
    .selectAll('circle')
    .data(options.data)
    .enter()
    .append('circle')
    .attr('cx', d => xScale(d['Year']))
    .attr('cy', d => yScale(getDateObj(d['Time'])))
    .attr('r', options.radius)
    .attr('data-xvalue', d => d['Year'])
    .attr('data-yvalue', d => getDateObj(d.Time).getMinutes())
    .classed('dot', true)
    .classed('doping', d => d['Doping'])
    .exit();
}
