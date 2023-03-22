//chrome-extension://khafeoajgbcjjcgnkkfakjhfjpjhgibn/background.html
var worktime = 5;
var resttime = 5;
var workgoing = 0;
var restgoing = 0;
var flag = 'stop';

function startClock() {
    flag = 'work';
    //while(flag != 'break') {
    chrome.notifications.create("notifi", {
        type: 'basic',
        iconUrl: 'images/robot-with-flower.png',
        title: 'tiltle',
        message: 'you need rest!!'
    });
    updateTime();
    //}
    
}

function sendMessageToContentScript(message, callback)
{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
    {
        chrome.tabs.sendMessage(tabs[0].id, message, function(response)
        {
            if(callback) callback(response);
        });
    });
}

function test() {
    chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
        var currentTabId = tabs[0].id;
        console.log("Current tab ID: " + currentTabId);
      });
}

function updateTime() {
    if(workgoing > worktime) {
        workgoing = 0;
        sendMessageToContentScript({cmd:'test', value:'你好，我是popup！'}, function(response)
        {
            console.log('来自content的回复：'+response);
        });
        flag = 'rest';
    }
    if(restgoing > resttime) {
        restgoing = 0;
        flag = 'stop';
    }
    switch (flag) {
        case 'work':
            workgoing++; 
            var title = document.getElementById("title");
            title.innerHTML = String(workgoing);
            chrome.browserAction.setBadgeText({text: String(worktime - workgoing)});
            chrome.browserAction.setBadgeBackgroundColor({color: "#ff8ba7"});
            break;
        case 'rest':
            restgoing++; 
            chrome.browserAction.setBadgeText({text: String(resttime - restgoing)});
            chrome.browserAction.setBadgeBackgroundColor({color: "#c3f0ca"});
            break;
        default:
            break;
    }
    if(flag != 'stop')
        setTimeout(updateTime, 1000);
}