function save_options() {
    var station = document.getElementById('station').value;
    var notificationsEnabled = document.getElementById('notification-enabled').checked;
    chrome.storage.sync.set({
        stationToMonitor: station,
        notificationsEnabled: notificationsEnabled
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
        stationToMonitor: 'AKALA',
        notificationsEnabled: true
    }, function (items) {
        document.getElementById('station').value = items.stationToMonitor;
        document.getElementById('notification-enabled').checked = items.notificationsEnabled;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);