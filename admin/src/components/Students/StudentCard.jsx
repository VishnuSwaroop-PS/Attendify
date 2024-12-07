import React from "react";
import Close from "@mui/icons-material/Close";
import { deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../../firebase/config";

function StudentCard({ student, onDelete }) {
  const deleteStudent = async () => {
    try {
      await deleteDoc(doc(firestore, "users", student.id));
      onDelete(student.id);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex rounded-xl items-center justify-between shadow-md w-full py-2 px-5">
      <div>
        <p className="font-Outfit text-primaryColor">{student.name}</p>
        <p className="font-Outfit font-extralight text-primaryColor">
          {student.rollNumber}
        </p>
      </div>
      <div
        onClick={deleteStudent}
        className="group rounded-full p-2 hover:bg-red-50 cursor-pointer"
      >
        <Close className="text-red-900" />
        <span className="invisible absolute w-max translate-y-10 -translate-x-20 rounded bg-red-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
          delete student
        </span>
      </div>
    </div>
  );
}

export default StudentCard;
