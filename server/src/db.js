const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: 'localhost',   // MySQL Docker container host
  port: '3306',        // MySQL port
  user: 'root',        // MySQL username
  password: '1234',    // MySQL password
  database: 'dnd',     // Database name
});


connection.connect((error) => {
  if (error) {
    console.error("Error connecting to MySQL:", error);
    throw error;
  }
  console.log("Connected to MySQL database");
});

function saveDesign(designData) {
  return new Promise((resolve, reject) => {

    console.log("designData=====================> ", designData);

    connection.query(
      "INSERT INTO designs SET ?",
      { canvas: JSON.stringify(designData.canvas) },
      (error, results, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
}

function getDesignById(designId) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM designs WHERE id = ?",
      [designId],
      (error, results, fields) => {
        if (error) {
          reject(error);
        } else {
          if (results.length > 0) {
            resolve(results[0]);
          } else {
            resolve(null);
          }
        }
      }
    );
  });
}

module.exports = {
  saveDesign,
  getDesignById,
};
