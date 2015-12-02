// ==UserScript==
// @name         WhatsApp Bot
// @namespace    http://www.3399.podserver.info/
// @version      1.5 BETA
// @description  A whatsapp bot just for fun
// @author       I3399I
// @match        https://web.whatsapp.com/
// @grant        Thanks for Macr's Warehouse making this good WS send msg method!
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

//Character used to indentify commands
var any = '/';

//Do debug or not
var doDebug = true;

//General vars
var args;
var id;
var lastId;
var msgText;
var version = '1.5 BETA';

//Get the CMD request
$(document).bind('DOMNodeInserted', function(e) {
	msgText = $('#main > div > div.pane-chat-msgs.pane-chat-body.lastTabIndex > div.message-list > div:last > div > div > div.message-text > span.emojitext.selectable-text').html();
	id = $('#main > div > div.pane-chat-msgs.pane-chat-body.lastTabIndex > div.message-list > div:last > div > div > div.message-text > span.emojitext.selectable-text').attr('data-reactid');
	if (lastId !== id){
		if (stringStartsWith(msgText, any)) {
			debug("Detected a command");
			parseCmd(msgText);
		}
	}
	lastId = id;
});

//CMD constructor
function cmd(nm, syntax, desc) {
	this.nm = nm;
	this.syntax = syntax;
	this.desc = desc;
	this.run = function (args) {
		console.log('EXECUTED ' + this.nm + ' IN DEFAULT MODE');
	};
}

//Start of CMD area

//Vars area
var tdareStack = [];
//End of vars area

var about = new cmd('about', '', 'About the Bot');
about.run = function(args) {
	send('WhatsApp Bot | Made by I3399I');
	send('Version ' + version);
	send('Source code at: http://bit.ly/1LMtENe');
};

var countdown = new cmd('countdown', '[TIMES] [MS]', 'Generates a countdown with custom miliseconds, min delay is 100 ms');
countdown.run = function(args) {
	var useIt = false;
	if(!useIt){
		send('This CMD is turned off due to spam!');
		return;
	}

	var i = 0;

	if(args.length < 3) { 
		syntaxError();
		return;
	}
	var times = parseInt(args[1]);
	if(isNaN(times))
		times = 5;
	debug('[COUNTDOWN] Got ' + times + ' times');
	var ms = parseInt(args[2]);
	if(isNaN(ms))
		ms = 500;
	ms -= 100;
	if(ms < 100)
		ms = 100;
	debug('[COUNTDOWN] Got ' + ms + ' miliseconds');
	
	if(times > 10){
		send('times too high! using 10 times instead!');
		times = 10;
	}

	if(ms > 2000){
		send('MS too high! using 2000ms instead!');
		ms = 2000;
	}

	send(times);

	loop();

	function loop() {
		setTimeout(function () {
			times--;
			if (times >= 0) {
				send(times);
				loop();
			}
		}, 	ms)
	};
};

var fact = new cmd('fact', '[NUMBER]', 'Returns the factorial of a x number');
fact.run = function(args) {
	if(args.length > 1 && !isNaN(args[1])){
		send(factorial(parseInt(args[1])));
	}
	else
		syntaxError();
};

var help = new cmd('help', '[CMD]', 'Used for help');
help.run = function(args) {
	var found = false;

	for (var i = 0; i < cmds.length; i++) {
		if(args[1] == cmds[i].nm){
			debug("[HELP CMD] Found " + args[1] + " CMD");
			send(cmds[i].nm.charAt(0).toUpperCase() + cmds[i].nm.slice(1) + "\n" + cmds[i].desc + '\nSyntax: ' + any + cmds[i].nm + ' ' + cmds[i].syntax);
			found = true;
		}
	}

	if (!found)
		send('No CMD with name "' + args[1] + '" found, use\n' + any + 'list to see all the CMDs');
};

var list = new cmd('list', '', 'Lists all the CMDs avaible');
list.run = function(args) {
	send('Avaible CMDs:\n');
	send('<---------->');

	for (var i = 0; i < cmds.length; i++) {
		send(cmds[i].nm);
	}
	send('<---------->');
	send('\nUse ' + any + 'help [CMD] to see how to use');
};

var say = new cmd('say', '[msg]', 'A command that makes me say something');
say.run = function(args) {
	args[0] = "";
	send(args.join(' '));
};

var tadd = new cmd('tadd', '[NAME]', 'Adds a person to tdare CMD');
tadd.run = function(args) {
	if(args.length < 2){
		syntaxError();
		return;
	}
	args[0] = '';
	var p = args.join(' ').substring(1);

	tdareStack[tdareStack.length] = p;
	send('Added ' + p + ' person to tdareStack');
};

var tdare = new cmd('tdare', 'set [truth|dare|both]', 'Truth or Dare CMD, generates random results or Use ' + any + 'tdare set [MODE] to change the mode.');
tdare.mode = 'both';
tdare.run = function(args) {
	if(args.length > 2){
		if(args[1] == 'set'){
			switch(args[2]){
				case 'truth':
				this.mode = 'truth';
				send('Set Truth or Dare mode to only truth');
				break;
				case 'dare':
				this.mode = 'dare';
				send('Set Truth or Dare mode to only dare');
				break;
				case 'both':
				this.mode = 'both';
				send('Set Truth or Dare mode to both');
				break;
				default:
				send('Invalid mode!');
			}
		}
	}else {
		if(tdareStack.length < 2){
			send('Error! At least 2 people need to be added! Used /tadd to add them');
			return;
		}
		var td = rand(0, 2);
		var nb1 = rand(0, tdareStack.length);
		var nb2 = rand(0, tdareStack.length);
		var msg;

		for(var i = 0; i < 10; i++){
			if(nb1 !== nb2){
				break;
			}
			nb1 = rand(0, tdareStack.length);
			nb2 = rand(0, tdareStack.length);
			debug('[TDARE] Looped for rand');
		}
		debug('[TDARE] Got ' + nb1 + ' index for first person');
		debug('[TDARE] Got ' + nb2 + ' index for first person');

		switch(this.mode){
			case 'truth':
			send(tdareStack[nb1] + ' asks ' + tdareStack[nb2]);
			break;
			case 'dare':
			send(tdareStack[nb1] + ' dares ' + tdareStack[nb2]);
			break;
			case 'both':
			msg = td > 0 ? ' asks ' : ' dares ';
			send(tdareStack[nb1] + msg + tdareStack[nb2]);
			break;
		}
	}
};

var tlist = new cmd('tlist', '', 'Lists all the persons from tdare CMD');
tlist.run = function(args) {
	for (var i = 0; i < tdareStack.length; i++) {
		send(tdareStack[i]);
	}
};

var trmv = new cmd('trmv', '[NAME]', 'Removes a person from tdare CMD');
trmv.run = function(args) {
	if(args.length < 2){
		syntaxError();
		return;
	}
	args[0] = '';
	var p = args.join(' ').substring(1);

	var index = tdareStack.indexOf(p);

	debug(['[TRMV] Got ' + index + ' index']);

	if(index > -1){
		tdareStack.splice(index, 1);
		send('Removed ' + p + ' from tdareStack');
	}
	else
		send('No person with name ' + p + ' found');
};

var whoisfat = new cmd('whoisfat', '', 'A stupid CMD');
whoisfat.run = function(args) {
	send('UR MOM! HUEHUEHUEHHUE');
};

//All the CMDs, used for listing/searching
var cmds = [
about, 
countdown,
fact,
help,
list,
say,
tadd,
tdare,
list,
trmv,
whoisfat];

//End of CMD area

//Parse the CMDs
function parseCmd(msg) {
	msg = msg.slice(1, msg.length);
	debug("Got '" + msg + "' CMD request.");
	args = msg.split(' ');
	for (var i = 0; i < cmds.length; i++) {
		if(args[0] == cmds[i].nm){
			debug("Executed " + args[0] + " CMD");
			cmds[i].run(args);
		}
	}
}

//Utils area

function debug(msg) {
	if(doDebug)
		console.log("[DEBUG]  " + msg + "\n");
}

//By: http://stackoverflow.com/questions/646628/how-to-check-if-a-string-startswith-another-string
function stringStartsWith(string, prefix) {
	return string.slice(0, prefix.length) == prefix;
}

//Based on http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
function rand(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

function syntaxError() {
	debug('Syntax Error!');
	send('Invalid syntax! Use\n' + any + 'help [CMD] to see how to use!');
}

function factorial(x) {
	if(x <= 1)
		return 1;
	else
		return x * factorial(x -1);
}

//End of utils area

//Send msgs 'engine'

//Based on http://macr1408.260mb.org/wspam2.html
function dispatch(target, eventType, msg) {
	var evt = document.createEvent("TextEvent");    
	evt.initTextEvent (eventType, true, true, window, msg, 0, "en-US");
	target.focus();
	target.dispatchEvent(evt);
}

function send(msg){
	setTimeout(function() {
		spam(msg);
	}, 100);
}

//Based on http://macr1408.260mb.org/wspam2.html
function spam(msg){
	texto = msg;
	campo = document.getElementsByClassName("input")[1];
	dispatch(campo, "textInput", texto); 
	var input = document.getElementsByClassName("icon btn-icon icon-send");
	input[0].click();
	setTimeout(function(){ }, 50);
}

//End of send msgs 'engine'