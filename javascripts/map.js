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
		    table_data.addRow([item[1],item[0] == null ? 'Unknown' : item[0],item[5]])
		    continue;
		}
		table_data.addRow([item[1],item[0],item[5]])
		data.addRow([item[2],item[3],item[5],item[0] + " | nodes:" + item[5]]);
	    }
	    $("#datetime").html(json.datetime);
	    $("#total").html(json.total);
//	    data = new google.visualization.DataTable(); data.addColumn('number', 'Lat'); data.addColumn('number', 'Long'); data.addColumn('number', 'Value'); data.addColumn({type:'string', role:'tooltip'}); data.addColumn('string', 'url'); data.addRows([[35.685,139.7514, 21,"Tokyo | nodes:21", "tokyo"],[34.6864,135.52, 7,"Osaka | nodes:7", "osaka"],])
	    var view = new google.visualization.DataView(data);
	    view.setColumns([0,1,2,3]);
	    var chart = new google.visualization.GeoChart(document.getElementById("chart_div"));
	    chart.draw(view, mapOptions);
	    var table = new google.visualization.Table(document.getElementById('table_div'));
            table.draw(table_data, {showRowNumber: true});
	},
	fail: function() {
	}
    });
}

function create_data(json) {
}
