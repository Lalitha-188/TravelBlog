import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function DescriptionDetail() {
  const { id } = useParams();
  const [description, setDescription] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/description/${id}`);
        setDescription(response.data);
      } catch (err) {
        console.error("Failed to fetch description", err);
      }
    };

    fetchDescription();
  }, [id]);

  if (!description) return <p>Loading...</p>;

  return (
    <div
  className="detail-container"
  style={{
    padding: "1.5rem",
    fontFamily: "Georgia, serif",
    backgroundColor:"#e6f7ff", 
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh", 
    color: "#000" 
  }}
>
  
      <button 
        onClick={() => navigate(-1)} 
        style={{ 
          position: "relative", 
          top: "3rem", 
          left: "1rem", 
          background: "lightblue", 
          color: "black",
          padding: "1rem",
          border: "none", 
          fontSize: "1rem", 
          cursor: "pointer" 
        }}
      >
        ← Back
      </button>

      {/* Title */}
      <h2 style={{ 
        textAlign: "center", 
        fontWeight: "bold", 
        fontSize: "2rem", 
        color: "#333", 
        marginTop: "0.01rem"
      }}>
        {description.title}
      </h2>

      {/* Image */}
      <img
        src={`http://localhost:5000/images/${description.file}`}
        alt={description.title}
        style={{ 
          width: "100%", 
          maxHeight: "300px", 
          objectFit: "contain", 
          borderRadius: "8px",
          display: "block",
          margin: ".01rem auto"
        }}
      />

      {/* Description Details */}
      <p style={{ fontSize: "19px", marginBottom: "0.5rem" }}>
        <strong>Days:</strong> {description.days}
      </p>

      <p style={{ fontSize: "19px", marginBottom: "0.5rem" }}>
        <strong>Itenary:</strong> {
          Array.isArray(description.itenary)
            ? description.itenary.join(", ")
            : description.itenary
        }
      </p>

      <p style={{ fontSize: "19px" }}>
        <strong>Tales:</strong> {description.tales}
      </p>
    </div>
  );
}
