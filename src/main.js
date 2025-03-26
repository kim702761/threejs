import * as THREE from 'three';
import { Tank } from './components/tank';
import { TerrainManager } from './components/terrain';
import { ObstacleManager } from './components/obstacles';
import { CollisionManager } from './utils/physics';
import { keys, initControls } from './utils/controls';
import { ProjectileManager } from './components/projectile';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// 초기 설정
initControls();
scene.background = new THREE.Color(0x87CEEB);
renderer.setClearColor(0x87CEEB);
scene.fog = new THREE.Fog(0x87CEEB, 80, 100);

// 조명 설정
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// 매니저 클래스 초기화
const terrainManager = new TerrainManager();
const obstacleManager = new ObstacleManager();
const tank = new Tank();
const collisionManager = new CollisionManager(obstacleManager.getObstacles());
const projectileManager = new ProjectileManager();

// 초기 오브젝트 생성
const terrain = terrainManager.createTerrain();
scene.add(terrain);
scene.add(tank.getMesh());

// 카메라 설정
const cameraOffset = new THREE.Vector3(0, 5, -10);
const cameraLookAtOffset = new THREE.Vector3(0, 0, 5);

function updateCamera() {
    const rotatedOffset = cameraOffset.clone();
    rotatedOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), tank.getMesh().rotation.y);
    
    camera.position.x = tank.getPosition().x + rotatedOffset.x;
    camera.position.y = tank.getPosition().y + rotatedOffset.y;
    camera.position.z = tank.getPosition().z + rotatedOffset.z;
    
    const rotatedLookAt = cameraLookAtOffset.clone();
    rotatedLookAt.applyAxisAngle(new THREE.Vector3(0, 1, 0), tank.getMesh().rotation.y);
    const lookAtPoint = new THREE.Vector3(
        tank.getPosition().x + rotatedLookAt.x,
        tank.getPosition().y + rotatedLookAt.y,
        tank.getPosition().z + rotatedLookAt.z
    );
    
    camera.lookAt(lookAtPoint);
}

// 게임 루프
function animate() {
    requestAnimationFrame(animate);
    tank.updateMovement(keys, collisionManager, terrainManager.getCurrentTerrain());
    terrainManager.updateTerrain(tank.getPosition(), scene, obstacleManager);
    
    // 충전 중이면 충전 업데이트
    if (keys.isCharging) {
        projectileManager.startCharging();
    }
    
    // 스페이스바를 떼면 발사
    if (keys.space === false && keys.isCharging === false) {
        projectileManager.fire(tank, scene);
    }
    
    // 포탄 업데이트
    projectileManager.update(scene, obstacleManager.getObstacles());
    
    collisionManager.updateObstacles(obstacleManager.getObstacles());
    updateCamera();
    renderer.render(scene, camera);
}

animate();

// 화면 크기 조정 이벤트 추가
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
});