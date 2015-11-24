// ==UserScript==
// @name         WhatsApp Bot
// @namespace    http://www.3399.podserver.info/
// @version      0.1
// @description  A whatsapp bot just for fun
// @author       I3399I
// @match        https://web.whatsapp.com/
// @grant        I3399I, 2015
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var lastText;
var msgText;
var args;

function cmd(nm, syntax, desc) {
	this.nm = nm;
	this.syntax = syntax;
	this.desc = desc;
	this.run = function (args) {
		console.log('EXECUTED ' + this.nm + ' IN DEFAULT MODE');
	};
}

var say = new cmd('say', '[msg]', 'A command that makes me say something.');
say.run = function(args) {
	console.log(args[1] + "OMG");
}

var cmds = [say];

//By: http://stackoverflow.com/questions/646628/how-to-check-if-a-string-startswith-another-string
function stringStartsWith(string, prefix) {
	return string.slice(0, prefix.length) == prefix;
}

function parseCmd(msg) {
	msg = msg.slice(1, msg.length);
	args = msg.split(' ');
	for (var i = 0; i < cmds.length; i++) {
		if(args[0] == cmds[i].nm){
			cmds[i].run(args);
		};
	};
}

$(document).bind('DOMNodeInserted', function(e) {
	msgText = $('#main > div > div.pane-chat-msgs.pane-chat-body.lastTabIndex > div.message-list > div:last > div > div > div.message-text > span.emojitext.selectable-text').html();
	if (lastText != msgText){
		if (stringStartsWith(msgText, '#'))
			parseCmd(msgText);
	}
	lastText = msgText;
});