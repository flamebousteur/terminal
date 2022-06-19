#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#define ENABLE_VIRTUAL_TERMINAL_PROCESSING 0x0004
#define true 1
#define TRUE 1
#define false 0
#define FALSE 0
#define SIZEARR(a) sizeof(a)/sizeof(a[0])

#define SET_CELL(x,y) NewArray[x + y * width] = 1; OldArray[x + y * width] = 1;
#define DEL_CELL(x,y) NewArray[x + y * width] = 0; OldArray[x + y * width] = 0;
#define FOOTER(text) printf("\033[%d;%dH%s\033[0;0H", rows, footer_width, text); footer_width+=strlen(text) + 1;
#define FOOTER_ATT(text, pos) printf("\033[%d;%dH%s\033[0;0H", rows, pos, text);
#define FOOTER_RIGHT(text) printf("\033[%d;%dH%s\033[0;0H", rows, width - strlen(text) - 1, text);
#define FOOTER_CENTER(text) printf("\033[%d;%ldH%s\033[0;0H", rows, (width - strlen(text)) / 2, text);

int main(){
	int footer_width = 0;
	printf("start set up\n");
	printf("this code is made for WIN32 10\n");
	int columns = 10,
		rows = 10;

	printf("set up done ");
	// game of life
	/* rule
	1. Any live cell with fewer than two live neighbours dies, as if caused by under-population.
	2. Any live cell with two or three live neighbours lives on to the next generation.
	3. Any live cell with more than three live neighbours dies, as if by overcrowding.
	4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
	*/
	int width = columns, height = rows - 3;
	char filename[256] = "./setup";
	if (width < 5 || height < 5){
		printf("width and height must be greater than 5\n");
		return 1;
	}
	printf("start game of life");
	FOOTER_CENTER("game of life");
	int total = width * height;
	int OldArray[total];
	int NewArray[total];
	// reset array
	for (int i = 0; i < total; i++){
		OldArray[i] = 0;
		NewArray[i] = 0;
	}

	// read the setup file
	int i = 0;
	int row = 0;
	char c;
	char fileContent[20] = ",#,\
,,#\
###\00";
	while ((c = fileContent[i + row]) != '\0'){
		if (c == '\n') {
			row++;
			i = 0;
			printf("%c", c);
		} else {
			if (c == '#'){
				NewArray[i + row * width] = 1;
				OldArray[i + row * width] = 1;
				printf("%d : %d\n", i, row);
			}
			i++;
		}
	}

	int alive = 0;
	do {
		// set the cursor to top left
		printf("\e[0;0H");
		// check if the cell is alive or dead
		// if alive, check the number of alive neighbors
		for (int i=0;i<total;i++){
			// check the number of alive neighbors
			// 0 is dead
			// 1 is alive
			int count = 0;
			int x = i % width;
			int y = i / width;
			if (x > 0 && OldArray[i - 1] == 1) count++;
			if (x < width - 1 && OldArray[i + 1] == 1) count++;
			if (y > 0 && OldArray[i - width] == 1) count++;
			if (y < height - 1 && OldArray[i + width] == 1) count++;
			if (x > 0 && y > 0 && OldArray[i - width - 1] == 1) count++;
			if (x < width - 1 && y > 0 && OldArray[i - width + 1] == 1) count++;
			if (x > 0 && y < height - 1 && OldArray[i + width - 1] == 1) count++;
			if (x < width - 1 && y < height - 1 && OldArray[i + width + 1] == 1) count++;
			if (OldArray[i] == 1){
				alive++;
				if (count < 2) NewArray[i] = 0;
				else if (count == 2 || count == 3) NewArray[i] = 1;
				else NewArray[i] = 0;
			} else {
				if (count == 3) NewArray[i] = 1;
				else NewArray[i] = 0;
			}
		}
		// set old array to new array and clear new array
		for (int i = 0; i < total; i++){
			OldArray[i] = NewArray[i];
			NewArray[i] = 0;
		}
		// draw
		for (int i=0;i<total;i++){
			if (OldArray[i] == 1){
				printf("#");
			} else {
				printf(" ");
			}
			if ((i+1) % width == 0){
				printf("\n");
			}
		}
		if (alive == 0){
			printf("game over\n");
			return 0;
		}
		printf("\033[%d;0Halive: %d\033[0;0H", rows, alive);
		alive = 0;
	} while (true);
}