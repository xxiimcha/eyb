import React, { useState } from 'react';
import './css/DeleteBatch.css';

function DeleteBatch() {
    const [formData, setFormData] = useState({
        firstName: 'Nico',
        middleName: '',
        lastName: 'Robin',
        course: 'BSCS',
        schoolYear: '2021 - 2022',
        email: 'gigafleur@gmail.com',
        contact: '09377389221',
        studentType: 'Regular',
        image: 'img_2ag45vk.png',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDelete = () => {
        // Perform delete operation here
        alert("Student record deleted successfully.");
    };

    return (
        <div className="delete-page">
            <div className="form-container">
                <label>First Name :</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} />

                <label>Middle Name :</label>
                <input type="text" name="middleName" value={formData.middleName} onChange={handleInputChange} />

                <label>Last Name :</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} />

                <label>Course :</label>
                <input type="text" name="course" value={formData.course} onChange={handleInputChange} />

                <label>School Year :</label>
                <input type="text" name="schoolYear" value={formData.schoolYear} onChange={handleInputChange} />

                <label>Email :</label>
                <input type="text" name="email" value={formData.email} onChange={handleInputChange} />

                <label>Contact :</label>
                <input type="text" name="contact" value={formData.contact} onChange={handleInputChange} />

                <div className="student-type">
                    <input type="radio" name="studentType" value="Regular" checked={formData.studentType === 'Regular'} onChange={handleInputChange} /> Regular
                    <input type="radio" name="studentType" value="Mid-Year" checked={formData.studentType === 'Mid-Year'} onChange={handleInputChange} /> Mid-Year
                </div>

                <div className="image-preview">
                    <span>{formData.image}</span>
                </div>

                <button className="delete-button" onClick={handleDelete}>Delete</button>
            </div>
            <div className="list-container">
                {/* List of entries */}
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Course</th>
                            <th>Year</th>
                            <th>Email</th>
                            <th>Contact</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Sample Data */}
                        <tr><td>Aquino, Zoro</td><td>BSCS</td><td>2021 - 2022</td><td>zorokuni@gmail.com</td><td>09493164580</td></tr>
                        <tr><td>Hiwaga, Maria</td><td>BSCS</td><td>2021 - 2022</td><td>mhwaga@gmail.com</td><td>09345279632</td></tr>
                        <tr><td>Kazman, Costa</td><td>BSCS</td><td>2021 - 2022</td><td>co$Hscash@gmail.com</td><td>09273438633</td></tr>
                        <tr><td>Robin, Nico</td><td>BSCS</td><td>2021 - 2022</td><td>gigafleur@gmail.com</td><td>09377389221</td></tr>
                        <tr><td>Sy, Chondis</td><td>BSCS</td><td>2021 - 2022</td><td>chandy33@gmail.com</td><td>09352217943</td></tr>
                        <tr><td>Vicenzio, Sanji</td><td>BSCS</td><td>2021 - 2022</td><td>vinsmoke_ji@gmail.com</td><td>09783342639</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DeleteBatch;