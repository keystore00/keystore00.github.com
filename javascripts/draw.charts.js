$.support.cors = true;
// Load the Visualization API and the piechart package.
google.load('visualization', '1.0', {'packages':['corechart']});
// Set chart options
var options = {'title':'Pool Hash Rate Distribution',
	       'width':1000,
	       'height':600};
var column_options = {'title':'Pool Workers',
		      'width':900,
		      'height':600};
var chart;
var column_chart
var nethash = 0;
var pool_total = 0;
var watt_pfm = 2.8;
// Set a callback to run when the Google Visualization API is loaded.
google.setOnLoadCallback(drawChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Pool');
    data.addColumn('string', 'Address');
    data.addColumn('number', 'Hashrate');
    var column_data = new google.visualization.DataTable();
    column_data.addColumn('string', 'Pool');
    column_data.addColumn('string', 'Address');
    column_data.addColumn('number', 'Workers');
    column_data.addColumn('number', 'Kh/s/worker');
    $.ajax({
	url:"http://givememona.tk/json/pools.json",
	type:"GET",
	success: function(ret){
	    var txt = ret["responseText"];
	    var html = $.parseHTML(txt);
	    var ptag = html[5];
	    var json = $.parseJSON(ptag.innerHTML);
	    var pinfos = json.pool_infos;
	    var pool_total_hash = 0;
	    var pool_total_workers = 0;
	    for (var i in pinfos) {
		var pool = pinfos[i];
		var pool_address = "http://" + pool.pool_address;
		pool.hashrate /= 1000; //to MH
		pool.network_hashrate /= 1000 * 1000; //to MH
		data.addRow([pool.pool_name, pool_address, pool.hashrate]);
		if (pool.workers != 0) {
		    hashrate_per_worker = pool.hashrate/pool.workers*1000;
		} else {
		    hashrate_per_worker = 0;
		}
		column_data.addRow([pool.pool_name, pool_address, pool.workers,hashrate_per_worker]);
		var atag = document.createElement('a');
		atag.href = pool_address;
		atag.target = '_blank';
		atag.appendChild(document.createTextNode(pool.pool_name));
		var item = document.createElement('li')
		item.appendChild(atag);
		document.getElementById('pool_link_list').appendChild(item);
		pool_total_hash += pool.hashrate;
		pool_total_workers += pool.workers
	    }
	    var no_res_pools = json.no_response;
	    var no_res_list = ""
	    for (var i in no_res_pools) {
		var no_res = no_res_pools[i];
		no_res_list = no_res_list + no_res + ",";
	    }
	    no_res_list = no_res_list + "?";
	    $("#cur_diff").html(json.cur_diff.toFixed(2));
	    $("#blocksuntildiffchangemin").html(json.blocksuntildiffchange * 1.5 / 60);
	    $("#nethash").html(pool.network_hashrate.toFixed(2));
	    $("#total_pool_hash").html(pool_total_hash.toFixed(2));
	    $("#total_workers").html(pool_total_workers);
	    $("#average_workers_hash").html((pool_total_hash/pool_total_workers*1000).toFixed(2));
	    $("#time").html(json.time);
	    $("#net_watt").html((pool.network_hashrate/watt_pfm).toFixed(2));
	    //draw pie chart
	    var others = pool.network_hashrate - pool_total_hash;
	    others = Math.max(0, others);
	    data.sort([{column: 2, desc:true}, {column: 0}]);
	    data.addRow(["Others (" + no_res_list + ")","hoge",others]);
	    var view = new google.visualization.DataView(data);
	    view.setColumns([0, 2]);
	    chart.draw(view, options);
	    //draw column chart
	    column_data.sort([{column: 2, desc:true}, {column: 0}]);
	    var column_view = new google.visualization.DataView(column_data);
	    column_view.setColumns([0,2,3]);
	    column_chart.draw(column_view, column_options);

	},
	fail: function() {
	}
    });


    // Instantiate and draw our chart, passing in some options.
    chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    column_chart = new google.visualization.ColumnChart(document.getElementById('column_chart_div'));

    var selectHandler = function(e) {
	window.location = data.getValue(chart.getSelection()[0]['row'],1);
    }
    var column_selectHandler = function(e) {
	window.location = column_data.getValue(column_chart.getSelection()[0]['row'],1);
    }
    // Add custom selection handler.
    google.visualization.events.addListener(chart, 'select', selectHandler);
    google.visualization.events.addListener(column_chart, 'select', column_selectHandler);

}
