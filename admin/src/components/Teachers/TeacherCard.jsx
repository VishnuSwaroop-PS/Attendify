import React from "react";
import UserIcon from "@mui/icons-material/Person";

function TeacherCard({ teacher }) {
  return (
    <div className="flex shadow-lg w-64 md:w-80 h-32 rounded-lg cursor-pointer hover:shadow-xl">
      <div className="w-1/2 p-5 bg-primaryColor flex justify-center items-center rounded-s-lg">
        <UserIcon className="text-white w-full h-full" />
      </div>
      <div className="w-1/2 p-5 rounded-e-lg bg-white">
        <p className="font-Outfit font-bold text-xl">{teacher.name}</p>
      </div>
    </div>
  );
}

export default TeacherCard;
