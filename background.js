var timeStamps = new Map();
const NOTIFICATION_TITLE = "Tab Loaded";
const ICON = "Icons/Icon_128px.png";
const NOTIFICATION_MESSAGE = "Your slow to load tab loaded."

chrome.runtime.onInstalled.addListener(function () {
    const ALERT_AFTER = 5*1000;
    chrome.storage.local.set({ "alertAfter": ALERT_AFTER }, function () {
        console.log("INFO - Initializing alertAfter to " + ALERT_AFTER + " milliseconds.");
    });

    const NOTIFICATION_TIME = 3*1000;
    chrome.storage.local.set({ "notificationTime": NOTIFICATION_TIME }, function () {
        console.log("INFO - Initializing notificationTime to " + NOTIFICATION_TIME + " milliseconds.");
    });
});

chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
    var time = Date.now();
    timeStamps.set(details.tabId, time);
})

chrome.webNavigation.onCompleted.addListener(function (details) {
    var id = details.tabId;
    var time = timeStamps.get(id);
    chrome.storage.local.get("alertAfter", function (item) {
        var alertAfter = item["alertAfter"];

        console.log("INFO - TabID " + id + " loaded in " + (Date.now() - time) + " milliseconds.");
        if ((Date.now() - time) > alertAfter) {
            chrome.storage.local.get("notificationTime", function (item) {
                var notificationTime = item["notificationTime"];

                chrome.notifications.create(
                    id.toString(),
                    {
                        type: "basic",
                        title: NOTIFICATION_TITLE,
                        iconUrl: ICON,
                        message: NOTIFICATION_MESSAGE
                    },
                    function () { }
                );
                setTimeout(function () {
                    chrome.notifications.clear(id.toString(), function () { });
                }, notificationTime);
            });
        }
        timeStamps.delete(id);
    });
})

chrome.tabs.onRemoved.addListener(function (tabId, details) {
    timeStamps.delete(details.tabId);
})

chrome.notifications.onClicked.addListener(function (idStr) {
    var id = parseInt(idStr);
    chrome.tabs.get(id, function (tab) {
        chrome.tabs.highlight({ 'tabs': tab.index }, function () { });
    });
})