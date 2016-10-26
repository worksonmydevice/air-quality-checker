var chmiPortalWebPageUrl = "http://portal.chmi.cz/files/portal/docs/uoco/web_generator/actual_hour_data_CZ.html"

chrome.browserAction.onClicked.addListener(openChmiPortalWebPage);

function openChmiPortalWebPage() {    
    chrome.tabs.getAllInWindow(undefined, function(tabs) {
    for (var i = 0, tab; tab = tabs[i]; i++) {
      if (tab.url && tab.url == chmiPortalWebPageUrl) {
        chrome.tabs.update(tab.id, {selected: true});
        chrome.tabs.reload(tab.id);
        return;
      }
    }
    chrome.tabs.create({url: chmiPortalWebPageUrl});
  });
}
