import React, { createContext, useContext, useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import TeacherCard from "./TeacherCard";
import AddTeacher from "./AddTeacher";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../firebase/config";

function Teachers({teacherDataFetched,setTeacherDataFetched,setTeachers,teachers}) {
  const [showModal, SetShowModal] = useState(false);
  

  useEffect(() => {
    console.log(teacherDataFetched)
    if (!teacherDataFetched) {
      fetchTeachers();
    }
  }, []);

  const fetchTeachers = async () => {
    try {
      const q = query(
        collection(firestore, "users"),
        where("role", "==", "Teacher")
      );
      const teacherCollection = await getDocs(q);
      const teacherList = teacherCollection.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeachers(teacherList);
      setTeacherDataFetched(true);
    } catch (e) {
      console.log("Error fetching teachers:", e);
    }
  };

  const handleModal = () => {
    SetShowModal(!showModal);
    fetchTeachers();
  };

  return (
    <div className={`max-h-screen min-h-screen w-full ${showModal ? "md:fixed" : null}`}>
      {showModal && <AddTeacher handleModal={handleModal} />}
      <div className="flex w-full justify-end p-4 fixed top-0 right-0 z-40">
        <div className="px-4 py-2 shadow-lg rounded-3xl bg-white flex items-center">
          <SearchIcon className="text-primaryColor" />
          <input
            type="text"
            className="px-2 outline-none text-gray-500 font-Outfit"
            placeholder="Search for a teacher"
            onChange={(e) => setSearchTerm(e.target.value)} // Handle search input
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 mt-20 gap-16 justify-items-center">
        {teachers.map((teacher) => (
          <TeacherCard key={teacher.id} teacher={teacher} />
        ))}
      </div>
      <div
        onClick={() => {
          SetShowModal(!showModal);
        }}
        className="flex justify-center items-center fixed bottom-5 right-5 w-16 h-16 bg-primaryColor rounded-full shadow-lg hover:scale-105 cursor-pointer"
      >
        <AddIcon className="text-white scale-105" />
      </div>
    </div>
  );
}

export default Teachers;
