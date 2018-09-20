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
  .text('Education Attainment in the United States')
  .attr('id', 'title')
  .attr("x", width / 2)
  .attr("y", padding / 2) 

// Description
svg.append('text')
  .text(`Percentage of adults age 25 or older with a bachelor's degree or higher`)
  .attr('id', 'description')
  .attr("x", width / 2)
  .attr("y", padding / 1)

// Tooltip  
const tooltip = d3.select('#chart').append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0)

// Map 
const path = d3.geoPath()

//Scale
const xScale = d3.scaleLinear()
  .domain([1, 10])
  .rangeRound([(height), (width)])

const color = d3.scaleThreshold()
  .domain(d3.range(2, 10))
  .range(d3.schemeBlues[9])

// Map Key
const mapKey = svg.append('g')
  .attr('class', 'key')
  .attr('transform', `translate(0, ${padding})`)

mapKey.selectAll('rect')
  .data(color.range().map((d) => {
    d = color.invertExtent(d)
    if (d[0] == null) {d[0] = xScale.domain()[0]}
    if (d[1] == null) {d[1] = xScale.domain()[1]}
    return d
  }))
  .enter().append('text')
  .attr('height', 8)
  .attr('x', (d) => xScale(d[0]))
  .attr('width', (d) => xScale(d[1]) - xScale(d[0]))
  .attr('fill', (d) => color(d[0]))

mapKey.append('text')
  .attr('class', 'caption')
  .attr('x', xScale.range()[0])
  .attr('y', -6)
  .text('Education Rates')

mapKey.call(d3.axisBottom(xScale)
      .tickFormat((x, i) => i ? x : `${x}%`)
      .tickValues(color.domain()))
    .select('.domain')
      .remove()

// Get the data
const eduURL = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json'
const countiesURL = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json'
const chart = async () => {
  let getEduData = await fetch(eduURL)
  let rawEduData = await getEduData.json()
  console.log(`rawEduData`, rawEduData)
  let getUSData = await fetch(countiesURL)
  let rawUSData = await getUSData.json()
  console.log(`rawUSData`, rawUSData)
  // var USDataId = topojson.feature(rawUSData, rawUSData.objects.counties).features.map(d => d.id)
  // console.log(`USDataId`, USDataId)

  //Create map
  svg.append('g')
    .attr('class', 'county')
    .selectAll('path')
    .data(topojson.feature(rawUSData, rawUSData.objects.counties).features)
    .enter().append('path')
    .attr('fill', (d) => color(d.id = rawEduData.map(d => d.fips)))
    .attr('d', path)
    .append('title')
      .text((d) => `${d.id}%`)
  svg.append('path')
    .datum(topojson.mesh(rawUSData, rawUSData.objects.states, (a, b) => a !== b))
    .attr('class', 'states')
    .attr('d', path)
}

chart()