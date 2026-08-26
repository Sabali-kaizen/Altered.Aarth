import './loading.css';
import './disclaimer.css';
import './account.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRMLoaderPlugin } from '@pixiv/three-vrm';
import { PLYLoader } from 'three/examples/jsm/Addons.js';
import { VRMAnimationLoaderPlugin, createVRMAnimationClip } from '@pixiv/three-vrm-animation';
import * as VRMAnimation from '@pixiv/three-vrm-animation';
import { deltaTime } from 'three/tsl';

const loadingScreen = document.createElement('div');

loadingScreen.id = 'loading-screen';

loadingScreen.innerHTML = `
    <div id="loading-text"></div>
        <div id="loading-dots">
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                    </div>
                    `;

                    document.body.appendChild(loadingScreen);

                    let loadingProgress = 0;

                    const loadingDots = document.querySelectorAll('.loading-dot');

                    const loadingTimer = setInterval(() => {
                        loadingProgress += 1;

                            const activeDots = Math.ceil(loadingProgress / 33.34);

                                loadingDots.forEach((dot, index) => {
                                        dot.classList.toggle('active', index < activeDots);
                                            });

                                                if (loadingProgress >= 100) {
                                                        clearInterval(loadingTimer);

                                                        loadingScreen.style.display = 'none';

                                                        showDisclaimer();
                                                            }
                                                            }, 100);

                    setTimeout(() => {
                            loadingScreen.classList.add('show-loading');
                            }, 2000);
                    
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x12051f);
scene.fog = new THREE.FogExp2(0x12051f, 0.018);

const camera = new THREE.PerspectiveCamera(
  68,
    window.innerWidth / window.innerHeight,
      0.1,
        1000
        );

        camera.position.set(0, 4.5, 10);
        camera.lookAt(0, 1.2, 0);

        const renderer = new THREE.WebGLRenderer({
          antialias: true
          });

          renderer.setSize(window.innerWidth, window.innerHeight);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

          document.body.style.margin = '0';
          document.body.style.overflow = 'hidden';
          document.body.appendChild(renderer.domElement);

          const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
          scene.add(ambientLight);

          const moonlight = new THREE.DirectionalLight(0x8b5fc7, 1.5);
          moonlight.position.set(-5, 10, 5);
          scene.add(moonlight);

          const horizonLight = new THREE.PointLight(0x6d2a9c, 3, 60);
          horizonLight.position.set(0, 4, -20);
          scene.add(horizonLight);

          const sunLight = new THREE.DirectionalLight(0xfff1c1, 2.0);
          sunLight.position.set(20, 8, -30);
          scene.add(sunLight);

          const sunCanvas = document.createElement('canvas');
          sunCanvas.width = 256;
          sunCanvas.height = 256;

          const sunContext = sunCanvas.getContext('2d');

          const sunGradient = sunContext.createRadialGradient(
              128, 128, 20,
                  128, 128, 128
                  );

                  sunGradient.addColorStop(0, 'rgba(255, 245, 190, 1)');
                  sunGradient.addColorStop(0.25, 'rgba(255, 210, 110, 0.95)');
                  sunGradient.addColorStop(0.55, 'rgba(255, 170, 70, 0.35)');
                  sunGradient.addColorStop(1, 'rgba(255, 150, 50, 0)');

                  sunContext.fillStyle = sunGradient;
                  sunContext.fillRect(0, 0, 256, 256);

                  const sunTexture = new THREE.CanvasTexture(sunCanvas);

                  const sunMaterial = new THREE.SpriteMaterial({
                      map: sunTexture,
                          transparent: true,
                              depthWrite: false
                              });

                              const sun = new THREE.Sprite(sunMaterial);

                              sun.scale.set(3, 3, 1);
                              sun.position.set(43, 5, -40);

                              scene.add(sun);

          const skyGeometry = new THREE.SphereGeometry(80, 32, 32);

          const skyMaterial = new THREE.MeshBasicMaterial({
            color: 0x12051f,
              side: THREE.BackSide
              });

              const sky = new THREE.Mesh(
                skyGeometry,
                  skyMaterial
                  );

                  scene.add(sky);

                  

                const loader = new GLTFLoader();

                loader.register((parser) => {
                  return new VRMLoaderPlugin(parser);
                  });

                loader.register((parser) => {
                  return new
                  VRMAnimationLoaderPlugin(parser);
                });

                  let fireEye = null;
                  let moveSpeed = 0;
                  let moveDirection = new THREE.Vector3();
                  let ninja_idleAnimation = null;
                  let walkAnimation = null;
                  let runAnimation = null;
                  let fireEyeAnimation = null;
                  let animationMixer = null;

                  function playFireEyeAnimation() {
                        if (!fireEye || !fireEyeAnimation) return;

                            const clip = createVRMAnimationClip(
                                    walkAnimation,
                                            fireEye
                                                );

                                                    animationMixer = new THREE.AnimationMixer(fireEye.scene);

                                                        const action = animationMixer.clipAction(clip);
                                                        window.fireEyeIdleAction = action;
                                                            action.play();
                                                            
                                                            
                                                                console.log('FireEye animation started!');
                                                                }

                                                                function updateFireEyeMovement(deltaTime) {
                                                                      if (!fireEye) return;

                                                                          if (moveSpeed > 0) {
                                                                                  fireEye.scene.position.addScaledVector(
                                                                                              moveDirection,
                                                                                                          moveSpeed * deltaTime
                                                                                                                  );
                                                                                                                  const angle = Math.atan2(
                                                                                                                    moveDirection.x,
                                                                                                                    moveDirection.z
                                                                                                                  );
                                                                                                                  fireEye.scene.rotation.y = angle + Math.PI;
                                                                                                                      }
                                                                                                                      }
                                                                
                  loader.load(
                    '/avatar/FireEye.vrm',
                      (gltf) => {
                          fireEye = gltf.userData.vrm;

                              fireEye.scene.position.set(0, 0, 0);
                                  fireEye.scene.rotation.y = 0;

                                      scene.add(fireEye.scene);

                                          console.log('FireEye loaded successfully!');
                                          playFireEyeAnimation();
                                            },
                                              (progress) => {
                                                  console.log(
                                                        'Loading FireEye:',
                                                              ((progress.loaded / progress.total) * 100).toFixed(1) + '%'
                                                                  );
                                                                    },
                                                                      (error) => {
                                                                          console.error('FireEye failed to load:', error);
                                                                            }
                                                                          );

                                                                            loader.load(
                                                                                  '/animations/Ninja_Idle.vrma',
                                                                                      (gltf) => {
                                                                                              fireEyeAnimation = gltf.userData.vrmAnimations[0];
                                                                                                      console.log('Ninja_Idle animation loaded:', fireEyeAnimation);
                                                                                                          },
                                                                                                              undefined,
                                                                                                                  (error) => {
                                                                                                                          console.error('Ninja_Idle animation failed to load:', error);
                                                                                                                              }
                                                                                                                              );

                                                                                                                              loader.load(
                                                                                                                                    '/animations/Walking.vrma',
                                                                                                                                        (gltf) => {
                                                                                                                                                walkAnimation = gltf.userData.vrmAnimations[0];
                                                                                                                                                        console.log('Walking animation loaded!');
                                                                                                                                                            },
                                                                                                                                                                undefined,
                                                                                                                                                                    (error) => {
                                                                                                                                                                            console.error('Walking animation failed to load:', error);
                                                                                                                                                                                }
                                                                                                                                                                                );

                                                                                                                                                                                loader.load(
                                                                                                                                                                                      '/animations/Running.vrma',
                                                                                                                                                                                          (gltf) => {
                                                                                                                                                                                                  runAnimation = gltf.userData.vrmAnimations[0];
                                                                                                                                                                                                          console.log('Running animation loaded!');
                                                                                                                                                                                                              },
                                                                                                                                                                                                                  undefined,
                                                                                                                                                                                                                      (error) => {
                                                                                                                                                                                                                              console.error('Running animation failed to load:', error);
                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                  );
                                                                                                                                                                                
                                                                            
          const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
          const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x17121f,
              roughness: 80
              });

              const ground = new THREE.Mesh(
                groundGeometry,
                  groundMaterial
                  );

                  // 🌱 GRASS FIELD

                  const grassGeometry = new THREE.ConeGeometry(0.035, 0.8, 3);
                  grassGeometry.translate(0, 0.4, 0);

                  const grassMaterial = new THREE.MeshStandardMaterial({
                      color: 0x3f7d20,
                          roughness: 1,
                              metalness: 0
                              });

                              const grassCount = 80000;

                              const grassField = new THREE.InstancedMesh(
                                  grassGeometry,
                                      grassMaterial,
                                          grassCount
                                          );

                                          const grassDummy = new THREE.Object3D();

                                          for (let i = 0; i < grassCount; i++) {

                                              const x = (Math.random() - 0.5) * 100;
                                                  const z = (Math.random() - 0.5) * 100;

                                                      const height = 0.6 + Math.random() * 0.8;
                                                          const width = 0.7 + Math.random() * 0.6;

                                                              grassDummy.position.set(x, 0, z);

                                                                  grassDummy.rotation.y = Math.random() * Math.PI * 2;

                                                                      grassDummy.scale.set(
                                                                              width,
                                                                                      height,
                                                                                              width
                                                                                                  );

                                                                                                      grassDummy.updateMatrix();

                                                                                                          grassField.setMatrixAt(
                                                                                                                  i,
                                                                                                                          grassDummy.matrix
                                                                                                                              );
                                                                                                                              }

                                                                                                                              grassField.instanceMatrix.needsUpdate = true;

                                                                                                                              scene.add(grassField);

                  ground.rotation.x = -Math.PI / 2;
                  ground.position.y = 0;

                  scene.add(ground);

          const clock = new THREE.Clock();

          function animate() {
            requestAnimationFrame(animate);

            const deltaTime = clock.getDelta();

            if (animationMixer) {animationMixer.update(deltaTime);
            }

            if (fireEye) {
              fireEye.update(deltaTime);
            }

            updateFireEyeMovement(deltaTime);

            if (animationMixer) {
                  animationMixer.update(clock.getDelta());
                  }

                  if (fireEye) {
                        camera.position.x = fireEye.scene.position.x;
                            camera.position.z = fireEye.scene.position.z + 12;

                                camera.lookAt(
                                        fireEye.scene.position.x,
                                                fireEye.scene.position.y + 2,
                                                        fireEye.scene.position.z
                                                            );
                                                            }
            renderer.render(scene, camera);
                                                          }
                animate();

                // ===============================
                // FIRE EYE MOVEMENT JOYSTICK
                // ===============================

                const joystick = document.createElement('div');

                joystick.style.position = 'fixed';
                joystick.style.left = '30px';
                joystick.style.bottom = '30px';
                joystick.style.width = '120px';
                joystick.style.height = '120px';
                joystick.style.border = '2px solid rgba(255,255,255,0.35)';
                joystick.style.borderRadius = '50%';
                joystick.style.background = 'rgba(255,255,255,0.08)';
                joystick.style.zIndex = '1000';
                joystick.style.touchAction = 'none';

                document.body.appendChild(joystick);


                const joystickKnob = document.createElement('div');

                joystickKnob.style.position = 'absolute';
                joystickKnob.style.left = '35px';
                joystickKnob.style.top = '35px';
                joystickKnob.style.width = '50px';
                joystickKnob.style.height = '50px';
                joystickKnob.style.borderRadius = '50%';
                joystickKnob.style.background = 'rgba(255,255,255,0.35)';
                joystickKnob.style.pointerEvents = 'none';

                joystick.appendChild(joystickKnob);


                let joystickActive = false;


                joystick.addEventListener('pointerdown', (event) => {
                    event.preventDefault();
                        event.stopPropagation();

                            joystickActive = true;

                                joystick.setPointerCapture(event.pointerId);
                                });


                                joystick.addEventListener('pointermove', (event) => {
                                    event.preventDefault();
                                        event.stopPropagation();

                                            if (!joystickActive) return;

                                                const rect = joystick.getBoundingClientRect();

                                                    let x = event.clientX - (rect.left + 60);
                                                        let y = event.clientY - (rect.top + 60);

                                                            const maxDistance = 35;

                                                                const distance = Math.sqrt(
                                                                        x * x + y * y
                                                                            );

                                                                                if (distance > maxDistance) {
                                                                                        x = (x / distance) * maxDistance;
                                                                                                y = (y / distance) * maxDistance;
                                                                                                    }


                                                                                                        joystickKnob.style.left =
                                                                                                                `${35 + x}px`;

                                                                                                                    joystickKnob.style.top =
                                                                                                                            `${35 + y}px`;


                                                                                                                                moveDirection.set(
                                                                                                                                        x / maxDistance,
                                                                                                                                                0,
                                                                                                                                                        y / maxDistance
                                                                                                                                                            );

                                                                                                                                                                moveDirection.normalize();

                                                                                                                                                                    moveSpeed = 2;
                                                                                                                                                                    });


                                                                                                                                                                    function stopJoystick(event) {

                                                                                                                                                                        if (event) {
                                                                                                                                                                                event.preventDefault();
                                                                                                                                                                                        event.stopPropagation();
                                                                                                                                                                                            }

                                                                                                                                                                                                joystickActive = false;

                                                                                                                                                                                                    joystickKnob.style.left = '35px';
                                                                                                                                                                                                        joystickKnob.style.top = '35px';

                                                                                                                                                                                                            moveSpeed = 0;
                                                                                                                                                                                            
                                                                                                                                                                                                            }

                                                                                                                                                                                                                moveDirection.set(
                                                                                                                                                                                                                        0,
                                                                                                                                                                                                                                0,
                                                                                                                                                                                                                                        0
                                                                                                                                                                                                                                            );
                                                                                                                                                                                                                                            


                                                                                                                                                                                                                                            joystick.addEventListener(
                                                                                                                                                                                                                                                'pointerup',
                                                                                                                                                                                                                                                    stopJoystick
                                                                                                                                                                                                                                                    );

                                                                                                                                                                                                                                                    joystick.addEventListener(
                                                                                                                                                                                                                                                        'pointercancel',
                                                                                                                                                                                                                                                            stopJoystick
                                                                                                                                                                                                                                                            );
                window.addEventListener('resize', () => {
                  camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();

                      renderer.setSize(window.innerWidth, window.innerHeight);
                      });

                      function showDisclaimer() {
                            const disclaimer = document.createElement('div');

                                disclaimer.id = 'disclaimer-screen';

                                    disclaimer.innerHTML = `
                                            <div class="disclaimer-content">
                                                <h1></h1>

                                                    <p>
                                                            AARTH 101 is a fictional interactive experience created
                                                                    for entertainment purposes. All characters, names,
                                                                            organizations, locations, events, timelines and situations
                                                                                    portrayed within the game are fictional unless otherwise
                                                                                            clearly stated.
                                                                                                </p>

                                                                                                    <p>
                                                                                                            Any resemblance to actual persons, living or deceased,
                                                                                                                    real organizations, places or events is purely coincidental
                                                                                                                            or used within the fictional context of the game.
                                                                                                                                </p>

                                                                                                                                    <p>
                                                                                                                                            AARTH 101 contains fictional violence, combat, destruction,
                                                                                                                                                    death, intense situations and mature themes. Some scenes
                                                                                                                                                            may contain imagery or situations that certain players
                                                                                                                                                                    may find disturbing, frightening or uncomfortable.
                                                                                                                                                                        </p>

                                                                                                                                                                            <p>
                                                                                                                                                                                    Player discretion is advised. The content presented within
                                                                                                                                                                                            the game does not represent real-world instructions,
                                                                                                                                                                                                    encouragement or endorsement of violence or harmful behavior.
                                                                                                                                                                                                        </p>
                                                                                                                                                                                                        </div>
                                                        `;
                                                            document.body.appendChild(disclaimer);

                                                            setTimeout(() => {
                                                                    disclaimer.remove();
                                                                        showCreateAccount();
                                                                        }, 10000);
                                                            }

                                                            function showCreateAccount() {
                                                                    const accountScreen = document.createElement('div');

                                                                        accountScreen.id = 'account-screen';

                                                                            accountScreen.innerHTML = `
                                                                                    <div class="account-content">
                                                                                                <h1>CREATE ACCOUNT</h1>

                                                                                                            <input type="text" placeholder="USERNAME">
                                                                                                                        <input type="password" placeholder="PASSWORD">

                                                                                                                                    <button>CREATE ACCOUNT</button>

                                                                                                                                                <p>Already have an account? LOGIN</p>
                                                                                                                                                        </div>
                                                                                                                                                            `;

                                                                                                                                                                document.body.appendChild(accountScreen);
                                                                                                                                                                }
                                                            
                      