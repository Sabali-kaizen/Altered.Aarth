import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRMLoaderPlugin } from '@pixiv/three-vrm';
import { PLYLoader } from 'three/examples/jsm/Addons.js';
import { VRMAnimationLoaderPlugin, createVRMAnimationClip } from '@pixiv/three-vrm-animation';
import * as VRMAnimation from '@pixiv/three-vrm-animation';
import { deltaTime } from 'three/tsl';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x12051f);
scene.fog = new THREE.FogExp2(0x12051f, 0.018);

const camera = new THREE.PerspectiveCamera(
  60,
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
                  let fireEyeAnimation = null;
                  let animationMixer = null;

                  function playFireEyeAnimation() {
                        if (!fireEye || !fireEyeAnimation) return;

                            const clip = createVRMAnimationClip(
                                    fireEyeAnimation,
                                            fireEye
                                                );

                                                    animationMixer = new THREE.AnimationMixer(fireEye.scene);

                                                        const action = animationMixer.clipAction(clip);
                                                            action.play();

                                                                console.log('FireEye animation started!');
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
                                                                                  '/animations/Walking.vrma',
                                                                                      (gltf) => {
                                                                                              fireEyeAnimation = gltf.userData.vrmAnimations[0];
                                                                                              playFireEyeAnimation();
                                                                                                      console.log('VRMA_01 loaded:', fireEyeAnimation);
                                                                                                          },
                                                                                                              undefined,
                                                                                                                  (error) => {
                                                                                                                          console.error('VRMA_01 failed to load:', error);
                                                                                                                              }
                                                                                                                              );
                                                                            
          const groundGeometry = new THREE.PlaneGeometry(100, 100);
          const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x17121f,
              roughness: 1
              });

              const ground = new THREE.Mesh(
                groundGeometry,
                  groundMaterial
                  );

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

            renderer.render(scene, camera);
         }

                animate();

                window.addEventListener('resize', () => {
                  camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();

                      renderer.setSize(window.innerWidth, window.innerHeight);
                      });