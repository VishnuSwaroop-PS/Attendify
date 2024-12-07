import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:frontend/summary/summary_student_list.dart'; // Make sure to import your custom student list widget

class ElevatedButtonW extends StatelessWidget {
  final String displayText;
  final String displayNum;
  final String courseName;

  const ElevatedButtonW({
    required this.displayText,
    required this.displayNum,
    required this.courseName,
  });

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;

    Future<void> _showStudentList(BuildContext context) async {
      // Load the JSON data
      final String response =
          await rootBundle.loadString('lib/constants/courses.json');
      final Map<String, dynamic> data = json.decode(response);

      // Find the course data that matches the selected course name
      final courseData = (data['courses'] as List).firstWhere(
          (course) => course['name'] == courseName,
          orElse: () => {});

      // Extract student data from the selected course
      final List<dynamic> students = courseData['students'] ?? [];

      showModalBottomSheet(
        context: context,
        builder: (context) {
          return Container(
            decoration: const BoxDecoration(
              image: DecorationImage(
                image: AssetImage('lib/assets/mainBg.png'),
                fit: BoxFit.fill,
              ),
            ),
            width: screenSize.width,
            child: Padding(
              padding: const EdgeInsets.all(10.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 10),
                  Text(
                    displayText,
                    style: GoogleFonts.outfit(
                      color: Theme.of(context).primaryColor,
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Expanded(
                    child: ListView.builder(
                      itemCount: students.length,
                      itemBuilder: (context, index) {
                        final student = students[index];
                        return SummaryStudentList(
                          name: student['name'],
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      );
    }

    return SizedBox(
      height: 60,
      width: 380,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: Theme.of(context).primaryColor,
        ),
        onPressed: () => _showStudentList(context),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              displayText,
              style: GoogleFonts.outfit(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
            Row(
              children: [
                Text(
                  displayNum,
                  style: GoogleFonts.outfit(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(
                  width: 20,
                  child: IconButton(
                    onPressed: () => _showStudentList(context),
                    icon: const Icon(
                      Icons.keyboard_arrow_down_rounded,
                      color: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
