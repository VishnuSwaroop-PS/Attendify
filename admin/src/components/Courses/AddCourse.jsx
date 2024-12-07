import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { addDoc, collection, getDocs, query, where, updateDoc, doc, arrayUnion } from "firebase/firestore";
import { firestore } from "../../firebase/config";

function AddCourse({ handleCourseModal, onCourseAdded }) {
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchTeachersAndClasses = async () => {
      try {
        // Query to fetch users with role "Teacher"
        const teacherQuery = query(
          collection(firestore, "users"),
          where("role", "==", "Teacher")
        );
        const teachersSnapshot = await getDocs(teacherQuery);
        const teachersList = teachersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTeachers(teachersList);

        // Fetch classes
        const classesSnapshot = await getDocs(collection(firestore, "classes"));
        const classesList = classesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClasses(classesList);
      } catch (error) {
        console.error("Error fetching teachers and classes:", error);
      }
    };

    fetchTeachersAndClasses();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    handleCourseModal();
  
    try {
      // Add new course to the database
      const courseRef = await addDoc(collection(firestore, "courses"), {
        courseName,
        courseCode,
        teacherIds: selectedTeachers,
        classIds: selectedClasses,
      });
  
      // Update selected teachers with the new course ID
      await Promise.all(
        selectedTeachers.map(async (teacherId) => {
          const teacherRef = doc(firestore, "users", teacherId);
          await updateDoc(teacherRef, {
            courseIds: arrayUnion(courseRef.id), // Add the new course ID to the teacher's courseIds array
          });
        })
      );
  
      // Update selected classes with the new course ID
      await Promise.all(
        selectedClasses.map(async (classId) => {
          const classRef = doc(firestore, "classes", classId);
          await updateDoc(classRef, {
            courseIds: arrayUnion(courseRef.id), // Add the new course ID to the class's courseIds array
          });
        })
      );
  
      onCourseAdded(); // Notify parent component about the new course
    } catch (error) {
      console.error("Error adding course and updating teachers and classes:", error);
    }
  };

  const handleTeacherChange = (id) => {
    setSelectedTeachers((prevSelectedTeachers) =>
      prevSelectedTeachers.includes(id)
        ? prevSelectedTeachers.filter((teacherId) => teacherId !== id)
        : [...prevSelectedTeachers, id]
    );
  };

  const handleClassChange = (id) => {
    setSelectedClasses((prevSelectedClasses) =>
      prevSelectedClasses.includes(id)
        ? prevSelectedClasses.filter((classId) => classId !== id)
        : [...prevSelectedClasses, id]
    );
  };

  return (
    <div className="absolute flex justify-center items-center inset-0 bg-transparent backdrop-blur-md w-full z-50">
      <div className="bg-white p-4 rounded-md shadow-md w-96 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-primaryColor">Add Course</h2>
          <div onClick={handleCourseModal} className="cursor-pointer">
            <CloseIcon className="text-gray-500" />
          </div>
        </div>
        <hr />
        <form className="space-y-4 mt-2" onSubmit={handleFormSubmit}>
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-600">Course Name</label>
            <input
              type="text"
              placeholder="Enter course name"
              className="border border-gray-300 p-2 rounded-md"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-600">Course Code</label>
            <input
              type="text"
              placeholder="Enter course code"
              className="border border-gray-300 p-2 rounded-md"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-600">Select Teacher(s)</label>
            <div className="space-y-2 max-h-32 overflow-y-scroll">
              {teachers.map((teacher) => (
                <div key={teacher.id} className="flex items-center space-x-2 max-h-32 overflow-y-scroll">
                  <input
                    type="checkbox"
                    value={teacher.id}
                    onChange={() => handleTeacherChange(teacher.id)}
                    checked={selectedTeachers.includes(teacher.id)}
                  />
                  <span>{teacher.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col space-y-2 ">
            <label className="text-sm text-gray-600">Select Classes</label>
            <div className="space-y-2 max-h-32 overflow-y-scroll">
              {classes.map((classItem) => (
                <div key={classItem.id} className="flex items-center space-x-2 ">
                  <input
                    type="checkbox"
                    value={classItem.id}
                    onChange={() => handleClassChange(classItem.id)}
                    checked={selectedClasses.includes(classItem.id)}
                  />
                  <span>{classItem.className}</span>
                </div>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-primaryColor text-white rounded-md hover:bg-white hover:border hover:border-primaryColor hover:text-primaryColor"
          >
            Add Course
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCourse;
