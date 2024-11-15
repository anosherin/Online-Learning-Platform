import React, { useState, useEffect } from 'react';
import { Button, styled, TableRow, TableHead, TableContainer, Paper, Table, TableBody, TableCell, tableCellClasses } from '@mui/material';
import axiosInstance from '../common/AxiosInstance';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
   [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,  // Header background color
      color: theme.palette.common.white,
      fontWeight: 'bold',
      fontSize: 16,
      borderBottom: '2px solid #f1f1f1',  // Light border for header
   },
   [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      padding: '16px 12px',  // Larger padding for better spacing
      borderBottom: '1px solid #ddd',  // Lighter bottom border for rows
   },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
   '&:hover': {
      backgroundColor: theme.palette.grey[200],  // Light gray hover effect
   },
   '&:last-child td, &:last-child th': {
      border: 0,
   },
}));

const AdminHome = () => {
   const [allUsers, setAllUsers] = useState([]);

   const allUsersList = async () => {
      try {
         const res = await axiosInstance.get('api/admin/getallusers', {
            headers: {
               "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
         });
         if (res.data.success) {
            setAllUsers(res.data.data);
         } else {
            alert(res.data.message);
         }
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      allUsersList();
   }, []);

   const deleteUser = async (userId) => {
      const confirmation = confirm('Are you sure you want to delete this user?');
      if (!confirmation) {
         return;
      }
      try {
         const res = await axiosInstance.delete(`api/user/deleteuser/${userId}`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         });
         if (res.data.success) {
            alert(res.data.message);
            allUsersList();
         } else {
            alert("Failed to delete the user");
         }
      } catch (error) {
         console.log('An error occurred:', error);
      }
   };

   return (
      <TableContainer component={Paper} sx={{ boxShadow: 6 }}>
         <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
               <TableRow>
                  <StyledTableCell>User ID</StyledTableCell>
                  <StyledTableCell align="left">User Name</StyledTableCell>
                  <StyledTableCell align="left">Email</StyledTableCell>
                  <StyledTableCell align="left">Type</StyledTableCell>
                  <StyledTableCell align="left">Action</StyledTableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {allUsers.length > 0 ? (
                  allUsers.map((user) => (
                     <StyledTableRow key={user._id}>
                        <StyledTableCell component="th" scope="row">
                           {user._id}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                           {user.name}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                           {user.email}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                           {user.type}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                           <Button
                              onClick={() => deleteUser(user._id)}
                              size="small"
                              sx={{
                                 fontSize: '1.5rem',  // Increased button size for better visibility
                                 padding: '6px 10px',  // Adjusted padding for the emoji button
                                 color: '#333',  // Dark color for delete button
                                 '&:hover': {
                                    backgroundColor: '#e8e8e8',  // Light gray hover effect
                                 },
                              }}
                           >
                              🗑️
                           </Button>
                        </StyledTableCell>
                     </StyledTableRow>
                  ))
               ) : (
                  <StyledTableRow>
                     <StyledTableCell colSpan={5} align="center">
                        No users found
                     </StyledTableCell>
                  </StyledTableRow>
               )}
            </TableBody>
         </Table>
      </TableContainer>
   );
};

export default AdminHome;
