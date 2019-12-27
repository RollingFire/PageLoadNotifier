document.addEventListener('DOMContentLoaded', function (event) {
    populatePopup();
    var submitButton = document.getElementById("submitButton");
    submitButton.addEventListener("click", function () {
        setAlertAfter(document.getElementById("alertAfterInput").value);
        setNotificationTime(document.getElementById("notificationTimeInput").value);
    });
});

function populatePopup() {
    chrome.storage.local.get("alertAfter", function (item) {
        document.getElementById("alertAfterInput").setAttribute("value", (item["alertAfter"] / 1000));
    });

    chrome.storage.local.get("notificationTime", function (item) {
        document.getElementById("notificationTimeInput").setAttribute("value", (item["notificationTime"] / 1000));
    });
}

function setAlertAfter(alertAfter) {
    if (alertAfter != null) {
        alertAfter *= 1000;
        chrome.storage.local.set({ "alertAfter": alertAfter }, function () {
            console.log("INFO - Setting alertAfter to " + alertAfter + " milliseconds.");
        });
    }
}

function setNotificationTime(notificationTime) {
    if (notificationTime != null) {
        notificationTime *= 1000;
        chrome.storage.local.set({ "notificationTime": notificationTime }, function () {
            console.log("INFO - Setting notificationTime to " + notificationTime + " milliseconds.");
        });
    }
}