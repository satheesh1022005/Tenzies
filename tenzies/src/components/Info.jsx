import React from "react";
import "./Info.css"; // Create this file for styling

function Info() {
  return (
    <div className="info-container">
      <div className="info-section">
        <h2>About Tenzies</h2>
        <p>
          Tenzies is a dice game where players roll ten dice and aim to achieve
          the highest score by freezing values and maximizing efficiency in
          rolling.
        </p>
        <p>
          Players earn points based on their speed (time taken) and strategy
          (number of rolls), calculated using a specific formula:
        </p>
        <p>
          Score = C / ((totalSeconds * T_w) + (rolls * R_w))
        </p>
        <p>
          Where C is a constant, T_w is the weightage for time, and R_w is the
          weightage for rolls.
        </p>
      </div>
      <div className="personal-details">
      <h2>About me</h2>
            <p>
            Hello, I am Satheesh here, currently pursuing a degree in Computer Science and Design at Kongu Engineering College. Aspiring software developer with a passion for leveraging technology to solve real-world challenges, eager to learn and stay updated on emerging technologies.
            </p>
            <div className="personal-details">
                <h3>Personal Details</h3>
                <ul>
                    <li>Email: <a href="mailto:satheesh1022005@email.com"> satheesh1022005@email.com</a></li>
                    <li>Portfolio: <a href="https://satheeshk.netlify.app/">satheeshk.netlify.app</a></li>
                    <li>LinkedIn: <a href="https://www.linkedin.com/in/-satheesh-k/"> linkedin.com/in/-satheesh-k</a></li>
                    <li>GitHub: <a href="https://github.com/satheesh1022005/">github.com/satheesh1022005</a></li>
                </ul>
            </div>
      </div>
    </div>
  );
}

export default Info;
