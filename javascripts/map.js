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
    // Create the data table header.
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'Lat');
    data.addColumn('number', 'Long');
    data.addColumn('number', 'Value');
    data.addColumn({type:'string', role:'tooltip'});
    // create header table
    var table_data = new google.visualization.DataTable();
    table_data.addColumn('string', 'Country');
    table_data.addColumn('string', 'City');
    table_data.addColumn('number', 'Nodes');
    table_data.addColumn('number', 'Lat');
    table_data.addColumn('number', 'Long');

    $.ajax({
	url:"http://54.200.189.80/nodemap",
	type:"GET",
	success: function(ret){
	    var txt = ret["responseText"];
	    var html = $.parseHTML(txt);
	    var ptag = html[5];
	    var json = $.parseJSON(ptag.innerHTML);
	    //create data table
	    for (var i in json.nodemap) {
		item = json.nodemap[i];
		if (item[0] == null | item[1] != 'JP') {
		    table_data.addRow([item[1],item[0] == null ? 'Unknown' : item[0],item[5],item[2],item[3]])
		    continue;
		}
		table_data.addRow([item[1],item[0],item[5],item[2],item[3]])
		data.addRow([item[2],item[3],item[5],item[0] + " | nodes:" + item[5]]);
	    }
	    $("#datetime").html(json.datetime);
	    $("#total").html(json.total);
	    var view = new google.visualization.DataView(data);
	    view.setColumns([0,1,2,3]);
	    var chart = new google.visualization.GeoChart(document.getElementById("chart_div"));
	    chart.draw(view, mapOptions);
	    var table_view = new google.visualization.DataView(table_data);
	    table_view.setColumns([0,1,2]);
	    var table = new google.visualization.Table(document.getElementById('table_div'));
            table.draw(table_view, tableOptions);
	    var tableSelectHandler = function(e) {
		var selection = table.getSelection()[0]['row'];
		window.location = "https://maps.google.com/?z=10&q=" + table_data.getValue(selection,3) + "," + table_data.getValue(selection,4);
	    }
	    // Add custom selection handler.
	    google.visualization.events.addListener(table, 'select', tableSelectHandler);
	},
	fail: function() {
	}
    });
}

function create_data(json) {
}
