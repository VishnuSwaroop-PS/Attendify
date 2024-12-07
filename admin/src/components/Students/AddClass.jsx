import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { firestore } from "../../firebase/config";

function AddClass({ handleClassModal, onCourseAdded }) {
  const [className, setClassName] = useState("");
  const [courses, setCourses] = useState([]); // To store the list of courses fetched from the DB
  const [selectedCourses, setSelectedCourses] = useState([]); // To store the selected courses
  const [error, setError] = useState("");

  // Fetch available courses from Firestore
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesQuery = query(collection(firestore, "courses")); // Adjust the collection name as per your Firestore structure
        const coursesSnapshot = await getDocs(coursesQuery);
        const coursesList = coursesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(coursesList);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Failed to load courses. Please try again.");
      }
    };

    fetchCourses();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(firestore, "classes"), {
        className: className,
        courseIds: selectedCourses, // Store selected course IDs in Firestore
      });
      onCourseAdded(); // Notify parent component about the new class
      handleClassModal(); // Close the modal after successful submission
    } catch (error) {
      console.error("Error adding class:", error);
      setError("Failed to add class. Please try again.");
    }
  };

  const handleCourseChange = (id) => {
    setSelectedCourses((prevSelectedCourses) =>
      prevSelectedCourses.includes(id)
        ? prevSelectedCourses.filter((courseId) => courseId !== id)
        : [...prevSelectedCourses, id]
    );
  };

  return (
    <div className="absolute flex justify-center items-center inset-0 bg-transparent backdrop-blur-md w-full z-50">
      <div className="bg-white p-4 rounded-md shadow-md w-96 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-primaryColor">Add Class</h2>
          <div
            onClick={handleClassModal}
            className="cursor-pointer z-50"
          >
            <CloseIcon className="text-gray-500" />
          </div>
        </div>
        <hr />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form className="space-y-4 mt-2" onSubmit={handleFormSubmit}>
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-600">Class Name</label>
            <input
              type="text"
              placeholder="Enter class name"
              className="border border-gray-300 p-2 rounded-md"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-600">Select Courses</label>
            <div className="space-y-2 max-h-32 overflow-y-scroll">
              {courses.map((course) => (
                <div key={course.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={course.id}
                    onChange={() => handleCourseChange(course.id)}
                    checked={selectedCourses.includes(course.id)}
                  />
                  <span>{course.courseName.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-primaryColor text-white rounded-md hover:bg-white hover:border hover:border-primaryColor hover:text-primaryColor"
          >
            Add Class
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddClass;
