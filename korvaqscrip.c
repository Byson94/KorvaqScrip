#include <stdio.h>
#include <stdlib.h>
#include <windows.h>  // Include Windows API header

int main() {
    // Set the title of the console window
    SetConsoleTitle("KorvaqScrip Node.js Runner");

    // Command to execute the Node.js script
    const char *command = "node ./code/script.js";

    // Execute the command
    int result = system(command);

    // Check if the command was successful
    if (result == -1) {
        perror("Error executing command");
        return 1;  // Return an error code
    }

    return 0;  // Return success
}
