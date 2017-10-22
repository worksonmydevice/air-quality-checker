var chmiPortalWebPageUrl = "http://portal.chmi.cz/files/portal/docs/uoco/web_generator/actual_hour_data_CZ.html"
var chmiPortalJSONUrl = "http://portal.chmi.cz/files/portal/docs/uoco/web_generator/aqindex_cze.json"
var stationCode;
var periodInMinutes = 1

// SCHEDULING START
function onInit() {
    scheduleNextUpdate();
}

function onAlarm(alarm) {
    if (alarm.name === 'station-data-changed') {
        updateIcon();
        showNotification();
    } else {
        chrome.storage.sync.get({
            stationToMonitor: 'AKALA'
        }, function (items) {
            stationCode = items.stationToMonitor;
        });
        getAirQualityJSON();
        scheduleNextUpdate();
    }    
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