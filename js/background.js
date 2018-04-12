// MIT License
//
// Copyright (c) 2018 Marcos Nesster
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.


chrome.runtime.onMessage.addListener(function (msg, sender) {
  // First, validate the message's structure
  chrome.browserAction.setBadgeBackgroundColor({ color: "#009688" }); // adicionar color compomentes
  if ((msg.from === 'content') && (msg.subject === 'showPageAction')) {
    // Enable the page-action for the requesting tab
    //chrome.browserAction.setIcon({path:"img/iconLauncher.png"});
    chrome.pageAction.show(sender.tab.id);
  }
  if (msg.action === "updateIcon") {
      if (msg.value) {
          //chrome.browserAction.setIcon({path: "img/check.png"});
          chrome.browserAction.setBadgeText({text: "" + msg.compo_length}); // We have 10+ unread items.
      } else {
          //chrome.browserAction.setIcon({path: "img/icon64.png"});
          chrome.browserAction.setBadgeText({text: "" + msg.compo_length});
      }
  }
});
