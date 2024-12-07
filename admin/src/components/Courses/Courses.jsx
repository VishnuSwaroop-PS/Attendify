import React, { useState, useEffect } from "react";
import CourseCard from "./CourseCard";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import AddCourse from "./AddCourse";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase/config";

function Courses({
  ccourseDataFetched,
  setCCourseDataFetched,
  setCCourses,
  ccourses,
}) {
  const [showCourseModal, setCourseShowModal] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCourses = async () => {
    try {
      // Ensure the loading state is set to true before fetching data
      const coursesSnapshot = await getDocs(collection(firestore, "courses"));
      const coursesList = coursesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCCourses(coursesList);
      setCCourseDataFetched(true);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError("Failed to load courses. Please try again later.");
    }
  };

  useEffect(() => {
    console.log("course data", ccourseDataFetched);
    if (!ccourseDataFetched) {
      fetchCourses();
    }
  }, []);

  const handleCourseModal = () => {
    setCourseShowModal(!showCourseModal);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCourses = ccourses.filter((course) =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div
      className={`max-h-screen min-h-screen w-full ${
        showCourseModal ? "md:fixed" : ""
      }`}
    >
      {showCourseModal && (
        <AddCourse
          handleCourseModal={handleCourseModal}
          onCourseAdded={fetchCourses}
        />
      )}
      <div className="flex w-full justify-end p-4 fixed top-0 right-0 z-50">
        <div className="px-4 py-2 shadow-lg rounded-3xl bg-white flex items-center">
          <SearchIcon className="text-primaryColor" />
          <input
            type="text"
            placeholder="Search for a course"
            className="px-2 outline-none text-gray-500 font-Outfit"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 w-full justify-items-center mt-20">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      <div
        onClick={handleCourseModal}
        className="flex justify-center items-center fixed bottom-5 right-5 w-16 h-16 bg-primaryColor rounded-full shadow-lg hover:scale-105 cursor-pointer"
      >
        <AddIcon className="text-white scale-105" />
      </div>
    </div>
  );
}

export default Courses;
