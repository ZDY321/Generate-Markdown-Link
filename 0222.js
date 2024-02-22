// ==UserScript==
// @name         Markdown Link Generator with Adjusted Settings Panel Input Margins
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  获取当前网站的网址和标题，并在页面中央显示Markdown格式的链接，以及一个复制按钮。现在设置面板中的输入框、选择框和按钮都有了黑色边框和圆角，且输入框的右侧间隔被调整。
// @author       ZDY
// @icon         https://markdown.com.cn/hero.png
// @match        *://*/*
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    let buttonPosition = 'left'; // 按钮初始位置
    let buttonBottom = 40; // 按钮距底部距离
    let buttonFontSize = 9; // 按钮字体大小

    // 创建右下角按钮样式
    function createButtonStyle() {
        return `
            position: fixed;
            bottom: ${buttonBottom}px;
            ${buttonPosition}: 20px;
            z-index: 10000;
            padding: 2px 5px;
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 5px;
            font-size: ${buttonFontSize}px;
        `;
    }

    // 通用样式，用于输入框、选择框和按钮
    const commonStyle = `
        border: 1px solid black; /* 黑色边框 */
        border-radius: 4px; /* 圆角 */
        padding: 2px 5px; /* 内边距 */
    `;

    // 输入框样式，调整宽度为固定值以减少右侧边距
    const inputStyle = `
        width: 120px; /* 设置输入框的固定宽度 */
        border: 1px solid black; /* 加上黑色边框 */
        border-radius: 4px; /* 设置圆角 */
        padding: 2px 5px; /* 添加内边距 */
    `;

    // 创建设置面板样式，修改为在页面中央显示
    const settingsPanelStyle = `
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
    `;

    // 创建复制按钮样式
    const copyButtonStyle = `
        padding: 5px 10px;
        background-color: #007BFF;
        color: white;
        border: none;
        cursor: pointer;
        border-radius: 5px;
        margin-left: 10px;
        font-size: 10px;
    `;

    // 创建显示链接的样式
    const linkStyle = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10000;
        background-color: white;
        border: 1px solid black;
        padding: 10px;
        border-radius: 5px;
        display: none;
        font-size: 10px;
    `;

    // 创建设置面板
    const settingsPanel = document.createElement('div');
    settingsPanel.style.cssText = settingsPanelStyle;
    settingsPanel.innerHTML = `
        <div>
            <label for="positionSelect">按钮位置:</label>
            <select id="positionSelect" style="${commonStyle}">
                <option value="left">左</option>
                <option value="right">右</option>
            </select>
        </div>
        <div>
            <label for="bottomInput">底部距离(px):</label>
            <input type="number" id="bottomInput" value="${buttonBottom}" style="${inputStyle}">
        </div>
        <div>
            <label for="fontSizeInput">字体大小(px):</label>
            <input type="number" id="fontSizeInput" value="${buttonFontSize}" style="${inputStyle}">
        </div>
        <button id="saveSettings" style="${commonStyle}">保存设置</button>
    `;

    // 创建复制按钮
    const copyButton = document.createElement('button');
    copyButton.innerHTML = 'M-Link';
    copyButton.style.cssText = createButtonStyle();

    // 创建显示Markdown链接的元素
    const linkContainer = document.createElement('div');
    linkContainer.style.cssText = linkStyle;

    // 将元素添加到页面中
    document.body.appendChild(copyButton);
    document.body.appendChild(linkContainer);
    document.body.appendChild(settingsPanel);

    // 点击按钮时的行为
    copyButton.addEventListener('click', function(event) {
        event.preventDefault(); // 阻止默认行为
        const title = document.title;
        const url = window.location.href;
        const markdownLink = `[${title}](${url})`;

        linkContainer.innerHTML = `${markdownLink} <button style="${copyButtonStyle}">复制</button>`;
        linkContainer.style.display = 'block';

        // 为新的复制按钮添加事件
        const newCopyButton = linkContainer.lastChild;
        newCopyButton.addEventListener('click', function() {
            try {
                GM_setClipboard(markdownLink, 'text');
                newCopyButton.innerHTML = '复制成功'; // 在按钮上显示复制成功
                setTimeout(() => { newCopyButton.innerHTML = '复制'; }, 2000); // 2秒后复位按钮文字
            } catch (e) {
                newCopyButton.innerHTML = '复制失败'; // 在按钮上显示复制失败
                setTimeout(() => { newCopyButton.innerHTML = '复制'; }, 2000); // 2秒后复位按钮文字
            }
        });
    });

    // 右键点击按钮显示设置面板
    copyButton.addEventListener('contextmenu', function(event) {
        event.preventDefault(); // 阻止默认的右键菜单
        settingsPanel.style.display = 'block';
    });

    // 保存设置并应用
    document.getElementById('saveSettings').addEventListener('click', function() {
        buttonPosition = document.getElementById('positionSelect').value;
        buttonBottom = parseInt(document.getElementById('bottomInput').value, 10);
        buttonFontSize = parseInt(document.getElementById('fontSizeInput').value, 10);
        copyButton.style.cssText = createButtonStyle(); // 更新按钮样式
        settingsPanel.style.display = 'none'; // 关闭设置面板
    });

    // 点击显示框以外的地方关闭显示框
    window.addEventListener('click', function(event) {
        if (!linkContainer.contains(event.target) && event.target !== copyButton && !settingsPanel.contains(event.target)) {
            linkContainer.style.display = 'none';
            settingsPanel.style.display = 'none';
        }
    });
})();
