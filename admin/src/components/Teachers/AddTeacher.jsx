import React, { useRef, useState, useEffect, useMemo } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Webcam from "react-webcam";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase/config";

function AddTeacher({ handleModal }) {
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [capturedImage, setCapturedImage] = useState(null);
  const [courses, setCourses] = useState([]);
  const webcamRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseCollection = await getDocs(
          collection(firestore, "courses")
        );
        const courseList = courseCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const sortedCourses = courseList.sort((a, b) =>
          a.courseName.localeCompare(b.courseName)
        );
        setCourses(sortedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setShowCamera(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(firestore, "users"), {
        courseIds: selectedCourses,
        email,
        faceId: "kjahjd", 
        name,
        role: "Teacher",
        pin: parseInt(pin), 
      });
      handleModal();

    } catch (e) {
      console.error("Error adding teacher: ", e);
    }
  };

  // const handleCourseSelection = (courseId) => {
  //   setSelectedCourses((prevSelectedCourses) =>
  //     prevSelectedCourses.includes(courseId)
  //       ? prevSelectedCourses.filter((id) => id !== courseId)
  //       : [...prevSelectedCourses, courseId]
  //   );
  // };

  return (
    <div className="absolute flex justify-center items-center inset-0 bg-transparent backdrop-blur-md w-full z-50">
      <div className="bg-white p-4 rounded-md shadow-md w-96 mx-auto">
        <div className="flex justify-between">
          <h2 className="text-lg font-bold mb-4 text-primaryColor">
            Add Teacher
          </h2>
          <div
            onClick={() => {
              handleModal();
            }}
            className="cursor-pointer"
          >
            <CloseIcon className="text-gray-500" />
          </div>
        </div>
        <hr />
        <form className="space-y-4 mt-2" onSubmit={handleFormSubmit}>
          <div className="flex flex-col space-y-1">
            <label className="text-sm text-gray-600">Name</label>
            <input
              type="text"
              placeholder="Name"
              className="border border-gray-300 p-2 rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)} // Updated event handler
              required
            />
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="border border-gray-300 p-2 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Updated event handler
              required
            />
            {/* <label className="text-sm text-gray-600">Courses</label>
            <div className="space-y-2 max-h-32 overflow-y-scroll">
              {courses.map((course) => (
                <div key={course.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={course.id}
                    name="course"
                    value={course.id}
                    onChange={() => handleCourseSelection(course.id)}
                    className="mr-2"
                  />
                  <label htmlFor={course.id} className="text-sm text-gray-600">
                    {course.courseName}
                  </label>
                </div>
              ))}
            </div> */}
            <label className="text-sm text-gray-600">Security Pin</label>
            <input
              type="number"
              placeholder="PIN"
              className="border border-gray-300 p-2 rounded-md"
              value={pin}
              onChange={(e) => setPin(e.target.value)} // Updated event handler
              required
            />
            <label className="text-sm text-gray-600">Capture Face</label>
            {capturedImage ? (
              <img
                src={capturedImage}
                alt="Captured face"
                className="w-full h-auto"
              />
            ) : (
              <button
                type="button"
                onClick={() => setShowCamera(true)}
                className="border border-gray-300 p-2 rounded-md bg-primaryColor text-white"
              >
                Capture Face
              </button>
            )}

            {showCamera && (
              <div className="flex flex-col items-center">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-auto"
                />
                <button
                  type="button"
                  onClick={captureImage}
                  className="mt-2 px-5 py-2 bg-primaryColor text-white rounded-md"
                >
                  Capture
                </button>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-primaryColor text-white rounded-md hover:bg-white hover:border hover:border-primaryColor hover:text-primaryColor"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddTeacher;
