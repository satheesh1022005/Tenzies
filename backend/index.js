import express from "express";
import mysql from "mysql2/promise"; // Using promise-based MySQL client
import cors from "cors";
import bcrypt from "bcrypt";
import "dotenv/config";

const app = express();
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

let pool;

// Create a MySQL connection pool
async function createPool() {
  try {
    pool = mysql.createPool(dbConfig);
    console.log("Connected to MySQL database");
  } catch (error) {
    console.error("Error connecting to MySQL:", error.message);
    process.exit(1);
  }
}

createPool();

app.use(express.json());
app.use(cors());
const saltRound = 10;

// Route to fetch scores
app.get("/scores", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT user.id, user.username, user.email, scores.score, scores.timestamp FROM user JOIN scores ON user.id = scores.userId WHERE scores.score != 0 ORDER BY scores.score ASC"
    );
    connection.release(); // Release connection back to pool
    res.json(rows);
  } catch (error) {
    console.error("Error fetching scores:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to register new user
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const connection = await pool.getConnection();
    // Check if username already exists
    const [rows] = await connection.query(
      "SELECT COUNT(*) AS count FROM user WHERE username = ?",
      [username]
    );

    if (rows[0].count > 0) {
      connection.release();
      return res.status(400).json({ error: "Username already exists" });
    }

    // Username doesn't exist, proceed with registration
    const hash = await bcrypt.hash(password, saltRound);
    const insertUserQuery =
      "INSERT INTO user(username, email, password) VALUES (?, ?, ?)";
    const userData = await connection.query(insertUserQuery, [
      username,
      email,
      hash,
    ]);

    const userId = userData[0].insertId;
    const insertScoreQuery =
      "INSERT INTO scores(userId, timestamp) VALUES (?, ?)";
    const scoreValue = [userId, new Date()];
    await connection.query(insertScoreQuery, scoreValue);
    connection.release();
    res.status(200).json("User created successfully");
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to handle user login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT * FROM user WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      connection.release();
      return res.status(400).json({
        message: "User does not exist. Sign up to create an account.",
      });
    }

    const match = await bcrypt.compare(password, rows[0].password);
    connection.release();

    if (match) {
      return res.status(200).json({
        id: rows[0].id,
        username: rows[0].username,
        message: "Welcome to Tenzies",
      });
    } else {
      return res.status(401).json({ message: "Username/password incorrect" });
    }
  } catch (error) {
    console.error("Error logging in user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to add score
app.post("/addscore", async (req, res) => {
  const { userid, score } = req.body;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT score AS max_score FROM scores WHERE userId = ?",
      [userid]
    );

    const max = rows.length ? rows[0].max_score : 0;

    if (max < score) {
      await connection.query("UPDATE scores SET score = ? WHERE userId = ?", [
        score,
        userid,
      ]);
      connection.release();
      return res.status(200).json("Score added successfully");
    } else {
      connection.release();
      return res.status(200).json("No update needed, score is not higher");
    }
  } catch (error) {
    console.error("Error adding score:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 8801;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
