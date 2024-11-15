import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Nav, Button, Navbar } from "react-bootstrap";
import AllCourses from "./AllCourses";
import './Home.css'; // Import the CSS file for styles

const Home = () => {
  const [studentsCount, setStudentsCount] = useState(0);
  const [jobOffersCount, setJobOffersCount] = useState(0);

  useEffect(() => {
    const incrementCounter = (setCount, targetValue) => {
      let count = 0;
      const increment = () => {
        if (count < targetValue) {
          count += Math.ceil(targetValue / 100); // Increment slowly
          setCount(count);
          setTimeout(increment, 20); // Recurse with timeout for smooth animation
        }
      };
      increment(); // Start the counter increment
    };

    incrementCounter(setStudentsCount, 1000000); // 1 Million Students
    incrementCounter(setJobOffersCount, 10000); // 10,000 Job Offers
  }, []);

  return (
    <>
      {/* Navbar Section */}
      <Navbar expand="lg" className="bg-body-tertiary shadow-sm">
        <Container fluid>
          <Navbar.Brand>
            <h2 style={{ color: "#2a73cc", fontWeight: "bold" }}>Coursara</h2>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="ms-auto" navbarScroll>
              <Link to={"/"} className="nav-link mx-3">
                Home
              </Link>
              <Link to={"/login"} className="nav-link mx-3">
                Login
              </Link>
              <Link to={"/register"} className="nav-link mx-3">
                Register
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <div id="home-container" className="first-container d-flex align-items-center justify-content-start position-relative">
        {/* Background with animated numbers */}
        <div className="background-container position-absolute w-100">
          <h3 className="counter-text">
            {studentsCount}+ Students
          </h3>
          <h3 className="counter-text">
            {jobOffersCount}+ Job Offers
          </h3>
          <h3 className="counter-text">
            Industry Experts on Board
          </h3>
        </div>

        {/* Text Content */}
        <div className="content-home animate__animated animate__fadeInLeft z-index-1">
          <p>
            Learning Without Limits: <br />
            <span style={{ color: "#2a73cc", fontWeight: "bold" }}>
              Your Education. Your Way.
            </span>
          </p>
          <Link to={"/register"}>
            <Button variant="primary" className="m-2" size="md">
              Explore Courses
            </Button>
          </Link>
        </div>
      </div>

      {/* Trending Courses Section */}
      <Container className="second-container my-5">
        <h2 className="text-center my-4" style={{ color: "#2a73cc", fontWeight: "bold" }}>
          Trending Courses
        </h2>
        <AllCourses />
      </Container>
    </>
  );
};

export default Home;
