var terminal = function (terminalel, row = 10, column = 10) {
	this.terminalel = terminalel;
	this.cursor = [0,0]
	this.column = Math.floor(column);
	this.row = Math.floor(row);
	this.escape = false;
	this.escapestring = "";
	this.slash = false;
	this.slashstring = "";
	this.savecursor = [0,0];
	this.backgroundColor = "#222";
	this.color = "#fff";
	this.beeeeeper = document.createElement('audio');
	this.oncursormove = function (){}

	this.terminalel.innerHTML = "";
	let tb = document.createElement('table');
	this.terminalel.appendChild(tb);
	// creat tr and td for each row and column
	for (let i = 0; i < this.row; i++) {
		let tr = document.createElement('tr');
		tb.appendChild(tr);
		for (let j = 0; j < this.column; j++) {
			let td = document.createElement('td');
			tr.appendChild(td);
		}
	}
}

terminal.prototype.clear = function () {
	this.terminalel.querySelectorAll('td').forEach(function (td) {
		td.innerHTML = '&nbsp;';
		td.style.backgroundColor = "#222";
		td.style.color = "#fff";
	})
	// reset the cursor
	this.setcursor(0,0);
	this.oncursormove();
}

terminal.prototype.clearfromcursor = function () {
	let tr = this.terminalel.querySelectorAll('tr')[this.cursor[0]];
	let td = tr.querySelectorAll('td')[this.cursor[1]];
	td.innerHTML = '&nbsp;';
}

terminal.prototype.cleartoend = function () {
	let tr = this.terminalel.querySelectorAll('tr')[this.cursor[0]];
	let td = tr.querySelectorAll('td')[this.cursor[1]];
	let tdlist = tr.querySelectorAll('td');
	for (let i = this.cursor[1]; i < tdlist.length; i++) {
		tdlist[i].innerHTML = '&nbsp;';
	}
}

terminal.prototype.setcursor = function (x,y) {
	this.cursor = [x,y];
	this.oncursormove()
}

terminal.prototype.chartable = function (x,y,char) {
	let td = this.terminalel.querySelectorAll('td');
	if (!td[y*this.column+x]) return;
	td[y*this.column+x].innerHTML = char;
	// set the color of the cursor
	td[y*this.column+x].style.backgroundColor = this.backgroundColor;
	td[y*this.column+x].style.color = this.color;
}

terminal.prototype.setcolorbg = function (color = "#222") {
	// if the color is a array, then set the color of the cursor
	if (Array.isArray(color)) color = 'rgb('+color[0]+','+color[1]+','+color[2]+')';
	this.backgroundColor = color;
}

terminal.prototype.setcolorfg = function (color = "#fff") {
	// if the color is a array, then set the color of the cursor
	if (Array.isArray(color)) color = 'rgb('+color[0]+','+color[1]+','+color[2]+')';
	this.color = color;
}

terminal.prototype.putchar = function (char) {
	if (typeof char == "number") char = String.fromCharCode(char);
	if (char.length > 1) throw new Error("putchar: char must be a single character or a number");
	if (this.escape){
		// the escape sequence
		switch (char) {
			case '[':
				break;
			case 'H':
				var [x,y] = this.escapestring.split(';').map(x => parseInt(x));
				this.setcursor(x,y);
				this.escape = false;
				this.escapestring = "";
				break;
			case 'f':
				var [x,y] = this.escapestring.split(';').map(x => parseInt(x));
				this.setcursor(x,y);
				this.escape = false;
				this.escapestring = "";
				break;
			case 'A':
				var [x] = this.escapestring.split(';').map(x => parseInt(x));
				this.setcursor(this.cursor[0],this.cursor[1]-x);
				this.escape = false;
				this.escapestring = "";
				break;
			case 'B':
				var [x] = this.escapestring.split(';').map(x => parseInt(x));
				this.setcursor(this.cursor[0],this.cursor[1]+x);
				this.escape = false;
				this.escapestring = "";
				break;
			case 'C':
				var [x] = this.escapestring.split(';').map(x => parseInt(x));
				this.setcursor(this.cursor[0]+x,this.cursor[1]);
				this.escape = false;
				this.escapestring = "";
				break;
			case 'D':
				var [x] = this.escapestring.split(';').map(x => parseInt(x));
				this.setcursor(this.cursor[0]-x,this.cursor[1]);
				this.escape = false;
				this.escapestring = "";
				break;
			case 'J':
				var [x] = this.escapestring.split(';').map(x => parseInt(x));
				switch (x) {
					case 0:
						this.clear();
						break;
					case 1:
						this.clearfromcursor();
						break;
					case 2:
						this.cleartoend();
						break;
//					default:
//						throw new Error("putchar: escape sequence J: unknown escape sequence");
				}
				this.escape = false;
				this.escapestring = "";
				break;
			case 'K':
				// Erase to end of line
				this.cleartoend();
				this.escape = false;
				this.escapestring = "";
				break;
			case 's':
				this.savecursor = this.cursor;
				this.escape = false;
				this.escapestring = "";
				break;
			case 'u':
				this.setcursor(this.savecursor[0],this.savecursor[1]);
				this.escape = false;
				this.escapestring = "";
				break;
			case 'm':
				var colors = this.escapestring.split(';')
				if (colors.length == 1 || colors.length == 2) {
					// SGR is actually partially supported
					// SGR refference: https://en.wikipedia.org/wiki/ANSI_escape_code#SGR_(Select_Graphic_Rendition)_parameters
					for (let i = 0; i < colors.length; i++) {
						switch (colors[i]) {
							case '0':
								this.setcolorbg();
								this.setcolorfg();
								break;
							case '30':
								this.setcolorfg("#222");
								break;
							case '31':
								this.setcolorfg([255,0,0]);
								break;
							case '32':
								this.setcolorfg([0,255,0]);
								break;
							case '33':
								this.setcolorfg([255,255,0]);
								break;
							case '34':
								this.setcolorfg([0,0,255]);
								break;
							case '35':
								this.setcolorfg([255,0,255]);
								break;
							case '36':
								this.setcolorfg([0,255,255]);
								break;
							case '37':
								this.setcolorfg([255,255,255]);
								break;
							// Bright color
							case '90':
								this.setcolorfg([118,118,118]);
								break;
							case '91':
								this.setcolorfg([231,72,86]);
								break;
							case '92':
								this.setcolorfg([22,198,12]);
								break;
							case '93':
								this.setcolorfg([249,241,165]);
								break;
							case '94':
								this.setcolorfg([59,120,255]);
								break;
							case '95':
								this.setcolorfg([180,0,158]);
								break;
							case '96':
								this.setcolorfg([97,214,214]);
								break;
							case '97':
								this.setcolorfg([242,242,242]);
								break;
							// background color
							case '40':
								this.setcolorbg("#222");
								break;
							case '41':
								this.setcolorbg([255,0,0]);
								break;
							case '42':
								this.setcolorbg([0,255,0]);
								break;
							case '43':
								this.setcolorbg([255,255,0]);
								break;
							case '44':
								this.setcolorbg([0,0,255]);
								break;
							case '45':
								this.setcolorbg([255,0,255]);
								break;
							case '46':
								this.setcolorbg([0,255,255]);
								break;
							case '47':
								this.setcolorbg([255,255,255]);
								break;
							// Bright background color
							case '100':
								this.setcolorbg([118,118,118]);
								break;
							case '101':
								this.setcolorbg([231,72,86]);
								break;
							case '102':
								this.setcolorbg([22,198,12]);
								break;
							case '103':
								this.setcolorbg([249,241,165]);
								break;
							case '104':
								this.setcolorbg([59,120,255]);
								break;
							case '105':
								this.setcolorbg([180,0,158]);
								break;
							case '106':
								this.setcolorbg([97,214,214]);
								break;
							case '107':
								this.setcolorbg([242,242,242]);
								break;
							default:
								this.setcolorbg();
								this.setcolorfg();
								break;
						}
					}
				} else if (colors.length == 3) {
					// 8-bit actually not supported
					// 8-bit refference: https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit
//					var color = colors.map(x => parseInt(x));
//					this.setcolor(color);
				} else if (colors.length == 5) {
					// 24-bit refference: https://en.wikipedia.org/wiki/ANSI_escape_code#24-bit
					if (colors[0] == "38") {
						this.setcolorfg([colors[2],colors[3],colors[4]]);
					} else if (colors[0] == "48") {
						this.setcolorbg([colors[2],colors[3],colors[4]]);
					}
				} else {
					this.setcolorfg(0);
				}
				this.escape = false;
				this.escapestring = "";
				break;
			default:
				this.escapestring += char;
				break;
		}
	} else if (this.slash) {
		switch (char) {
			case 'a':
				this.slash = false;
				this.beeeeeper.play();
				break;
			case 'b':
				this.slash = false;
				this.putchar('\b');
				break;
			case 'e':
				this.slash = false;
				this.escape = true;
				break;
			case 'f':
				this.slash = false;
				this.putchar('\f');
				break;
			case 'n':
				this.slash = false;
				this.putchar('\n');
				break;
			case 'r':
				this.slash = false;
				this.putchar('\r');
				break;
			case 't':
				this.slash = false;
				this.putchar('\t');
				break;
			case 'v':
				this.slash = false;
				this.putchar('\v');
				break;
			case '\\':
				this.slash = false;
				this.putchar('\\');
				break;
			default:
				this.slash = false;
				this.putchar(char);
				break;
		}
	} else {
		switch (char) {
			case '\x1b':
				// escape sequence
				this.escape = true;
				break;
			case "\n":
				this.cursor[0] = 0;
				this.cursor[1]++;
				this.oncursormove()
				break;
			case "\r":
				this.cursor[0] = 0;
				this.oncursormove()
				break;
			case "\b":
				this.cursor[0]--;
				this.oncursormove()
				break;
			case "\t":
				this.cursor[0] += 8 - (this.cursor[0] % 8);
				this.oncursormove()
				break;
			case "\f":
				this.cursor[0] = 0;
				this.cursor[1] = 0;
				this.oncursormove()
				this.clear();
				break;
			case "\u0007":
				// beeeeeeeeeeeeeeeeeeeeeeeep
				this.beeeeeper.play();
				break;
			case "\v":
				this.cursor[1]++;
				this.oncursormove()
				break;
			case "":
				break;
			case "\\":
				this.slash = true;
				break;
			default:
				this.chartable(this.cursor[0],this.cursor[1],char);
				this.cursor[0]++;
				if (this.cursor[0] >= this.column) {
					this.cursor[0] = 0;
					this.cursor[1]++;
				}
				if (this.cursor[1] >= this.row) {
					// add a new line tr
					let tr = document.createElement('tr');
					this.terminalel.querySelector('table').appendChild(tr);
				}
				this.oncursormove()
				break;
		}
	}
	return char;
}

terminal.prototype.puts = function (text) {
	if (typeof text == "number") return this.putchar(text);
	for (let i = 0; i < text.length; i++) {
		this.putchar(text[i]);
	}
	return text.length;
}

terminal.prototype.printf = function (text, ...args) {
	let on = false;
	let result = '';
	for (let i = 0; i < text.length; i++) {
		if (text[i] == "%") {
			on = true;
		} else if (on) {
			on = false;
			if (text[i] == "d" || text[i] == "i" || text[i] == "ld" || text[i] == "li" || text[i] == "hd" || text[i] == "hi" || text[i] == "f" || text[i] == "s") {
				result += args[0]
				args.shift();
			} else if (text[i] == "c") {
				result += String.fromCharCode(args[0]);
				args.shift();
			} else if (text[i] == "p") {
				console.log("I don't know how to print a pointer in javascript");
				args.shift();
			} else if (text[i] == "x" || text[i] == "X") {
				result += args[0].toString(16);
			} else if (text[i] == "o") {
				result += args[0].toString(8);
			} else if (text[i] == "u") {
				result += args[0].toString(10);
			} else {
				result += text[i];
			}
		} else {
			result += text[i];
		}
	}
	return this.puts(result);
}

// input system ======================================================================
var input = function (terminal){
	this.terminal = terminal
	this.cursorele = document.createElement('span');
	this.in = "";
	this.inpos = 0;
	this.lines = 0
	this.historic = {
		cursor:0,
		up:function() {
			if(this.cursor+1 < this.commands.length){
				this.cursor++
			}
			return this.commands[this.cursor]
		},
		down:function() {
			if(this.cursor != 0){
				this.cursor--
			}
			return this.commands[this.cursor]
		},
		commands:[]
	}

	this.terminal.terminalel.appendChild(this.cursorele);
	this.cursorele.style.position = "absolute";
	this.cursorele.style.top = "0px";
	this.cursorele.style.left = "0px";
	document.body.addEventListener('keydown', this.key.bind(this))
	this.terminal.oncursormove = this.oncursormove.bind(this);
}

input.prototype.show = function (n = 0) {
	// reset cursor position
	let b = this.inpos - 1
	if (b < 0) b = 0
	let a = this.terminal.cursor[0] - (b) - n
	if (a < 0) a = 0;
	this.terminal.setcursor(
		a,
		this.terminal.cursor[1]
	);
	// show input
	this.terminal.puts(this.in);
}

input.prototype.oncursormove = function () {
	// mouve the cursor element to the selected td element
	let tr = this.terminal.terminalel.querySelectorAll('tr')[this.terminal.cursor[1]];
	if (tr) {
		let td = tr.querySelectorAll('td')[this.terminal.cursor[0]];
		if (td) {
			this.cursorele.innerHTML = '';
			this.cursorele.style.top = td.offsetTop+'px';
			this.cursorele.style.left = td.offsetLeft+'px';
		}
	}
}

input.prototype.addinput = function (str) {
	// add str to this.in at the right position
	this.in = this.in.substring(0,this.inpos) + str + this.in.substring(this.inpos);
	this.inpos += str.length;
	this.oncursormove();
}

input.prototype.delinput = function () {
	if (this.in.length <= 0) return;
//	this.in = this.in.slice(0,this.inpos-1) + this.in.slice(this.inpos);
	this.in = this.in.substring(0,this.inpos-1) + this.in.substring(this.inpos);
	this.inpos--;
	this.oncursormove();
}

input.prototype.cleainput = function () {
	this.in = "";
	this.inpos = 0;
	this.oncursormove();
}

input.prototype.key = function (e) {
	if (this.onkey) this.onkey(e);
	if (e.key.length === 1) {
		this.addinput(e.key);
		this.show()
		this.historic.commands[0] = this.in;
	} else if (e.key === "Backspace") {
		// delete last char in the terminal
		this.delinput()
		if (this.in.length >= 0) {
			this.terminal.puts("\b \b");
			this.show(2)
		} else if (this.lines > 0) {
			// delete go up one line with escape sequence
			this.lines--;
			this.terminal.puts("\b \b");
			this.show(2)
		}
		this.historic.commands[0] = this.in;
	} else if (e.key === "Enter") {
		if (e.shiftKey === true) {
			this.addinput("\n");
			this.show()
			this.lines++;
		} else {
			if(this.in != ''){
				if (this.onsend) this.onsend(this.in);

				if(this.in != this.historic.commands[1]){
					this.historic.commands.splice(1,0,this.in)
				}
				this.historic.commands[0] = ""
				this.historic.cursor = 0
				if(this.historic.commands.length > 10){
					this.historic.commands.splice(10,this.historic.commands.length - 10)
				}
				this.cleainput();
			}
		}
	} else if (e.key === "ArrowLeft") {
		if(this.inpos > 0){
			this.inpos--;
			this.terminal.cursor[0]--;
			if (this.terminal.cursor[0] < 0) this.terminal.cursor[0] = 0;
			this.oncursormove();
		}
	} else if (e.key === "ArrowRight") {
		if(this.inpos < this.in.length){
			this.inpos++;
			this.terminal.cursor[0]++;
			if (this.terminal.cursor[0] >= this.terminal.column) this.terminal.cursor[0] = this.terminal.column-1;
			this.oncursormove();
		}
	} else if (e.key === "ArrowUp") {
		let b = this.historic.up()
		if(typeof b != "undefined"){
			this.in = b
		}
	} else if (e.key === "ArrowDown") {
		let b = this.historic.down()
		if(typeof b != "undefined"){
			this.in = b
		}
	}
}

// webassembly module for terminal ============================================================
// not finished but working

var wams_func = function(term = null) {
	if (term != null) {
		this.term = term;
	}
	this.stream = {
		stdout: function (char){
			if (term) term.putchar(char);
			else console.log(char);
		}
	}
}

wams_func.prototype.fd_write = function(fd, char) {
	if (fd == 1) {
		this.stream.stdout(char);
	}
}

var wasm = function (url, importObject = true, args = [], term = null) {
	var memory;
	var memory8;
	var memory32;
	var wmsf;
	if (term != null) wmsf = new wams_func(term);
	else wmsf = new wams_func();
	if (importObject === true) {
		var importObject = {
			env: {
				getColumns: function () {
					if (term) return term.column;
					else return 0;
				},
				getRows: function () {
					if (term) return term.row;
					else return 0;
				}
			},
			wasi_snapshot_preview1:{
				proc_exit: function(code) {
					console.log("exit code: ", code);
					return 1;
				},
				// https://github.com/WebAssembly/WASI/blob/main/phases/snapshot/docs.md#-fd_writefd-fd-iovs-ciovec_array---resultsize-errno
				// TypeScript: fd_write  (fd: number, iovs: iovec_t, iovs_len: number, errno: number): number
				fd_write: function(fd, iov, iovcnt, pnum) {
					// original code from emscripten
					var num = 0;
					for (var i = 0; i < iovcnt; i++) {
						var ptr = memory32[((iov)>>2)];
						var len = memory32[(((iov)+(4))>>2)];
						iov += 8;
						for (var j = 0; j < len; j++) {
							wmsf.fd_write(fd, memory8[ptr+j]);
						}
						num += len;
					}
					memory32[((pnum)>>2)] = num;
					return 0;
				},
				fd_close: function(fd) {
					console.log("fd_close",fd)
					return 1;
				},
				fd_seek: function(fd, offset, whence) {
					console.log(fd, offset, whence)
					return 1;
				},
				args_sizes_get: function(pnum) {
					// args is an array of strings
					memory32[((pnum)>>2)] = args.length;
					return 0;
				},
				args_get: function(argv, argv_buf) {
					console.log(argv, argv_buf)
					// args is an array of strings
					for (var i = 0; i < args.length; i++) {
						let arr = [];
						var ptr = memory32[((argv)>>2)];
						var len = args[i].length;
						for (var j = 0; j < len; j++) {
							memory8[ptr+j] = args[i].charCodeAt(j);
							arr.push(memory8[ptr+j])
						}
						memory32[(((argv)+(4))>>2)] = len;
						argv += 8;
						console.log(String.fromCharCode.apply(null, arr));
					}
					return 0;
				},
			},
		}
	}
	var r;
	return new Promise(function(resolve, reject) {
		WebAssembly.instantiateStreaming(fetch(url),importObject)
		.then(result => {
			r = result.instance.exports;
			memory = r.memory;
			memory8 = new Uint8Array(memory.buffer);
			memory32 = new Uint32Array(memory.buffer);
			resolve(r);
		}).catch(e => reject(e));
	})
}

export { terminal, input, wasm };