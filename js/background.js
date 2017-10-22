var chmiPortalWebPageUrl = "http://portal.chmi.cz/files/portal/docs/uoco/web_generator/actual_hour_data_CZ.html"
var chmiPortalJSONUrl = "http://portal.chmi.cz/files/portal/docs/uoco/web_generator/aqindex_cze.json"
var stationCode;
var periodInMinutes = 1

// SCHEDULING START
function onInit() {
    scheduleNextUpdate();
}

function onAlarm(alarm) {
    chrome.storage.sync.get({
        stationToMonitor: 'AKALA'
    }, function (items) {
        stationCode = items.stationToMonitor;
    });
    getAirQualityJSON();
    scheduleNextUpdate();
}

function scheduleNextUpdate() {
    chrome.alarms.create('refresh', { periodInMinutes: periodInMinutes });
}

chrome.runtime.onInstalled.addListener(onInit);
chrome.alarms.onAlarm.addListener(onAlarm);


chrome.runtime.onStartup.addListener(function () {
    getAirQualityJSON();
});
// SCHEDULING END

// ONCLICK START
chrome.browserAction.onClicked.addListener(showNotification);

// ONCLICK END


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

function updateStationData(stationIndex, stationName) {
    var changed = localStorage.stationIndex != stationIndex;
    localStorage.stationIndex = stationIndex;
    localStorage.stationName = stationName;
    updateIcon();
    if (changed) {
        showNotification();
    }
}

function updateIcon() {
    chrome.browserAction.setBadgeText({
        text: typeof localStorage.stationIndex !== 'undefined' ? localStorage.stationIndex : "?"
    });
}

function showNotification() {
    chrome.notifications.create("AQnotifID", {
        title: "*** Air Quality Checker ***",
        iconUrl: chrome.runtime.getURL('images/icon_128.png'),
        type: "basic",
        message: "Station: " + localStorage.stationName + "\nAQ status: " + localStorage.stationIndex
    }, function () { });
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
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var resp = JSON.parse(xhr.responseText);
            var state = resp.States[0];
            var stationData;
            var regions = state.Regions;
            for (i = 0; i < regions.length; i++) {
                stationData = regions[i].Stations.find(findStationByCode);
                if (stationData != undefined) {
                    break;
                }
            }
            updateStationData(stationData.Ix, stationData.Name);
        }
    }
    xhr.send();
}
