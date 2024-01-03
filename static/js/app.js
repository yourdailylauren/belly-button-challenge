function init() {
    var selector = d3.select("#selDataset");

    // Fetching data from the provided URL
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // initial plots using first sample data
        const firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}

function buildCharts(sample) {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
        var samples = data.samples;
        var result = samples.find((sampleObj) => sampleObj.id === sample);

        // Bar Chart
        var barData = [{
            y: result.otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
            x: result.sample_values.slice(0, 10).reverse(),
            text: result.otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",
        }];

        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: { t: 30, l: 150 }
        };

        Plotly.newPlot("bar", barData, barLayout);

        // Bubble Chart
        var bubbleData = [{
            x: result.otu_ids,
            y: result.sample_values,
            text: result.otu_labels,
            mode: "markers",
            marker: {
                size: result.sample_values,
                color: result.otu_ids,
                colorscale: "Earth"
            }
        }];

        var bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: { t: 0 },
            hovermode: "closest",
            xaxis: { title: "OTU ID" }
        };

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
}

function buildMetadata(sample) {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
        var metadata = data.metadata;
        var result = metadata.find((sampleObj) => sampleObj.id == sample);

        var PANEL = d3.select("#sample-metadata");

        PANEL.html("");
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}

function optionChanged(newSample) {
    buildCharts(newSample);
    buildMetadata(newSample);
}

// Initialize the dashboard
init();
