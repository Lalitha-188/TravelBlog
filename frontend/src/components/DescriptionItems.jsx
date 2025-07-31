import React, { useState, useEffect } from 'react';
import { useLoaderData, Link } from 'react-router-dom';
import { LuCalendarDays } from "react-icons/lu";
import { FaHeart, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from 'axios';

export default function DescriptionItems() {
  const descriptions = useLoaderData();
  const [allDescriptions, setAllDescriptions] = useState([]);
  const [isFavDescription, setIsFavDescription] = useState(false);

  let path = window.location.pathname === "/places";
  const[favItem, setFavItem] = useState(
  JSON.parse(localStorage.getItem("favorites")) || [])

  useEffect(() => {
    setAllDescriptions(descriptions);
  }, [descriptions]);

 const favDescription = (item) => {
  const alreadyExists = favItem.some(desc => desc._id === item._id);
  let updatedFavs;

  if (alreadyExists) {
    updatedFavs = favItem.filter(desc => desc._id !== item._id);
  } else {
    updatedFavs = [...favItem, item];
  }

  setFavItem(updatedFavs);
  localStorage.setItem("favorites", JSON.stringify(updatedFavs));
};
const onDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this item?");
  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found");
      return;
    }

    await axios.delete(`http://localhost:5000/description/${id}`, {
      headers: {
        authorization: "Bearer " + token,
      },
    });

    setAllDescriptions((prev) =>
      prev.filter((description) => description._id !== id)
    );

    const updatedFavs = favItem.filter((description) => description._id !== id);
    localStorage.setItem("favorites", JSON.stringify(updatedFavs));
    setFavItem(updatedFavs); 

    alert("Deleted successfully");
  } catch (err) {
    console.error("Delete failed:", err.response?.data || err.message);
    alert("Failed to delete");
  }
};
return (
  <div
    style={{
      backgroundColor: path ? '' : 'unset', 
      minHeight: '100vh',
      minWidth: '100vh',
      padding: '1rem'
    }}
  >
      <div className={path ? "card-container places-layout" : "card-container"}>
      {allDescriptions.map((item, index) => {
        const cardContent = (
          <div className="card">
            <img
              src={`http://localhost:5000/images/${item.file}`}
              alt={item.title}
              width="100%"
              height="150px"
              style={{ objectFit: 'cover', borderRadius: '5px 5px 0 0',display:'block' }}
            />
            <div className="card-body">
              <div className="title">{item.title}</div>
              <div className="icons">
                <div className="days">
                  <LuCalendarDays />
                  <span>{item.days} days</span>
                </div>

                {!path ? (
                  <FaHeart
                    onClick={(e) => {
                      e.preventDefault();
                      favDescription(item);
                    }}
                    style={{
                      color: favItem.some(res => res._id === item._id) ? "black" : "gray",
                      cursor: "pointer"
                    }}
                  />
                ) : (
                  <div className='action'>
                    <Link to={`/editDescription/${item._id}`} className="editIcon"><FaEdit /></Link>
                    <MdDelete onClick={() => onDelete(item._id)} className='deleteIcon' />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

        return (
          <div key={index}>
            {!path ? (
              <Link to={`/description/${item._id}`} className="card-link">
                {cardContent}
              </Link>
            ) : (
              cardContent
            )}
          </div>
        );
      })}
    </div>
  </div>
)}
