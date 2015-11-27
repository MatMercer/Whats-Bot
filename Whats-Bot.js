// ==UserScript==
// @name         WhatsApp Bot
// @namespace    http://www.3399.podserver.info/
// @version      0.4
// @description  A whatsapp bot just for fun
// @author       I3399I
// @match        https://web.whatsapp.com/
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

//Character used to indentify commands
var any = '#';

var lastId;
var id;
var msgText;
var args;

//Get the command request
$(document).bind('DOMNodeInserted', function(e) {
	msgText = $('#main > div > div.pane-chat-msgs.pane-chat-body.lastTabIndex > div.message-list > div:last > div > div > div.message-text > span.emojitext.selectable-text').html();
	id = $('#main > div > div.pane-chat-msgs.pane-chat-body.lastTabIndex > div.message-list > div:last > div > div > div.message-text > span.emojitext.selectable-text').attr('data-reactid');
	if (lastId !== id){
		if (stringStartsWith(msgText, any)) {
			parseCmd(msgText);
			sleep(100);
		}
	};
	lastId = id;
});

//CMD
function cmd(nm, syntax, desc) {
	this.nm = nm;
	this.syntax = syntax;
	this.desc = desc;
	this.run = function (args) {
		console.log('EXECUTED ' + this.nm + ' IN DEFAULT MODE');
	};
};

//Start of CMD area

var say = new cmd('say', '[msg]', 'A command that makes me say something.');
say.run = function(args) {
	console.log(args[1] + "OMG");
};

var test = new cmd('teste', '', 'A debug command');
test.run = function(args) {
	sendMsg(args[0]);
};

//End of CMD area

//All the cmds, used for listing/searching
var cmds = [say, test];

//Parse the cmds
function parseCmd(msg) {
	msg = msg.slice(1, msg.length);
	args = msg.split(' ');
	for (var i = 0; i < cmds.length; i++) {
		if(args[0] == cmds[i].nm){
			sleep(100);
			cmds[i].run(args);
		};
	};
};

//By: http://stackoverflow.com/questions/646628/how-to-check-if-a-string-startswith-another-string
function stringStartsWith(string, prefix) {
	return string.slice(0, prefix.length) == prefix;
};

//By: http://stackoverflow.com/questions/16873323/javascript-sleep-wait-before-continuing
function sleep(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds){
			break;
		}
	}
}

function sendMsg(msg){
	text = msg;
	reps = 1;
	campo = document.getElementsByClassName("input")[1];
	contador = 1;
	while(contador<=reps){
		dispatch(campo, "textInput", text); 
		var input = document.getElementsByClassName("icon btn-icon icon-send");
		input[0].click();
		contador++;
		setTimeout(function(){ }, 1);
	}
}

function dispatch(target, eventType, char) {
	sleep(200);
	var evt = document.createEvent("TextEvent");    
	evt.initTextEvent (eventType, true, true, window, char, 0, "en-US");
	target.focus();
	target.dispatchEvent(evt);
}