import 'dart:async';
import 'dart:io';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'package:frontend/summary/summary_screen.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'package:path/path.dart' as path;
import 'package:path_provider/path_provider.dart';

class ScanScreen extends StatefulWidget {
  final List<CameraDescription> cameras;
  final String courseName;

  const ScanScreen(
      {super.key, required this.cameras, required this.courseName});

  @override
  State<ScanScreen> createState() => _ScanScreenState();
}

class _ScanScreenState extends State<ScanScreen> {
  late CameraController _controller;
  late Future<void> _initializeControllerFuture;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    CameraDescription? frontCamera;
    for (var camera in widget.cameras) {
      if (camera.lensDirection == CameraLensDirection.front) {
        frontCamera = camera;
        break;
      }
    }
    if (frontCamera != null) {
      _controller = CameraController(frontCamera, ResolutionPreset.high);
      _initializeControllerFuture = _controller.initialize();
      _startFrameTimer();
    } else {
      print("No front camera found");
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    _timer?.cancel();
    super.dispose();
  }

  void _startFrameTimer() {
    _timer = Timer.periodic(Duration(seconds: 2), (timer) async {
      if (!_controller.value.isStreamingImages) {
        return;
      }

      final image = await _controller.takePicture();
      final imagePath = image.path;

      final file = File(imagePath);
      final request = http.MultipartRequest(
        'POST',
        Uri.parse(
            'http://127.0.0.1:5000/upload-frame'), // Ensure the correct URL
      );
      request.files.add(await http.MultipartFile.fromPath('frame', imagePath));

      try {
        final response = await request.send();
        if (response.statusCode == 200) {
          print("Frame sent successfully");
        } else {
          print("Failed to send frame: ${response.statusCode}");
        }
      } catch (e) {
        print("Error sending frame: $e");
      } finally {
        file.delete(); // Clean up the image file after sending
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final buttonWidth = screenSize.width * 0.3;
    final cameraPreviewHeight = screenSize.height * 0.5;

    return Stack(
      children: [
        Container(
          decoration: const BoxDecoration(
            image: DecorationImage(
              image: AssetImage('lib/assets/mainBg.png'),
              fit: BoxFit.cover,
            ),
          ),
        ),
        WillPopScope(
            onWillPop: () async {
              return false;
            },
            child: Scaffold(
              backgroundColor: Colors.transparent,
              appBar: _appBar(),
              body: Padding(
                padding: const EdgeInsets.all(10.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    SizedBox(
                      height: cameraPreviewHeight,
                      width: screenSize.width * 0.9,
                      child: FutureBuilder<void>(
                        future: _initializeControllerFuture,
                        builder: (context, snapshot) {
                          if (snapshot.connectionState ==
                              ConnectionState.done) {
                            return AspectRatio(
                              aspectRatio: _controller.value.aspectRatio,
                              child: CameraPreview(_controller),
                            );
                          } else {
                            return const Center(
                                child: CircularProgressIndicator());
                          }
                        },
                      ),
                    ),
                    const SizedBox(height: 20),
                    Text(
                      "Please ensure your eyes are visible and your face is framed from the shoulders up",
                      style: GoogleFonts.outfit(
                        color: Colors.black,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        SizedBox(
                          width: buttonWidth,
                          height: 50,
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.white,
                              foregroundColor: Theme.of(context).primaryColor,
                            ),
                            onPressed: () async {
                              try {
                                await _initializeControllerFuture; // Ensure the camera is initialized
                                final image = await _controller.takePicture();

                                // Get the path to the image
                                final imagePath = image.path;

                                // Create a file instance from the image path
                                final file = File(imagePath);

                                // Create a multipart request to send the image to the backend
                                final request = http.MultipartRequest(
                                  'POST',
                                  Uri.parse(
                                      'http://192.168.1.4:3000/upload-frame'), // Update with your backend URL
                                );
                                request.files.add(
                                    await http.MultipartFile.fromPath(
                                        'frame', imagePath));

                                // Send the request to the backend
                                final response = await request.send();

                                // Convert the streamed response to a regular response
                                final res =
                                    await http.Response.fromStream(response);

                                if (res.statusCode == 200) {
                                  final result = jsonDecode(res.body);
                                  print("Image sent successfully");
                                  print("Result: ${result['result']}");

                                  // You can now display the result in your UI
                                  showDialog(
                                    context: context,
                                    builder: (BuildContext context) {
                                      return AlertDialog(
                                        title: Text("Face Recognition Result"),
                                        content:
                                            Text(result['result'].toString()),
                                        actions: <Widget>[
                                          TextButton(
                                            child: Text("OK"),
                                            onPressed: () {
                                              Navigator.of(context).pop();
                                            },
                                          ),
                                        ],
                                      );
                                    },
                                  );
                                } else {
                                  print(
                                      "Failed to send image: ${res.statusCode}");
                                }

                                // Clean up the image file after sending
                                file.delete();
                              } catch (e) {
                                print("Error capturing or sending image: $e");
                              }
                            },
                            child: Text(
                              "Mark",
                              style: GoogleFonts.outfit(
                                fontWeight: FontWeight.bold,
                                color: Colors.black,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        SizedBox(
                          width: buttonWidth,
                          height: 50,
                          child: ElevatedButton(
                            onPressed: () {
                              // Navigator.push(
                              //   context,
                              //   MaterialPageRoute(
                              //     builder: (context) =>
                              //         SummaryScreen(courseName: widget.courseName),
                              //   ),
                              // );
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Theme.of(context).primaryColor,
                            ),
                            child: Text(
                              "Next",
                              style: GoogleFonts.outfit(
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              floatingActionButton: Padding(
                padding: const EdgeInsets.only(right: 10, bottom: 0),
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    Container(
                      width: 70,
                      height: 70,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(200.0),
                        color: const Color(0xFFD9FFF6),
                      ),
                    ),
                    Container(
                      width: 55,
                      height: 55,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(200.0),
                        color: const Color(0xFFB0FFED),
                      ),
                    ),
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(200.0),
                        color: const Color(0xFF06DFAD),
                      ),
                      child: IconButton(
                        icon: const Icon(Icons.check_rounded),
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) =>
                                  SummaryScreen(courseName: widget.courseName),
                            ),
                          );
                        },
                        focusColor: Theme.of(context).primaryColor,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
              ),
            )),
      ],
    );
  }

  PreferredSizeWidget _appBar() {
    return PreferredSize(
      preferredSize: const Size.fromHeight(150),
      child: Stack(
        children: [
          Container(
            decoration: const BoxDecoration(
              image: DecorationImage(
                image: AssetImage('lib/assets/student_bg.png'),
                fit: BoxFit.cover,
              ),
            ),
          ),
          SafeArea(
            child: Center(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Text(
                      "Amar G Nath",
                      style: GoogleFonts.outfit(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      "2347208",
                      style: GoogleFonts.outfit(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
