var chmiPortalWebPageUrl = "http://portal.chmi.cz/files/portal/docs/uoco/web_generator/actual_hour_data_CZ.html"

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
}
