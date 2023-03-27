$(function() {
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

    const arrayElement = document.getElementById('array');

    bg.list.forEach(item => {
    const newItem = document.createElement('p');
    newItem.innerText = item;
    newItem.addEventListener('click', () => {
        // 点击事件处理逻辑
        console.log(`You clicked on item: ${item}`);
    });
    arrayElement.appendChild(newItem);
    });
});

$('#button').click(e => {
    var settime = 25;
    var percent = 0;
    var bg = chrome.extension.getBackgroundPage();
    bg.startClock();
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
});