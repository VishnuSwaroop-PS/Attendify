import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import AddClass from "./AddClass";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase/config"; // Ensure this is correctly imported
import ClassCard from "./ClassCard";

function Students({
  courseDataFetched,
  setCourseDataFetched,
  setCourses,
  courses,
  classesDataFetched,
  setClassesDataFetched,
  setClasses,
  classes,
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      const courseCollection = await getDocs(collection(firestore, "courses"));
      const courseList = courseCollection.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const sortedCourses = courseList.sort((a, b) =>
        a.courseName.localeCompare(b.courseName)
      );
      setCourses(sortedCourses);
      setCourseDataFetched(true);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchClasses = async () => {
    try {
      const classCollection = await getDocs(collection(firestore, "classes"));
      const classList = classCollection.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const sortedClasses = classList.sort((a, b) =>
        a.className.localeCompare(b.className)
      );
      setClasses(sortedClasses);
      setClassesDataFetched(true);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const handleCourseSelection = (courseId) => {
    setSelectedCourses((prevSelectedCourses) =>
      prevSelectedCourses.includes(courseId)
        ? prevSelectedCourses.filter((id) => id !== courseId)
        : [...prevSelectedCourses, courseId]
    );
  };

  const handleClassModal = () => {
    setShowModal(!showModal);
  };
  
  const handleCourseAdd = () => {
    fetchClasses();
  }

  const handleDeleteClass = (classId) => {
    setClasses(classes.filter((course) => course.id !== classId));
  };

  useEffect(() => {
    fetchClasses();
    fetchCourses();
  }, []);

  return (
    <div className={`max-h-screen min-h-screen w-full ${showModal ? "md:fixed" : null}`}>
      {showModal ? (
        <AddClass
          handleCourseSelection={handleCourseSelection}
          selectedCourses={selectedCourses}
          courses={courses}
          handleClassModal={handleClassModal}
          onCourseAdded={handleCourseAdd}
        />
      ) : null}
      <div className="flex w-full justify-end p-4 fixed top-0 right-0 z-20 ">
        <div className="px-4 py-2 shadow-lg rounded-3xl bg-white flex items-center ">
          <SearchIcon className="text-primaryColor" />
          <input
            type="text"
            className="px-2 outline-none text-gray-500 font-Outfit"
            placeholder="Search for a class"
          />
        </div>
      </div>
      <div className="flex flex-col gap-16 mt-20">
        {classes.map((course) => (
          <ClassCard key={course.id} course={course} onDelete={handleDeleteClass} />
        ))}
      </div>
      <div
        className="flex justify-center items-center fixed bottom-5 right-5 w-16 h-16 bg-primaryColor rounded-full shadow-lg hover:scale-105 cursor-pointer"
        onClick={() => {
          setShowModal(!showModal);
        }}
      >
        <AddIcon className="text-white scale-105" />
      </div>
    </div>
  );
}

export default Students;
