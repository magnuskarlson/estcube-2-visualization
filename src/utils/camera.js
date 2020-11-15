import * as THREE from "three";

const fov = 75;
const aspect = 2;  // the canvas default
const near = 0.1;
const far = 5;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;
camera.position.y = 1;
camera.lookAt(0, 0, 0);

export default camera;
