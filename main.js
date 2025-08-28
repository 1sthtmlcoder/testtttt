// THREE.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('scene') });
renderer.setSize(window.innerWidth, window.innerHeight);
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);
let avatar = null;
const loaderFBX = new THREE.FBXLoader();
const loaderOBJ = new THREE.OBJLoader();
loaderFBX.load('avatar.fbx', obj => { avatar = obj; scene.add(avatar); }, undefined, err => { loaderOBJ.load('avatar.obj', obj => { avatar = obj; scene.add(avatar); }); });
if(!avatar){ const bodyGeo = new THREE.BoxGeometry(1, 2, 0.5); const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0077ff }); avatar = new THREE.Mesh(bodyGeo, bodyMat); const headGeo = new THREE.SphereGeometry(0.5, 32, 32); const headMat = new THREE.MeshStandardMaterial({ color: 0xffccaa }); const head = new THREE.Mesh(headGeo, headMat); head.position.y = 1.5; avatar.add(head); scene.add(avatar); }
camera.position.z = 5;
function animate() { requestAnimationFrame(animate); if(avatar) avatar.rotation.y += 0.002; renderer.render(scene, camera); }
animate();
// Chat UI
const input = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const speakBtn = document.getElementById('speakBtn');
const replyDiv = document.getElementById('botReply');
sendBtn.addEventListener('click', async () => {
  const message = input.value.trim();
  if(!message) return;
  input.value = '';
  const res = await fetch('http://localhost:3000/api/respond', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ message }) });
  const data = await res.json();
  replyDiv.textContent = data.reply;
  ws.send(JSON.stringify({ word: message, meaning: data.reply }));
});
// Voice recognition
let recognition;
if('webkitSpeechRecognition' in window){ recognition = new webkitSpeechRecognition(); recognition.continuous=false; recognition.interimResults=false; recognition.onresult=event=>{ input.value=event.results[0][0].transcript; sendBtn.click(); }; }
speakBtn.addEventListener('click',()=>{ if(recognition) recognition.start(); });
// WebSocket
const ws = new WebSocket('wss://c101e99df1ed.ngrok-free.app');
ws.onopen=()=>console.log('Connected to learning server');
ws.onmessage=msg=>console.log('WS message:', msg.data);
