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
  .text('United States Higher Education Analysis')
  .attr('id', 'title')
  .attr("x", width / 2)
  .attr("y", padding / 2) 

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
}

chart()