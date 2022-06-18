#include <stdio.h>

int main() {
	puts("Hello World!");
	return 0;
}
// emcc main.c -O1 -o main.wasm -s WASM=1 -s SIDE_MODULE=1