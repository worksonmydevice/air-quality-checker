function showChmiPortalWebPage() {
    chrome.tabs.query({ "url": chmiPortalWebPageUrl }, function (tabs) {
        tab = tabs[0];
        if (tab) {
            chrome.tabs.update(tab.id, { selected: true });
            chrome.tabs.reload(tab.id);
        } else {
            chrome.tabs.create({ url: chmiPortalWebPageUrl });
        }
    });
}

var findRegionByCode = function (region) {
    return region.Code === regionCode;
}

function findStationByCode(station) {
    return station.Code === stationCode;
}

function getAirQualityJSON(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", chmiPortalJSONUrl, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var resp = JSON.parse(xhr.responseText);
            if (callback) {
                callback(resp);
            } else {
                var stationData;
                var states = resp.States;
                for (j =0; j < states.length; j++) {    
                    if (stationData != undefined) {
                        break;
                    }                
                    var regions = states[j].Regions;
                    for (i = 0; i < regions.length; i++) {
                        stationData = regions[i].Stations.find(findStationByCode);
                        if (stationData != undefined) {
                            break;
                        }
                    }
                }                
                updateStationData(stationData);
            }            
        }
    }
    xhr.send();
}

function updateStationData(stationData) {
    var stationIndex = stationData.Ix;
    var stationName = stationData.Name;
    var changed = (localStorage.stationIndex != stationIndex || localStorage.stationName != stationName);
    localStorage.stationIndex = stationIndex;
    localStorage.stationName = stationName;
    localStorage.stationData = JSON.stringify(stationData);
    if (changed) {
        chrome.alarms.create('station-data-changed', { when: Date.now() });        
    }
}