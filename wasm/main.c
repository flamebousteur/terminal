#include <stdio.h>
#include "./terminalJS.h"

int main(int argc, char *argv[]) {
	// use the terminalJS.h functions to get the terminal size
	printf("%d : %d\n", getColumns(), getRows());

	// print all the arguments
	for (int i = 0; i < argc; i++) {
		printf("%d : %s\n", i, argv[i]);
	}
	return 0;
}

// emcc main.c -o main.wasm -s WASM=1
// !!! the error are not important