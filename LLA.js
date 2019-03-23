/*
LV2 is a 2d vector object
LV3 is a 3d vector object

LV functionality:
	toString
	copy
	i[add/scale/div/sub] ->affects this object
	add/scale/div/sub ->affects others
	setAs -> set from other object
	setValues -> set from parameters (resets like constructor)
	dist
	round/floor
	mag
	interpolateTo (target, time) interpolates this point to target given time (0-1)
LV2
	static fromAngle -> takes angle in degrees, returns LV2
	getAngle -> returns the angle given our normalized LV2
LV3:
	cross/icross

LMat3 is a 3d matrix object
LMat4 is a 4d matrix object

LMat
	constructors take in a list of values to represent the values or nothing and all are set to zero
	copy
	toString
	i/transpose
	mult
	dist
	imult
	multLV2
	multLV3	
	
	static functions:
		rot/x/y/z
		scale
		trans
		identity
		zero

*/


function LV2(x, y){
	this.x = x;
	this.y = y;
}

LV2.rad2deg = 57.295779513082320;

LV2.prototype.toString = function(){
	return '[' + this.x + ',' + this.y + ']';
};

LV2.prototype.copy = function(){
	return new LV2(this.x, this.y);
};

LV2.prototype.setAs = function(o){
	this.x = o.x;
	this.y = o.y;
};

LV2.prototype.setValues = function(x, y){
	this.x = x;
	this.y = y;
};

LV2.prototype.add = function(o){
	return new LV2(this.x + o.x, this.y + o.y);
};

LV2.prototype.iadd = function(o){
	this.x += o.x;
	this.y += o.y;
};

LV2.prototype.sub = function(o){
	return new LV2(this.x - o.x, this.y - o.y);
};

LV2.prototype.isub = function(o){
	this.x -= o.x;
	this.y -= o.y;
};

LV2.prototype.scale = function(s){
	return new LV2(this.x * s, this.y * s);
};

LV2.prototype.iscale = function(s){
	this.x *= s;
	this.y *= s;
};

LV2.prototype.div = function(s){
	return new LV2(this.x / s, this.y / s);
};

LV2.prototype.idiv = function(s){
	this.x /= s;
	this.y /= s;
};

LV2.prototype.dot = function(o){
	return this.x * o.y + this.y * o.x;
};

LV2.prototype.dist = function(o){
	var dx = this.x - o.x;
	var dy = this.y - o.y;
	return Math.sqrt(dx * dx + dy * dy);
};

LV2.prototype.mag = function(){
	return Math.sqrt(this.x * this.x + this.y * this.y);
};

LV2.prototype.round = function(){
	return new LV2(Math.round(this.x), Math.round(this.y));
};

LV2.prototype.floor = function(){
	return new LV2(Math.floor(this.x), Math.floor(this.y));
};

LV2.prototype.iround = function(){
	this.x = Math.round(this.x);
	this.y = Math.round(this.y);
};

LV2.prototype.ifloor = function(){
	this.x = Math.floor(this.x);
	this.y = Math.floor(this.y);
};

LV2.prototype.unit = function(){
	var m = Math.sqrt(this.x * this.x + this.y * this.y);
	return new LV2(this.x / m, this.y / m);	
};

LV2.prototype.iunit = function(){
	var m = Math.sqrt(this.x * this.x + this.y * this.y);
	this.x /= m;
	this.y /= m;
};

LV2.prototype.interpolateTo = function(target, time){
	var to = target.copy();
	to.isub(this);
	to.iscale(time);
	to.iadd(this);
	return to;
}

LV2.fromAngle = function(angle){
	var rv = new LV2(0,0);
	angle /= LV2.rad2deg;
	rv.x = Math.cos(angle);
	rv.y = Math.sin(angle);
	return rv;
}

LV2.prototype.getAngle = function(){
	var angle = LV2.rad2deg * Math.atan(this.y / this.x);
	if(this.x < 0.0)
		angle += 180.0;
	else if(y < 0.0)
		angle += 360.0;
	return angle;
}

// LV3

function LV3(x, y, z){
	this.x = x;
	this.y = y;
	this.z = z;
}

LV3.prototype.toString = function(){
	return '[' + this.x + ',' + this.y + ',' + this.z + ']';
};

LV3.prototype.copy = function(){
	return new LV3(this.x, this.y, this.z);
};

LV3.prototype.setAs = function(o){
	this.x = o.x;
	this.y = o.y;
	this.z = o.z;
};

LV3.prototype.setValues = function(x, y, z){
	this.x = x;
	this.y = y;
	this.z = z;
};

LV3.prototype.add = function(o){
	return new LV3(this.x + o.x, this.y + o.y, this.z + o.z);
};

LV3.prototype.iadd = function(o){
	this.x += o.x;
	this.y += o.y;
	this.z += o.z;
};

LV3.prototype.sub = function(o){
	return new LV3(this.x - o.x, this.y - o.y, this.z - o.z);
};

LV3.prototype.isub = function(o){
	this.x -= o.x;
	this.y -= o.y;
	this.z -= o.z;
};

LV3.prototype.scale = function(s){
	return new LV3(this.x * s, this.y * s, this.z * s);
};

LV3.prototype.iscale = function(s){
	this.x *= s;
	this.y *= s;
	this.z *= s;
};

LV3.prototype.div = function(s){
	return new LV3(this.x / s, this.y / s, this.z / s);
};

LV3.prototype.idiv = function(s){
	this.x /= s;
	this.y /= s;
	this.z /= s;
};

LV3.prototype.dot = function(o){
	return this.x * o.x + this.y * o.y + this.z * o.z;
};

LV3.prototype.cross = function(o){
	return new LV3(this.y * o.z - this.z * o.y,
				   this.z * o.x - this.x * o.z,
				   this.x * o.y - this.y * o.x
			);
};

LV3.prototype.icross = function(o){
	var x = this.x;
	var y = this.y;
	var z = this.z;
	this.x = y * o.z - z * o.y;
	this.y = z * o.x - x * o.z;
	this.z = x * o.y - y * o.x;
};


LV3.prototype.dist = function(o){
	var dx = this.x - o.x;
	var dy = this.y - o.y;
	var dz = this.z - o.z;
	return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

LV3.prototype.mag = function(){
	return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};

LV3.prototype.round = function(){
	return new LV3(Math.round(this.x), Math.round(this.y), Math.round(this.z));
};

LV3.prototype.floor = function(){
	return new LV3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
};

LV3.prototype.iround = function(){
	this.x = Math.round(this.x);
	this.y = Math.round(this.y);
	this.z = Math.round(this.z);
};

LV3.prototype.ifloor = function(){
	this.x = Math.floor(this.x);
	this.y = Math.floor(this.y);
	this.z = Math.floor(this.z);
};


LV3.prototype.unit = function(){
	var m = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	return new LV3(this.x / m, this.y / m, this.z / m);	
};

LV3.prototype.iunit = function(){
	var m = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	this.x /= m;
	this.y /= m;
	this.z /= m;	
};

//LMat3

function LMat3(inp){
	if(inp === undefined)
		this.arr = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	else
		this.arr = inp;
}

LMat3.prototype.toString = function(){
	return '|' + this.arr[0] + ',' + this.arr[1] + ',' + this.arr[2] + '|\n' + 
		   '|' + this.arr[3] + ',' + this.arr[4] + ',' + this.arr[5] + '|\n' +
		   '|' + this.arr[6] + ',' + this.arr[7] + ',' + this.arr[8] + '|\n';
};

LMat3.prototype.copy = function(){
	return new LMat3(this.arr.slice());
};

LMat3.prototype.itranspose = function(){
	this.arr = [
		this.arr[0], this.arr[3], this.arr[6],
		this.arr[1], this.arr[4], this.arr[7],
		this.arr[2], this.arr[5], this.arr[8] 
	];
};

LMat3.prototype.transpose = function(){
	return new LMat3([
		this.arr[0], this.arr[3], this.arr[6],
		this.arr[1], this.arr[4], this.arr[7],
		this.arr[2], this.arr[5], this.arr[8] 
	]);
};


LMat3.prototype.imult = function(m){
	this.arr = [
		this.arr[0] * m.arr[0] + this.arr[1] * m.arr[3] + this.arr[2] * m.arr[6],
		this.arr[0] * m.arr[1] + this.arr[1] * m.arr[4] + this.arr[2] * m.arr[7],
		this.arr[0] * m.arr[2] + this.arr[1] * m.arr[5] + this.arr[2] * m.arr[8],

		this.arr[3] * m.arr[0] + this.arr[4] * m.arr[3] + this.arr[5] * m.arr[6],
		this.arr[3] * m.arr[1] + this.arr[4] * m.arr[4] + this.arr[5] * m.arr[7],
		this.arr[3] * m.arr[2] + this.arr[4] * m.arr[5] + this.arr[5] * m.arr[8],

		this.arr[6] * m.arr[0] + this.arr[7] * m.arr[3] + this.arr[8] * m.arr[6],
		this.arr[6] * m.arr[1] + this.arr[7] * m.arr[4] + this.arr[8] * m.arr[7],
		this.arr[6] * m.arr[2] + this.arr[7] * m.arr[5] + this.arr[8] * m.arr[8], 
	];
};

LMat3.prototype.mult = function(m){
	return new LMat3([
		this.arr[0] * m.arr[0] + this.arr[1] * m.arr[3] + this.arr[2] * m.arr[6],
		this.arr[0] * m.arr[1] + this.arr[1] * m.arr[4] + this.arr[2] * m.arr[7],
		this.arr[0] * m.arr[2] + this.arr[1] * m.arr[5] + this.arr[2] * m.arr[8],

		this.arr[3] * m.arr[0] + this.arr[4] * m.arr[3] + this.arr[5] * m.arr[6],
		this.arr[3] * m.arr[1] + this.arr[4] * m.arr[4] + this.arr[5] * m.arr[7],
		this.arr[3] * m.arr[2] + this.arr[4] * m.arr[5] + this.arr[5] * m.arr[8],

		this.arr[6] * m.arr[0] + this.arr[7] * m.arr[3] + this.arr[8] * m.arr[6],
		this.arr[6] * m.arr[1] + this.arr[7] * m.arr[4] + this.arr[8] * m.arr[7],
		this.arr[6] * m.arr[2] + this.arr[7] * m.arr[5] + this.arr[8] * m.arr[8], 
	]);	
};


LMat3.prototype.multLV2 = function(p){
	return new LV2(p.x * this.arr[0] + p.y * this.arr[1] + 0 * this.arr[2],
				   p.x * this.arr[3] + p.y * this.arr[4] + 0 * this.arr[5]);
};

LMat3.prototype.multLV3 = function(p){
	return new LV3(p.x * this.arr[0] + p.y * this.arr[1] + p.z * this.arr[2],
				   p.x * this.arr[3] + p.y * this.arr[4] + p.z * this.arr[5],
				   p.x * this.arr[6] + p.y * this.arr[7] + p.z * this.arr[8]);
};

LMat3.zero = function(){
	return new LMat3();
};

LMat3.identity = function(){
	return new LMat3([1, 0, 0, 0, 1, 0, 0, 0, 1]);
};

LMat3.scale = function(scalar){
	return new LMat3([scalar, 0, 0, 0, scalar, 0, 0, 0, 1]);
};

LMat3.trans = function(x, y){
	return new LMat3([1, 0, x, 0, 1, y, 0, 0, 1]);
};

LMat3.rotate = function(angle){
	angle *= 0.0174533;
	var cosine = Math.cos(angle);
	var sinus = Math.sin(angle);
	return new LMat3([cosine, -sinus, 0, sinus, cosine, 0, 0, 0, 1]);
};

LMat3.rotateX = function(angle){
	angle *= 0.0174533;
	var cosine = Math.cos(angle);
	var sinus = Math.sin(angle);
	return new LMat3([1, 0, 0, 0, cosine, -sinus, 0, sinus, cosine]);
};

LMat3.rotateY = function(angle){
	angle *= 0.0174533;
	var cosine = Math.cos(angle);
	var sinus = Math.sin(angle);
	return new LMat3([cosine, 0, sinus, 0, 1, 0, -sinus, 0, cosine]);
};

LMat3.rotateZ = function(angle){
	angle *= 0.0174533;
	var cosine = Math.cos(angle);
	var sinus = Math.sin(angle);
	return new LMat3([cosine, -sinue, 0, sinus, cosine, 0, 0, 0, 1]);
};
	
//LMat4
function LMat4(inp){
	if(inp === undefined)
		this.arr = [0, 0, 0, 0,
					0, 0, 0, 0,
					0, 0, 0, 0,
					0, 0, 0, 0];
	else
		this.arr = inp;
}

LMat4.prototype.toString = function(){
	return '|' + this.arr[0] + ',' + this.arr[1] + ',' + this.arr[2] + ',' + this.arr[3] + '|\n' + 
		   '|' + this.arr[4] + ',' + this.arr[5] + ',' + this.arr[6] + ',' + this.arr[7] + '|\n' + 
		   '|' + this.arr[8] + ',' + this.arr[9] + ',' + this.arr[10] + ',' + this.arr[11] + '|\n' + 
		   '|' + this.arr[12] + ',' + this.arr[13] + ',' + this.arr[14] + ',' + this.arr[15] + '|\n';
};

LMat4.prototype.copy = function(){
	return new LMat4(this.arr.slice());
};

LMat4.prototype.itranspose = function(){
	this.arr = [
		this.arr[0], this.arr[4], this.arr[8], this.arr[12],
		this.arr[1], this.arr[5], this.arr[9], this.arr[13],
		this.arr[2], this.arr[6], this.arr[10], this.arr[14],
		this.arr[3], this.arr[7], this.arr[11], this.arr[15]
	];
};

LMat4.prototype.transpose = function(){
	return new LMat4([
		this.arr[0], this.arr[4], this.arr[8], this.arr[12],
		this.arr[1], this.arr[5], this.arr[9], this.arr[13],
		this.arr[2], this.arr[6], this.arr[10], this.arr[14],
		this.arr[3], this.arr[7], this.arr[11], this.arr[15]
	]);
};

LMat4.prototype.imult = function(m){
	this.arr = [
		this.arr[0]*m.arr[0] + this.arr[1]*m.arr[4] + this.arr[2]*m.arr[8] + this.arr[3]*m.arr[12],
		this.arr[0]*m.arr[1] + this.arr[1]*m.arr[5] + this.arr[2]*m.arr[9] + this.arr[3]*m.arr[13],
		this.arr[0]*m.arr[2] + this.arr[1]*m.arr[6] + this.arr[2]*m.arr[10] + this.arr[3]*m.arr[14],
		this.arr[0]*m.arr[3] + this.arr[1]*m.arr[7] + this.arr[2]*m.arr[11] + this.arr[3]*m.arr[15],

		this.arr[4]*m.arr[0] + this.arr[5]*m.arr[4] + this.arr[6]*m.arr[8] + this.arr[7]*m.arr[12],
		this.arr[4]*m.arr[1] + this.arr[5]*m.arr[5] + this.arr[6]*m.arr[9] + this.arr[7]*m.arr[13],
		this.arr[4]*m.arr[2] + this.arr[5]*m.arr[6] + this.arr[6]*m.arr[10] + this.arr[7]*m.arr[14],
		this.arr[4]*m.arr[3] + this.arr[5]*m.arr[7] + this.arr[6]*m.arr[11] + this.arr[7]*m.arr[15],

		this.arr[8]*m.arr[0] + this.arr[9]*m.arr[4] + this.arr[10]*m.arr[8] + this.arr[11]*m.arr[12],
		this.arr[8]*m.arr[1] + this.arr[9]*m.arr[5] + this.arr[10]*m.arr[9] + this.arr[11]*m.arr[13],
		this.arr[8]*m.arr[2] + this.arr[9]*m.arr[6] + this.arr[10]*m.arr[10] + this.arr[11]*m.arr[14],
		this.arr[8]*m.arr[3] + this.arr[9]*m.arr[7] + this.arr[10]*m.arr[11] + this.arr[11]*m.arr[15],

		this.arr[12]*m.arr[0] + this.arr[13]*m.arr[4] + this.arr[14]*m.arr[8] + this.arr[15]*m.arr[12],
		this.arr[12]*m.arr[1] + this.arr[13]*m.arr[5] + this.arr[14]*m.arr[9] + this.arr[15]*m.arr[13],
		this.arr[12]*m.arr[2] + this.arr[13]*m.arr[6] + this.arr[14]*m.arr[10] + this.arr[15]*m.arr[14],
		this.arr[12]*m.arr[3] + this.arr[13]*m.arr[7] + this.arr[14]*m.arr[11] + this.arr[15]*m.arr[15]
		
	];
};

LMat4.prototype.mult = function(m){
	return new LMat4([
		this.arr[0]*m.arr[0] + this.arr[1]*m.arr[4] + this.arr[2]*m.arr[8] + this.arr[3]*m.arr[12],
		this.arr[0]*m.arr[1] + this.arr[1]*m.arr[5] + this.arr[2]*m.arr[9] + this.arr[3]*m.arr[13],
		this.arr[0]*m.arr[2] + this.arr[1]*m.arr[6] + this.arr[2]*m.arr[10] + this.arr[3]*m.arr[14],
		this.arr[0]*m.arr[3] + this.arr[1]*m.arr[7] + this.arr[2]*m.arr[11] + this.arr[3]*m.arr[15],

		this.arr[4]*m.arr[0] + this.arr[5]*m.arr[4] + this.arr[6]*m.arr[8] + this.arr[7]*m.arr[12],
		this.arr[4]*m.arr[1] + this.arr[5]*m.arr[5] + this.arr[6]*m.arr[9] + this.arr[7]*m.arr[13],
		this.arr[4]*m.arr[2] + this.arr[5]*m.arr[6] + this.arr[6]*m.arr[10] + this.arr[7]*m.arr[14],
		this.arr[4]*m.arr[3] + this.arr[5]*m.arr[7] + this.arr[6]*m.arr[11] + this.arr[7]*m.arr[15],

		this.arr[8]*m.arr[0] + this.arr[9]*m.arr[4] + this.arr[10]*m.arr[8] + this.arr[11]*m.arr[12],
		this.arr[8]*m.arr[1] + this.arr[9]*m.arr[5] + this.arr[10]*m.arr[9] + this.arr[11]*m.arr[13],
		this.arr[8]*m.arr[2] + this.arr[9]*m.arr[6] + this.arr[10]*m.arr[10] + this.arr[11]*m.arr[14],
		this.arr[8]*m.arr[3] + this.arr[9]*m.arr[7] + this.arr[10]*m.arr[11] + this.arr[11]*m.arr[15],

		this.arr[12]*m.arr[0] + this.arr[13]*m.arr[4] + this.arr[14]*m.arr[8] + this.arr[15]*m.arr[12],
		this.arr[12]*m.arr[1] + this.arr[13]*m.arr[5] + this.arr[14]*m.arr[9] + this.arr[15]*m.arr[13],
		this.arr[12]*m.arr[2] + this.arr[13]*m.arr[6] + this.arr[14]*m.arr[10] + this.arr[15]*m.arr[14],
		this.arr[12]*m.arr[3] + this.arr[13]*m.arr[7] + this.arr[14]*m.arr[11] + this.arr[15]*m.arr[15]
		
	]);
};


LMat4.prototype.multLV3 = function(p){
	return new LV3(p.x * this.arr[0] + p.y * this.arr[1] + p.z * this.arr[2] + this.arr[3],
				   p.x * this.arr[4] + p.y * this.arr[5] + p.z * this.arr[6] + this.arr[7],
				   p.x * this.arr[8] + p.y * this.arr[9] + p.z * this.arr[10] + this.arr[11]);
};


LMat4.scale = function(scalar){
	return new LMat4([scalar, 0, 0, 0, 
					  0, scalar, 0, 0,
					  0, 0, scalar, 0,
					  0, 0, 0, 1]);
};

LMat4.trans = function(x, y, z){
	return new LMat4([1, 0, 0, x,
					  0, 1, 0, y,
					  0, 0, 1, z,
					  0, 0, 0, 1]);
};

LMat4.rotateX = function(angle){
	angle *= 0.0174533;
	var cosine = Math.cos(angle);
	var sinus = Math.sin(angle);
	return new LMat4([1, 0, 0, 0,
					  0, cosine, -sinus, 0,
					  0, sinus, cosine, 0,
					  0, 0, 0, 1
		]);
};


LMat4.rotateY = function(angle){
	angle *= 0.0174533;
	var cosine = Math.cos(angle);
	var sinus = Math.sin(angle);
	return new LMat4([cosine, 0, sinus, 0,
					  0, 1, 0, 0,
					  -sinus, 0, cosine, 0,
					  0, 0, 0, 1
		]);
};


LMat4.rotateZ = function(angle){
	angle *= 0.0174533;
	var cosine = Math.cos(angle);
	var sinus = Math.sin(angle);
	return new LMat4([cosine, -sinus, 0, 0,
					  sinus, cosine, 0, 0,
					  0, 0, 0, 0,
					  0, 0, 0, 1
		]);
};

LMat4.zero = function(){
	return new LMat4();
};

LMat4.identity = function(){
	return new LMat4([1, 0, 0, 0,
					  0, 1, 0, 0,
					  0, 0, 1, 0,
					  0, 0, 0, 1]);
};
