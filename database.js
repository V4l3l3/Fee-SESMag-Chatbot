const mysql = require('mysql2');

// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Default user for XAMPP MySQL
  password: 'Y00ngi103476134340', // Default password for XAMPP MySQL
  database: 'chatbot' // The name of the database you created
});

// Connect to the MySQL database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});


// Function to insert conversation into the database
const insertConversation = async (userMessage, botResponse) => {
    const query = 'INSERT INTO conversations (user_message, bot_response) VALUES (?, ?)';
    try {
      await db.promise().execute(query, [userMessage, botResponse]);
      console.log('Conversation inserted successfully');
    } catch (err) {
      console.error('Error inserting conversation:', err);
    }
  };
  
  // Function to insert file data into the database
  const insertFile = async (fileName, filePath) => {
    const query = 'INSERT INTO uploads (file_name, file_path) VALUES (?, ?)';
    try {
      await db.promise().execute(query, [fileName, filePath]);
      console.log('File inserted successfully');
    } catch (err) {
      console.error('Error inserting file:', err);
    }
  };
  
  // Export functions
  module.exports = {
    insertConversation,
    insertFile,
  };