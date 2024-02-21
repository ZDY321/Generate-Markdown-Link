// ==UserScript==
// @name         Enhanced Markdown Link Generator with Customizable Position and Style
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  获取当前网站的网址和标题，并在页面中央显示Markdown格式的链接，以及一个复制按钮。当用户点击复制按钮时，将链接复制到剪贴板并显示相应的成功与否的提示。现在点击右下角按钮还可以更改按钮位置和样式。
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
        bottom: 50px;
        left: 50px;
        z-index: 10000;
        padding: 2px 5px; /* 调小按钮大小 */
        background-color: #4CAF50;
        color: white;
        border: none;
        cursor: pointer;
        border-radius: 5px;
        font-size: 9px; /* 调小文字大小 */
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

    // 创建复制按钮
    const copyButton = document.createElement('button');
    copyButton.innerHTML = 'Markdown-Link';
    copyButton.style.cssText = buttonStyle;

    // 创建显示Markdown链接的元素
    const linkContainer = document.createElement('div');
    linkContainer.style.cssText = linkStyle;

    // 将元素添加到页面中
    document.body.appendChild(copyButton);
    document.body.appendChild(linkContainer);

    // 更改按钮位置、样式、文字大小和边距的功能
copyButton.addEventListener('contextmenu', function(e) {
    e.preventDefault(); // 阻止默认的右键菜单
    const userStyle = prompt("请输入新样式（格式：侧边=边距/底部/字体大小），侧边可以是 'left' 或 'right'：", "right=50px/50px/9px");
    if (userStyle) {
        const [sideMargin, bottomFontSize] = userStyle.split('='); // 先分割侧边和边距与其余部分
        const [side, margin] = sideMargin.split('/'); // 分割侧边和边距
        const [bottom, fontSize] = bottomFontSize.split('/'); // 分割底部和字体大小

        // 确定用户想要按钮在左侧还是右侧，并据此应用
        if (side.trim().toLowerCase() === 'left' || side.trim().toLowerCase() === 'right') {
            copyButton.style.bottom = bottom;
            copyButton.style[side.trim().toLowerCase()] = margin; // 根据用户输入应用边距
            copyButton.style.fontSize = fontSize;
            // 如果之前在对面位置，清除那边的样式属性
            if (side.trim().toLowerCase() === 'left') {
                copyButton.style.right = ''; // 如果选择左侧，则清除右侧属性
            } else if (side.trim().toLowerCase() === 'right') {
                copyButton.style.left = ''; // 如果选择右侧，则清除左侧属性
            }
        } else {
            alert("无效位置。请指定 'left' 或 'right' 为侧边。");
        }
    }
});




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
        if (!linkContainer.contains(event.target) && event.target !== copyButton) {
            linkContainer.style.display = 'none';
        }
    });
})();
