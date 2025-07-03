import React from 'react';
import bg from '../assets/bg.jpg';         
import travell from '../assets/travell.png'; 
import './Home.css'; 
import DescriptionItems from '../components/DescriptionItems';
import { useNavigate,} from 'react-router-dom';
import { useState } from 'react'; // ✅ CORRECT
import Modal from "../components/Modal"; // make sure this exists
import Form from "../components/Form"; // your login form



export default function Home() {
  const navigate=useNavigate()
  const  [isOpen,setIsOpen]=useState(false)


  const addDescription=()=>{
    let token=localStorage.getItem("token")
    if(token)
    navigate("/addDescription")
  else{
    console.log("No token: Opening modal");
    setIsOpen(true)
  }

  }
  return (
    <>
 
      <div className="bg" style={{ backgroundImage: `url(${bg})` }}></div>

      <section className="home">
        {/* Centered Title at the Top */}
        <div className="top-center">
          <h1>Wander Tales</h1>
        </div>

        {/* Left Description & Button */}
        <div className="left">
          <h5>
Welcome to our Travel Blog,your personal gateway to breathtaking destinations, hidden gems, and unforgettable experiences.
Whether you're planning your next getaway or simply seeking inspiration, our community of travelers brings you real stories, guides, tips, and photos from every corner of the globe.</h5>
          <button onClick={addDescription}>Share your travel ideas</button>
        </div>

        {/* Right Image */}
        <div>
          <img src={travell} width="420" height="380" alt="travel" className="right" />
        </div>
      </section>
      <div className='description'>
        <DescriptionItems/>
      </div>
      {isOpen && (
  <Modal onClose={() => setIsOpen(false)}>
    <Form
      onLoginSuccess={(token) => {
        localStorage.setItem("token", token); // ✅ use real token
        setIsOpen(false);
        navigate("/addDescription");
      }}

      onClose={() => setIsOpen(false)}
    />
  </Modal>
)}

    </>
  );
}
