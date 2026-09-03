import React, { useState, useEffect } from "react";
import axios from "axios";

function ProjectForm() {

  // ONE STATE
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
    status: "",
    deadline: "",
    picture: "",
    member: "",
  });

   const [members, setMembers] = useState([]);

  // HANDLE ALL INPUTS
  function handleChange(e) {

    const { name, value, files } = e.target;

    setFormData({
      ...formData,

      // FILE OR NORMAL INPUT
      [name]: files ? files[0] : value,
    });
  }




  async function handleSubmit() {

    try {

   let res = await axios.post(
  `${import.meta.env.VITE_BACKEND_URL}/project/createform`,
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data"
    },
    withCredentials: true
  }
);

      console.log(res.data);

      alert("Project Added Successfully");

      // CLEAR INPUTS
      setFormData({
        title: "",
        description: "",
        category: "",
        priority: "",
        status: "",
        deadline: "",
        picture: "",
        member: "",
      });

    } catch (error) {

      console.log(error);

      alert("Error");
    }
  }


  
  useEffect(() => {
    getMembers();
  }, []);

  async function getMembers() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/members/getmember`,
        {
           withCredentials: true
        }
      );

      console.log("API Response:", res.data);

      if (res.data.success) {
        setMembers(res.data.data || res.data.members || []);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  }

  return (
    <div className="container">

      <div className="form-box">

        <h2>Add Project</h2>

        {/* TITLE */}
        <input
          type="text"
          name="title"
          placeholder="Project Title"
          value={formData.title}
          onChange={handleChange}
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          placeholder="Project Description"
          value={formData.description}
          onChange={handleChange}
        />

        {/* CATEGORY */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          <option value="App">App</option>
          <option value="Web">Web</option>
          <option value="Game">Game</option>
        </select>

        {/* PRIORITY */}
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="">Select Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        {/* STATUS */}
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="">Select Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        {/* DEADLINE */}
        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
        />


        <select
          name="member"
          value={formData.member}
          onChange={handleChange}
        >
          <option value="">Select Member</option>

          {members.map((member) => (
            <option key={member._id} value={member._id}>
              {member.fullName}
            </option>
          ))}
        </select>

        <input
          type="file"
          onChange={function (e) {

            setFormData({
              ...formData,
              picture: e.target.files[0]
            })

          }}
        />

        {/* BUTTON */}
        <button onClick={handleSubmit}>
          Add Project
        </button>

      </div>
      <style>{`

        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
          font-family:Arial;
        }

        .container{
          width:100%;
          min-height:100vh;
          background:#f3f4f6;
          display:flex;
          justify-content:center;
          align-items:center;
          padding:20px;
        }

        .form-box{
          width:100%;
          max-width:500px;
          background:white;
          padding:30px;
          border-radius:10px;
          box-shadow:0px 0px 10px rgba(0,0,0,0.1);
        }

        .form-box h2{
          text-align:center;
          margin-bottom:20px;
          color:#111827;
        }

        .form-box input,
        .form-box textarea,
        .form-box select{
          width:100%;
          padding:12px;
          margin-bottom:15px;
          border:1px solid #d1d5db;
          border-radius:5px;
          outline:none;
          font-size:15px;
        }

        .form-box textarea{
          height:100px;
          resize:none;
        }

        .form-box button{
          width:100%;
          padding:12px;
          background:#111827;
          color:white;
          border:none;
          border-radius:5px;
          font-size:16px;
          cursor:pointer;
        }

        .form-box button:hover{
          background:#374151;
        }

      `}</style>

    </div>
  );
}

export default ProjectForm;