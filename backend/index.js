import express from "express";
import mysql from "mysql2";
import cors from "cors";
const app = express();
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "tenzies",
});
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.json("Hello I am satheesh");
});
app.get("/data", (req, res) => {
  const q = "SELECT * FROM user;";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
app.get("/scores", (req, res) => {
  const q =
    "SELECT user.id,user.username,user.email,scores.score,scores.timestamp FROM user JOIN scores ON user.id = scores.userId";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  // Check if username already exists
  const checkUsernameQuery =
    "SELECT COUNT(*) AS count FROM user WHERE username = ?";
  db.query(checkUsernameQuery, [username], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result[0].count > 0) {
      // Username already exists, send error message to frontend
      console.log("hello");
      return res.status(400).json({ error: "Username already exists" });
    }

    // Username doesn't exist, proceed with registration
    const insertUserQuery =
      "INSERT INTO user(username, email, password) VALUES (?, ?, ?)";
    db.query(insertUserQuery, [username, email, password], (err, userData) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const userId = userData.insertId;
      const insertScoreQuery =
        "INSERT INTO scores(userId, timestamp) VALUES (?, ?)";
      const scoreValue = [userId, new Date()];
      db.query(insertScoreQuery, scoreValue, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        return res.status(200).json("User created successfully");
      });
    });
  });
});

app.post("/login", (req, res) => {
  const q = "SELECT * FROM user WHERE username = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) {
      console.error("Error executing database query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (data.length === 0) {
      return res.status(400).json({
        message: "User does not exist. Sign up to create an account.",
      });
    } else if (data[0].password === req.body.password) {
      return res.status(200).json({ message: "Welcome to Tenzies" });
    } else {
      return res.status(401).json({ message: "Username/password incorrect" });
    }
  });
});

app.listen(8800, () => {
  console.log("connected to backend1");
});
