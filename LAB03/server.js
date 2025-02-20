// Import required modules
const http = require('http');     // Built-in HTTP module
const url = require('url');       // URL module to parse query parameters
const connect = require('connect'); // Connect framework for middleware support

// Function to perform calculations
function calculate(req, res) {
    // Parse the URL to extract query parameters
    const queryObject = url.parse(req.url, true).query;
    
    // Extract method, x, and y from the query string
    const method = queryObject.method;
    const x = parseFloat(queryObject.x);
    const y = parseFloat(queryObject.y);
    
    let result;
    
    // Check if x and y are valid numbers
    if (isNaN(x) || isNaN(y)) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        return res.end("Error: x and y must be valid numbers.");
    }

    // Perform the appropriate operation based on the method parameter
    if (method === "add") {
        result = `${x} + ${y} = ${x + y}`;
    } else if (method === "subtract") {
        result = `${x} - ${y} = ${x - y}`;
    } else if (method === "multiply") {
        result = `${x} * ${y} = ${x * y}`;
    } else if (method === "divide") {
        // Handle divide-by-zero case
        result = y !== 0 ? `${x} / ${y} = ${x / y}` : "Error: Division by zero is not allowed.";
    } else {
        result = "Invalid method. Please use add, subtract, multiply, or divide.";
    }

    // Send response to the client
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(result);
}

// Create a Connect app instance
const app = connect();

// Use the calculate function as middleware
app.use('/lab3', calculate);

// Create an HTTP server using the Connect app
http.createServer(app).listen(3000, () => {
    console.log("Server running at http://localhost:3000/lab3?method=add&x=16&y=4");
});
