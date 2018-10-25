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
    left: 30,
    bottom: 30
  }
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
  let legend;
  let xScale;
  let yScale;

  svg = d3.select( "#graph" )
          .append( "svg" )
          .attr( "width", options.width + options.margins.left + options.margins.right )
          .attr( "height", options.height + options.margins.top + options.margins.bottom );

  // Appending titles
  svg.append( "text" )
     .text( "Doping in Professional Bicycle Racing" )
     .attr( "id", "title" )

  svg.append( "text" )
     .text( "35 Fastest times up Alpe d'Huez" )
     .attr( "id", "subtitle" )

  // Appending descriptive text
  legend = svg.append( "g" )
              .attr( "id", "legend" );

  legend.append( "rect" )
        .attr( "width", "18" )
        .attr( "height", "18" );

  legend.append( "rect" )
        .attr( "width", "18" )
        .attr( "height", "18" )
        .classed( "doping", true );

  legend.append( "text" )
        .text( "No doping allegations" )
  
  legend.append( "text" )
        .text( "Riders with doping allegations" )
        .classed ( "doping", true )


  xScale = d3.scaleLinear()
             .domain([ d3.min( options.years ), d3.max( options.years ) ])
             .range( [ options.margins.left, options.width + options.margins.left] );

  yScale = d3.scaleLinear()
             .domain( [ d3.min( options.seconds), d3.max( options.seconds )] )
             .range( [ options.margins.top, options.height + options.margins.top ] );

  svg.selectAll( "circle" )
     .data( options.data )
     .enter()
     .append( "circle" )
     .attr( "cx", d => xScale( d["Year"] ) )
     .attr( "cy", d => yScale( d["Seconds"] ) )
     .attr( "r", options.radius )
     .attr( "data-xvalue", d => d["Year"] )
     .attr( "data-yvalue", d => {
       let time = new Date(0);
       time.setMinutes( d.Time.split( ":" )[0] )
       time.setSeconds( d.Time.split( ":" )[1] )
       return time.getMinutes();
     })
     .classed( "dot", true )
     .classed ( "doping", d => d["Doping"] )
     .exit();
}
