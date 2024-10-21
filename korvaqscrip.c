#include <stdio.h>
#include <stdlib.h>
#include <windows.h>  // Include Windows API header

void setConsoleColor(int textColor, int backgroundColor) {
    // Get the handle to the console output
    HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
    
    // Set the text and background color
    SetConsoleTextAttribute(hConsole, textColor | backgroundColor);
}

int main() {
    // Set the title of the console window
    SetConsoleTitle("KorvaqScrip Node.js Runner");

    // Clear the console (optional)
    system("cls");

    // Set the console text color for the prompt (double purple)
    setConsoleColor(FOREGROUND_RED | FOREGROUND_BLUE | FOREGROUND_INTENSITY, 0);  // Purple color

    // Print the prompt
    printf("> ");  // Display the prompt symbol

    // Reset the color for normal output
    setConsoleColor(7, 0); // Default color: gray text on black background

    // Command to execute the Node.js script
    const char *command = "node ./code/script.js";

    // Execute the command
    int result = system(command);

    // Check if the command was successful
    if (result == -1) {
        perror("Error executing command");
        return 1;  // Return an error code
    }

    // Reset to default colors before exiting
    setConsoleColor(7, 0); // Reset to default colors
    return 0;  // Return success
}
