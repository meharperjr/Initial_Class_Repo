var data;

d3.json("static/samples.json").then((sampleData) => {
    
    data = sampleData;

    // populate select dropdown
    var select = d3.select('#selDataset')
        .classed("custom-select", true);

    var options = select
        .selectAll('option')
        .data(sampleData.names)
        .enter()
        .append('option')
        .text(function (d) { return d; });

});

// populate dashboard 
function optionChanged(id) {
   
    var filteredbyparams = data.metadata.filter(function (belly) {
        if ((parseInt(belly.id) === parseInt(id))) {
            return belly;
        }
    });

    filteredbyparams.forEach((belly) => {
      

        // Create and populate table with meta data of selected ID
        var DemoInfo = d3.select('#sample-metadata');
        DemoInfo.selectAll("table").remove();

        var table_bb = DemoInfo
            .append('table')
            .classed("table table-hover table-striped", true);

        var table_h_bb = table_bb
            .append('tbody');

        // Loop through object to get key value pairs to display as meta data
        Object.entries(belly).forEach(([key, value]) => {
            var bb_row = table_h_bb.append("tr");
            var bb_cell = bb_row.append("td").text(key.toUpperCase());
            var bb_cell = bb_row.append("td").text(value);
        });

    });

    // grab samples section corresponding to id selected via filter
    filteredbyparams2 = data.samples.filter(function (bellys) {
        if ((parseInt(bellys.id) === parseInt(id))) {
            return bellys;
        }
    });

    filteredbyparams2.forEach((bellys) => {
      

 

        // data is sorted, but what if its not
        var sValues = bellys.sample_values.slice(0);
        var subid = bellys.otu_ids.slice(0);
        var labels = bellys.otu_labels.slice(0);

        // combine the arrays for sorting
        var list = [];
        for (var j = 0; j < subid.length; j++)
            list.push({ 'sValues': sValues[j], 'subid': subid[j], 'labels': labels[j] });
        
        
        list.sort(function(a, b) {
            return ((a.sValues > b.sValues) ? -1 : ((a.sValues == sValues.name) ? 0 : 1));
        });

    
        for (var k = 0; k < list.length; k++) {
            sValues[k] = list[k].sValues;
            subid[k] = `id:${list[k].subid.toString()}`;
            console.log(bellys.otu_ids)
            labels[k] = list[k].labels;
        }

        

 var trace1 = {
            x: bellys.otu_ids,
            y: bellys.sample_values,
            mode: 'markers',
            marker: {
                size: bellys.sample_values,
                 }
        };

        var data = [trace1];

        var layout = {
            title: 'Belly-Button Biodiversity',
        };

        Plotly.react('bubble', data, layout);
        
        // create bar chart
        var trace = {
            type: 'bar',
            marker: { color: 'green'
            },
            x: sValues.slice(0, 10), 
            y: subid.slice(0, 10),
            transforms: [{
                type: 'sort',
                target: 'x',
                
              }],
            hovertext: labels,
            orientation: 'h'
        };


        var data = [trace];
        var layout = {
            title: 'Top 10 OTUs Found in Sample',
            xaxis: {
                title: {
                    text: 'OTUs Found',
                    font: {
                        size: 18,
                    }
                },
            },
            yaxis: {
                title: {
                    text: 'OTU ID',
                    font: {
                        size: 18,

                    }
                }
            }
        };

        Plotly.react('bar', data, layout);
 

    });



}