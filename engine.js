import * as THREE from 'three';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const viewport=document.getElementById('viewport');
const scene=new THREE.Scene(); scene.background=new THREE.Color(0x202631);
scene.fog=new THREE.Fog(0x202631,28,90);
const camera=new THREE.PerspectiveCamera(60,1,.1,500); camera.position.set(7,6,9);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace; viewport.appendChild(renderer.domElement);
const orbit=new OrbitControls(camera,renderer.domElement); orbit.enableDamping=true; orbit.target.set(0,1,0);
const transform=new TransformControls(camera,renderer.domElement); scene.add(transform);
transform.addEventListener('dragging-changed',e=>orbit.enabled=!e.value);
transform.addEventListener('objectChange',()=>renderInspector());
const grid=new THREE.GridHelper(100,100,0x596273,0x343b48); scene.add(grid);
scene.add(new THREE.HemisphereLight(0xb9d7ff,0x41404a,1.25));
const sun=new THREE.DirectionalLight(0xffffff,2.2); sun.position.set(6,10,5); sun.castShadow=true; sun.shadow.mapSize.set(1024,1024); scene.add(sun);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshStandardMaterial({color:0x343b43,roughness:1}));
ground.rotation.x=-Math.PI/2;ground.position.y=-.025;ground.receiveShadow=true;scene.add(ground);
const objects=[]; let selected=null,mode='translate',playing=false,last=performance.now(),frames=0,fpsTime=0;
function addObject(type){
 let obj,geo,mat=new THREE.MeshStandardMaterial({color:0x8b83ff,roughness:.65});
 if(type==='Box')geo=new THREE.BoxGeometry(1,1,1);
 if(type==='Sphere')geo=new THREE.SphereGeometry(.6,32,20);
 if(type==='Cylinder')geo=new THREE.CylinderGeometry(.5,.5,1,32);
 if(type==='Plane')geo=new THREE.PlaneGeometry(2,2);
 if(geo){obj=new THREE.Mesh(geo,mat);obj.castShadow=true;obj.receiveShadow=true;obj.position.y=type==='Plane'?0.01:.5;obj.name=type==='Box'?'Cube':type;scene.add(obj);objects.push(obj);select(obj);refreshHierarchy();}
 if(type==='Light'){obj=new THREE.PointLight(0xffdfad,20,12);obj.position.set(2,3,1);obj.name='Point Light';scene.add(obj);objects.push(obj);select(obj);refreshHierarchy();}
 updateCount();return obj;
}
function select(obj){selected=obj;transform.detach();if(obj&&!playing)transform.attach(obj);refreshHierarchy();renderInspector();document.getElementById('selectionLabel').textContent=obj?obj.name+' selected':'Нет выбранного объекта'}
function refreshHierarchy(){const el=document.getElementById('hierarchy');el.innerHTML='';for(const o of objects){const d=document.createElement('div');d.className='tree-item'+(o===selected?' selected':'');d.innerHTML=`<span class="tree-icon">${o.isLight?'☼':'◈'}</span><span></span>`;d.lastChild.textContent=o.name;d.onclick=()=>select(o);el.appendChild(d)}}
function field(parent,label,value,onChange,step='0.1'){const row=document.createElement('div');row.className='field';const l=document.createElement('label');l.textContent=label;const input=document.createElement('input');input.type='number';input.step=step;input.value=Number(value).toFixed(2);input.addEventListener('change',()=>onChange(Number(input.value)||0));row.append(l,input);parent.append(row)}
function renderInspector(){const el=document.getElementById('inspector');el.innerHTML='';if(!selected){el.className='inspector empty';el.textContent='Выберите объект в иерархии или сцене';return}el.className='inspector';
 const name=document.createElement('div');name.className='field';name.innerHTML='<label>Имя</label>';const inp=document.createElement('input');inp.value=selected.name;inp.onchange=()=>{selected.name=inp.value;refreshHierarchy()};name.append(inp);el.append(name);
 const g=document.createElement('div');g.className='field-group';g.innerHTML='<div class="group-title">TRANSFORM</div>';el.append(g);
 for(const [label,key] of [['Position','position'],['Rotation','rotation'],['Scale','scale']]){const h=document.createElement('div');h.style.cssText='font-size:10px;color:#7f899a;margin:9px 0 5px';h.textContent=label;g.append(h);for(const axis of ['x','y','z'])field(g,axis.toUpperCase(),selected[key][axis],v=>{selected[key][axis]=key==='rotation'?THREE.MathUtils.degToRad(v):v; if(key==='rotation')renderInspector()})}
 if(selected.material?.color){const mg=document.createElement('div');mg.className='field-group';mg.innerHTML='<div class="group-title">MATERIAL</div>';const r=document.createElement('div');r.className='field';r.innerHTML='<label>Color</label>';const c=document.createElement('input');c.type='color';c.className='color-input';c.value='#'+selected.material.color.getHexString();c.oninput=()=>selected.material.color.set(c.value);r.append(c);mg.append(r);el.append(mg)}
 const del=document.createElement('button');del.textContent='Удалить объект';del.style.cssText='width:100%;color:#ff8585;margin-top:8px';del.onclick=()=>{transform.detach();scene.remove(selected);objects.splice(objects.indexOf(selected),1);selected=null;refreshHierarchy();renderInspector();updateCount()};el.append(del);
}
function updateCount(){document.getElementById('objectCount').textContent=objects.length+' Objects'}
function resize(){const w=viewport.clientWidth,h=viewport.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)}
new ResizeObserver(resize).observe(viewport);resize();
renderer.domElement.addEventListener('pointerdown',e=>{if(playing)return;const rect=renderer.domElement.getBoundingClientRect();const mouse=new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);const ray=new THREE.Raycaster();ray.setFromCamera(mouse,camera);const hits=ray.intersectObjects(objects,false);if(hits.length)select(hits[0].object)});
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;transform.setMode(mode);document.querySelectorAll('[data-mode]').forEach(x=>x.classList.toggle('active',x===b))});
document.getElementById('gridBtn').onclick=e=>{grid.visible=!grid.visible;e.currentTarget.classList.toggle('active',grid.visible)};
document.getElementById('addMenu').onclick=()=>document.getElementById('addPopup').classList.toggle('hidden');
document.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{addObject(b.dataset.add);document.getElementById('addPopup').classList.add('hidden')});
document.getElementById('playBtn').onclick=()=>{playing=!playing;const b=document.getElementById('playBtn');b.textContent=playing?'■ Стоп':'▶ Играть';b.classList.toggle('play',!playing);transform.detach();orbit.enabled=!playing;if(!playing)select(selected)};
function serialize(){return {format:'ZeroEngineScene',version:'0.1.0',objects:objects.map(o=>({type:o.isLight?'Light':o.geometry?.type==='BoxGeometry'?'Box':o.geometry?.type==='SphereGeometry'?'Sphere':o.geometry?.type==='CylinderGeometry'?'Cylinder':'Plane',name:o.name,position:o.position.toArray(),rotation:o.rotation.toArray(),scale:o.scale.toArray(),color:o.material?.color?.getHexString()||null}))}}
document.getElementById('saveBtn').onclick=()=>{const blob=new Blob([JSON.stringify(serialize(),null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='zero-scene.json';a.click();URL.revokeObjectURL(a.href)};
document.getElementById('loadBtn').onclick=()=>document.getElementById('fileInput').click();
document.getElementById('fileInput').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const data=JSON.parse(await f.text());if(data.format!=='ZeroEngineScene')throw Error('Неверный формат');for(const o of [...objects])scene.remove(o);objects.length=0;selected=null;for(const d of data.objects){const o=addObject(d.type);o.name=d.name;o.position.fromArray(d.position);o.rotation.fromArray(d.rotation);o.scale.fromArray(d.scale);if(d.color&&o.material)o.material.color.set('#'+d.color)}refreshHierarchy();select(null)}catch(err){alert('Не удалось открыть сцену: '+err.message)}e.target.value=''};
function animate(now){requestAnimationFrame(animate);const dt=Math.min((now-last)/1000,.05);last=now;orbit.update();renderer.render(scene,camera);frames++;if(now-fpsTime>1000){document.getElementById('fps').textContent=frames+' FPS';frames=0;fpsTime=now}}
requestAnimationFrame(animate);
 // Basic mobile first-person controls for Play mode
let move={x:0,y:0};const stick=document.getElementById('stick'),knob=stick.querySelector('.stick-knob');let active=false;
stick.addEventListener('pointerdown',e=>{active=true;stick.setPointerCapture(e.pointerId)});
stick.addEventListener('pointermove',e=>{if(!active)return;const r=stick.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let x=(e.clientX-cx)/35,y=(e.clientY-cy)/35;const n=Math.hypot(x,y);if(n>1){x/=n;y/=n}move={x,y};knob.style.transform=`translate(${x*25}px,${y*25}px)`});
function release(){active=false;move={x:0,y:0};knob.style.transform=''}stick.addEventListener('pointerup',release);stick.addEventListener('pointercancel',release);
let look=false,lastX=0,lastY=0;document.getElementById('lookBtn').onclick=()=>{look=!look;document.getElementById('lookBtn').textContent=look?'Обзор: ВКЛ':'Обзор'};
renderer.domElement.addEventListener('pointermove',e=>{if(!playing||!look||e.pointerType==='mouse')return;if(lastX){orbit.rotateLeft((e.clientX-lastX)*.004);orbit.rotateUp((e.clientY-lastY)*.004)}lastX=e.clientX;lastY=e.clientY});
document.getElementById('jumpBtn').onclick=()=>{if(playing)camera.position.y+=.2};
(function mobileLoop(){requestAnimationFrame(mobileLoop);if(playing){const forward=new THREE.Vector3();camera.getWorldDirection(forward);forward.y=0;forward.normalize();const right=new THREE.Vector3().crossVectors(forward,camera.up).negate();camera.position.addScaledVector(forward,-move.y*.09);camera.position.addScaledVector(right,move.x*.09);orbit.target.copy(camera.position).add(forward)}})();
addObject('Box');select(null);
