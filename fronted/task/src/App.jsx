import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";   // ← ye import upar add karo

import Home from "./Pages/Home.jsx";
import Register from "./Pages/Register.jsx";
import Login from "./Pages/Login.jsx";

import ProjectList from "./Pages/ProjectList.jsx";
import AddProject from "./Pages/AddProject.jsx";
import Updateproject from "./Pages/Updateproject.jsx";

import CreateMember from "./Pages/Createmember.jsx";
import Membershowpage from "./Pages/Membershowpage.jsx";
import Updatemember from "./Pages/Updatemember.jsx";

import Tasklist from "./Pages/Tasklist.jsx";
import Projectdetail from "./Compoment/Projectdetail.jsx";

import Completedtask from "./Pages/Completedtask.jsx";  // ← ye import upar add karo

import AdminProtectedRoutes from "./loyout/Adminprotectedroutes.jsx";
import Default from "./Pages/Default.jsx";

import Member from "./Pages/Member.jsx";  // ← ye import upar add karo
import AllProject from "./Pages/AllProject.jsx";

import AboutPage from "./Pages/AboutPage.jsx";
import ContactPage from "./Pages/ContactPage.jsx";  // ← ye import upar add karo 

import UserProtectedRoutes from "./loyout/UserProtectedRoutes.jsx";  // ← ye import upar add karo

import NameList from "./Compoment/NameList.jsx";  // add this import at the top
import AnotherPage from "./Pages/AnotherPage.jsx";

import Taskgivesredux from "./Compoment/Taskgivesredux.jsx";  // add this import at the top
import "./api/axiosConfig.js";



function App() {
  return (

    <HashRouter>
      <Toaster position="top-right" />
      <Routes>

        {/* Public Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/reg" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Default />} />
        <Route path="/member" element={<Member />} />
        <Route path="/projects" element={<AllProject />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/namelist" element={<NameList />} />   // add this route for NameList component
        <Route path="/another" element={<AnotherPage />} />
        <Route path="/taskgivesredux" element={<Taskgivesredux />} />
        {/* Admin Protected Routes */}

        <Route
          path="/Membershowpage"
          element={
            <AdminProtectedRoutes>
              <Membershowpage />
            </AdminProtectedRoutes>
          }
        />

        <Route
          path="/tasklist"
          element={
            <UserProtectedRoutes>
              <Tasklist />
            </UserProtectedRoutes>
          }
        />

        <Route
          path="/tasklist/:projectId"
          element={
            <UserProtectedRoutes>
              <Tasklist />
            </UserProtectedRoutes>
          }
        />

        <Route
          path="/completedtask"
          element={
            <UserProtectedRoutes>
              <Completedtask />
            </UserProtectedRoutes>
          }
        />

        <Route
          path="/completedtask/:projectId"
          element={
            <UserProtectedRoutes>
              <Completedtask />
            </UserProtectedRoutes>
          }
        />






        <Route
          path="/projectlist"
          element={
            <AdminProtectedRoutes>
              <ProjectList />
            </AdminProtectedRoutes>
          }
        />

        <Route
          path="/addproject"
          element={
            <AdminProtectedRoutes>
              <AddProject />
            </AdminProtectedRoutes>
          }
        />

        <Route
          path="/createmember"
          element={
            <AdminProtectedRoutes>
              <CreateMember />
            </AdminProtectedRoutes>
          }
        />

        <Route
          path="/update/:id"
          element={
            <AdminProtectedRoutes>
              <Updateproject />
            </AdminProtectedRoutes>
          }
        />

        <Route
          path="/updatemember/:id"
          element={          
            <AdminProtectedRoutes> 
              <Updatemember />
            </AdminProtectedRoutes>
          }
        />

        <Route
          path="/project/:id"
          element={
            <AdminProtectedRoutes>
              <Projectdetail />
            </AdminProtectedRoutes>
          }
        />

      </Routes>
    </HashRouter>
  );
}

export default App;