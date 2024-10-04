const storage = chrome.storage.sync;
chrome.storage.sync.get(['chatbotUrl'], function (result) {
  window.gptbotsChatbotConfig = {
    chatbotUrl: result.chatbotUrl,
  };
});

document.body.onload = embedChatbot;

async function embedChatbot() {
  const gptbotsChatbotConfig = window.gptbotsChatbotConfig;
  if (!gptbotsChatbotConfig) {
    console.warn('Chatbot Url is empty or is not provided');
    return;
  }

  // Заменяем SVG на изображение
  const chatbotIcon = chrome.runtime.getURL("images/48.png");

  // create iframe
  function createIframe() {
    const iframe = document.createElement('iframe');
    iframe.allow = "fullscreen;microphone"
    iframe.title = "gptbots chatbot bubble window"
    iframe.id = 'gptbots-chatbot-bubble-window'
    iframe.src = gptbotsChatbotConfig.chatbotUrl
    iframe.style.cssText = 'border: none; position: fixed; flex-direction: column; justify-content: space-between; box-shadow: rgba(150, 150, 150, 0.2) 0px 10px 30px 0px, rgba(150, 150, 150, 0.2) 0px 0px 0px 1px; bottom: 6.7rem; right: 1rem; width: 30rem; height: 48rem; border-radius: 0.75rem; display: flex; z-index: 2147483647; overflow: hidden; left: unset; background-color: #F3F4F6;'
    document.body.appendChild(iframe);
  }

  /**
   * rem to px
   * @param {*} rem ：30rem
   */
  function handleRemToPx(rem) {
    if (!rem) return;
    let pxValue = 0;
    try {
      const regex = /\d+/;
      // extract the numeric part and convert it to a numeric type
      const remValue = parseInt(regex.exec(rem)[0], 10);
      const rootFontSize = parseFloat(
        window.getComputedStyle(document.documentElement).fontSize
      );
      pxValue = remValue * rootFontSize;
    } catch (error) {
      console.error(error);
    }
    return pxValue;
  }

  /**
   * support element drag
   * @param {*} targetButton entry element
   */
  function handleElementDrag(targetButton) {
    // define a variable to hold the mouse position
    let mouseX = 0,
      mouseY = 0,
      offsetX = 0,
      offsetY = 0;

    // Listen for mouse press events, get mouse position and element position
    targetButton.addEventListener("mousedown", function (event) {
      // calculate mouse position
      mouseX = event.clientX;
      mouseY = event.clientY;

      // calculate element position
      const rect = targetButton.getBoundingClientRect();
      offsetX = mouseX - rect.left;
      offsetY = mouseY - rect.top;

      // listen for mouse movement events
      document.addEventListener("mousemove", onMouseMove);
    });

    // listen for mouse lift events and stop listening for mouse move events
    document.addEventListener("mouseup", function () {
      document.removeEventListener("mousemove", onMouseMove);
    });

    // the mouse moves the event handler to update the element position
    function onMouseMove(event) {
      // calculate element position
      let newX = event.clientX - offsetX,
        newY = event.clientY - offsetY;

      // 计算视线边界
      const viewportWidth = window.innerWidth,
        viewportHeight = window.innerHeight;

      const maxX = viewportWidth - targetButton.offsetWidth,
        maxY = viewportHeight - targetButton.offsetHeight;

      // application limitation
      newX = Math.max(12, Math.min(newX, maxX));
      newY = Math.max(12, Math.min(newY, maxY));

      // update element position
      targetButton.style.left = newX + "px";
      targetButton.style.top = newY + "px";
    }
  }

  const targetButton = document.getElementById("gptbots-chatbot-bubble-button");

  if (!targetButton) {
    // create button
    const containerDiv = document.createElement("div");
    containerDiv.id = 'gptbots-chatbot-bubble-button';
    containerDiv.style.cssText = `position: fixed; bottom: 2rem; right: 2rem; width: 48px; height: 48px; border-radius: 24px; background-color: #FF5733; box-shadow: rgba(0, 0, 0, 0.3) 0px 4px 12px 0px; cursor: pointer; z-index: 2147483647; transition: all 0.3s ease-in-out 0s; left: unset; transform: scale(1); :hover {transform: scale(1.15);}`;

    const displayDiv = document.createElement('div');
    displayDiv.style.cssText = "display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; z-index: 2147483647;";

    // Создаем элемент изображения
    const iconImg = document.createElement('img');
    iconImg.src = chatbotIcon;
    iconImg.style.width = '100%';
    iconImg.style.height = '100%';
    iconImg.style.borderRadius = '24px';  // Делаем изображение круглым

    displayDiv.appendChild(iconImg);
    containerDiv.appendChild(displayDiv);
    document.body.appendChild(containerDiv);
    handleElementDrag(containerDiv);

    // add click event to control iframe display
    containerDiv.addEventListener('click', function () {
      const targetIframe = document.getElementById('gptbots-chatbot-bubble-window');
      if (!targetIframe) {
        createIframe();
        // Здесь мы не меняем иконку, так как используем одно и то же изображение
        return;
      }
      if (targetIframe.style.display === "none") {
        targetIframe.style.display = "block";
      } else {
        targetIframe.style.display = "none";
      }
    });
  } else {
    // add any drag and drop to the floating icon
    handleElementDrag(targetButton);
  }
}