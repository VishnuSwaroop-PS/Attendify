import 'package:flutter/material.dart';
import 'package:frontend/students/student_list.dart';
import 'package:google_fonts/google_fonts.dart';

class StudentCard extends StatelessWidget {
  final Map<String, dynamic> student;
  final Map<String, dynamic> course;

  const StudentCard({
    super.key,
    required this.student,
    required this.course,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(10.0),
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(backgroundColor: Colors.white),
        onPressed: () {
          // Navigator.push(
          //   context,
          //   MaterialPageRoute(
          //     builder: (context) => StudentList(
          //       courseName: course['name'], // Pass course name
          //       students: course['students'], // Pass list of students
          //     ),
          //   ),
          // );
        },
        child: Padding(
          padding: const EdgeInsets.all(10),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    student['name'],
                    style: GoogleFonts.outfit(
                        fontWeight: FontWeight.bold, color: Colors.black),
                  ),
                  Text(
                    student['rollNumber'],
                    style: GoogleFonts.outfit(
                        fontWeight: FontWeight.w300, color: Colors.black),
                  ),
                ],
              ),
              // Text(
              //   student['attendancePercentage'].toString(),
              //   style: GoogleFonts.outfit(
              //       fontWeight: FontWeight.bold,
              //       color: student['attendancePercentage'] < 85
              //           ? Colors.red
              //           : Theme.of(context).primaryColor),
              // ),
            ],
          ),
        ),
      ),
    );
  }
}
