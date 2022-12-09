import { Mat4 } from './math.js';
import { Parser } from './parser.js';
import { Scene } from './scene.js';
import { Renderer } from './renderer.js';
import { TriangleMesh } from './trianglemesh.js';
// DO NOT CHANGE ANYTHING ABOVE HERE

////////////////////////////////////////////////////////////////////////////////
// TODO: Implement createCube, createSphere, computeTransformation, and shaders
////////////////////////////////////////////////////////////////////////////////

// Example two triangle quad
const quad = {
	positions: [-1, -1, -1, 1, -1, -1, 1, 1, -1, -1, -1, -1, 1,  1, -1, -1,  1, -1],
	normals: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
	uvCoords: [0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]
}

const cube = {
	positions: [
		// -z
		-1,	-1,	-1,	
		 1,	 1,	-1,	
		 1,	-1,	-1,	
		 1,	 1,	-1,	
		-1,	-1,	-1,	
		-1,	 1,	-1,	
		// +z
		-1,	-1,	 1,	
		 1,	-1,	 1,	
		 1,	 1,	 1,	
		 1,	 1,	 1,	
		-1,	 1,	 1,	
		-1,	-1,	 1,	
		// -y
		-1,	-1,	-1,	
		 1,	-1,	-1,	
		 1,	-1,	 1,	
		 1,	-1,	 1,	
		-1,	-1,	 1,	
		-1,	-1,	-1,	
		// +y
		-1,	 1,	-1,	
		 1,	 1,	 1,	
		 1,	 1,	-1,	
		 1,	 1,	 1,	
		-1,	 1,	-1,	
		-1,	 1,	 1,	
		// -x
		-1,	-1,	-1,	
		-1,	-1,	 1,	
		-1,	 1,	-1,	
		-1,	-1,	 1,	
		-1,	 1,	 1,	
		-1,	 1,	-1,	
		// +x
		 1,	 1,	 1,	
		 1,	 1,	-1,	
		 1,	-1,	 1,	
		 1,	 1,	-1,	
		 1,	-1,	-1,	
		 1,	-1,	 1,	
	],
	normals: [
		// -z
		0,0,-1,	0,0,-1,	0,0,-1,	0,0,-1,	0,0,-1,	0,0,-1,	
		// +z
		0,0,1,	0,0,1,	0,0,1,	0,0,1,	0,0,1,	0,0,1,	
		// -y
		0,-1,0,	0,-1,0,	0,-1,0,	0,-1,0,	0,-1,0,	0,-1,0,	
		// +y
		0,1,0,	0,1,0,	0,1,0,	0,1,0,	0,1,0,	0,1,0,	
		// -x
		-1,0,0,	0,1,0,	0,1,0,	0,1,0,	0,1,0,	0,1,0,	
		// +x
		1,0,0,	0,1,0,	0,1,0,	0,1,0,	0,1,0,	0,1,0,	
	],
	uvs: [
		// -z
		1, 2/3, 	
		1/2, 1, 
		1/2, 2/3, 
		1/2, 1, 
		1, 2/3, 	
		1, 1,
		// +z
		0,2/3,
		1/2,2/3,
		1/2,1,
		1/2,1,
		0,1,
		0,2/3,
		// -y
		1,1/3,
		1/2,1/3,
		1/2,0,
		1/2,0,
		1,0,
		1,1/3,
		// +y
		0,1/3,
		1/2,0,
		1/2,1/3,
		1/2,0,
		0,1/3,
		0,0,
		// -x
		1/2,1/3,
		1,1/3,
		1/2,2/3,
		1,1/3,
		1,2/3,
		1/2,2/3,
		// +x
		0,2/3,
		1/2,2/3,
		0,1/3,
		1/2,2/3,
		1/2,1/3,
		0,1/3,
	]
}


TriangleMesh.prototype.createCube = function() {
	this.positions = cube.positions;
	this.normals = cube.normals;
	this.uvCoords = cube.uvCoords; // TODO: check if correct with image
}

TriangleMesh.prototype.createSphere = function(numStacks, numSectors) {

	// referencing http://www.songho.ca/opengl/gl_sphere.html
	// ! POSITIONS, VERT NORMAL, UV 

	var verts = new Array();
	var norms = new Array();
	var uvs = new Array();
	
	var x, y, z, xy;				// vertex position
	var nx, ny, nz;					// vertex normal
	var s, t;						// vertex texCoord
	
	let sectorStep = 2 * Math.PI / numSectors;
	let stackStep = Math.PI / numStacks;
	var sectorAngle, stackAngle;

	// add (sectorCount+1) vertices per stack
		// the first and last vertices have same position and normal, but different tex coords
		for(var i = 0; i <= numStacks; ++i) {
		stackAngle = Math.PI / 2 - i * stackStep;	// starting from pi/2 to -pi/2
		xy = Math.cos(stackAngle);				// r * cos(u)
		z = Math.sin(stackAngle);				// r * sin(u)

		for(var j = 0; j <= numSectors; ++j) {

			sectorAngle = j * sectorStep;		// starting from 0 to 2pi

			// vertex position (x, y, z)
			x = xy * Math.cos(sectorAngle);		// r * cos(u) * cos(v)
			y = xy * Math.sin(sectorAngle);		// r * cos(u) * sin(v)
			verts.push(x);
			verts.push(y);
			verts.push(z);
	
			// normalized vertex normal (nx, ny, nz)
			nx = x;
			ny = y;
			nz = z;
			norms.push(nx);
			norms.push(ny);
			norms.push(nz);
	
			// vertex tex coord (s, t) range between [0, 1]
			s = j / numSectors;
			t = i / numStacks;
			uvs.push(s);
			uvs.push(t);
		}
	}


	// ! ORGNIZING INDICES

	var _indices = new Array();
	var lineIndices = new Array();

	var k1, k2;

	for(var i = 0; i < numStacks; ++i)
	{
		k1 = i * (numSectors + 1);     // beginning of current stack
		k2 = k1 + numSectors + 1;      // beginning of next stack
	
		for(var j = 0; j < numSectors; ++j, ++k1, ++k2)
		{
			// k1 => k2 => k1+1
			if(i != 0)
			{
				_indices.push(k1);
				_indices.push(k2);
				_indices.push(k1 + 1);
			}

			// k1+1 => k2 => k2+1
			if(i != (numStacks-1))
			{
				_indices.push(k1 + 1);
				_indices.push(k2);
				_indices.push(k2 + 1);
			}

			lineIndices.push(k1);
			lineIndices.push(k2);
			if(i != 0)  // horizontal lines except 1st stack, k1 => k+1
			{
				lineIndices.push(k1);
				lineIndices.push(k1 + 1);
			}
		}
	}

	// ! ASSIGN

	this.positions = verts; 
	this.normals = norms;
	this.uvCoords = uvs;
	this.indices = _indices;

	var vertGroups = new Array();
	
	for (var i = 0; i < this.positions.length/3; ++i) {
		vertGroups.push(
			i + ":	"+ this.positions.slice(i*3, i*3+3).map(x => x.toFixed(0)).join(", ") + " \n"
		);
	}

	// console.log("VERTS:\n" + vertGroups);
	// 	// verts.map((element, index) => index + ":	"+ element.toFixed(2)).join("\n"));
	// console.log(
	// 	"INDICES:\n" + 
	// 	_indices.map((element, index) => index + ":	"+ element.toFixed(0)).join("\n"));
}

Scene.prototype.computeTransformation = function(transformSequence) {
	// input are 2d arrays each transformation is one row
	// each row starts with the type of transformation
	// each row is followed by the parameters

	// transformSequence.forEach((x , i) => {
	// 	console.log(i + ":	" + x);
	// });

	var transform = Mat4.create(); // identity

	applyTransformRec(transformSequence, 0, transform);

	// 	console.log("Transform matrix: " + transform.map(x => x.toFixed(2)));
	
	return transform;
}

// tail recursion to correct order
function applyTransformRec(inputs, row, mt) {
	

	let current = inputs[row];

	var m = Mat4.create();


	if 		(current[0] == "S") {
		Mat4.set( m,
			current[1],	0,	0,	0,
			0,	current[2],	0,	0,
			0,	0,	current[3],	0,
			0,	0,	0,	1
		);
	}
	else if (current[0] == "T") {
		Mat4.set( m,
			1,	0,	0,	0,
			0,	1,	0,	0,
			0,	0,	1,	0,
			current[1],	current[2],	current[3],	1
		);
	}
	else if (current[0] == "Rx") {
		let theta = (current[1] * Math.PI) / 180.0;
		Mat4.set( m,
			1,	0,	0,	0,
			0,	 Math.cos(theta),	Math.sin(theta),	0,
			0,	-Math.sin(theta),	Math.cos(theta),	0,
			0,	0,	0,	1
		);
	}
	else if (current[0] == "Ry") {
		let theta = (current[1] * Math.PI) / 180.0;
		Mat4.set( m,
			Math.cos(theta),	0,	-Math.sin(theta),	0,
			0,	1,	0,	0,
			Math.sin(theta),	0,	Math.cos(theta),	0,
			0,	0,	0,	1
		);
	}
	else if (current[0] == "Rz") {
		let theta = (current[1] * Math.PI) / 180.0;
		Mat4.set( m,
			Math.cos(theta),	Math.sin(theta),	0,	0,
			-Math.sin(theta),	Math.cos(theta),	0,	0,
			0,	0,	1,	0,
			0,	0,	0,	1
		);
	}

	if (row+1 < inputs.length) {
		mt = Mat4.multiply(mt, applyTransformRec(inputs, row+1, mt), m);
		return mt;
	}
	else {
		return m;
	}
}


/*
0:	Rx,70,0,0
1:	Rz,75,0,0
2:	S,0.5,0.5,0.5
3:	T,-1,0,2

T * S * Rz * Rx 

*/



Renderer.prototype.VERTEX_SHADER = `
precision mediump float;
attribute vec3 position, normal;
attribute vec2 uvCoord;
uniform vec3 lightPosition;
uniform mat4 projectionMatrix, viewMatrix, modelMatrix;
uniform mat3 normalMatrix;
varying vec2 vTexCoord;

// new vars
varying vec3 fNormal;
varying vec3 lightDir;
varying vec3 cameraDir;

void main() {
	fNormal = normalize(normalMatrix * normal);
	vTexCoord = uvCoord;
	vec4 pos = viewMatrix * modelMatrix * vec4(position, 1.0);
	gl_Position = projectionMatrix * pos;
	
	lightDir = normalize(lightPosition - position);
	vec3 cameraDir = -pos.z * normalize(position);
}
`;

Renderer.prototype.FRAGMENT_SHADER = `
precision mediump float;
// created with material: 
// ambient (ka), diffuse (kd), specular (ks), and specular exponent (shininess) coefficients
uniform vec3 ka, kd, ks, lightIntensity; 
uniform float shininess;
uniform sampler2D uTexture;
uniform bool hasTexture;
varying vec2 vTexCoord;

// TODO: implement fragment shader logic below

// added vars
varying vec3 fNormal;
varying vec3 lightDir;
varying vec3 cameraDir;

void main() {
	
	// ! blinn-phong: ambient + diffuse + and specular

	float n_dot_l = dot(fNormal, lightDir);
	vec3 halfVector = normalize(lightDir + cameraDir);
	float n_dot_hv = dot(fNormal, halfVector);
  
	vec3 diffuse = kd * lightIntensity * max(0.0, n_dot_l);
	vec3 specular = ks * lightIntensity * pow(max(0.0, n_dot_hv), shininess);
	vec3 finalColor = ka + diffuse + specular;
	

	// ! texture sampling

	if (hasTexture) {

	}
  
	gl_FragColor = vec4(finalColor, 1.0);
}
`;

////////////////////////////////////////////////////////////////////////////////
// EXTRA CREDIT: change DEF_INPUT to create something interesting!
////////////////////////////////////////////////////////////////////////////////
const DEF_INPUT = [
	"c,myCamera,perspective,5,5,5,0,0,0,0,1,0;",
	"l,myLight,point,0,5,0,2,2,2;",
	"p,unitCube,cube;",
	"p,unitSphere,sphere,8,16;",
	"m,redDiceMat,0.3,0,0,0.7,0,0,1,1,1,15,dice.jpg;",
	"m,grnDiceMat,0,0.3,0,0,0.7,0,1,1,1,15,dice.jpg;",
	"m,bluDiceMat,0,0,0.3,0,0,0.7,1,1,1,15,dice.jpg;",
	"m,globeMat,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5,globe.jpg;",
	"o,rd,unitCube,redDiceMat;",
	"o,gd,unitCube,grnDiceMat;",
	"o,bd,unitCube,bluDiceMat;",
	"o,gl,unitSphere,globeMat;",
	"X,rd,Rz,75;X,rd,Rx,90;X,rd,S,0.5,0.5,0.5;X,rd,T,-1,0,2;",
	"X,gd,Ry,45;X,gd,S,0.5,0.5,0.5;X,gd,T,2,0,2;",
	"X,bd,S,0.5,0.5,0.5;X,bd,Rx,90;X,bd,T,2,0,-1;",
	"X,gl,S,1.5,1.5,1.5;X,gl,Rx,90;X,gl,Ry,-150;X,gl,T,0,1.5,0;",
].join("\n");

// DO NOT CHANGE ANYTHING BELOW HERE
export { Parser, Scene, Renderer, DEF_INPUT };
