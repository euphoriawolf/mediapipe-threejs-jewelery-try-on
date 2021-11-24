import './App.css';
import {Hands} from "@mediapipe/hands";
import * as HandsM from "@mediapipe/hands";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import {useRef, useEffect, Suspense} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const Lights = () => {
  return (
      <>
          <pointLight position={[0,0,0]} intensity={2} />
      </>
  )
}

const Model = () => {
  const gltf = useLoader(GLTFLoader, "https://3dfoodmodel-modelviewer.s3.amazonaws.com/assets/Bolle/Nevada_Blue/BolleNevada_Blue_v1.glb");
  const ref = useRef();

  useFrame((state, delta) => {
    ref.current.position.x = (landmark_x - 0.5)*10;
    ref.current.position.y = -(landmark_y - 0.5)*7.5;
    //ref.current.position.z = -(landmark_z)*10;
    //ref.current.rotation.
    ref.current.scale.x = scale*33;
    ref.current.scale.y = scale*33;
    ref.current.scale.z = scale*33;
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
var scale = 0.1;


function App() {

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  var camera = null;

  function onResults(results){
    //console.log(results);
    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        if (landmarks[14].x !== "undefined") {
          landmark_x = (landmarks[14].x + landmarks[13].x)/2;
          landmark_y = (landmarks[14].y + landmarks[13].y)/2;
          landmark_z = (landmarks[14].z + landmarks[13].z)/2;
          scale = landmarks[13].y - landmarks[14].y;
          //console.log(scale);
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
          <Webcam className="webcam-wrapper" ref={webcamRef} mirrored={true}/>
          <Canvas className="canvas-wrapper">
            <pointLight intensity={1}/>
            <Suspense fallback={null}>
              <Model position={[0,0,-3]}/>
            </Suspense>
          </Canvas>
        </div>
    
  );
}

export default App;
