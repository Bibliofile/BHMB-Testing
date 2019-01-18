// ==UserScript==
// @name         Blockheads - MessageBot
// @namespace    http://portal.theblockheads.net/
// @version      0.1
// @description  try to take over the world!
// @author       Bibliofile
// @match        http://portal.theblockheads.net/worlds/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const container = document.querySelector('#tabs > ul');

    function createLink(text, url) {
        const li = container.appendChild(document.createElement('li'));
        const link = li.appendChild(document.createElement('a'));
        link.textContent = text;

        link.addEventListener('click', function() {
            const script = document.head.appendChild(document.createElement('script'));
            script.src = url;
            link.disabled = true;
        });
    }

    createLink('Bot 6.x', 'http://blockheadsfans.com/messagebot/bot/load');
    createLink('Bot 7.x', 'https://blockheads-messagebot.github.io/Browser-Loader/bundle.js');
})();
