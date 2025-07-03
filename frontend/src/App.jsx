import React from 'react'
import'./App.css'
import {createBrowserRouter,RouterProvider, useAsyncValue} from "react-router-dom"
import Home from './pages/Home'
import MainNavigation from './components/MainNavigation'
import axios from 'axios'
import ProtectedRoute from './components/ProtectedRoute';
import DescriptionItems from './components/DescriptionItems'; 
import AddDescription from './pages/AddDescription'; 
import EditDescription from './pages/EditDescription';
import DescriptionDetail from "./pages/DescriptionDetail"



const getAllDescriptions = async () => {
  let allDescriptions = []
  await axios.get("http://localhost:5000/description").then(res=>{
  allDescriptions=res.data
});
return allDescriptions
}

const getplaces = async () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "undefined") return [];

    let user;
    try {
      user = JSON.parse(storedUser);
    } catch (e) {
      console.error("Invalid JSON in localStorage 'user':", storedUser);
      return [];
    }

    if (!user || !user._id) return [];

    const res = await axios.get("http://localhost:5000/description");
    const filtered = res.data.filter((item) => {
      const creator = item.createdBy;

      if (typeof creator === "object" && creator !== null) {
        return creator._id === user._id;
      }

      if (typeof creator === "string") {
        return creator === user._id;
      }

      return false;
    });

    return filtered;
  } catch (error) {
    console.error("Error loading user descriptions:", error);
    return [];
  }
};

const  getFavDescriptions=()=>{
  return JSON.parse(localStorage.getItem("favorites"))
}


const router = createBrowserRouter([
  {
    path: '/',
    element: <MainNavigation />,
    children: [
      {
        path: '/',
        element: <Home />,
        loader: getAllDescriptions
      },
      {
        path: '/places',
        element: (
          <ProtectedRoute>
            <DescriptionItems />
          </ProtectedRoute>
        ),
        loader: getplaces
      },
      {
        path: '/favourites',
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
        loader: getFavDescriptions
      },
            {
        path: '/addDescription',
        element: (
          <ProtectedRoute>
            <AddDescription />
          </ProtectedRoute>
        )
      },
      
            {
        path: '/editDescription/:id',
        element: (
          <ProtectedRoute>
            <EditDescription />
          </ProtectedRoute>
        )
      },
      
            {
        path: '/description/:id',
        element: (
          <ProtectedRoute>
            <DescriptionDetail />
          </ProtectedRoute>
        )
      }

    ]
  }
]);
export default function App() {
  return <RouterProvider router={router} />;
}