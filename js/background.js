var chmiPortalWebPageUrl = "http://portal.chmi.cz/files/portal/docs/uoco/web_generator/actual_hour_data_CZ.html"
var chmiPortalJSONUrl = "http://portal.chmi.cz/files/portal/docs/uoco/web_generator/aqindex_cze.json"
var regionCode = "T"
var stationCode = "TFMIA"

chrome.browserAction.onClicked.addListener(showChmiPortalWebPage);

function showChmiPortalWebPage() {  
    chrome.tabs.query({"url": chmiPortalWebPageUrl}, function(tabs) {
        tab = tabs[0];
        if (tab) {
            chrome.tabs.update(tab.id, {selected: true});
            chrome.tabs.reload(tab.id);
        } else {
            chrome.tabs.create({url: chmiPortalWebPageUrl});
        }
    });
    getAirQualityJSON();
}

var findRegionByCode = function (region) {
    return region.Code === regionCode;
}

function findStationByCode(station) {
    return station.Code === stationCode;
}

function getAirQualityJSON() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", chmiPortalJSONUrl, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            var resp = JSON.parse(xhr.responseText);
            var state = resp.States[0]
            var region = state.Regions.find(findRegionByCode)
            var stationData = region.Stations.find(findStationByCode);
            chrome.notifications.create("AQnotifID", {
                                        title: "*** Air Quality Checker ***",
                                        iconUrl: chrome.runtime.getURL('images/icon_128.png'),
                                        type: "basic",
                                        message: "Station: " + stationData.Name + "\nAQ status: " + stationData.Ix
                                        }, function() {});
        }
    }
    xhr.send();
}
