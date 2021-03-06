// Data Visualization Script

// Set the margin and padding of the SVG
const margin = { top: 50, right: 20, bottom: 50, left: 100 }
const padding = 60

// Set the width and height using the current width and height of the div
const width = 960
const height = 600

// Create svg and append to chart div
const svg = d3.select('#chart')
  .append('svg')
  .attr('class', 'graph')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)

// Title
svg.append('text')
  .text('Higher Education in the United States')
  .attr('id', 'title')
  .attr(`transform`, `translate(${width / 2}, ${padding / 2})`)

// Description
svg.append('text')
  .text(`Percentage of people with a bachelor's degree or higher`)
  .attr('id', 'description')
  .attr(`transform`, `translate(${width / 2}, ${padding / 1})`)

// Tooltip  
const tooltip = d3.select('#chart').append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0)

 // Geo path generator
 const path = d3.geoPath() 

// Get the data
const eduURL = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json'
const countiesURL = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json'
const chart = async () => {
  let getEduData = await fetch(eduURL)
  let eduData = await getEduData.json()
  let getUSData = await fetch(countiesURL)
  let USData = await getUSData.json()
  let counties = topojson.feature(USData, USData.objects.counties).features

  // Higher education rate variance
  const minRate = d3.min(eduData.map(d => d.bachelorsOrHigher))
  const maxRate = d3.max(eduData.map(d => d.bachelorsOrHigher))

  // Map education data to county data
  const dataset = counties.filter(county => {
    return eduData.some(eduCounty => {
      if (county.id == eduCounty.fips) {
        let mergedData = Object.assign(county, eduCounty)
        return mergedData
      }
    })
  })
  console.log(`dataset`, dataset)

  // Set color palette using d3-scale-chromatic library
  //inspired by https://bl.ocks.org/mbostock/4060606
  const palette = d3.schemeBlues[9]
  const color = d3.scaleThreshold()
    .domain(d3.range(minRate, maxRate, (maxRate-minRate)/(palette.length-1)))
    .range(palette)

  // Legend (using d3 SVG Legend (v4) library)
  const linear = d3.scaleLinear()
    .domain([minRate/100, maxRate/100]) //scale for percentage label format
    .range([color.range()[1], color.range()[color.range().length - 1]]);

  const legendLinear = d3.legendColor()
    .shapeWidth(padding)
    .orient('horizontal')
    .cells(8)
    .labelFormat(d3.format(".1%"))
    .scale(linear)

  svg.append("g")
    .attr("class", "legendLinear")
    .attr('id', 'legend')
    .attr('transform', `translate(${width / 2}, ${height + margin.top+17})`)

  svg.select(".legendLinear")
    .call(legendLinear);
  
  // Map
  svg.append('g').selectAll('path')
    .data(dataset)
    .enter().append('path')
    .attr('class', 'county')
    .attr('data-fips', (d) => d.id)
    .attr('data-education', (d) => d.bachelorsOrHigher)
    .style('fill', (d) => color(d.bachelorsOrHigher))
    .attr('d', path)
    .attr('dy', 40)
    .on('mouseover', (d) => {
      tooltip.transition().duration(200).style('opacity', 0.9)
      tooltip.html(
        `<p>${d.area_name}, ${d.state}: ${d.bachelorsOrHigher}%</p>`)
        .attr('data-education', d.bachelorsOrHigher)
        .style('left', `${d3.event.layerX}px`)
        .style('top', `${d3.event.layerY - 28}px`)
    })
    .on('mouseout', () => tooltip.transition().duration(500).style('opacity', 0)) 
    .attr(`transform`, `translate(0, ${padding / 1})`)

  //Map borders
  //adopted from by https://bl.ocks.org/mbostock/4060606
  svg.append('path')
    .datum(topojson.mesh(USData, USData.objects.states, (a, b) => a !== b))
    .attr('class', 'states')
    .attr('d', path)

}
chart()