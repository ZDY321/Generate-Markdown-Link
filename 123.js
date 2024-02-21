// ==UserScript==
// @name         Enhanced Markdown Link Generator with Customizable Position and Style
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  获取当前网站的网址和标题，并在页面中央显示Markdown格式的链接，以及一个复制按钮。当用户点击复制按钮时，将链接复制到剪贴板并显示相应的成功与否的提示。右键点击按钮时，可以自定义按钮的位置和样式。
// @author       ZDY
// @icon         https://markdown.com.cn/hero.png
// @match        *://*/*
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    // 创建右下角按钮样式
    const buttonStyle = `
        position: fixed;
        bottom: 40px;
        left: 20px;
        z-index: 10000;
        padding: 2px 5px;
        background-color: #4CAF50;
        color: white;
        border: none;
        cursor: pointer;
        border-radius: 5px;
        font-size: 9px;
    `;

    // 创建复制按钮
    const copyButton = document.createElement('button');
    copyButton.innerHTML = 'M-Link';
    copyButton.style.cssText = buttonStyle;
    document.body.appendChild(copyButton);

    // 创建和添加显示Markdown链接的元素
    const linkContainer = document.createElement('div');
    linkContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10001;
        background-color: white;
        border: 1px solid black;
        padding: 10px;
        border-radius: 5px;
        display: none;
        font-size: 10px;
    `;
    document.body.appendChild(linkContainer);

    // 创建悬浮框以更改按钮位置和样式
    const settingsPanel = document.createElement('div');
    settingsPanel.innerHTML = `
        <div style="position: fixed; bottom: 60px; right: 20px; z-index: 10002; padding: 10px;
                    background-color: white; border: 1px solid #ddd; display: none;">
            <div>
                侧边: <select id="sideSelect"><option value="left">左</option><option value="right">右</option></select>
                边距: <input type="number" id="marginInput" value="20" style="width: 50px;"> px
                底部: <input type="number" id="bottomInput" value="40" style="width: 50px;"> px
                字体大小: <input type="number" id="fontSizeInput" value="9" style="width: 50px;"> px
            </div>
            <button id="applySettingsButton">应用</button>
        </div>
    `;
    document.body.appendChild(settingsPanel);

    // 为复制按钮添加右键菜单事件监听器
    copyButton.addEventListener('contextmenu', function(e) {
        e.preventDefault(); // 阻止默认的右键菜单
        settingsPanel.firstChild.style.display = 'block';
    });

    // 应用按钮样式更改
    document.getElementById('applySettingsButton').addEventListener('click', function() {
        const side = document.getElementById('sideSelect').value;
        const margin = document.getElementById('marginInput').value;
        const bottom = document.getElementById('bottomInput').value;
        const fontSize = document.getElementById('fontSizeInput').value;

        // 应用新的按钮样式
        copyButton.style.position = 'fixed';
        copyButton.style.bottom = `${bottom}px`;
        copyButton.style[side] = `${margin}px`;
        copyButton.style.fontSize = `${fontSize}px`;

        // 清除之前的位置样式
        if(side === 'left') {
            copyButton.style.right = '';
        } else {
            copyButton.style.left = '';
        }

        settingsPanel.firstChild.style.display = 'none'; // 隐藏设置面板
    });

    // 原有的点击按钮显示Markdown链接的功能
    copyButton.addEventListener('click', function() {
        const title = document.title;
        const url = window.location.href;
        const markdownLink = `[${title}](${url})`;
        linkContainer.innerHTML = `${markdownLink} <button style="${copyButtonStyle}">复制</button>`;
        linkContainer.style.display = 'block';

        const newCopyButton = linkContainer.lastChild;
        newCopyButton.addEventListener('click', function() {
            try {
                GM_setClipboard(markdownLink, 'text');
                newCopyButton.innerHTML = '复制成功';
                setTimeout(() => { newCopyButton.innerHTML = '复制'; }, 2000);
            } catch (e) {
                newCopyButton.innerHTML = '复制失败';
                setTimeout(() => { newCopyButton.innerHTML = '复制'; }, 2000);
            }
        });
    });

    // 点击显示框以外的地方关闭显示框
    window.addEventListener('click', function(event) {
        if (!linkContainer.contains(event.target) && event.target !== copyButton && !settingsPanel.firstChild.contains(event.target)) {
            linkContainer.style.display = 'none';
            settingsPanel.firstChild.style.display = 'none';
        }
    });
})();
