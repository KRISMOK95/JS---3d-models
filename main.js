import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2s8Pqa6pG68N5Ztu7oV9ymT2KHsCinSo",
  authDomain: "mt-aas.firebaseapp.com",
  projectId: "mt-aas",
  storageBucket: "mt-aas.appspot.com",
  messagingSenderId: "822493253485",
  appId: "1:822493253485:web:3944a00e63e7c3552a1464",
  measurementId: "G-9Y41K5G1V3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

const container = document.getElementById('model-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 10000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setClearColor(0xf0f0f0);
container.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

camera.position.z = 5;

const loader = new THREE.OBJLoader();

loader.load('SMC_JP_HRS050A200/HRS050-A-20(0).obj', (model) => {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('eisen_0004_c/metal1.jpg');
  model = new THREE.Mesh(model.children[0].geometry, new THREE.MeshPhongMaterial({ map: texture, specular: 0x111111, shininess: 30 }));
  scene.add(model);

  model.position.set(0, 0, 0);
  model.rotation.set(0, 0, 0);
  model.scale.set(1, 1, 1);
}, (xhr) => {
  console.log((xhr.loaded / xhr.total * 100) + '% loaded');
}, (error) => {
  console.error('An error occurred', error);
});

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});

// Real-time data listener
const dataRef = collection(db, "initial_data");

onSnapshot(dataRef, (querySnapshot) => {
  const dataDisplay = document.getElementById('data-display');
  dataDisplay.innerHTML = '';

  querySnapshot.forEach((doc) => {
    const temperature = doc.data().temperature;

    const listItem = document.createElement('li');
    listItem.textContent = `Temperature: ${temperature} degree`;
    dataDisplay.appendChild(listItem);
  });
});
