   
   var selector = d3.select("#selDataset");
    d3.json("data/samples.json").then((data) => {
        var sampleNames = data.names;
        sampleNames.forEach((id) => {
            selector
                .append("option")
                .text(id)
                .property("value", id);
        });
        //Use the first sample from the list to build the initial plots
        const firstSample = sampleNames[0];
        buildCharts(firstSample);
        gaugeChart(firstSample);
    });
	
function optionChanged(sample) {
    buildCharts(sample);
    gaugeChart(sample);
}

function gaugeChart(sample) {
    d3.json("data/samples.json").then((data) => {
        var metadata = data.metadata;
        //console.log(metadata);
        var result = metadata.filter(meta => meta.id == sample)[0];
        var sample_metadata = d3.select("#sample-metadata");
        sample_metadata.html("");
        // Use `Object.entries` to add each key and value pair to the panel
        Object.entries(result).forEach(([key, value]) => {
            sample_metadata.append("h6").text(`${key.toUpperCase()}: ${value}`)
        })

        //Gauge Chart
        var data = [{
            domain: { x: [0, 1], y: [0, 1] },
            type: "indicator",
            mode: "gauge+number+delta",
            value: result.wfreq,
            title: { text: "Scrubs per week", font: { size: 18 } },
            titlefont: { family: '"Palatino Linotype", "Book Antiqua", Palatino, serif' },
            delta: { reference: 0, increasing: { color: "gray" } },
            gauge: {
                axis: { range: [0, 9], tickwidth: 0.25, tickcolor: "gray" },
                bar: { color: "gray" },
                bgcolor: "white",
                borderwidth: 1,
                bordercolor: "black",
                steps: [
                    { range: [0, 250], color: "Orange" },
                    { range: [250, 300], color: "darkblue" }
                ],
                threshold: {
                    line: { color: "red", width: 4 },
                    thickness: 0.75,
                    value: 9
                }
            }
        }];
        var layout = {
            width: 500,
            height: 400,
            margin: { t: 25, b: 25, l: 25, r: 25 },
            paper_bgcolor: "white",
            font: { color: "blue", family: "Arial" }
        };
        Plotly.newPlot("gauge", data, layout);
    });
}


function buildCharts(sample) {
    d3.json("data/samples.json").then((data) => {
        var samples = data.samples;
        var filter = samples.filter(object => object.id.toString() === sample);
        var result = filter[0];
        var sample_values = result.sample_values;
        var ids = result.otu_ids;
        var labels = result.otu_labels;

        var trace1 = {
            x: ids,
            y: sample_values,
            text: labels,
            mode: 'markers',
            marker: {
                color: ids,
                size: sample_values,
                colorscale: "Electric"
            }
        };
       //Bubble Chart
        var layout = {
            title: 'Bacteria Cultures per Sample',
            showlegend: false,
            hovermode: 'closest',
            xaxis: { title: "OTU ID" + sample },
            margin: { t: 30 }
        };
        Plotly.newPlot("bubble", [trace1], layout);

        
        var trace1 = {
            x: sample_values.slice(0, 10).reverse(),
            y: ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
            text: labels.slice(0, 10).reverse(),
            name: "Greek",
            type: "bar",
            orientation: "h"
        };
        
        var layout = {
            title:  "Test Subject ID№" + sample,
            margin: { l: 100, r: 100, t: 100, b: 100 }
        };
        Plotly.newPlot("bar", [trace1], layout);

        
    });
}


function buildMetadata(sample) {
    d3.json("data/samples.json").then((data) => {
        var metadata = data.metadata;
        //console.log(metadata);
        var result = metadata.filter(meta => meta.id == sample)[0];
        var sample_metadata = d3.select("#sample-metadata");
        sample_metadata.html("");
        // Use `Object.entries` to add each key and value pair to the panel
        Object.entries(result).forEach(([key, value]) => {
            sample_metadata.append("h6").text(`${key.toUpperCase()}: ${value}`)
        });
	})
}