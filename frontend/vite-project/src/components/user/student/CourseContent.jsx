import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Accordion, Modal } from 'react-bootstrap';
import axiosInstance from '../../common/AxiosInstance';
import ReactPlayer from 'react-player';
import { UserContext } from '../../../App';
import NavBar from '../../common/NavBar';
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Button } from '@mui/material';

const CourseContent = () => {
   const user = useContext(UserContext)

   const { courseId, courseTitle } = useParams(); // Extract courseId from URL
   const [courseContent, setCourseContent] = useState([]);
   const [currentVideo, setCurrentVideo] = useState(null);
   const [playingSectionIndex, setPlayingSectionIndex] = useState(-1);
   const [completedSections, setCompletedSections] = useState([]);
   const [completedModule, setCompletedModule] = useState([]);
   const [showModal, setShowModal] = useState(false);
   const [certificate, setCertificate] = useState(null);
   // Extract sectionIds from completedModule
   const completedModuleIds = completedModule.map((item) => item.sectionId);

   const downloadPdfDocument = (rootElementId) => {
      const input = document.getElementById(rootElementId);
      html2canvas(input).then((canvas) => {
         const imgData = canvas.toDataURL('image/png');
         const pdf = new jsPDF();
         pdf.addImage(imgData, 'JPEG', 0, 0);
         pdf.save('download-certificate.pdf');
      });
   };

   const getCourseContent = async () => {
      try {
         const res = await axiosInstance.get(`/api/user/coursecontent/${courseId}`, {
            headers: {
               "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
         });
         if (res.data.success) {
            setCourseContent(res.data.courseContent);
            console.log(res.data.completeModule);
            setCompletedModule(res.data.completeModule);
            setCertificate(res.data.certficateData.updatedAt);
         }
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      getCourseContent();
   }, [courseId]);

   const playVideo = (videoPath, index) => {
      setCurrentVideo(videoPath);
      setPlayingSectionIndex(index);
   };

   const completeModule = async (sectionId) => {
      if (completedModule.length < courseContent.length) {
         if (playingSectionIndex !== -1 && !completedSections.includes(playingSectionIndex)) {
            setCompletedSections([...completedSections, playingSectionIndex]);

            try {
               const res = await axiosInstance.post(`api/user/completemodule`, {
                  courseId,
                  sectionId: sectionId
               }, {
                  headers: {
                     Authorization: `Bearer ${localStorage.getItem('token')}`
                  }
               });
               if (res.data.success) {
                  alert(res.data.message);
                  getCourseContent();
               }
            } catch (error) {
               console.log(error);
            }
         }
      } else {
         setShowModal(true);
      }
   };

   return (
      <>
         <NavBar />
         <h1 className='my-3 text-center'>Welcome to the course: {courseTitle}</h1>

         <div className='course-content'>
            <div className="course-section">
               <Accordion defaultActiveKey="0" flush>
                  {courseContent.map((section, index) => {
                     const sectionId = index;
                     const isSectionCompleted = !completedModuleIds.includes(sectionId);

                     return (
                        <Accordion.Item key={index} eventKey={index.toString()}>
                           <Accordion.Header>{section.S_title}</Accordion.Header>
                           <Accordion.Body>
                              {section.S_description}
                              {section.S_content && (
                                 <>
                                    <Button color='success' className='mx-2' variant="text" size="small" onClick={() => playVideo(`http://localhost:5000${section.S_content.path}`, index)}>
                                       Play Video
                                    </Button>
                                    {isSectionCompleted && !completedSections.includes(index) && (
                                       <Button
                                          variant='success'
                                          size='sm'
                                          onClick={() => completeModule(sectionId)}
                                          disabled={playingSectionIndex !== index}
                                       >
                                          Completed
                                       </Button>
                                    )}
                                 </>
                              )}
                           </Accordion.Body>
                        </Accordion.Item>
                     );
                  })}
                  {completedModule.length === courseContent.length && (
                     <Button className='my-2' onClick={() => setShowModal(true)}>Download Certificate</Button>
                  )}
               </Accordion>
            </div>
            <div className="course-video w-50">
               {currentVideo && (
                  <ReactPlayer
                     url={currentVideo}
                     width='100%'
                     height='100%'
                     controls
                  />
               )}
            </div>

         </div>

         <Modal
            size="lg"
            show={showModal}
            onHide={() => setShowModal(false)}
            dialogClassName="modal-90w"
            aria-labelledby="example-custom-modal-styling-title"
         >
            <Modal.Header closeButton>
               <Modal.Title id="example-custom-modal-styling-title">
                  Completion Certificate
               </Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <div style={{ textAlign: 'center', padding: '20px' }}>
                  <h2 style={{ fontWeight: 'bold', fontSize: '30px', color: '#007bff' }}>Congratulations!</h2>
                  <p style={{ fontSize: '18px', marginBottom: '20px' }}>You have successfully completed the course</p>

                  <div id='certificate-download' style={{
                     border: '5px solid #007bff', borderRadius: '10px', padding: '30px', maxWidth: '600px', margin: '0 auto', backgroundColor: '#f9f9f9'
                  }}>
                     <h1 style={{ fontSize: '28px', color: '#333' }}>Certificate of Completion</h1>
                     <div style={{ margin: '20px 0' }}>
                        <p style={{ fontSize: '20px' }}>This is to certify that</p>
                        <h2 style={{ fontSize: '24px', color: '#000' }}>{user.userData.name}</h2>
                        <p style={{ fontSize: '20px' }}>has successfully completed the course</p>
                        <h3 style={{ fontSize: '22px', color: '#007bff' }}>{courseTitle}</h3>
                        <p style={{ fontSize: '20px' }}>on</p>
                        <p style={{ fontSize: '20px', fontStyle: 'italic' }}>{new Date(certificate).toLocaleDateString()}</p>
                     </div>
                  </div>
               </div>
               <Button onClick={() => downloadPdfDocument('certificate-download')} sx={{ float: 'right', marginTop: 3, backgroundColor: '#007bff', color: 'white' }}>
                  Download Certificate
               </Button>
            </Modal.Body>
         </Modal>
      </>
   );
};

export default CourseContent;
