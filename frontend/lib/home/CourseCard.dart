import 'package:flutter/material.dart';
import 'package:frontend/students/student_list.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:camera/camera.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class CourseCard extends StatefulWidget {
  final Map<String, dynamic> course;
  final List<CameraDescription> cameras;
  final String courseId;

  const CourseCard({
    required this.course,
    required this.cameras,
    required this.courseId,
  });

  @override
  _CourseCardState createState() => _CourseCardState();
}

class _CourseCardState extends State<CourseCard> {
  int studentCount = 0;
  List<Map<String, dynamic>> students = [];

  @override
  void initState() {
    super.initState();
    _fetchStudentCount();
  }

  Future<void> _fetchStudentCount() async {
    try {
      final studentsQuery = FirebaseFirestore.instance
          .collection('users')
          .where('role', isEqualTo: 'Student')
          .where('courseIds', arrayContains: widget.courseId);

      final studentSnapshot = await studentsQuery.get();

      setState(() {
        students = studentSnapshot.docs
            .map((doc) => doc.data() as Map<String, dynamic>)
            .toList();
        studentCount = students.length;
      });
    } catch (error) {
      print("Error fetching students: $error");
      setState(() {
        studentCount = 0; // Default to 0 if there's an error
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 100,
      child: Padding(
        padding: const EdgeInsets.all(10.0),
        child: ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
            elevation: 5,
          ),
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => StudentList(
                  courseName: widget.course['courseName'] ?? 'Unknown Course',
                  students: students,
                  cameras: widget.cameras,
                ),
              ),
            );
          },
          child: Padding(
            padding: const EdgeInsets.all(10),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      widget.course['courseName'].toUpperCase(),
                      style: GoogleFonts.outfit(
                        fontWeight: FontWeight.bold,
                        color: Colors.black,
                      ),
                    ),
                    Text(
                      widget.course['courseCode'].toUpperCase(),
                      style: GoogleFonts.outfit(
                        fontWeight: FontWeight.w300,
                        color: Colors.black,
                      ),
                    ),
                  ],
                ),
                Row(
                  children: [
                    Text(
                      studentCount.toString(),
                      style: GoogleFonts.outfit(
                        fontWeight: FontWeight.bold,
                        color: Colors.black,
                      ),
                    ),
                    const SizedBox(width: 10),
                    Icon(
                      Icons.supervisor_account_sharp,
                      color: Theme.of(context).primaryColor,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
