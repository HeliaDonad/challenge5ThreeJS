import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import gsap from 'gsap';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const gui = new dat.GUI();

// Voeg blauwe hemel toe
scene.background = new THREE.Color(0x87CEEB);

// Daglicht toevoegen
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

// Buiten vloer (omgeving)
const planeGeometry = new THREE.PlaneGeometry(50, 50);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x3CB371 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1;
plane.receiveShadow = true;
scene.add(plane);

// Binnen vloer (vloer in het huis)
const houseFloorGeometry = new THREE.PlaneGeometry(10, 10);
const houseFloorMaterial = new THREE.MeshStandardMaterial({ color: 0xC2B280 });
const houseFloor = new THREE.Mesh(houseFloorGeometry, houseFloorMaterial);
houseFloor.rotation.x = -Math.PI / 2;
houseFloor.position.set(0, -0.95, 0); 
houseFloor.receiveShadow = true;
scene.add(houseFloor);

// Muur materiaal
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });

const wallGeometry = new THREE.BoxGeometry(10, 4.5, 0.1);
const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
wall1.position.set(0, 1.25, -5);
scene.add(wall1);

const wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
wall2.position.set(0, 1.25, 5);
scene.add(wall2);

const wall4 = new THREE.Mesh(wallGeometry, wallMaterial);
wall4.position.set(5, 1.25, 0);
wall4.rotation.y = Math.PI / 2;
scene.add(wall4);

const doorWidth = 2;
const doorHeight = 3;
const wallWidth = 10;
const wallHeight = 4.5;

const wallShape = new THREE.Shape();
wallShape.moveTo(-wallWidth / 2, -wallHeight / 2);
wallShape.lineTo(wallWidth / 2, -wallHeight / 2);
wallShape.lineTo(wallWidth / 2, wallHeight / 2);
wallShape.lineTo(-wallWidth / 2, wallHeight / 2);
wallShape.lineTo(-wallWidth / 2, -wallHeight / 2);

const doorHole = new THREE.Path();
doorHole.moveTo(-doorWidth / 2, -wallHeight / 2);
doorHole.lineTo(-doorWidth / 2, doorHeight - wallHeight / 2);
doorHole.lineTo(doorWidth / 2, doorHeight - wallHeight / 2);
doorHole.lineTo(doorWidth / 2, -wallHeight / 2);
wallShape.holes.push(doorHole);

const wallWithDoorGeometry = new THREE.ExtrudeGeometry(wallShape, {
  depth: 0.1,
  bevelEnabled: false,
});
const wallWithDoor = new THREE.Mesh(wallWithDoorGeometry, wallMaterial);
wallWithDoor.position.set(-5, 1.25, 0);
wallWithDoor.rotation.y = Math.PI / 2;
scene.add(wallWithDoor);

const roofGeometry = new THREE.ConeGeometry(7, 4.5, 4);
const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x8B0000 });
const roof = new THREE.Mesh(roofGeometry, roofMaterial);
roof.position.set(0, 5.75, 0);
roof.rotation.y = Math.PI / 4;
scene.add(roof);

camera.position.set(-15, 3, 0);

gsap.to(camera.position, {
  duration: 3,
  x: -6,
  y: 2,
  z: 0,
  onUpdate: () => {
    camera.lookAt(wallWithDoor.position);
  }
});

const textureLoader = new THREE.TextureLoader();
const paintingTexture = textureLoader.load('painting.jpg');

const paintingGeometry = new THREE.BoxGeometry( 2, 2, 0.02 );
const paintingMaterial = new THREE.MeshStandardMaterial( { 
  color: 0xffffff, 
  map: paintingTexture,
} );
const painting = new THREE.Mesh( paintingGeometry, paintingMaterial );
painting.position.set(0, 2, -4.9);
scene.add(painting);

const treeGeometry = new THREE.CylinderGeometry(0.3, 0.3, 5, 12);
const leavesGeometry = new THREE.SphereGeometry(1.5, 16, 16);
const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });

for (let i = 0; i < 8; i++) {
  const angle = (i / 8) * Math.PI * 2;
  const x = Math.cos(angle) * 15;
  const z = Math.sin(angle) * 15;

  const trunk = new THREE.Mesh(treeGeometry, trunkMaterial);
  trunk.position.set(x, 1.5, z);
  trunk.castShadow = true;

  const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
  leaves.position.set(x, 4, z);
  leaves.castShadow = true;

  scene.add(trunk);
  scene.add(leaves);
}

const cloudGeometry = new THREE.SphereGeometry(1, 12, 12);
const cloudMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

for (let i = 0; i < 5; i++) {
  const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
  cloud.position.set(Math.random() * 30 - 15, Math.random() * 5 + 5, Math.random() * 30 - 15);
  cloud.scale.set(1.5, 1, 1);
  scene.add(cloud);
}

const clock = new THREE.Clock();
function animate() {
  const elapsedTime = clock.getElapsedTime();
  controls.update();
  renderer.render(scene, camera);
}
