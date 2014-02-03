import urllib2
import json
from datetime import datetime as dt

#pools=["mona.2chpool.com", "mona1.monapool.com", "gikopool.net", "mona.pool.null-x.me", "vippool.net"]
mona_info = {"pool_infos":[],"time":""}
pools=["gikopool.net", "mona.pool.null-x.me", "vippool.net"]
for pool in pools:
    url = "http://" + pool + "/index.php?page=api&action=public"
    response = urllib2.urlopen(url)
    json_str = response.read()
    jsonObj = json.loads(json_str)
    mona_info["pool_infos"].append(jsonObj)
mona_info["time"] = dt.now().strftime('%Y/%m/%d %H:%M:%S')
print json.dumps(mona_info)
