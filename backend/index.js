import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bcrypt from "bcrypt";
const app = express();
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "tenzies",
});
app.use(express.json());
app.use(cors());
const saltRound = 10;
// app.get("/", (req, res) => {
//   res.json("Hello I am satheesh");
// });
app.get("/data", (req, res) => {
  const { id } = req.query;
  console.log(id);
  const q = `
    SELECT user.username, scores.score, scores.timestamp
    FROM user
    LEFT JOIN scores ON user.id = scores.userId
    WHERE user.id = ?
  `;
  db.query(q, [id], (err, data) => {
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
    bcrypt.hash(password, saltRound, (err, hash) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      const insertUserQuery =
        "INSERT INTO user(username, email, password) VALUES (?, ?, ?)";
      db.query(insertUserQuery, [username, email, hash], (err, userData) => {
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
});
app.post("/login", (req, res) => {
  const q = "SELECT * FROM user WHERE username = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) {
      console.error("Error executing database query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (data.length <= 0) {
      return res.status(400).json({
        message: "User does not exist. Sign up to create an account.",
      });
    } else {
      bcrypt.compare(req.body.password, data[0].password, (err, response) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        if (response) {
          return res.status(200).json({
            id: data[0].id,
            username: data[0].username,
            message: "Welcome to Tenzies",
          });
        } else {
          return res
            .status(401)
            .json({ message: "Username/password incorrect" });
        }
      });
    }
  });
});
app.post("/addscore", (req, res) => {
  const { userid, score } = req.body;
  const q = "INSERT INTO scores(userId,score) VALUES(?,?)";
  db.query(q, [userid, score], (err, data) => {
    if (err) {
      console.error("Error executing database query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.status(200).json("score added successfully");
  });
});

app.listen(8800, () => {
  console.log("connected to backend1");
});
