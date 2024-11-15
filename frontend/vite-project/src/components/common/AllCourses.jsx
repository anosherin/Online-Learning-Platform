import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from './AxiosInstance';
import { Button, Modal, Form } from 'react-bootstrap';
import { UserContext } from '../../App';
import { Link, useNavigate } from 'react-router-dom';
import {
   MDBCol,
   MDBInput,
   MDBRow,
   MDBCard,
   MDBCardBody,
   MDBCardTitle,
   MDBCardText,
} from "mdb-react-ui-kit";

const AllCourses = () => {
   const navigate = useNavigate();
   const user = useContext(UserContext);
   const [allCourses, setAllCourses] = useState([]);
   const [filterTitle, setFilterTitle] = useState('');
   const [filterType, setFilterType] = useState('');
   const [showModal, setShowModal] = useState(Array(allCourses.length).fill(false));
   const [cardDetails, setCardDetails] = useState({
      cardholdername: '',
      cardnumber: '',
      cvvcode: '',
      expmonthyear: '',
   });

   const handleChange = (e) => {
      setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
   };

   const handleShow = (courseIndex, coursePrice, courseId, courseTitle) => {
      if (coursePrice === 'free') {
         handleSubmit(courseId);
         return navigate(`/courseSection/${courseId}/${courseTitle}`);
      } else {
         const updatedShowModal = [...showModal];
         updatedShowModal[courseIndex] = true;
         setShowModal(updatedShowModal);
      }
   };

   const handleClose = (courseIndex) => {
      const updatedShowModal = [...showModal];
      updatedShowModal[courseIndex] = false;
      setShowModal(updatedShowModal);
   };

   const getAllCoursesUser = async () => {
      try {
         const res = await axiosInstance.get('api/user/getallcourses', {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         });
         if (res.data.success) {
            setAllCourses(res.data.data);
         }
      } catch (error) {
         console.log('An error occurred:', error);
      }
   };

   useEffect(() => {
      getAllCoursesUser();
   }, []);

   const isPaidCourse = (course) => {
      return /\d/.test(course.C_price); // Checks if C_price contains a number
   };

   const handleSubmit = async (courseId) => {
      try {
         const res = await axiosInstance.post(`api/user/enrolledcourse/${courseId}`, cardDetails, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         });
         if (res.data.success) {
            alert(res.data.message);
            navigate(`/courseSection/${res.data.course.id}/${res.data.course.Title}`);
         } else {
            alert(res.data.message);
            navigate(`/courseSection/${res.data.course.id}/${res.data.course.Title}`);
         }
      } catch (error) {
         console.log('An error occurred:', error);
      }
   };

   return (
      <>
         <div className="mt-4 filter-container text-center mb-4">
            <p className="mt-3">Search By:</p>
            <input
               type="text"
               placeholder="Search by title"
               value={filterTitle}
               onChange={(e) => setFilterTitle(e.target.value)}
               className="filter-input"
            />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="filter-select">
               <option value="">All Courses</option>
               <option value="Paid">Paid</option>
               <option value="Free">Free</option>
            </select>
         </div>

         <div className="course-container">
            {allCourses?.length > 0 ? (
               allCourses
                  .filter(
                     (course) =>
                        filterTitle === '' ||
                        course.C_title?.toLowerCase().includes(filterTitle?.toLowerCase())
                  )
                  .filter((course) => {
                     if (filterType === 'Free') {
                        return !isPaidCourse(course);
                     } else if (filterType === 'Paid') {
                        return isPaidCourse(course);
                     } else {
                        return true;
                     }
                  })
                  .map((course, index) => (
                     <div key={course._id} className="course-card mb-4">
                        <MDBCard className="course-card-content">
                           <MDBCardBody>
                              <MDBCardTitle tag="h5">{course.C_title}</MDBCardTitle>
                              <MDBCardText>
                                 <strong>Educator:</strong> {course.C_educator}
                              </MDBCardText>
                              <MDBCardText>
                                 <strong>Category:</strong> {course.C_categories}
                              </MDBCardText>
                              <MDBCardText>
                                 <strong>Price:</strong> {course.C_price === 'free' ? 'Free' : `₹${course.C_price}`}
                              </MDBCardText>
                              <MDBCardText>
                                 <strong>Sections:</strong> {course.sections.length}
                              </MDBCardText>
                              {user.userLoggedIn ? (
                                 <>
                                    <Button
                                       variant="outline-primary"
                                       onClick={() => handleShow(index, course.C_price, course._id, course.C_title)}
                                    >
                                       Start Course
                                    </Button>
                                    <Modal show={showModal[index]} onHide={() => handleClose(index)}>
                                       <Modal.Header closeButton>
                                          <Modal.Title>
                                             Payment for {course.C_title} Course
                                          </Modal.Title>
                                       </Modal.Header>
                                       <Modal.Body>
                                          <p>Price: {course.C_price}</p>
                                          <Form onSubmit={(e) => {
                                             e.preventDefault();
                                             handleSubmit(course._id);
                                          }}>
                                             <MDBInput
                                                label="Card Holder Name"
                                                name="cardholdername"
                                                value={cardDetails.cardholdername}
                                                onChange={handleChange}
                                                type="text"
                                                required
                                             />
                                             <MDBInput
                                                label="Card Number"
                                                name="cardnumber"
                                                value={cardDetails.cardnumber}
                                                onChange={handleChange}
                                                type="number"
                                                required
                                             />
                                             <MDBRow className="mb-4">
                                                <MDBCol md="6">
                                                   <MDBInput
                                                      label="Expiration Date"
                                                      name="expmonthyear"
                                                      value={cardDetails.expmonthyear}
                                                      onChange={handleChange}
                                                      type="text"
                                                      required
                                                   />
                                                </MDBCol>
                                                <MDBCol md="6">
                                                   <MDBInput
                                                      label="CVV"
                                                      name="cvvcode"
                                                      value={cardDetails.cvvcode}
                                                      onChange={handleChange}
                                                      type="number"
                                                      required
                                                   />
                                                </MDBCol>
                                             </MDBRow>
                                             <div className="d-flex justify-content-end">
                                                <Button variant="secondary" onClick={() => handleClose(index)}>
                                                   Close
                                                </Button>
                                                <Button variant="primary" type="submit">
                                                   Pay Now
                                                </Button>
                                             </div>
                                          </Form>
                                       </Modal.Body>
                                    </Modal>
                                 </>
                              ) : (
                                 <Link to={'/login'}>
                                    <Button variant="outline-primary">Start Course</Button>
                                 </Link>
                              )}
                           </MDBCardBody>
                        </MDBCard>
                     </div>
                  ))
            ) : (
               <p>No courses available at the moment</p>
            )}
         </div>
      </>
   );
};

export default AllCourses;
