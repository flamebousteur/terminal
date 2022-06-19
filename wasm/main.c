#include <stdio.h>
#include "./terminalJS.h"

int main() {
	printf("%d : %d", getColumns(), getRows());
	return 0;
}

// emcc main.c -o main.wasm -s WASM=1
// !!! the error are not important