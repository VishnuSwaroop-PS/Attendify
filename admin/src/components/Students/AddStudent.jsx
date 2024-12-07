import React, { useState, useRef, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Webcam from "react-webcam";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase/config";

function AddStudent({ handleStudentModal, onStudentAdded, course }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const webcamRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setShowCamera(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    handleStudentModal();

    if (!capturedImage) {
        console.error("No image captured!");
        return;
    }

    try {
        // Convert base64 image to Blob
        const response = await fetch(capturedImage);
        const blob = await response.blob();

        const formData = new FormData();
        formData.append('capturedImage', blob, 'captured_image.jpg');
        formData.append('name', name);

        // Send the image to the backend for processing
        const backendResponse = await fetch('http://127.0.0.1:5000/register-student', {
            method: 'POST',
            body: formData,
        });

        const data = await backendResponse.json();
        console.log(data);

        if (backendResponse.ok) {
            const faceId = data.data.features; // Extract faceId from the response

            console.log("Extracted Face ID:", faceId);

            // Now add the student to the Firestore
            await addDoc(collection(firestore, "users"), {
                classId: course.id,
                email,
                faceId, // Use the extracted faceId
                name,
                role: "Student",
                rollNumber,
                courseIds: selectedCourses, // Include selected courses
            });

            onStudentAdded(); // Notify parent component of the new student
        } else {
            console.error("Failed to extract faceId:", data.error);
        }
    } catch (e) {
        console.error("Error adding student: ", e);
    }
  };

  useEffect(() => {
    const fetchClassesAndCourses = async () => {
      try {
        const classCollection = await getDocs(collection(firestore, "classes"));
        const classList = classCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClasses(classList);

        const courseCollection = await getDocs(collection(firestore, "courses"));
        const courseList = courseCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAvailableCourses(courseList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchClassesAndCourses();
  }, []);

  const handleCourseChange = (courseId) => {
    setSelectedCourses((prevSelectedCourses) =>
      prevSelectedCourses.includes(courseId)
        ? prevSelectedCourses.filter((id) => id !== courseId)
        : [...prevSelectedCourses, courseId]
    );
  };

  return (
    <div className="absolute flex justify-center items-center inset-0 bg-transparent backdrop-blur-md w-full z-50">
      <div className="bg-white p-4 rounded-md shadow-md w-96 mx-auto">
        <div className="flex justify-between">
          <h2 className="text-lg font-bold mb-4 text-primaryColor">Add Student</h2>
          <div onClick={handleStudentModal} className="cursor-pointer">
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
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="border border-gray-300 p-2 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className="text-sm text-gray-600">Roll Number</label>
            <input
              type="text"
              placeholder="Roll Number"
              className="border border-gray-300 p-2 rounded-md"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              required
            />
            <label className="text-sm text-gray-600">Class</label>
            <input
              type="text"
              placeholder={course.className}
              disabled
              className="border border-gray-300 p-2 rounded-md"
              required
            />
            <label className="text-sm text-gray-600">Select Courses</label>
            <div className="space-y-2">
              {availableCourses.map((course) => (
                <div key={course.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={course.id}
                    value={course.id}
                    onChange={() => handleCourseChange(course.id)}
                    checked={selectedCourses.includes(course.id)}
                  />
                  <label htmlFor={course.id} className="ml-2">
                    {course.courseName.toUpperCase()}
                  </label>
                </div>
              ))}
            </div>
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

export default AddStudent;