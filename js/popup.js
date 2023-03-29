$(function() {
    updatePopup();
    renderPopup();
});

function updatePopup() {
    var settime = 25;
    var percent = 0;
    var bg = chrome.extension.getBackgroundPage();
    if(bg.flag == 'work') {
        settime = bg.workgoing;
        percent = bg.workgoing*100/bg.worktime;
    }
    else if(bg.flag == 'rest') {
        settime = bg.restgoing;
        percent = bg.restgoing*100/bg.resttime;
    }
    var showtime = document.getElementById("show-time");
    showtime.innerHTML = String(settime);
    console.log(percent);
    $("#per").css('background-color','#ff8ba7');
    $("#per").css('height',percent+'%');
}

setInterval(updatePopup, 1000); // 每隔1000毫秒（1秒）调用一次updatePopup函数

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "updateList") {
        renderPopup();
    }
});

function renderPopup() {
    const arrayElement = document.getElementById('array');
    arrayElement.innerHTML = ''; // 清空当前任务列表

    const bg = chrome.extension.getBackgroundPage();

    bg.list.forEach((item, index) => {
        const newItem = document.createElement('p');
        newItem.innerText = item;
        newItem.addEventListener('click', () => {
            bg.currentItemIndex = index;
            bg.startClock(index);
        });
        arrayElement.appendChild(newItem);
    });
}

document.getElementById('clear-tomatoes').addEventListener('click', () => {
    const bg = chrome.extension.getBackgroundPage();
    bg.clearAllTomatoes();
});
