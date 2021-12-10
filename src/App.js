import './App.css';
import {Hands} from "@mediapipe/hands";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import {useRef, useEffect, Suspense, useState, useCallback} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as controlUtils from "@mediapipe/control_utils";
import { Environment, OrbitControls } from "@react-three/drei";

const Lights = () => {
  return (
      <>
          <pointLight position={[10,10,10]} intensity={2} />
      </>
  )
}

const FACING_MODE_USER = "user";
const FACING_MODE_ENVIRONMENT = "environment";

const videoConstraints = {
  facingMode: "user"
};



const Model = () => {
  const gltf = useLoader(GLTFLoader, "https://ttb-dev.s3.amazonaws.com/RingTransformed.glb");
  const ref = useRef();

  useFrame((state, delta) => {
    ref.current.position.x = (landmark_x - 0.5);
    ref.current.position.y = -(landmark_y - 0.5)*0.75;
    ref.current.rotation.z = -(rotateZ) + Math.PI/2;
    //ref.current.rotation.x = rotateX;
    if (hand_info === "Left") {
      if (rotateY < 0) {
        ref.current.rotation.y = rotateY + Math.PI/16;
      } else {
        ref.current.rotation.y = rotateY + Math.PI + Math.PI/16;
      }
    } else {
      if (rotateY > 0) {
        ref.current.rotation.y = rotateY - Math.PI/16;
      } else {
        ref.current.rotation.y = rotateY + Math.PI - Math.PI/16;
      }
    }
    //ref.current.rotation.x = rotateX;
    //ref.current.rotation.x = -rotateX + Math.PI/2;
    //ref.current.position.z = 0;
    // ref.current.position.x = 0;
    // ref.current.position.y = 0;
    // ref.current.position.z = -10;
    ref.current.scale.x = scale*3.3;
    ref.current.scale.y = scale*3.3;
    ref.current.scale.z = scale*3.3;
  })
  return (
    <>
      <primitive ref={ref} object={gltf.scene} scale={5} />
    </>
  );
};

var landmark_x = -100;
var landmark_y = -100;
var landmark_z = -100;
var scale_x = 0.1;
var scale_y = 0.1;
var scale_z = 0.1;
var scale = 0.1;
var rotateZ = 0;
var rotateY = 0;
var rotateX = 0;
var hand_info = null;


function App() {

  const [facingMode, setFacingMode] = useState(FACING_MODE_USER);
  console.log(facingMode);

  console.log(controlUtils);

  // const handleClick = useCallback(() => {
  //   setFacingMode(
  //     prevState =>
  //       prevState === FACING_MODE_USER
  //         ? FACING_MODE_ENVIRONMENT
  //         : FACING_MODE_USER
  //   );
  // }, []);

  const webcamRef = useRef(null);
  var camera = null;

  function onResults(results){
    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        //console.log(landmarks[0]);
        if (landmarks[14].x !== "undefined") {
          landmark_x = (landmarks[14].x + landmarks[13].x)/2;
          landmark_y = (landmarks[14].y + landmarks[13].y)/2;
          landmark_z = (landmarks[14].z + landmarks[13].z)/2;
          //console.log(landmark_z);
          scale_x = landmarks[13].x - landmarks[14].x;
          scale_y = landmarks[13].y - landmarks[14].y;
          scale_z = landmarks[13].z - landmarks[14].z;
          //calculate the distance between landmarks[13] and [14]
          scale = Math.sqrt((landmarks[14].x- landmarks[13].x)**2 + (landmarks[14].y- landmarks[13].y)**2 + (landmarks[14].z- landmarks[13].z)**2);
          
          rotateZ = Math.atan((landmarks[14].y - landmarks[13].y)/(landmarks[14].x - landmarks[13].x));
          rotateX = Math.atan((landmarks[14].z - landmarks[0].z)/(landmarks[14].y - landmarks[0].y));
          rotateY = Math.atan((landmarks[9].z - landmarks[13].z)/(landmarks[9].x - landmarks[13].x));

          hand_info = results.multiHandedness[0].label;
          console.log(rotateX);

        }
      }
    }
  }

  useEffect(() => {
    const hands = new Hands({
      locateFile:(file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    })

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
      selfieMode: true,
      
    })

    hands.onResults(onResults);

    if(typeof webcamRef.current !== "undefined" && webcamRef.current !== null){
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async()=>{
          await hands.send({image:webcamRef.current.video})
        },
        //width: 640,
        //height: 480,
      })

      camera.start();
    }

  })
  return (
    
        <div className="outer-div">
        {/* <button className="webcam-wrapper" style={{zIndex:20}} onClick={handleClick}>Switch camera</button> */}
          <Webcam className="webcam-wrapper" ref={webcamRef} mirrored={facingMode === FACING_MODE_USER ? true : false} videoConstraints={{
          ...videoConstraints,
          facingMode
          }}/>
          <Canvas camera={{fov:75, position: [0, 0, 0.5] }} className="canvas-wrapper">
            <Lights></Lights>
            <Suspense fallback={null}>
              <Model position={[0,0,0]}/>
              <Environment preset="studio"></Environment>
              <OrbitControls></OrbitControls>
            </Suspense>
          </Canvas>
        </div>
    
  );
}

export default App;
