function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1-1. Create the buildCharts function.
function buildCharts(sample) {
  // 1-2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 1-3. Create a variable that holds the samples array. 
    samplesArray = data.samples;

    // 1-4. Create a variable that filters the samples for the object with the desired sample number.
    sampleFiltered = samplesArray.filter(element => element.id == sample);

    // 1-5. Create a variable that holds the first sample in the array.
    sampleSelected = sampleFiltered[0];

    // 1-6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    otuIds = sampleSelected.otu_ids;
    otuLabels = sampleSelected.otu_labels;
    sampleValues = sampleSelected.sample_values;

    // 1-7. Create the yticks for the bar chart.
    var yticks = otuIds.sort((a,b) => a - b).reverse().slice(0,9);

    // 1-8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues,
      y: yticks,
      type: "bar",
      orientation: "h"
    }];

    // 1-9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found"
    };

    // 1-10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("barChart", barData, barLayout);

    // 2-1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
        size: sampleValues
      }
    }];

    // 2-2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacterial Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      showlegend: false,
      hovermode: true
    };

    // 2-3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubbleChart", bubbleData, bubbleLayout); 
  });
}
