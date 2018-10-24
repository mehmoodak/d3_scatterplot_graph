let options = {
  width: 920,
  height: 630,
  data: [],
  years: [],
  times: [],
  seconds: [],
  radius: 8,
  margin: 50
}

let log = () => console.log('options', options);

document.addEventListener( 'DOMContentLoaded', (e) => loadData( 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json' ) );

function loadData( url ) {
  fetch( url )
    .then( response => response.json() )
    .then( data => { 
      options.data = data;
      options.years = data.map ( d => d.Year );
      options.times = data.map ( d => d.Time );
      options.seconds = data.map ( d => d.Seconds );
    })
    .then( () => {
      log();
      renderGraph();
    })
}

function renderGraph() {
  let svg;
  let xScale;
  let yScale;

  svg = d3.select( "#graph" )
          .append( "svg" )
          .attr( "width", options.width + (options.margin * 2) )
          .attr( "height", options.height + (options.margin * 2) );

  xScale = d3.scaleLinear()
             .domain([ d3.min( options.years ), d3.max( options.years ) ])
             .range( [ options.margin, options.width + options.margin] );

  yScale = d3.scaleLinear()
             .domain( [ d3.min( options.seconds), d3.max( options.seconds )] )
             .range( [ options.margin, options.height + options.margin ] );

  svg.selectAll( "circle" )
     .data( options.data )
     .enter()
     .append( "circle" )
     .attr( "cx", d => xScale( d["Year"] ) )
     .attr( "cy", d => yScale( d["Seconds"] ) )
     .attr( "r", options.radius )
     .classed ( "doping", d => d["Doping"] )
     .exit();
}
