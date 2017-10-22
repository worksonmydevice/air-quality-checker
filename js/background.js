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
    var stationIndex = typeof localStorage.stationIndex !== 'undefined' ? localStorage.stationIndex : "?";
    chrome.browserAction.setBadgeText({
        text: stationIndex
    });
    var iconColor = getIconColor(stationIndex);
    chrome.browserAction.setBadgeBackgroundColor({
        color: iconColor
    });
}

function getIconColor(stationIndex) {
    var color;
    switch (stationIndex) {
        case "1":
            color = "#C7EAFB";
            break;
        case "2":
            color = "#9BD3AE";
            break;
        case "3":
            color = "#FFF200";
            break;
        case "4":
            color = "#FAA61A";
            break;
        case "5":
            color = "#ED1C24";
            break;
        case "6":
            color = "#671F20";
            break;
        default:
            color = "#C7EAFB";
    }
    return color;
}

function showNotification() {
    chrome.notifications.create("AQnotifID", {
        title: localStorage.stationName + " >>" + localStorage.stationIndex + "<<",
        iconUrl: chrome.runtime.getURL('images/icon_128.png'),
        type: "basic",
        message: "Station: " + localStorage.stationName + "\nAQ Status: " + localStorage.stationIndex
    }, function () { });
}