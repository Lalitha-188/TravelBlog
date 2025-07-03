import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import travell from '../assets/travell.png'; // ✅ Correct import path

export default function AddDescription() {
  const [descriptionData, setDescriptionData] = useState({});
  const navigate = useNavigate();

  const onHandleChange = (e) => {
    const val = e.target.name === "itenary"
? e.target.value.split(",")
      : e.target.name === "file"? e.target.files[0]: e.target.value;

    setDescriptionData((prev) => ({
      ...prev,
      [e.target.name]: val,
    }));
  };
const onHandleSubmit = async (e) => {
  e.preventDefault();

  if (!descriptionData.title || !descriptionData.days || !descriptionData.itenary || !descriptionData.tales || !descriptionData.file) {
    alert("Please fill all fields");
    return;
  }

  const formData = new FormData();
  formData.append("title", descriptionData.title);
  formData.append("days", descriptionData.days);
  formData.append("itenary", descriptionData.itenary.join(",")); // ✅ FIXED HERE
  formData.append("tales", descriptionData.tales);
  formData.append("file", descriptionData.file);

  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
  const token = localStorage.getItem("token");
console.log("Token from localStorage:", token);

if (!token) {
  alert("No token found. Please login again.");
  return;
}


  try {
    await axios.post("http://localhost:5000/description", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'authorization': 'Bearer ' + localStorage.getItem("token")
      },
    });
    navigate("/");
  } catch (err) {
    console.error("Error submitting form", err);
    alert("Submission failed: " + (err.response?.data?.error || err.message));
  }
};

  return (
    <div
      className="container"
      style={{
        backgroundImage: `url(${travell})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        padding: "2rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity:"0.8"
      }}
    >
        <form
  onSubmit={onHandleSubmit}
  style={{
    padding: "2rem",
    borderRadius: "10px",
    width: "100%",
    maxWidth: "600px"
  }}
>
        <div className="form-control">
          <label>Title</label>
          <input type="text" className="input" name="title" onChange={onHandleChange} />
        </div>
        <div className="form-control">
          <label>Days</label>
          <input type="number" className="input" name="days" onChange={onHandleChange} />
        </div>
        <div className="form-control">
          <label>Itenary</label>
          <textarea className="input-textarea" name="itenary" rows="5" onChange={onHandleChange}></textarea>
        </div>
        <div className="form-control">
          <label>Tales</label>
          <textarea className="input-textarea" name="tales" rows="5" onChange={onHandleChange}></textarea>
        </div>
        <div className="form-control">
          <label>File</label>
          <input type="file" className="input" name="file" onChange={onHandleChange} />
        </div>
        <br/>
        <button type="submit" className="submit-button">Add Description</button>
      </form>
    </div>
  );
}
