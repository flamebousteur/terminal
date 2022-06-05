import { terminal, wasm } from './terminal.js';

// example of simple shell
const term = new terminal(document.querySelector('terminal'), window.innerHeight/15 - 1, window.innerWidth/10 - 3);

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
term.printf("%s %s %c\n", "Hello", "World", 33);