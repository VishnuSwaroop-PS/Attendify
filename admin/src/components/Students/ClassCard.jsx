import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import StudentCard from "./StudentCard";
import AddStudent from "./AddStudent";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { firestore } from "../../firebase/config";

function ClassCard({ course, onDelete }) {
  const [showStudents, setShowStudents] = useState(false);
  const [showAddStudentsModal, setShowAddStudentsModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchStudents = async () => {
    try {
      const studentsQuery = query(
        collection(firestore, "users"),
        where("role", "==", "Student"),
        where("classId", "==", course.id)
      );

      const studentSnapshot = await getDocs(studentsQuery);
      const studentList = studentSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setStudents(studentList);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [showStudents, course.id]);

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(firestore, "classes", course.id));
      if (onDelete) {
        onDelete(course.id);
      }
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };

  const handleStudentModal = () => {
    setShowAddStudentsModal(!showAddStudentsModal);
    if (!showAddStudentsModal) {
      fetchStudents();
    }
  };

  const handleStudentChanges = () => {
    fetchStudents();
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {showAddStudentsModal && (
        <AddStudent
          course={course}
          onStudentAdded={handleStudentChanges}
          handleStudentModal={handleStudentModal}
        />
      )}
      <div
        className={`flex justify-between bg-white shadow-lg px-5 py-3 ${
          showStudents ? "rounded-t-xl" : "rounded-xl"
        } items-center`}
      >
        <div>
          <p className="text-primaryColor font-Outfit font-bold">
            {course.className.toUpperCase()}
          </p>
        </div>
        <div>
          <p className="text-primaryColor font-Outfit font-bold">
            {students.length}
          </p>
        </div>
        <div className="flex gap-5">
          <div
            onClick={handleDelete}
            className="group rounded-full p-2 hover:bg-red-50 cursor-pointer"
          >
            <DeleteIcon className="text-red-900" />
            <span className="invisible group-hover:visible absolute bg-red-900 text-white px-2 py-2 rounded-md text-xs mt-8">
              Delete Class
            </span>
          </div>

          <div className="group rounded-full p-2 hover:bg-green-50 cursor-pointer">
            <EditIcon className="text-primaryColor" />
            <span className="invisible group-hover:visible absolute bg-primaryColor text-white px-2 py-2 rounded-md text-xs mt-8">
              Edit Class
            </span>
          </div>
          <div
            className="group rounded-full p-2 hover:bg-green-50 cursor-pointer"
            onClick={() => {
              setShowStudents(!showStudents);
            }}
          >
            <ArrowDropDownIcon className="text-primaryColor" />
            <span className="invisible group-hover:visible absolute bg-primaryColor text-white px-2 py-2 rounded-md text-xs mt-8 -translate-x-20 w-max">
              show student list
            </span>
          </div>
        </div>
      </div>
      {showStudents && (
        <div className="flex flex-col justify-between bg-white shadow-lg px-5 py-3 rounded-b-xl items-start max-h-96 overflow-y-scroll gap-2">
          <div className="w-full">
            <div className="flex justify-between md:w-full">
              <h1 className="text-lg font-bold text-primaryColor">
                Student List
              </h1>
              <div className="flex items-center">
                <div className="hidden md:flex items-center bg-white px-4 py-2 rounded-3xl">
                  <SearchIcon className="text-primaryColor" />
                  <input
                    type="text"
                    className="px-2 outline-none text-gray-500 font-Outfit"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div
                  onClick={handleStudentModal}
                  className="group bg-green-50 rounded-full p-2 hover:scale-110 hover:text-white cursor-pointer"
                >
                  <AddIcon className="text-primaryColor" />
                  <span className="invisible group-hover:visible absolute bg-primaryColor text-white px-2 py-1 rounded-md text-xs -translate-x-3/4 -top-2  w-max">
                    Add student
                  </span>
                </div>
              </div>
            </div>
            <hr className="w-full pb-1" />
          </div>
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onDelete={handleStudentChanges}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ClassCard;
