import { terminal , input } from './terminal.js';

// example of simple shell
let lines = 0
const term = new terminal(document.querySelector('terminal'), window.innerHeight/15 - 1, window.innerWidth/10 - 3);

const inp = new input(term);
inp.onkey = function (e){}

function comble(txt,lenght){
	let result = [];
	for (let i=0; i < lenght; i++){
		txt[i] ? result.push(txt[i]) : result.push(" ")
	}
	return result.join("")
}

let commands = {
	'help': 'show this help message',
	'echo': 'show a message',
	'clear | cls': 'clear the terminal',
	'reset': 'page: reload the page\n\thistory | h: clear the history',
}

function command(cmd) {
	cmd = cmd.split(' ')
	let cmd_name = cmd[0]
	let cmd_args = cmd.slice(1)
	switch (cmd_name) {
		case "help":
			if (cmd_args[1]) {
				return commands[cmd_args[1]]
			} else {
				let c = ''
				let maxl = 0
				for (let key in commands) if(key.length>maxl) maxl = key.length
				maxl += 2
				for (let i in commands) {
					c += comble(i,maxl)+commands[i]+'\n'
				}
				return c
			}
		case "echo":
			return cmd_args.join(' ');
		case "cls":
			term.clear();
			lines = 0;
			break;
		case "clear":
			term.clear();
			lines = 0;
			break;
		case 'reset':
			if (cmd_args[0]) {
				if (cmd_args[0] === "page"){
					window.location.reload();
					return "reloading page";
				}else if (cmd_args[0] === "history" || cmd_args[0] === "h") {
					inp.historic.commands = [];
					return "commands history reseted";
				}
			}
			break;
		default:
			return "Unknown command: " + cmd;
	}
}

inp.onsend = function (text) {
	term.puts("\n");
	let r = command(text)
	if (r){
		term.puts(r+'\n')
	}
}

// demo
for (let i = 0; i < 11; i++) {
	for (let j = 0; j < 10; j++) {
		let n = 10 * i + j;
		if (n > 107) break;
		term.puts("\x1b["+n+"m "+n+"\x1b[0m");
	}
	term.puts("\n");
}

term.puts("\x1b[1;31mHello\x1b[m \x1b[1;32mWorld\x1b[m \x1b[1;33m!\x1b[0m\n");
term.printf("%s %s %s\n", "Hello", "World", "!");