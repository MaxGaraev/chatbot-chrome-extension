
document.getElementById('save-button').addEventListener('click', function (e) {
  e.preventDefault();
  const chatbotUrl = document.getElementById('chatbot-url').value;
  const errorTip = document.getElementById('error-tip');

  if (chatbotUrl.trim() === "") {
    errorTip.textContent = "URL чата не может быть пустым.";
  } else {
    errorTip.textContent = "";

    chrome.storage.sync.set({
      'chatbotUrl': chatbotUrl,
    }, function () {
      alert('Успешно сохранено!');
    });
  }
});

// Load parameters from chrome.storage when the page loads
chrome.storage.sync.get(['chatbotUrl'], function (result) {
  const chatbotUrlInput = document.getElementById('chatbot-url');

  if (result.chatbotUrl) {
    chatbotUrlInput.value = result.chatbotUrl;
  }

});