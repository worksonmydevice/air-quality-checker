function save_options() {
    var station = document.getElementById('station').value;
    chrome.storage.sync.set({
        stationToMonitor: station
    }, function () {
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        chrome.alarms.create('options-updated', { when: Date.now() });
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

function restore_options() {
    chrome.storage.sync.get({
        stationToMonitor: 'AKALA'
    }, function (items) {
        document.getElementById('station').value = items.stationToMonitor;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);