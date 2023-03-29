
setTimeout(test, 1000);

//setTimeout(add, 1000);
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
     console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
    if(request.cmd == 'test') {
      //alert(request.value);
      add();
    }
    sendResponse('get');
});

function test() {
  console.log("just test");
}



function add() {
  //创建一个div
  var newDiv = document.createElement("div");
  newDiv.id = "x";
  newDiv.style.top = "50px";
  newDiv.style.right = "50px";
  newDiv.style.position = "fixed";
  document.body.appendChild(newDiv);

  // 创建<img>元素并设置其src属性
  var e_img = document.createElement('img');
  e_img.src = chrome.extension.getURL('images/clock.png');
  e_img.width="100";	
  e_img.height="100";
  e_img.style.backgroundColor = 'transparent';
  e_img.classList.add("e_img");
  console.log(document.querySelector('img'));
  console.log(e_img.classList);


  var e_button = document.createElement('button');
  e_button.innerText = "go on";
  e_button.style.color = "#8a8a8a";
  e_button.style.backgroundColor = "#f0f0f0";
  e_button.style.border = "1px solid #cccccc";
  e_button.style.padding = "10px 15px";
  e_button.style.fontSize = "14px";
  e_button.style.borderRadius = "5px";
  e_button.style.cursor = "pointer";
  e_button.style.fontWeight = "400";
  e_button.style.outline = "none";
  e_button.style.boxShadow = "0 2px 3px rgba(0, 0, 0, 0.1)";
  e_button.addEventListener("click", function() {
    newDiv.remove();
    chrome.runtime.sendMessage({ type: 'goingOnClicked' });
  });
  //img挂载到div上
  newDiv.appendChild(e_img);
  newDiv.appendChild(e_button);
}







