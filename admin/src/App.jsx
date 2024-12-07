import React, { useState } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import Students from "./components/Students/Students";
import Courses from "./components/Courses/Courses";
import Teachers from "./components/Teachers/Teachers";
import mainBG from "./assets/mainBg.png";
import ScanScreen from "./components/Scan/ScanScreen";

function App() {
  const [renderScreenVal, setRenderScreenVal] = useState(0);
  const [teacherDataFetched, setTeacherDataFetched] = useState(false);
  const [courseDataFetched, setCourseDataFetched] = useState(false);
  const [classesDataFetched, setClassesDataFetched] = useState(false);
  const [ccourseDataFetched, setCCourseDataFetched] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [ccourses, setCCourses] = useState([]);
  

  const renderScreen = () => {
    switch (renderScreenVal) {
      case 0:
        return (
          <Students
            courseDataFetched={courseDataFetched}
            setCourseDataFetched={setCourseDataFetched}
            classesDataFetched={classesDataFetched}
            setClassesDataFetched={setClassesDataFetched}
            courses={courses}
            classes={classes}
            setClasses={setClasses}
            setCourses={setCourses}
          />
        );
      case 1:
        return (
          <Courses
            ccourseDataFetched={ccourseDataFetched}
            setCCourseDataFetched={setCCourseDataFetched}
            ccourses={ccourses}
            setCCourses={setCCourses}            
          />
        );
      case 2:
        return (
          <Teachers
            teachers={teachers}
            setTeachers={setTeachers}
            teacherDataFetched={teacherDataFetched}
            setTeacherDataFetched={setTeacherDataFetched}
          />
        );
      case 3:
        return (
          <ScanScreen/>
        );
      default:
        return (
          <Students
            courseDataFetched={courseDataFetched}
            setCourseDataFetched={setCourseDataFetched}
            classesDataFetched={classesDataFetched}
            setClassesDataFetched={setClassesDataFetched}
            courses={courses}
            classes={classes}
            setClasses={setClasses}
            setCourses={setCourses}
          />
        );
    }
  };

  return (
    <div
      className="flex"
      style={{
        backgroundImage: `url(${mainBG})`,
        backgroundSize: "fill", // Changed to 'cover'
        backgroundPosition: "center",
        backgroundRepeat: "repeat", // Changed to 'no-repeat'
      }}
    >
      <Sidebar setRenderScreenVal={setRenderScreenVal} />
      <div className="ml-16 flex-grow p-4">{renderScreen()}</div>
    </div>
  );
}

export default App;
