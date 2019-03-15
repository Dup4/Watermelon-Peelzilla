/*
 Function  : Final project_PersonalPart
 Author    : PAN, Lvzhi
 Build_Date: Dec. 24, 2018 
 Version   : 1.0
 */ 

var canvas,ctx;  

function Guy() {
	/* 人物移动部分 */
	this.moveUp = false; 
	this.moveDown = false;  
	this.moveLeft = false;
	this.moveRight = false; 
	this.speed = 4; 
	this.moveUpdate = function () {  /* 根据当前移动方向改变下一帧的坐标 */
		if (this.moveUp == true) this.pos.y -= this.speed;  
		if (this.moveDown == true) this.pos.y += this.speed;
		if (this.moveLeft == true) this.pos.x -= this.speed;
		if (this.moveRight == true) this.pos.x += this.speed;
		if (this.pos.x <= 0) this.pos.x = 0;  
		if (this.pos.x >= canvas.width - this.w) this.pos.x = canvas.width - this.w;
		if (this.pos.y <= 0) this.pos.y = 0;
		if (this.pos.y >= canvas.height - this.h) this.pos.y = canvas.height - this.h;
	}
	/* 人物移动部分 */

	/* 普通子弹射出部分 */
	this.shootUp = false;
	this.shootDown = false;
	this.shootLeft = false;
	this.shootRight = false;  
	this.shootDir = new Victor (0, 0);   
	this.shootCollection = new ShootCollection();
	this.ShootAdd = function () { 
		this.shootDir = new Victor (0, 0);    /* 判断射出的方向 八个方向 只有合法输入才可以射出子弹 */
		if (this.shootUp == true && this.shootDown == false && 
			this.shootLeft == false && this.shootRight == false) 
			this.shootDir = new Victor (0, -1);
		if (this.shootUp == false && this.shootDown == true && 
			this.shootLeft == false && this.shootRight == false) 
			this.shootDir = new Victor (0, 1);
		if (this.shootUp == false && this.shootDown == false && 
			this.shootLeft == true && this.shootRight == false) 
			this.shootDir = new Victor (-1, 0);
		if (this.shootUp == false && this.shootDown == false && 
			this.shootLeft == false && this.shootRight == true) 
			this.shootDir = new Victor (1, 0);
		if (this.shootUp == true && this.shootDown == false && 
			this.shootLeft == true && this.shootRight == false) 
			this.shootDir = new Victor (-1, -1);
		if (this.shootUp == false && this.shootDown == true && 
			this.shootLeft == true && this.shootRight == false) 
			this.shootDir = new Victor (-1, 1);
		if (this.shootUp == true && this.shootDown == false && 
			this.shootLeft == false && this.shootRight == true) 
			this.shootDir = new Victor (1, -1);
		if (this.shootUp == false && this.shootDown == true && 
			this.shootLeft == false && this.shootRight == true) 
			this.shootDir = new Victor (1, 1); 
		if (!(this.shootDir.x == 0 && this.shootDir.y == 0)) {
			this.shootCollection.addElement(new Shoot(new Victor(this.pos.x + this.w / 2, this.pos.y + this.h / 2), this.shootDir.clone(), 5, 10));
		}
	};
	/* 普通子弹射出部分 */

	/* 矩形炸弹部分 */
	this.isRectangleBomb = false;    
	this.rectangleBombCollection = new RectangleBombCollection();  
	this.addRectangleBomb = function() {
		this.rectangleBombCollection.addElement(new RectangleBomb(this.pos.clone(), this.w, this.h));  
	};
	/* 矩形炸弹部分 */
	
	/* 圆形护盾部分 */
	this.isArcShieldopen = 0;
	this.arcShield = undefined;
	this.addArcShield = function(monster) {
		if (this.isArcShieldopen == 0) {  /* 当前状态为关闭 */
			if (this.arcShield !== undefined) {  /* 如果关闭了护盾 就把所有怪物的状态置位不被防御状态*/
				this.arcShield = undefined;  
				monster.elementList.forEach( function (obj) {
					obj.isArcDefence = 0;
				});	
			}
			return;
		}
		if (this.arcShield === undefined) { /* 如果是刚开启，则创建新对象 */
			this.arcShield = new ArcShield(this.pos);   
		}	
	}
	/* 圆形护盾部分 */

	/* 激光炮部分 */
	this.isLaser = 0; 
	this.laser = undefined; 
	this.laserDir = new Victor(0, 0);
	this.addLaser = function() { 
		if (this.isLaser == 1) {  
			this.laserDir = new Victor(0, 0);
			if (this.moveUp == true && this.moveDown == false && 
				this.moveLeft == false && this.moveRight == false) 
				this.laserDir = new Victor (0, -1);
			if (this.moveUp == false && this.moveDown == true && 
				this.moveLeft == false && this.moveRight == false) 
				this.laserDir = new Victor (0, 1);
			if (this.moveUp == false && this.moveDown == false && 
				this.moveLeft == true && this.moveRight == false) 
				this.laserDir = new Victor (-1, 0);
			if (this.moveUp == false && this.moveDown == false && 
				this.moveLeft == false && this.moveRight == true) 
				this.laserDir = new Victor (1, 0);
			if (this.moveUp == true && this.moveDown == false && 
				this.moveLeft == true && this.moveRight == false) 
				this.laserDir = new Victor (-1, -1);
			if (this.moveUp == false && this.moveDown == true && 
				this.moveLeft == true && this.moveRight == false) 
				this.laserDir = new Victor (-1, 1);
			if (this.moveUp == true && this.moveDown == false && 
				this.moveLeft == false && this.moveRight == true) 
				this.laserDir = new Victor (1, -1);
			if (this.moveUp == false && this.moveDown == true && 
				this.moveLeft == false && this.moveRight == true) 
				this.laserDir = new Victor (1, 1); 
			if (this.laser === undefined) {       /* 激光炮蓝耗 */
				if (this.nowMp >= 0) {
					this.nowMp -= 0;
					this.laser = new Laser(this.pos.clone(), this.w, this.laserDir.clone()); /* 创建激光炮对象 */
				} else {
					this.isLaser = 0;
					return;
				}
			}
			this.laser.draw(this.laserDir.clone());
		}
		else if (this.isLaser == 2) {
			if (this.laser === undefined) return; 
			if (this.laser.done()) {
				this.isLaser = 0;
				this.laser = undefined;
				return;
			} 
			else {
				this.laser.loading = false; 
				this.laser.draw();
			}
		}
	};
	/* 激光炮部分 */

	/* 主人公的状态 */
	this.nowHp = 100; 
	this.nowMp = 100;
	this.maxHp=100;
	this.maxMp=100;
	this.lv=0;
	this.Exp=0;
	this.Score=0;
	this.place=1;
	this.isDead = function() { /* 判断是否死亡 */
		if (this.nowHp <= 0) return true; 
		return false;
	}
	/* 升级的状态变化 */
	this.levelUp = function() { 
		if (this.Exp >= Math.min(200+this.lv*20,560)) {
			this.speed += 0.1;
			var delta = this.Exp / (Math.min(200+this.lv*20,560));
		//	this.maxHp += 10 * delta;
		//	this.maxMp += 10 * delta; 
			this.Exp = this.Exp % (Math.min(200+this.lv*20,560));
			this.lv += delta;
			this.nowHp = this.maxHp;
			this.nowMp = this.maxMp;
		}
	}
	//~ this.levelUp = function() { 
		//~ if (this.Exp >= 100) {
			//~ var delta = this.Exp / 100;
			//~ this.lv += delta;
			//~ this.maxHp += 10 * delta;
			//~ this.maxMp += 10 * delta; 
			//~ this.Exp = this.Exp % 100;
			//~ this.nowHp = this.maxHp;
			//~ this.nowMp = this.maxMp;
		//~ }
	//~ }
	this.pos = new Victor (canvas.width / 2-7.5, canvas.height / 2 - 7.5);  /* 主人公的初始位置 pos 存的是小矩形左上角和右上角*/    
	this.w = 15;
	this.h = 15;   
	/* 绘制主人公*/
	this.draw = function() {  
		ctx.save(); 
		ctx.strokeStyle = "white";  
		ctx.strokeRect(this.pos.x, this.pos.y, this.w, this.h);  
		ctx.restore();   
	}; 

	/* 每一帧要做的事情 */
	this.work = function (monster) {  
		this.levelUp();
		if (this.isLaser < 1) {  /* 当前处于不发射激光炮状态 */
 			this.ShootAdd();   
 			if (this.isRectangleBomb == true) {
 				if (this.nowMp >= 5) {
 					this.nowMp -= 5;
 					this.addRectangleBomb();
 				}
 				this.isRectangleBomb = false;
 			}
			this.moveUpdate();  
		} else {   /* 当前发射激光炮状态 不能移动 */
			/* 激光炮执行部分 */
			this.addLaser(); 
			if (this.isLaser == 2) {
				if (this.laser !== undefined) {
					for (var i = 0; i < monster.elementList.size(); ++i) {
						var temp = monster.elementList.first();
						monster.elementList.removeElementAtIndex(0);
						this.laser.attack(temp);
						monster.elementList.add(temp);  
					}
				} else {
					this.isLaser = 0;
				}
			}
		}
		/* 两种攻击技能要做的事情 */
		this.shootCollection.work(monster); 
		this.rectangleBombCollection.work(monster); 

		this.draw();  
		/* 蓝耗控制 */
		if (this.isArcShieldopen == 1) {
			if (this.nowMp >= 0.14) {
				this.nowMp -= 0.14;
			} else {
				this.isArcShieldopen = 0;
			}
		}
		this.addArcShield(monster);  
		if (this.isArcShieldopen == 1) {
			this.arcShield.draw(this.pos);   /* 将当前主人公的位置信息传进去 */ 
			for (var i = 0; i < monster.elementList.size(); ++i) {
				var temp = monster.elementList.first();
				monster.elementList.removeElementAtIndex(0);
				this.arcShield.defense(temp);
				monster.elementList.add(temp);
			}
		}
	};

	/* 对boss 的伤害判定*/
	this.workBoss = function (Boss) {
		this.shootCollection.attackboss(Boss);
		this.rectangleBombCollection.attackboss(Boss);
		if (this.laser !== undefined) {
			this.laser.attackboss(Boss);
		}
	}
};

/* 队列功能 */
function Collection() {
	this.elementList = new buckets.LinkedList();
	this.addElement = function (element) {
		this.elementList.add(element); 
	};
	this.draw = function () {
		this.elementList.forEach( function (obj) {
			obj.draw();
		});
	};
	this.update = function () {
		this.elementList.forEach(function (obj) {
			obj.update(); 
		}); 
	};
	this.remove = function () {
		for (var i = 0; i < this.elementList.size(); ++i) {
			var temp = this.elementList.first();
			this.elementList.removeElementAtIndex(0); 
			if (!temp.done()) this.elementList.add(temp);
		}
	};
};


/* 普通攻击函数 */
function Shoot(st, dir, len, speed) { 
	this.dir = dir.normalize();
	this.len = len;
	this.startPoint = st; 
	this.endPoint = this.startPoint.clone().add(this.dir.clone().multiply(new Victor (this.len, this.len)));  
	this.speed = speed; 
	this.draw = function() {
		ctx.save(); 
		ctx.strokeStyle = "white"; 
		ctx.beginPath();
		ctx.moveTo(this.startPoint.x, this.startPoint.y);
		ctx.lineTo(this.endPoint.x, this.endPoint.y);
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
	};
	this.update = function() {
		var delta = this.dir.clone().multiply(new Victor (this.speed, this.speed));
		this.startPoint.add(delta);
		this.endPoint.add(delta); 
	};
	this.done = function() {   /* 判断是否出canvas边界 */
		if (this.startPoint.x >= 0 && this.startPoint.x <= canvas.width &&
			this.startPoint.y >= 0 && this.startPoint.y <= canvas.height) 
			return false;
		return true;  
	};
	this.isHit = function(tar) {  /* 判断是否被击中 */
		if (this.startPoint.x >= tar.pos.x - tar.size - 5 && this.startPoint.x <= tar.pos.x + tar.size + 5 && 
			this.startPoint.y >= tar.pos.y - tar.size - 5 && this.startPoint.y <= tar.pos.y + tar.size + 5) {
				return true; 
			}
		return false;
	};
	this.attack = function(monster) {
		for (var i = 0; i < monster.elementList.size(); ++i) {
			var temp = monster.elementList.first();
			monster.elementList.removeElementAtIndex(0); 
			if (this.isHit(temp) == true) {   /* 一个子弹 只能造成一滴伤害 */
				temp.hp -= 1; 
				monster.addElement(temp);
				return true;
			}   
			monster.addElement(temp);
		}
		return false;
	};
	this.inArea = function(pos, rect) {
		if (pos.x >= rect.x &&
			pos.x <= rect.x + rect.w &&
			pos.y >= rect.y &&
			pos.y <= rect.y + rect.h)
			return true;
		return false;
	};
	this.attackBoss = function (Boss) {
		if (this.inArea(this.startPoint, Boss) ||
			this.inArea(this.endPoint, Boss)) {
			--Boss.hp;                      /* 普通攻击对Boss造成的伤害 */	
			return true;           
		}
		return false;
	};
};

function ShootCollection() {  
	Collection.call(this); 
	this.attackAll = function(monster) {
		for (var i = 0; i < this.elementList.size(); ++i) {
			var temp = this.elementList.first();
			this.elementList.removeElementAtIndex(0);
			if (temp.attack(monster) == false) 
				this.addElement(temp); 
		}
	};
	this.attackboss = function(Boss) {
		for (var i = 0; i < this.elementList.size(); ++i) {
			var temp = this.elementList.first();
			this.elementList.removeElementAtIndex(0);
			if (temp.attackBoss(Boss) == false) 
				this.addElement(temp);
		}
	};
	this.work = function(monster) {
		this.draw(); 
		this.update();
		this.remove();  
		this.attackAll(monster);
	};
};

function RectangleBomb(pos, w, h) { 
	this.pos = pos;
	this.w = w;
	this.h = h; 
	this.deltaW = 0;
	this.deltaH = 0; 
	this.lastTime = 0;
	this.initTime = Date.now();  
	this.waitTime = 400;  
	this.draw = function() {
		ctx.save(); 
		ctx.fillStyle = "white"; 
		ctx.globalAlpha = 0.3;
		if (Date.now() - this.initTime > this.waitTime) {
			var fps = parseInt(1000 / (Date.now() - this.lastTime)); 
			this.deltaW += 800 / fps;
			this.deltaH += 800 / fps; 
			ctx.fillRect(this.pos.x, this.pos.y - this.deltaH, this.w, this.deltaH * 2);
			ctx.fillRect(this.pos.x - this.deltaW, this.pos.y, this.deltaW * 2, this.h);	
		} 
		else {
			ctx.fillRect(this.pos.x, this.pos.y, this.w, this.h); 
		} 
		ctx.restore();  
		this.lastTime = Date.now(); 
	};
	this.done = function() {  
		if (this.pos.x - this.deltaW <= 0 && this.pos.x + this.deltaW >= canvas.width &&
		    this.pos.y - this.deltaH <= 0 && this.pos.y + this.deltaH >= canvas.height)
			return true;
		return false;   
	};
	this.inArea = function(leftdown, rightup, pos) {   /* 判断怪物是否在矩形边界内 */
		if (pos.x >= leftdown.x - 1 && pos.x <= rightup.x + 1 &&
			pos.y >= leftdown.y - 1 && pos.y <= rightup.y + 1)
			return true;
		return false;   
	}
	this.attack = function(tar) { 
		if (Date.now() - this.initTime < this.waitTime) return; /* 如果矩形炸弹还没开始炸则不攻击 */ 
		var leftdown = { x : this.pos.x, y : this.pos.y - this.deltaH};
		var rightup = { x : this.pos.x + this.w, y : this.pos.y + this.deltaH};
		if (tar.pos.y >= leftdown.y && tar.pos.y <= rightup.y && 
			Math.abs(tar.pos.x - leftdown.x) < tar.size) 
			tar.isDead = true;
		if (tar.pos.y >= leftdown.y && tar.pos.y <= rightup.y &&
			Math.abs(tar.pos.x - rightup.x) < tar.size) 
			tar.isDead = true;
		if (tar.pos.x >= leftdown.x && tar.pos.x <= rightup.x && 
			Math.abs(tar.pos.y - leftdown.y) < tar.size) 
			tar.isDead = true;
		if (tar.pos.x >= leftdown.x && tar.pos.x <= rightup.x &&
			Math.abs(tar.pos.y - rightup.y) < tar.size) 
			tar.isDead = true;  
		if (this.inArea(leftdown, rightup, tar.pos) == true) tar.isDead = true;
		leftdown = { x : this.pos.x - this.deltaW, y : this.pos.y};
		rightup = { x : this.pos.x + this.deltaW, y : this.pos.y + this.h};
		if (tar.pos.y >= leftdown.y && tar.pos.y <= rightup.y && 
			Math.abs(tar.pos.x - leftdown.x) < tar.size) 
			tar.isDead = true;
		if (tar.pos.y >= leftdown.y && tar.pos.y <= rightup.y &&
			Math.abs(tar.pos.x - rightup.x) < tar.size) 
			tar.isDead = true;
		if (tar.pos.x >= leftdown.x && tar.pos.x <= rightup.x && 
			Math.abs(tar.pos.y - leftdown.y) < tar.size) 
			tar.isDead = true;
		if (tar.pos.x >= leftdown.x && tar.pos.x <= rightup.x &&
			Math.abs(tar.pos.y - rightup.y) < tar.size) 
			tar.isDead = true; 
		if (this.inArea(leftdown, rightup, tar.pos) == true) tar.isDead = true; 
	};
	//判断两个矩形是否相交，可以判断不相交取非
	this.rectangleIntersect = function (ld1, ur1, ld2, ur2) {  
		if (! (ld1.x > ur2.x || ur1.x < ld2.x ||
			   ld1.y > ur2.y || ur1.y < ld2.y)) 
			return true;
		return false;
	}
	this.attackBoss = function (Boss) {
		if (Date.now() - this.initTime < this.waitTime) return; /* 如果矩形炸弹还没开始炸则不攻击 */ 
		var leftdown = { x : this.pos.x, y : this.pos.y - this.deltaH};
		var rightup = { x : this.pos.x + this.w, y : this.pos.y + this.deltaH}; 
		var leftdown2 = { x : this.pos.x - this.deltaW, y : this.pos.y};
		var rightup2 = { x : this.pos.x + this.deltaW, y : this.pos.y + this.h};
		if (this.rectangleIntersect(leftdown, rightup, {x : Boss.x, y : Boss.y}, {x : Boss.x + Boss.w, y : Boss.y + Boss.h}) ||
			this.rectangleIntersect(leftdown2, rightup2, {x : Boss.x, y : Boss.y}, {x : Boss.x + Boss.w, y : Boss.y + Boss.h})) {
			--Boss.hp;      /* 矩形对Boss 的攻击伤害*/ 
		}
	}
};

function RectangleBombCollection() {
	Collection.call(this);
	this.attackAll = function (monster) {   /* 时间复杂度 O(nm) n 代表矩形炸弹个数 m 代表小怪个数 */ 
		this.elementList.forEach( function (obj) {
			monster.elementList.forEach( function (objMon) {
				obj.attack(objMon);
			})
		})
	};
	this.attackboss = function (Boss) {
		this.elementList.forEach( function (obj) {
			obj.attackBoss(Boss);
		})
	};
	this.work = function(monster) {
		this.attackAll(monster);
		this.draw();
		this.remove();
		
	};
};

function ArcShield(pos) {
	this.pos = pos;
	this.r = 100;   /* 护盾的半径*/
	this.draw = function(pos) {
		this.pos = pos;
		ctx.save();
		ctx.setLineDash([10, 5]); 
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#f36';  
		ctx.globalAlpha = 0.8;
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2, true);  
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
		this.lastTime = Date.now();
	}
	this.getDis = function(tar) {  /* 获得两个圆心间的距离 */
		return Math.sqrt(Math.pow(tar.pos.x - this.pos.x, 2) + Math.pow(tar.pos.y - this.pos.y, 2));
	};
	this.defense = function(tar) {
		if (this.getDis(tar) <= tar.size + this.r) { /* 判断相交或者包含 */
			tar.isArcDefence = 1;
		} else if (this.getDis(tar) >= tar.size + this.r + 100) {
			tar.isArcDefence = 0;
		}
	};
}

function Laser(pos, w, dir) {
	this.pos = pos;  
	this.w = w;
	this.deltaW = 0;   
	this.h = 1024; 
	this.dir = dir;
	this.loading = true;   
	this.lastTime = 0;
	this.len = 10;
	this.pointLeft = undefined;
	this.pointRight = undefined;
	this.endLeft = undefined;
	this.endRight = undefined;  
	this.draw = function(Dir) {
		ctx.save(); 
		if (this.loading == true && !(Dir.x == 0 && Dir.y == 0)) this.dir = Dir; 
		if (this.dir.x == 0 && this.dir.y == 0) this.dir = new Victor(0, -1);
		this.pointLeft = this.pos.clone(); 
		this.pointRight = this.pos.clone();
		if (this.dir.x == 0 || this.dir.y == 0) {  
			var delta = 3;   /* 修正参数 */
			// right
			if (this.dir.x == 1) {
				this.pointLeft.y -= this.deltaW + delta; 
				this.pointRight.y += this.w + this.deltaW + delta;   
			} 
			// down
			else if (this.dir.y == 1) {
				this.pointLeft.x -= this.deltaW + delta;
				this.pointRight.x += this.w + this.deltaW + delta;
			}
			// left
			else if (this.dir.x == -1) { 
				this.pointLeft.x += this.w;
				this.pointLeft.y -= this.deltaW + delta;
				this.pointRight.x += this.w;
				this.pointRight.y += this.w + this.deltaW + delta;
			}
			// up
			else {
				this.pointLeft.x -= this.deltaW + delta;
				this.pointLeft.y += this.w;
				this.pointRight.x += this.w + this.deltaW + delta;
				this.pointRight.y += this.w; 
			}
		}
		else {
			// left_up
			if (this.dir.x == -1 && this.dir.y == -1) {
				this.pointLeft.y += this.w;
				this.pointRight.x += this.w;
				this.pointLeft.add((new Victor(-1, 1)).multiply(new Victor(this.deltaW, this.deltaW))); 
				this.pointRight.add((new Victor(1, -1)).multiply(new Victor(this.deltaW, this.deltaW)));
			}
			// left_down
			else if (this.dir.x == -1 && this.dir.y == 1) {
				this.pointLeft.x += this.w;
				this.pointLeft.y += this.w;
				this.pointLeft.add((new Victor(1, 1)).multiply(new Victor(this.deltaW, this.deltaW)));
				this.pointRight.add((new Victor(-1, -1)).multiply(new Victor(this.deltaW, this.deltaW)));
			}
			// right_up
			else if (this.dir.x == 1 && this.dir.y == -1) {
				this.pointRight.x += this.w;
				this.pointRight.y += this.w;
				this.pointLeft.add((new Victor(-1, -1)).multiply(new Victor(this.deltaW, this.deltaW)));
				this.pointRight.add((new Victor(1, 1)).multiply(new Victor (this.deltaW, this.deltaW)));
			}
			// right_down 
			else {
				this.pointLeft.x += this.w;
				this.pointRight.y += this.w;
				this.pointLeft.add((new Victor(1, -1)).multiply(new Victor(this.deltaW, this.deltaW)));
				this.pointRight.add((new Victor(-1, 1)).multiply(new Victor(this.deltaW, this.deltaW)));
			}
		} 
		if (this.loading == true) {     
			this.endLeft = this.pointLeft.clone().add(this.dir.clone().multiply(new Victor(1024, 1024))); 
			this.endRight = this.pointRight.clone().add(this.dir.clone().multiply(new Victor(1024, 1024))); 
			var fps = parseInt(1000 / (Date.now() - this.lastTime));
			this.deltaW += 20 / fps;
			if (this.deltaW > this.w) this.deltaW = this.w;  
			ctx.setLineDash([10, 5]); 
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#f36';  
			//绘制蓄力框
			ctx.beginPath();
			ctx.moveTo(this.pointLeft.x, this.pointLeft.y);
			ctx.lineTo(this.pointRight.x, this.pointRight.y);
			ctx.stroke(); 
			ctx.beginPath();
			ctx.moveTo(this.pointLeft.x, this.pointLeft.y);
			ctx.lineTo(this.endLeft.x, this.endLeft.y); 
			ctx.stroke();
			ctx.beginPath(); 
			ctx.moveTo(this.pointRight.x, this.pointRight.y);
			ctx.lineTo(this.endRight.x, this.endRight.y); 
			ctx.stroke();
		}
		else {
			this.endLeft = this.pointLeft.clone().add(this.dir.clone().multiply(new Victor(this.len, this.len))); 
			this.endRight = this.pointRight.clone().add(this.dir.clone().multiply(new Victor(this.len, this.len))); 
			var fps = parseInt(1000 / (Date.now() - this.lastTime));
			this.len += 1500 / fps;  
			ctx.beginPath();
			ctx.moveTo(this.pointLeft.x, this.pointLeft.y); 
			ctx.lineTo(this.endLeft.x, this.endLeft.y);
			ctx.lineTo(this.endRight.x, this.endRight.y);
			ctx.lineTo(this.pointRight.x, this.pointRight.y);
			ctx.closePath();
			ctx.fillStyle = "white";
			ctx.globalAlpha = 0.3;
			ctx.fill();
		}
		ctx.restore();  
		this.lastTime = Date.now();
	};
	this.done = function() {
		var end = this.pos.clone().add(this.dir.clone().multiply(new Victor(this.len, this.len)));
		if ((end.x <= -50 || end.x >= canvas.width + 50) || (end.y <= -50 || end.y >= canvas.height + 50))
			return true;
		return false;  
	};
	// kx - y + y1 - kx1 = 0  | kx_0 - y_0 + y_1 - kx_1| / sqrt(k^2 + 1)
	this.getK = function (point1, point2) {
		return (point2.y - point1.y) * 1.0 / (point2.x - point1.x);
	}
	this.getDis = function (k, x1, y1, pos) {
		return (Math.abs(k * pos.x - pos.y + y1 - k * x1) * 1.0) / Math.sqrt(k * k + 1); 
	};
	this.getV = function (x1, y1, x2, y2, pos) {
		return (pos.x - x1) * (y2 - y1) - (pos.y - y1) * (x2 - x1); 
	}
	this.inArea = function(leftdown, rightup, pos) {
		if (pos.x >= leftdown.x - 5 && pos.x <= rightup.x + 5 &&
			pos.y >= leftdown.y - 5 && pos.y <= rightup.y + 5)
			return true;
		return false;  
	}
	this.attack = function(tar) {    /* 对单一怪物判断的复杂度为O(1) */
		if (this.loading == true) return;
		if (this.dir.x == 0 || this.dir.y == 0) {  /* 如果射出的是矩形 */
			var leftdown = undefined, rightup = undefined;
			// up
			if (this.dir.y == -1) {
				leftdown = this.pointLeft;
				rightup = this.endRight;
			}
			// down
			else if (this.dir.y == 1) {
				leftdown = this.endLeft;
				rightup = this.pointRight;
			}
			// left
			else if (this.dir.x == -1) {
				leftdown = this.endLeft;
				rightup = this.pointRight;
			}
			// right
			else {
				leftdown = this.pointLeft;
				rightup = this.endRight;
			}
			/* 坐标系不同*/
			if (rightup.y < leftdown.y) {
				var tmp = rightup.y;
				rightup.y = leftdown.y;
				leftdown.y = tmp;
			}
			if (rightup.x < leftdown.x) {
				var tmp = rightup.x;
				rightup.x = leftdown.x;
				leftdown.x = tmp;
			}
			if (tar.pos.y >= leftdown.y && tar.pos.y <= rightup.y && 
				Math.abs(tar.pos.x - leftdown.x) < tar.size) 
				tar.isDead = true;
			if (tar.pos.y >= leftdown.y && tar.pos.y <= rightup.y &&
				Math.abs(tar.pos.x - rightup.x) < tar.size) 
				tar.isDead = true;
			if (tar.pos.x >= leftdown.x && tar.pos.x <= rightup.x && 
				Math.abs(tar.pos.y - leftdown.y) < tar.size) 
				tar.isDead = true;
			if (tar.pos.x >= leftdown.x && tar.pos.x <= rightup.x &&
				Math.abs(tar.pos.y - rightup.y) < tar.size) 
				tar.isDead = true;  
			if (this.inArea(leftdown, rightup, tar.pos) == true) {  
				tar.isDead = true;
			}
		} else {  /* 射出的是斜矩形 */
			// 判断圆形和斜矩形是否相交  就是判断圆心到三条边的距离是否小于半径
			if (this.getDis(this.getK(this.pointLeft, this.pointRight),  
				this.pointLeft.x, this.pointLeft.y, tar.pos) < tar.size)  
				tar.isDead = true;
			if (this.getDis(this.getK(this.pointRight, this.endRight),
				this.pointRight.x, this.pointRight.y, tar.pos) < tar.size)
				tar.isDead = true;
			if (this.getDis(this.getK(this.pointLeft, this.endLeft),
				this.pointLeft.x, this.pointLeft.y, tar.pos) < tar.size)
				tar.isDead = true;
			// if (this.getDis(this.getK(this.endLeft, this.endRight),    /*  这条线段好像有问题.. */
			// 	this.endLeft.x, this.endLeft.y, tar.pos) < tar.size) 
			// 	tar.isDead = true;

			// 判断圆心是否被矩形包含 
			// 一个平行四边形 做线性规划 两条平行线上假设直线方程为z = ax + by + c 那么得到的z的正负性不同
			if (this.getV(this.pointLeft.x, this.pointLeft.y, this.pointRight.x, this.pointRight.y, tar.pos) *
				this.getV(this.endLeft.x, this.endLeft.y, this.endRight.x, this.endRight.y, tar.pos) <= 0 &&
				this.getV(this.pointRight.x, this.pointRight.y, this.endRight.x, this.endRight.y, tar.pos) * 
				this.getV(this.pointLeft.x, this.pointLeft.y, this.endLeft.x, this.endLeft.y, tar.pos) <= 0)
					tar.isDead = true;   
		}
	};
	this.attackboss = function(Boss) {    
		if (this.loading == true) return;
		if (this.dir.x == 0 || this.dir.y == 0) {  /* 如果射出的是矩形 */  /* 判定复杂度 O(1)*/
			var leftdown = undefined, rightup = undefined;
			// up
			if (this.dir.y == -1) {
				leftdown = this.pointLeft;
				rightup = this.endRight;
			}
			// down
			else if (this.dir.y == 1) {
				leftdown = this.endLeft;
				rightup = this.pointRight;
			}
			// left
			else if (this.dir.x == -1) {
				leftdown = this.endLeft;
				rightup = this.pointRight;
			}
			// right
			else {
				leftdown = this.pointLeft;
				rightup = this.endRight;
			}
			/* 坐标系不同*/
			if (rightup.y < leftdown.y) {
				var tmp = rightup.y;
				rightup.y = leftdown.y;
				leftdown.y = tmp;
			}
			if (rightup.x < leftdown.x) {
				var tmp = rightup.x;
				rightup.x = leftdown.x;
				leftdown.x = tmp;
			}
			if (! (leftdown.x > Boss.x + Boss.w ||
				   leftdown.y > Boss.y + Boss.h ||
				   rightup.x < Boss.x ||
				   rightup.y < Boss.y)) {
					Boss.hp -= 3;        /* 激光炮对Boss造成的伤害*/
				}
		} else {  /* 射出的是斜矩形 */      /* 判定复杂度 O(64)*/
			//判断两个矩形的四条线段是否存在相交 
			elementListBoss = new buckets.LinkedList();
			elementListLaser = new buckets.LinkedList();
			elementListBoss.add({p1 : new Victor(Boss.x, Boss.y), p2 : new Victor(Boss.x, Boss.y + Boss.h)});
			elementListBoss.add({p1 : new Victor(Boss.x, Boss.y), p2 : new Victor(Boss.x + Boss.w, Boss.y)});
			elementListBoss.add({p1 : new Victor(Boss.x + Boss.w, Boss.y), p2 : new Victor(Boss.x + Boss.w, Boss.y + Boss.h)});
			elementListBoss.add({p1 : new Victor(Boss.x, Boss.y + Boss.h), p2 : new Victor(Boss.x + Boss.w, Boss.y + Boss.h)});
			elementListLaser.add({p1 : this.pointLeft.clone(), p2 : this.pointRight.clone()});
			elementListLaser.add({p1 : this.pointLeft.clone(), p2 : this.endLeft.clone()});
			elementListLaser.add({p1 : this.endLeft.clone(), p2 : this.endRight.clone()});
			elementListLaser.add({p1 : this.pointRight.clone(), p2 : this.endRight.clone()});
			if (this.isRecIntersect(elementListBoss, elementListLaser) == true) {
				Boss.hp -= 3;        /* 激光炮对Boss造成的伤害*/
			}
		}
	};

	//叉积
	this.vecCross = function(p1, p2) {
		return p1.x * p2.y - p2.x * p1.y;
	};

	this.vecSub = function(p1, p2) {   /* p1 - p2 */
		return p1.clone().subtract(p2.clone()); 
	};

	//两条线段是否相交 
	this.isLineIntersect = function (p1, p2, q1, q2) {
		var d1 = this.vecCross(this.vecSub(p2, p1), this.vecSub(q1, p1));
		var d2 = this.vecCross(this.vecSub(p2, p1), this.vecSub(q2, p1));
		var d3 = this.vecCross(this.vecSub(q2, q1), this.vecSub(p1, q1));
		var d4 = this.vecCross(this.vecSub(q2, q1), this.vecSub(p2, p1));
		if (d1 * d2 < 0 &&
			d3 * d4 < 0) {
			return true;
		} else {
			return false;
		}
	};

	//两个矩形是否相交
	this.isRecIntersect = function (Boss, Laser) {
		for (var i = 0; i < Boss.size(); ++i) {
			var boss = Boss.elementAtIndex(i);
			for (var j = 0; j < Boss.size(); ++j) {
				var laser = Laser.elementAtIndex(j);
				if (this.isLineIntersect(boss.p1.clone(), boss.p2.clone(),
										 laser.p1.clone(), laser.p2.clone())) {
					return true;
				} 
			}
		}
		return false;
	};

};

function Enemy(pos, hp) {
	this.pos = pos;
	this.hp = hp;
	this.size = Math.max(this.hp * 2 + 5, 3); 
	this.speed = Math.max(10 - hp, 1);
	this.isDead = false; /* 判断是否死亡 */
	this.lastTime = 0; 
	this.isArcDefence = 0;
	this.draw = function() {
		ctx.save();
		ctx.fillStyle = "white";
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill();
		ctx.restore();  
	};
	this.update = function(dir) { 
		this.size = Math.max(this.hp * 2 + 5, 3);
		var speed = this.speed;
		if (this.isArcDefence == 1) speed *= -1;    /* 如果此时被圆形护盾抵挡，反向移动 */
		// 向着主角的方向移动 
		this.pos.add(dir.clone().normalize().multiply(new Victor(speed, speed)));
	}; 
	this.done = function() {   /* 判定是否死亡 */ 
		if (this.hp <= 0 || this.isDead == true)  
			return true;
		return false;
	};
	this.isOut = function() {
		if (this.pos.x < 0 || this.pos.x > canvas.width || 
			this.pos.y < 0 || this.pos.y > canvas.height)
			return true;
		return false;
	}
};

// 小怪容器功能函数 
function EnemyCollection(waitTime, /* 生成怪物的时间间隔 */
					     totEnemy  /* 需要生成的怪物总量 */) {    
	Collection.call(this); 
	this.lastTime = 0; 
	this.waitTime = waitTime;  /* 生成怪物的时间间隔 */
	this.totEnemy = totEnemy;   /* 一轮中生成怪物的总量 */
	this.nowEnemy = 0;   /* 当前已经生成的怪物总量 */
	this.rand = function(a, b) { 
		return parseInt(Math.random() * (b - a + 1) + a);  
	}
	this.getDis = function(a, b) {
		return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
	}
	this.work = function(guy, pos) {   /* 如果随机的话 范围 x : [10, 630] y : [10, 730], hp : [4, 10] */
		if (Date.now() - this.lastTime > this.waitTime && this.nowEnemy < this.totEnemy) {
			//一定时间间隔 生成随机小怪 生成的小怪在一定范围内   
			this.addElement(new Enemy(new Victor(pos.x, pos.y), this.rand(1, 10)));    
			this.lastTime = Date.now(); 
			++this.nowEnemy;
		}
		/* 如果小怪物碰到了主人公 那么它直接死亡，主人公掉血 */ 
		if (guy.isArcShieldopen == false) for (var i = 0; i < this.elementList.size(); ++i) {
			var temp = this.elementList.first();
			this.elementList.removeElementAtIndex(0);
			if (this.getDis(temp.pos, guy.pos) < temp.size + guy.w / 2) {
				temp.isDead = true;
				guy.nowHp -= 4;     /* 这里改变被怪物碰到后扣得血 */
				guy.Score -= 1;
				--this.nowEnemy;
			}
			this.addElement(temp);
		}
		//将所有死亡的怪物移除 
		for (var i = 0; i < this.elementList.size(); ++i) {
			var temp = this.elementList.first();
			this.elementList.removeElementAtIndex(0);
			if (temp.done() == true) { 
				guy.Score +=rand(0,3);
				guy.Exp += 1;
			}
			if (!temp.done() && !temp.isOut()) this.addElement(temp);
		}
		this.elementList.forEach(function (obj) {
			var dir = new Victor(guy.pos.x + guy.w / 2 - obj.pos.x, guy.pos.y + guy.h / 2 - obj.pos.y);
			obj.update(dir);
		});
	} 
	this.clear = function() {
		this.nowEnemy=0;
		this.elementList.clear();
	}
	this.setwaitTime = function(x) {
		this.waitTime = x;
	}
	this.settotEnemy = function(x) {
		this.totEnemy = x;
	}
	//函数功能说明
	//clear() 可以用来清除容器内所有怪物 比如回合结束的时候初始化可以用
	/*work()  小怪的调用函数 
	          guy参数表示主人公的对象 用来设定小怪下一帧的方向
	          pos 表示 新生成的小怪的坐标*/
	/*setwaitTime()  设置生成怪物的间隔*/
	/*settotEnemy()  设置生成怪物总量*/
}


/* 怪物站点 */ 
function EnemySite(pos, hp, waitTime) {   
	this.pos = pos;
	this.hp = hp;     
	this.size = Math.max(this.hp * 2 + 5, 3); 
	this.initTime = Date.now(); 
	this.durationTime = 10000; 
	this.lastTime = 0;
	this.waitTime = waitTime;
	this.draw = function() {
		ctx.save();
		ctx.strokeStyle = "white"; 
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.stroke(); 
		ctx.restore();   
	}; 
	this.addMonster = function(enemyCollection) {
		if (Date.now() - this.lastTime > this.waitTime) {
			enemyCollection.addElement(new Enemy(this.pos.clone(), this.hp)); 
			this.lastTime = Date.now();
		} 
	};
	this.done = function() {   /* 判定是否到时间 */ 
		if (Date.now() - this.initTime >= this.durationTime)   
			return true; 
		return false;
	};  
}

function EnemySiteCollection(enemyCollection) {
	Collection.call(this);
	this.enemyCollection = enemyCollection;
	this.work = function() {
		for (var i = 0; i < this.elementList.size(); ++i) {
			var temp = this.elementList.first();
			this.elementList.removeElementAtIndex(0);
			if (temp.done() == true) continue;
			temp.addMonster(this.enemyCollection);
			temp.draw();
			this.addElement(temp);
		}
	};
	this.clear = function() {
			this.elementList.clear();
	}
}


















/* 废弃的功能 */
//原定的想法是圆形作为攻击技能，消灭范围内的怪物，现已废弃
// function ArcBomb(pos, r) {
// 	this.pos = pos;
// 	this.r = r;
// 	this.deltaR = 0;
// 	this.tarR = 100;
// 	this.initTime = Date.now();
// 	this.lastTime = 0;
// 	this.waitTime = 400;
// 	this.draw = function() {
// 		ctx.save();
// 		ctx.fillStyle = "red";
// 		ctx.globalAlpha = 0.2; 
// 		ctx.beginPath();
// 		if (Date.now() - this.initTime > this.waitTime) {
// 			var fps = parseInt(1000 / (Date.now() - this.lastTime));
// 			this.deltaR += 300 / fps; 
// 			ctx.arc(this.pos.x, this.pos.y, this.r + this.deltaR, 0, Math.PI * 2, false);
// 		}
// 		else {
// 			ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2, true);   
// 		}
// 		ctx.fill(); 
// 		ctx.closePath();
// 		ctx.restore();
// 		this.lastTime = Date.now();
// 	};
// 	this.done = function() {
// 		if (this.deltaR >= this.tarR) 
// 			return true;
// 		return false; 
// 	};
// 	this.getDis = function(tar) {
// 		return Math.sqrt(Math.pow(this.pos.x - tar.x, 2) + Math.pow(this.pos.y - tar.y, 2)); 
// 	}
// 	this.attack = function(tar) { 
// 		if (Date.now() - this.initTime < this.waitTime) return;
// 		if (this.getDis(tar.pos) <= this.r + tar.size + this.tarR) tar.isDead = true;
// 	};
// };

// function ArcBombCollection() {
// 	Collection.call(this);
// 	this.work = function() {
// 		this.draw();
// 		this.remove();
// 	};
// };
