// ==UserScript==
// @name         Generate Markdown Link
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  获取当前网站的网址和标题，并在页面中央显示Markdown格式的链接，以及一个复制按钮。当用户点击复制按钮时，将链接复制到剪贴板并显示相应的成功与否的提示
// @match      *://*/*
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    // 创建右下角按钮样式
    const buttonStyle = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        padding: 5px 10px; /* 调小按钮大小 */
        background-color: #4CAF50;
        color: white;
        border: none;
        cursor: pointer;
        border-radius: 5px;
        font-size: 12px; /* 调小文字大小 */
    `;

    // 创建复制按钮样式
    const copyButtonStyle = `
        padding: 5px 10px; /* 调小按钮大小 */
        background-color: #007BFF; /* 改为蓝色 */
        color: white;
        border: none;
        cursor: pointer;
        border-radius: 5px;
        margin-left: 10px;
        font-size: 10px; /* 调小文字大小 */
    `;

    // 创建显示链接的样式
    const linkStyle = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10000;
        background-color: white;
        border: 1px solid black; /* 修改边框颜色为黑色 */
        padding: 10px;
        border-radius: 5px;
        display: none;
        font-size: 10px; /* 调小文字大小 */
    `;

    // 创建复制按钮
    const copyButton = document.createElement('button');
    copyButton.innerHTML = 'Generate Markdown Link';
    copyButton.style.cssText = buttonStyle;

    // 创建显示Markdown链接的元素
    const linkContainer = document.createElement('div');
    linkContainer.style.cssText = linkStyle;

    // 将元素添加到页面中
    document.body.appendChild(copyButton);
    document.body.appendChild(linkContainer);

    // 点击按钮时的行为
    copyButton.addEventListener('click', function() {
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

    // 点击显示框以外的地方关闭显示框
    window.addEventListener('click', function(event) {
        if (!linkContainer.contains(event.target) && event.target !== copyButton) {
            linkContainer.style.display = 'none';
        }
    });
})();
