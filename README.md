# Web Based Jewelery Try-on Demo

This project aims to create Real-time Web based Virtual Jewelery Try-on experiences.

It is built with [React](https://github.com/facebook/react), using [MediaPipe](https://github.com/google/mediapipe), [ThreeJS - react-three/fiber](https://github.com/pmndrs/react-three-fiber) and [react-webcam](https://github.com/mozmorris/react-webcam).\
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Demo

[Jewelery Try-on Demo](https://main.d2ablu3msld68r.amplifyapp.com/)

Try on Desktop and Mobile browsers to check the performance differences.

## Under the Hood

This demo app currently captures a video stream via [react-webcam](https://github.com/mozmorris/react-webcam), feeds the stream into [MediaPipe Hands](https://google.github.io/mediapipe/solutions/hands.html) which tracks 21 3D landmarks of a hand from just a single frame, which then provides real-time locations to [ThreeJS - react-three/fiber](https://github.com/pmndrs/react-three-fiber) render the 3D object accordingly.

![Hand Landmarks](https://google.github.io/mediapipe/images/mobile/hand_landmarks.png)

## Limitations

- This project runs well on Desktop browsers (>20fps) but does not perform well on Mobile browsers (<5fps). This is related to Mediapipe. More research is needed and currently WIP.
- Check [Performance Characteristics](https://blog.tensorflow.org/2020/03/face-and-hand-tracking-in-browser-with-mediapipe-and-tensorflowjs.html)

## Work in Progress (WIP)

- The 3D model currently currently tracks Ring Finger, but 3D object rotations and scaling are WIP.
- GLTFLoader has a problem loading 3D objects from the public folder. We believe it is related to headers. It is currently WIP.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.
