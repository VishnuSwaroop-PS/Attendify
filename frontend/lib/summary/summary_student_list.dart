import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class SummaryStudentList extends StatelessWidget {
  final String name;

  const SummaryStudentList({
    super.key,
    required this.name,
  });

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Container(
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: Colors.green.withOpacity(0.1),
              spreadRadius: 2,
              blurRadius: 5,
              offset: const Offset(0, 3),
            ),
          ],
          borderRadius: BorderRadius.circular(30),
          color: Colors.white, // Added color to differentiate container
        ),
        child: SizedBox(
          width: screenSize.width - 20, // Adjust width with padding
          height: 60, // Adjusted height for better alignment
          child: Padding(
            padding: const EdgeInsets.all(10.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    name,
                    style: GoogleFonts.outfit(
                      color: Colors.black,
                      fontSize: 16,
                    ),
                    overflow: TextOverflow.ellipsis, // Handle overflow
                  ),
                ),
                Row(
                  children: [
                    IconButton(
                      onPressed: () {},
                      icon: const Icon(Icons.check_rounded),
                      color: Theme.of(context).primaryColor,
                    ),
                    const SizedBox(width: 8), // Add space between icons
                    IconButton(
                      onPressed: () {},
                      icon: const Icon(Icons.close_rounded),
                      color: Colors.red,
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
