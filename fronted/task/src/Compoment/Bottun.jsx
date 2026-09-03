import React from "react";

function Bottun(props) {

  let { title } = props;

    //kjltrkgjrlkjtkgjekl 

  return (
    <>
      <button className="btn">
        <span>{title}</span>
      </button>
        
 


      <style>{`
        .btn{
          padding:12px 24px;
          border:none;
          border-radius:12px;
          background:linear-gradient(135deg,#2563eb,#7c3aed);
          color:white;
          font-size:15px;
          font-weight:600;
          cursor:pointer;
          transition:all .3s ease;
          box-shadow:0 8px 20px rgba(37,99,235,.25);
        }

        .btn:hover{
          transform:translateY(-3px);
          box-shadow:0 12px 25px rgba(37,99,235,.35);
        }

        .btn:active{
          transform:scale(.98);
        }
      `}</style>
    </>
  );
}

export default Bottun;