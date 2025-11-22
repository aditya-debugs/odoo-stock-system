import { Link } from "react-router-dom";
import Button from "../components/Button";

const Home = () => {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Welcome to MERN + PostgreSQL App</h1>
      <p style={{ margin: "1rem 0" }}>
        A full-stack application built with React, Express, Node.js, and
        PostgreSQL
      </p>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          marginTop: "2rem",
        }}
      >
        <Link to="/login">
          <Button>Login</Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="secondary">Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
