import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import { Container, Nav } from 'react-bootstrap';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axiosInstance from './AxiosInstance';
import Dropdown from 'react-bootstrap/Dropdown';

const Register = () => {
   const navigate = useNavigate();
   const [selectedOption, setSelectedOption] = useState('Select User');
   const [data, setData] = useState({
      name: "",
      email: "",
      password: "",
      type: "",
   });

   const handleSelect = (eventKey) => {
      setSelectedOption(eventKey);
      setData({ ...data, type: eventKey });
   };

   const handleChange = (e) => {
      const { name, value } = e.target;
      setData({ ...data, [name]: value });
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      if (!data?.name || !data?.email || !data?.password || !data?.type) return alert("Please fill all fields");
      else {
         axiosInstance.post('/api/user/register', data)
            .then((response) => {
               if (response.data.success) {
                  alert(response.data.message);
                  navigate('/login');
               } else {
                  console.log(response.data.message);
               }
            })
            .catch((error) => {
               console.log("Error", error);
            });
      }
   };

   return (
      <>
         <Navbar expand="lg" className="bg-body-tertiary">
            <Container fluid>
               <Navbar.Brand><h2 style={{ color: "#2a73cc", fontWeight: "bold" }}>Coursara</h2></Navbar.Brand>
               <Navbar.Toggle aria-controls="navbarScroll" />
               <Navbar.Collapse id="navbarScroll">
                  <Nav
                     className="me-auto my-2 my-lg-0"
                     style={{ maxHeight: '100px' }}
                     navbarScroll
                  >
                  </Nav>
                  <Nav>
                     <Link to={'/'}>Home</Link>
                     <Link to={'/login'}>Login</Link>
                     <Link to={'/register'}>Register</Link>
                  </Nav>
               </Navbar.Collapse>
            </Container>
         </Navbar>
         <div className="first-container">
            <Container component="main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
               <Box
                  sx={{
                     marginTop: 8,
                     marginBottom: 4,
                     display: 'flex',
                     flexDirection: 'column',
                     alignItems: 'center',
                     padding: '20px',
                     background: '#ffffff',
                     boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.3)',
                     borderRadius: '12px',
                     width: '450px', // Box width kept the same
                     height: 'auto',  // Box height is now reduced
                     overflow: 'hidden', // Prevent scroll
                  }}
               >
                  <Typography
                     component="h1"
                     variant="h5"
                     sx={{
                        color: '#2a73cc', // Updated color
                        fontWeight: 'bold',
                        mb: 2,  // Reduced margin
                        textAlign: 'center',
                        fontSize: '1.5rem', // Increased font size for title
                     }}
                  >
                     Get Started!
                  </Typography>
                  <Box component="form" onSubmit={handleSubmit} noValidate>
                     <TextField
                        margin="normal"
                        fullWidth
                        id="name"
                        label="Full Name"
                        name="name"
                        value={data.name}
                        onChange={handleChange}
                        autoComplete="name"
                        autoFocus
                        InputProps={{
                           style: { background: '#fff', borderRadius: '5px', fontSize: '0.85rem' },  // Reduced font size
                        }}
                     />
                     <TextField
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        autoComplete="email"
                        InputProps={{
                           style: { background: '#fff', borderRadius: '5px', fontSize: '0.85rem' },  // Reduced font size
                        }}
                     />
                     <TextField
                        margin="normal"
                        fullWidth
                        name="password"
                        value={data.password}
                        onChange={handleChange}
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        InputProps={{
                           style: { background: '#fff', borderRadius: '5px', fontSize: '0.85rem' },  // Reduced font size
                        }}
                     />
                     <Dropdown className='my-3'>
                        <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                           {selectedOption}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                           <Dropdown.Item onClick={() => handleSelect("Student")}>Student</Dropdown.Item>
                           <Dropdown.Item onClick={() => handleSelect("Teacher")}>Teacher</Dropdown.Item>
                        </Dropdown.Menu>
                     </Dropdown>
                     <Box mt={1} mb={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                           type="submit"
                           variant="contained"
                           sx={{
                              width: '180px',  // Adjusted button width
                              background: '#2a73cc',
                              fontSize: '1rem',  // Font size for the button
                              transition: 'transform 0.3s ease-in-out',
                              '&:hover': {
                                 transform: 'scale(1.05)',
                              },
                              '&:active': {
                                 transform: 'scale(0.95)',
                              },
                           }}
                        >
                           Register
                        </Button>
                     </Box>
                     <Grid container justifyContent="center" alignItems="center" mt={1}>
                        <Grid item>
                           Already have an account?{' '}
                           <Link
                              style={{ color: "#2a73cc", fontWeight: "bold", fontSize: '0.85rem' }}  // Reduced font size
                              to={'/login'}
                           >
                              Sign In
                           </Link>
                        </Grid>
                     </Grid>
                  </Box>
               </Box>
            </Container>
         </div>
      </>
   );
};

export default Register;
