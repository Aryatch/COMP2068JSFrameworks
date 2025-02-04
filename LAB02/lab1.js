//Name=Rahul Hamal, Abishek Bhagat
//
//Import the 'prompt-sync' package to enable user input via the terminal
const prompt = require('prompt-sync')();

//ANSI Color Codes for styling terminal output
const colors = {
    reset: "\x1b[0m",     // Resets the color back to default
    yellow: "\x1b[33m",   // Yellow for highlighting choices
    green: "\x1b[32m",    // Green for a winning message
    red: "\x1b[31m",      // Red for a losing message
    blue: "\x1b[34m",     // Blue for a tie message
    cyan: "\x1b[36m"      // Cyan for general game messages
};

//Function to get the user's choice
function getUserChoice() {
    let userChoice;
    while (true) {
        // Prompting user for input
        console.log(`${colors.yellow}👉 Choose: ROCK 🪨 | PAPER 📄 | SCISSORS ✂️ ${colors.reset}`);
        userChoice = prompt("Your choice: ").trim().toUpperCase(); // Convert input to uppercase for uniformity

        //Check if the input is valid (only ROCK, PAPER, or SCISSORS)
        if (["ROCK", "PAPER", "SCISSORS"].includes(userChoice)) {
            return userChoice; // Return valid choice
        }

        //Display an error message for invalid input
        console.log(`${colors.red}⚠️ Invalid choice! Please enter ROCK, PAPER, or SCISSORS.${colors.reset}\n`);
    }
}

//Function to randomly generate the computer's choice
function getComputerChoice() {
    let choices = ["ROCK", "PAPER", "SCISSORS"]; // List of possible choices
    return choices[Math.floor(Math.random() * choices.length)]; // Randomly select one choice
}

//Function to determine the winner based on user & computer choices
function determineWinner(userChoice, computerChoice) {
    //Case 1: It's a tie if both choices are the same
    if (userChoice === computerChoice) {
        return `${colors.blue}🤝 It's a tie!${colors.reset}`;
    }

    //Case 2: User wins based on game rules
    if (
        (userChoice === "ROCK" && computerChoice === "SCISSORS") ||  // Rock beats Scissors
        (userChoice === "SCISSORS" && computerChoice === "PAPER") || // Scissors beat Paper
        (userChoice === "PAPER" && computerChoice === "ROCK")        // Paper beats Rock
    ) {
        return `${colors.green}🎉 You Win!${colors.reset}`;
    }

    //Case 3: Otherwise, the computer wins
    return `${colors.red}💻 Computer Wins!${colors.reset}`;
}

//Function to play the Rock-Paper-Scissors game
function playGame() {
    console.log(`${colors.cyan}\n🎮 Welcome to the Rock-Paper-Scissors Game! 🎮${colors.reset}\n`);

    let playAgain = true; // Flag to determine if the user wants to replay

    while (playAgain) { // Loop to keep playing until the user decides to stop
        // Get user and computer choices
        let userSelection = getUserChoice();
        let computerSelection = getComputerChoice();

        //Display choices with styling
        console.log(`\n🧑 You chose: ${colors.yellow}${userSelection}${colors.reset}`);
        console.log(`💻 Computer chose: ${colors.yellow}${computerSelection}${colors.reset}`);

        //Display the result
        console.log(`\n🏆 Result: ${determineWinner(userSelection, computerSelection)}\n`);

        //Ask if the user wants to play again
        let response = prompt("🔄 Do you want to play again? (yes/no): ").trim().toLowerCase();

        if (response !== "yes") { // If the response is anything other than "yes", exit
            playAgain = false;
            console.log(`${colors.cyan}👋 Thanks for playing! See you next time!${colors.reset}\n`);
        }
    }
}

//Start the game
playGame();
