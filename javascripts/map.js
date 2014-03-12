$.support.cors = true;
google.load('visualization', '1', {packages:['table']});
google.load('visualization', '1', {'packages': ['geochart']});
google.setOnLoadCallback(drawChart);
var mapOptions = {
    enableRegionInteractivity: true,
    displayMode: "markers",
    region: 'auto',
    colorAxis: {colors: ['yellow', 'red']},
    tooltip: { showTitle: false }
};
var tableOptions = {
    showRowNumber: true
};
function drawChart() {
    // Create data table header.
    table_data = new google.visualization.DataTable();
    table_data.addColumn('string', 'Country');
    table_data.addColumn('string', 'City');
    table_data.addColumn('number', 'Nodes');
    table_data.addColumn({type:'string', role:'tooltip'});
    table_data.addColumn('number', 'Lat');
    table_data.addColumn('number', 'Long');

    var jpnodes = 0;
    $.ajax({
	url:"http://54.200.189.80/nodemap",
	type:"GET",
	success: function(ret){
	    var txt = ret["responseText"];
	    var html = $.parseHTML(txt);
	    var ptag = html[5];
	    var json = $.parseJSON(ptag.innerHTML);
	    //Create data table
	    for (var i in json.nodemap) {
		var item = json.nodemap[i];
		// item = city, country, lag, long, timezone, nodes
		item[0] = item[0] == null? "Unknown":item[0];
		var tooltip = item[0] + "(" + item[1] + ")" + " | nodes:" + item[5];
		table_data.addRow([item[1],item[0],item[5], tooltip, item[2],item[3]])
		if (item[1] == 'JP') {
		    jpnodes += item[5];
		}
	    }
	    $("#datetime").html(json.datetime);
	    $("#total").html(json.total + ' (JP:' + jpnodes + ')');
	    view = new google.visualization.DataView(table_data);
	    view.setColumns([4,5,2,3]);
	    chart = new google.visualization.GeoChart(document.getElementById("chart_div"));
	    chart.draw(view, mapOptions);
	    table_view = new google.visualization.DataView(table_data);
	    table_view.setColumns([0,1,2]);
	    table = new google.visualization.Table(document.getElementById('table_div'));
            table.draw(table_view, tableOptions);
	    var tableSelectHandler = function(e) {
		var selection = table.getSelection()[0]['row'];
		window.location = "https://maps.google.com/?z=10&q=" + table_data.getValue(selection,4) + "," + table_data.getValue(selection,5);
	    }
	    // Add custom selection handler.
	    google.visualization.events.addListener(table, 'select', tableSelectHandler);
	},
	fail: function() {
	}
    });
}
world = true;
function buttonClicked() {
    var button = document.getElementById("button");
    if (world) {
	button.value = "World";
	drawJapan();
    } else {
	button.value = "Japan";
	drawWorld();
    }
    world = !world;
}

function drawJapan() {
    var filtered = table_data.getFilteredRows([{column: 0, value: 'JP'}])
    table_view.setRows(filtered);
    table_view.setColumns([0,1,2]);
    table.draw(table_view, tableOptions);
    view.setRows(filtered);
    chart = new google.visualization.GeoChart(document.getElementById("chart_div"));
    chart.draw(view, mapOptions);
}

function drawWorld() {
    table_view = new google.visualization.DataView(table_data);
    table_view.setColumns([0,1,2]);
    table.draw(table_view, tableOptions);
    view = new google.visualization.DataView(table_data);
    view.setColumns([4,5,2,3]);
    chart = new google.visualization.GeoChart(document.getElementById("chart_div"));
    chart.draw(view, mapOptions);
}
