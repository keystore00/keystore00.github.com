function arrange() {
    var container = document.getElementById('container')
    $.ajax({
	url:"http://54.200.116.71/entries",
	type:"GET",
	//async:false,
	success: function(ret){
	    var txt = ret["responseText"];
	    var html = $.parseHTML(txt);
	    var ptag = html[5];
	    var json = $.parseJSON(ptag.innerHTML);
	    var entries = json.works;
	    for (var i in entries) {
		var entry = entries[i];
		var brick = document.createElement('div');
		brick.className = 'brick'
		var img = document.createElement('img');
		img.src = './image/' + entry.image;
		img.alt = entry.author;
		img.setAttribute('width','100%');
		var info = document.createElement('div');
		info.className = 'info'
		info.align = 'center';
		var atag = document.createElement('a');
		atag.href = 'monacoin:' + entry.address;
		atag.appendChild(document.createTextNode('vote'));
		var h3 = document.createElement('h2');
		h3.appendChild(document.createTextNode(entry.author));
		var h5 = document.createElement('h3');
		h5.appendChild(document.createTextNode('mona : ' + entry.balance));
		info.appendChild(h3);
		info.appendChild(h5);
		info.appendChild(atag);
		brick.appendChild(img);
		brick.appendChild(info);
		document.getElementById('container').appendChild(brick);
	    }
	    $("#datetime").html(json.datetime);
	    reset()
	},
	fail: function() {
	    var failed = 1;
	}
    });
}
arrange();
