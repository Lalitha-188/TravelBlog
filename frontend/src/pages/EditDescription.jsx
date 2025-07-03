import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate,useParams } from 'react-router-dom';
import travell from '../assets/travell.png'; // ✅ Correct import path

export default function EditDescription() {
  const [descriptionData, setDescriptionData] = useState({});
  const navigate = useNavigate();
  const{id}=useParams()
useEffect(() => {
  const getData = async () => {
    const response = await axios.get(`http://localhost:5000/description/${id}`);
    const res = response.data;

    setDescriptionData({
      title: res.title || "",
      itenary: Array.isArray(res.itenary) ? res.itenary.join(", ") : "",
      tales: res.tales || "",
      days: res.days || "",
      file: res.file || null,
    });
  };
  getData();
}, []);


  const onHandleChange = (e) => {
  const val = e.target.name === "file"
    ? e.target.files[0]
    : e.target.value;

  setDescriptionData((prev) => ({
    ...prev,
    [e.target.name]: val,
  }));
};
const onHandleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("title", descriptionData.title);
  formData.append("days", descriptionData.days);
  formData.append("itenary", descriptionData.itenary.split(",").map(item => item.trim())); // ✅
  formData.append("tales", descriptionData.tales);
  if (descriptionData.file instanceof File) {
    formData.append("file", descriptionData.file);
  }

  try {
    await axios.put(`http://localhost:5000/description/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'authorization': 'bearer ' + localStorage.getItem("token")
      },
    });
    navigate("/places");
  } catch (err) {
    console.error("Error submitting form", err);
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
          <input type="text" className="input" name="title" onChange={onHandleChange} value={descriptionData.title}/>
        </div>
        <div className="form-control">
          <label>Days</label>
          <input type="number" className="input" name="days" onChange={onHandleChange} value={descriptionData.days} />
        </div>
        <div className="form-control">
          <label>Itenary</label>
          <textarea className="input-textarea" name="itenary" rows="5" onChange={onHandleChange} value={descriptionData.itenary}></textarea>
        </div>
        <div className="form-control">
          <label>Tales</label>
          <textarea className="input-textarea" name="tales" rows="5" onChange={onHandleChange} value={descriptionData.tales}></textarea>
        </div>
        <div className="form-control">
          <label>File</label>
          <input type="file" className="input" name="file" onChange={onHandleChange} />
        </div>
        <br/>
        <button type="submit" className="submit-button">Edit Description</button>
      </form>
    </div>
  );
}
