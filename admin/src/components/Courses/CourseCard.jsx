import React, { useEffect, useState } from "react";
import UserIcon from "@mui/icons-material/Person";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { firestore } from "../../firebase/config";

function CourseCard({ course }) {
  const [teacherName, setTeacherName] = useState("");
  const [student, setStudent] = useState([]);

  const fetchStudentCount = async () => {
    try {
      const studentsQuery = query(
        collection(firestore, "users"),
        where("role", "==", "Student"),
        where("courseIds", "array-contains", course.id) // Fetch students in any of the classIds
      );

      const studentSnapshot = await getDocs(studentsQuery);
      const studentList = studentSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setStudent(studentList);
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudent([]); // Default to 0 if there's an error
    }
  };

  const fetchTeacherName = async () => {
    if (course.teacherIds && course.teacherIds.length > 0) {
      try {
        const teacherDocRef = doc(firestore, "users", course.teacherIds[0]); // Use the first teacherId
        const teacherDoc = await getDoc(teacherDocRef);
        if (teacherDoc.exists()) {
          setTeacherName(teacherDoc.data().name || "Unknown Teacher");
        } else {
          setTeacherName("Unknown Teacher");
        }
      } catch (error) {
        console.error("Error fetching teacher:", error);
        setTeacherName("Error fetching teacher");
      }
    } else {
      setTeacherName("No Teacher Assigned");
    }
  };

  useEffect(() => {
    fetchStudentCount();
    fetchTeacherName();
  }, []);

  return (
    <div className="w-72 md:w-80 h-28 bg-gray-50 shadow-lg rounded-[45px] flex justify-between bg-bgImg bg-local ">
      <div className="w-3/5 h-28 bg-primaryColor shadow-lg rounded-[45px] p-5 bg-bgImg bg-local">
        <p className="font-Outfit font-bold text-white text-sm ">
          {course.courseName.toUpperCase()}
        </p>
        <p className="font-Outfit text-sm font-extralight text-white">
          {teacherName}
        </p>
        <p className="font-Outfit font-thin text-sm text-white">
          {course.courseCode.toUpperCase()}
        </p>
      </div>
      <div className="flex relative">
        <div className="flex justify-start items-start">
          <div className="w-20 h-20 bg-primaryColor bg-opacity-40 rounded-full ">
            <div className="flex absolute top-6 right-10 justify-center items-center">
              <div className="w-16 h-16 bg-primaryColor bg-opacity-20 rounded-full flex justify-center items-center">
                <div className="w-10 h-10 bg-primaryColor rounded-full flex justify-center items-center">
                  <p className="font-Outfit text-lg text-white">
                    {student.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
