var chmiPortalWebPageUrl = "https://portal.chmi.cz/files/portal/docs/uoco/web_generator/actual_hour_data_CZ.html"
var chmiPortalJSONUrl = "https://portal.chmi.cz/files/portal/docs/uoco/web_generator/aqindex_cze.json"
var stationCode;
var periodInMinutes = 1
const DEFAULT_STATION_CODE = "AKALA";

// SCHEDULING START
function onInit() {
    if (localStorage.stationData === undefined) {
        localStorage.stationData = '{"Components" : [{"Code": "N/A", "Ix": -1}]}';
    }
    if (localStorage.stationCode === undefined) {
        localStorage.stationCode = DEFAULT_STATION_CODE;
        localStorage.stationName = "---";
    }
    updateIcon();
    scheduleNextUpdate();    
}

function onAlarm(alarm) {
    if (alarm.name === 'station-data-changed') {
        updateIcon();
    } else {
        chrome.storage.sync.get({
            stationToMonitor: DEFAULT_STATION_CODE
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
chrome.notifications.onButtonClicked.addListener(openChmiPageEvent);
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
    chrome.storage.sync.get(
        function () {
            var notification = getListNotification();                        
            notif = chrome.notifications.create(null, notification, null);            
        }
    );
}

function openChmiPageEvent(notificationId, buttonIndex) {
    if (buttonIndex == 0) {
        showChmiPortalWebPage();
    } else if (buttonIndex == 1) {
        chrome.runtime.openOptionsPage();
    }
}

function getBasicNotification() {
    var stationData = JSON.parse(localStorage.stationData);
    var stationDataComponents = stationData.Components;
    var notificationMessage = "";
    stationDataComponents.map(function (component) {
        notificationMessage = notificationMessage + component.Code + ": " + component.Ix + "; ";
    });

    return {
        type: "basic",
        title: localStorage.stationName + " >>" + localStorage.stationIndex + "<<",
        iconUrl: chrome.runtime.getURL('images/icon_128.png'),
        message: notificationMessage
    };
}

function getListNotification() {
    var stationData = JSON.parse(localStorage.stationData);
    var stationDataComponents = stationData.Components;
    var components = stationDataComponents.map(function (component) {
        return {title: component.Code, message: "    " + component.Ix.toString()};
    });

    return {
        type: "list",
        title: localStorage.stationName,
        iconUrl: chrome.runtime.getURL('images/icon_128.png'),
        message: "Overall quality index: " + localStorage.stationIndex,
        items: components,
        buttons: [{title:"chmi web"},{title:"options"}]
    };
}