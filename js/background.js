//chrome-extension://khafeoajgbcjjcgnkkfakjhfjpjhgibn/background.html
var worktime = 5;
var resttime = 5;
var workgoing = 0;
var restgoing = 0;
var currentItemIndex = -1;
var flag = 'stop';
var clickedGoingOn = false;




var list = [];
var notionData = [];
notionSync(databaseId, token);

function startClock(index) {
    flag = 'work';
    // Save the index of the clicked item
    currentItemIndex = index;
    chrome.notifications.create("notifi", {
        type: 'basic',
        iconUrl: 'images/robot-with-flower.png',
        title: 'tiltle',
        message: 'you need rest!!'
    });
    updateTime();
    
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

async function updateTime() {
    if (workgoing > worktime) {
        sendMessageToContentScript({ cmd: 'test', value: '你好，我是popup！' }, function (response) {
            console.log('来自content的回复：' + response);
        });
        // 检查用户是否已经点击了 goingon 按钮
        while (!clickedGoingOn) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        if (clickedGoingOn) {
            workgoing = 0;
            flag = 'rest';
            clickedGoingOn = false; // 重置 clickedGoingOn 变量
        } else {
            workgoing--;
        }
    }
    if(restgoing > resttime) {
        restgoing = 0;
        flag = 'stop';
        updateList(currentItemIndex);
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

async function notionSync(databaseId, token) {
    const readUrl = "https://api.notion.com/v1/databases/" + databaseId + "/query";
    try {
      const response = await fetch(readUrl, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28'
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      notionData = data.results;
      for (const result of data.results) {
        //console.log(result);
        
        
        let numbs = result.properties.done.number;
        let emoji = '';
        if(result.properties.done.number != null) {
            while(numbs>0) {
                emoji += '\u{1F345}';
                numbs--;
            }
                
        }
        var s = result.properties.Name.title[0].plain_text + ' ' + emoji;
        //console.log(s);
        list.push(s);
    }
    } catch (error) {
      console.error('Error handling response:', error);
    }
}

async function updateList(index) {
 
    currentItemIndex = index;
    // 更新番茄数
    if (currentItemIndex < 0 || currentItemIndex >= notionData.length) {
        console.error('Invalid currentItemIndex:', currentItemIndex);
        return;
    }
    console.log('notionData:', notionData);
    console.log('currentItemIndex:', index);

    const result = notionData[currentItemIndex];
    console.log(result);
    const pageId = result.id;
    result.properties.done.number += 1;

    // 更新数据库
    await updateNotionDatabase(pageId, token, result);

    // 重新获取任务列表
    list = [];
    await notionSync(databaseId, token);

    // 通知popup更新任务列表
    chrome.runtime.sendMessage({ type: "updateList" });
}

async function updateNotionDatabase(pageId, token, result) {
    const updateUrl = `https://api.notion.com/v1/pages/${pageId}`;
    const data = {
        "properties": {
            "Name": {
                "title": result.properties.Name.title
            },
            "done": {
                "number": result.properties.done.number
            }
        }
    };

    try {
        const response = await fetch(updateUrl, {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const updatedData = await response.json();
        console.log('Updated data:', updatedData);
    } catch (error) {
        console.error('Error updating the database:', error);
    }
}


async function clearAllTomatoes() {
    for (let i = 0; i < notionData.length; i++) {
        const result = notionData[i];
        const pageId = result.id;
        result.properties.done.number = 0;

        // 更新数据库
        await updateNotionDatabase(pageId, token, result);
    }

    // 重新获取任务列表
    list = [];
    await notionSync(databaseId, token);

    // 通知popup更新任务列表
    chrome.runtime.sendMessage({ type: "updateList" });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'goingOnClicked') {
        clickedGoingOn = true;
    }
});
