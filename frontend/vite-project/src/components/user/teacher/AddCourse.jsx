import React, { useState, useContext } from 'react';
import { Button, Form, Col, Row, Table } from 'react-bootstrap';
import { UserContext } from '../../../App';
import axiosInstance from '../../common/AxiosInstance';

const AddCourse = () => {
  const user = useContext(UserContext);
  const [addCourse, setAddCourse] = useState({
    userId: user.userData._id,
    C_educator: '',
    C_title: '',
    C_categories: '',
    C_price: '',
    C_description: '',
    sections: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddCourse({ ...addCourse, [name]: value });
  };

  const handleCourseTypeChange = (e) => {
    setAddCourse({ ...addCourse, C_categories: e.target.value });
  };

  const addInputGroup = () => {
    setAddCourse({
      ...addCourse,
      sections: [
        ...addCourse.sections,
        {
          S_title: '',
          S_description: '',
          S_content: null,
        },
      ],
    });
  };

  const handleChangeSection = (index, e) => {
    const { name, value } = e.target;
    const updatedSections = [...addCourse.sections];
    const sectionToUpdate = updatedSections[index];

    // Check if it's the file input (video/image)
    if (name === 'S_content') {
      sectionToUpdate.S_content = e.target.files[0];
    } else {
      sectionToUpdate[name] = value;
    }

    setAddCourse({ ...addCourse, sections: updatedSections });
  };

  const removeInputGroup = (index) => {
    const updatedSections = [...addCourse.sections];
    updatedSections.splice(index, 1);
    setAddCourse({
      ...addCourse,
      sections: updatedSections,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append regular form fields
    Object.keys(addCourse).forEach((key) => {
      if (key === 'sections') {
        // Add sections data to FormData
        addCourse[key].forEach((section, index) => {
          formData.append(`S_title[${index}]`, section.S_title);
          formData.append(`S_description[${index}]`, section.S_description);
          if (section.S_content instanceof File) {
            formData.append('S_content', section.S_content);
          }
        });
      } else {
        formData.append(key, addCourse[key]);
      }
    });

    try {
      const res = await axiosInstance.post('/api/user/addcourse', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 201) {
        if (res.data.success) {
          alert(res.data.message);
        } else {
          alert('Failed to create course');
        }
      } else {
        alert('Unexpected response status: ' + res.status);
      }
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An error occurred while creating the course');
    }
  };

  return (
    <div className="add-course-container">
      <Form className="mb-3" onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridJobType">
            <Form.Label>Course Type</Form.Label>
            <Form.Select value={addCourse.C_categories} onChange={handleCourseTypeChange}>
              <option>Select categories</option>
              <option>IT & Software</option>
              <option>Finance & Accounting</option>
              <option>Personal Development</option>
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col} controlId="formGridTitle">
            <Form.Label>Course Title</Form.Label>
            <Form.Control name="C_title" value={addCourse.C_title} onChange={handleChange} type="text" placeholder="Enter Course Title" required />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridEducator">
            <Form.Label>Course Educator</Form.Label>
            <Form.Control name="C_educator" value={addCourse.C_educator} onChange={handleChange} type="text" placeholder="Enter Course Educator" required />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridPrice">
            <Form.Label>Course Price (Rs.)</Form.Label>
            <Form.Control name="C_price" value={addCourse.C_price} onChange={handleChange} type="text" placeholder="for free course, enter 0" required />
          </Form.Group>
          <Form.Group as={Col} className="mb-3" controlId="formGridDescription">
            <Form.Label>Course Description</Form.Label>
            <Form.Control name="C_description" value={addCourse.C_description} onChange={handleChange} required as="textarea" placeholder="Enter Course description" />
          </Form.Group>
        </Row>

        <hr />

        {addCourse.sections.map((section, index) => (
          <div key={index} className="d-flex flex-column mb-4 border rounded-3 border-3 p-3 position-relative">
            <Col xs={24} md={12} lg={8}>
              <span style={{ cursor: 'pointer' }} className="position-absolute top-0 end-0 p-1" onClick={() => removeInputGroup(index)}>
                ❌
              </span>
            </Col>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridSectionTitle">
                <Form.Label>Section Title</Form.Label>
                <Form.Control
                  name="S_title"
                  value={section.S_title}
                  onChange={(e) => handleChangeSection(index, e)}
                  type="text"
                  placeholder="Enter Section Title"
                  required
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridSectionContent">
                <Form.Label>Section Content (Video or Image)</Form.Label>
                <Form.Control
                  name="S_content"
                  onChange={(e) => handleChangeSection(index, e)}
                  type="file"
                  accept="video/*,image/*"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formGridSectionDescription">
                <Form.Label>Section Description</Form.Label>
                <Form.Control
                  name="S_description"
                  value={section.S_description}
                  onChange={(e) => handleChangeSection(index, e)}
                  required
                  as="textarea"
                  placeholder="Enter Section description"
                />
              </Form.Group>

              {/* Display video if it's uploaded */}
              {section.S_content && section.S_content instanceof File && section.S_content.type.startsWith('video/') && (
                <div>
                  <video width="320" height="240" controls>
                    <source
                      src={URL.createObjectURL(section.S_content)}
                      type={section.S_content.type}
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </Row>
          </div>
        ))}

        <Row className="mb-3">
          <Col xs={24} md={12} lg={8}>
            <Button size="sm" variant="outline-secondary" onClick={addInputGroup}>
              ➕ Add Section
            </Button>
          </Col>
        </Row>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default AddCourse;
