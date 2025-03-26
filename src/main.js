import * as THREE from 'three';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create basic tank
function createTank() {
    const tank = new THREE.Group();
    
    // Tank body (base)
    const bodyGeometry = new THREE.BoxGeometry(2, 0.8, 3);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x4f5d3f,
        flatShading: true
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    
    // Tank tracks
    const trackGeometry = new THREE.BoxGeometry(0.4, 0.4, 3);
    const trackMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });
    const leftTrack = new THREE.Mesh(trackGeometry, trackMaterial);
    const rightTrack = new THREE.Mesh(trackGeometry, trackMaterial);
    leftTrack.position.set(-1.2, -0.2, 0);
    rightTrack.position.set(1.2, -0.2, 0);
    
    // Tank turret base
    const turretBaseGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.4, 8);
    const turretBaseMaterial = new THREE.MeshPhongMaterial({ color: 0x3d4a2f });
    const turretBase = new THREE.Mesh(turretBaseGeometry, turretBaseMaterial);
    turretBase.position.y = 0.6;
    
    // Tank turret
    const turretGeometry = new THREE.BoxGeometry(1.4, 0.5, 1.8);
    const turretMaterial = new THREE.MeshPhongMaterial({ color: 0x4a5a3f });
    const turret = new THREE.Mesh(turretGeometry, turretMaterial);
    turret.position.y = 0.85;
    
    // Tank cannon (포신 위치와 회전 수정)
    const cannonGeometry = new THREE.CylinderGeometry(0.15, 0.15, 2.5, 8);
    const cannonMaterial = new THREE.MeshPhongMaterial({ color: 0x2a2a2a });
    const cannon = new THREE.Mesh(cannonGeometry, cannonMaterial);
    
    // 포신의 회전과 위치 수정
    cannon.rotation.x = -Math.PI / 2; // x축 기준으로 90도 회전
    cannon.position.set(0, 0.85, 1.2); // 포탑 위치에 맞춰 조정
    
    // Add all parts to tank
    tank.add(body);
    tank.add(leftTrack);
    tank.add(rightTrack);
    tank.add(turretBase);
    tank.add(turret);
    tank.add(cannon);
    
    return tank;
}

// Add lighting for better 3D appearance
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Update ground material to use PhongMaterial for better lighting
const groundMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x8B4513,
    side: THREE.DoubleSide
});

// Create ground
const groundGeometry = new THREE.PlaneGeometry(20, 20);
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = Math.PI / 2;
scene.add(ground);

// Create and add tank
const tank = createTank();
scene.add(tank);

// Position camera and tank
camera.position.set(0, 10, 15);
camera.lookAt(tank.position);
tank.position.y = 0.5;

// Game state
let gameState = {
    score: 0,
    isPlaying: true
};

// Movement controls
const moveSpeed = 0.1;
const rotateSpeed = 0.02;
const keys = {
    w: false,
    s: false,
    a: false,
    d: false
};

// Key event listeners
window.addEventListener('keydown', (e) => {
    switch(e.key.toLowerCase()) {
        case 'w': keys.w = true; break;
        case 's': keys.s = true; break;
        case 'a': keys.a = true; break;
        case 'd': keys.d = true; break;
    }
});

window.addEventListener('keyup', (e) => {
    switch(e.key.toLowerCase()) {
        case 'w': keys.w = false; break;
        case 's': keys.s = false; break;
        case 'a': keys.a = false; break;
        case 'd': keys.d = false; break;
    }
});

// Update tank movement
function updateTankMovement() {
    if (keys.w) {
        tank.position.x += Math.sin(tank.rotation.y) * moveSpeed;
        tank.position.z += Math.cos(tank.rotation.y) * moveSpeed;
    }
    if (keys.s) {
        tank.position.x -= Math.sin(tank.rotation.y) * moveSpeed;
        tank.position.z -= Math.cos(tank.rotation.y) * moveSpeed;
    }
    if (keys.a) {
        tank.rotation.y += rotateSpeed;
    }
    if (keys.d) {
        tank.rotation.y -= rotateSpeed;
    }
}

// Update game loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update tank movement
    updateTankMovement();
    
    // Update camera position to follow tank
    camera.position.x = tank.position.x;
    camera.position.z = tank.position.z + 15;
    camera.lookAt(tank.position);
    
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Start the game
animate(); 