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

const Login = () => {
   const navigate = useNavigate();
   const [data, setData] = useState({
      email: "",
      password: "",
   });

   const handleChange = (e) => {
      const { name, value } = e.target;
      setData({ ...data, [name]: value });
   };

   const handleSubmit = (e) => {
      e.preventDefault();

      if (!data?.email || !data?.password) {
         return alert("Please fill all fields");
      } else {
         axiosInstance.post('/api/user/login', data)
            .then((res) => {
               if (res.data.success) {
                  alert(res.data.message);
                  localStorage.setItem("token", res.data.token);
                  localStorage.setItem("user", JSON.stringify(res.data.userData));
                  navigate('/dashboard');
                  setTimeout(() => {
                     window.location.reload();
                  }, 1000);
               } else {
                  alert(res.data.message);
               }
            })
            .catch((err) => {
               if (err.response && err.response.status === 401) {
                  alert("User doesn't exist");
               }
               navigate("/login");
            });
      }
   };

   return (
      <>
         <Navbar expand="lg" className="bg-body-tertiary">
            <Container fluid>
               <Navbar.Brand>
                  <h2 style={{ color: "#2a73cc", fontWeight: "bold" }}>Coursara</h2>
               </Navbar.Brand>
               <Navbar.Toggle aria-controls="navbarScroll" />
               <Navbar.Collapse id="navbarScroll">
                  <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll></Nav>
                  <Nav>
                     <Link to={'/'}>Home</Link>
                     <Link to={'/login'}>Login</Link>
                     <Link to={'/register'}>Register</Link>
                  </Nav>
               </Navbar.Collapse>
            </Container>
         </Navbar>

         <div className='first-container'>
            <Container component="main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
               <Box
                  sx={{
                     marginTop: 5,
                     marginBottom: 4,
                     display: 'flex',
                     flexDirection: 'column',
                     alignItems: 'center',
                     padding: '20px',
                     background: '#ffffff',
                     boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.3)', // Stronger shadow
                     borderRadius: '12px',
                     width: '400px', // Increased width
                     height: 'auto', // Height based on content
                  }}
               >
                  <Typography
                     component="h1"
                     variant="h5"
                     sx={{
                        color: '#2a73cc', // Color change to #2a73cc
                        fontWeight: 'bold',
                        mb: 2,
                        textAlign: 'center',
                     }}
                  >
                     Welcome Back!
                  </Typography>
                  <Box component="form" onSubmit={handleSubmit} noValidate>
                     <TextField
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        autoComplete="email"
                        autoFocus
                        InputProps={{
                           style: { background: '#fff', borderRadius: '5px', fontSize: '0.9rem' },
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
                           style: { background: '#fff', borderRadius: '5px', fontSize: '0.9rem' },
                        }}
                     />
                     <Grid container justifyContent="flex-end" mt={1}>
                        <Grid item>
                           <Link
                              style={{
                                 color: "#2a73cc",
                                 textDecoration: "none",
                                 fontSize: "0.8rem", // Smaller font size for link
                              }}
                              to={'/forgot-password'}
                           >
                              Forgot Credentials?
                           </Link>
                        </Grid>
                     </Grid>
                     <Box
                        mt={2}
                        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                     >
                        <Button
                           type="submit"
                           variant="contained"
                           sx={{
                              mt: 3,
                              mb: 2,
                              width: '150px',
                              background: '#2a73cc',
                              fontSize: '0.9rem',
                              transition: 'transform 0.3s ease-in-out',
                              '&:hover': {
                                 transform: 'scale(1.05)',
                              },
                              '&:active': {
                                 transform: 'scale(0.95)',
                              },
                           }}
                        >
                           Login
                        </Button>
                     </Box>
                     <Grid container justifyContent="center" alignItems="center" mt={2}>
                        <Grid item>
                           Don't have an account?{' '}
                           <Link
                              style={{ color: "#2a73cc", fontWeight: "bold", fontSize: '0.9rem' }}
                              to={'/register'}
                              variant="body2"
                           >
                              {"Sign Up"}
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

export default Login;
