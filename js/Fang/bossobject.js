//变量声明
var enterflag=false;
var INCREASE_SPEED = 10;
var NORMAL_SPEED = 0.5;
var GROW_CYCLE = 1*1*1000;
var isGrow=-1;
var GROW_CYCLE2 = 1*10*1000;
var direction = 0;
var SLOWDOWN_SPEED = 3;
// var SUMMONPLACE_HEIGHT = 30; 废弃功能
// var SUMMONPLACE_WIDTH = 10;
var NOWSPEED = 0;

var lastTime = 0;

var SPEEDDOWN_TIME = 0;


function Boss(){//boss类声明
	var t = 0;
	var boom = null;
	var Water = null;

	this.lastTime= Date.now();
	this.CD = 1.5*1000; 

	this.up = false;
	this.down = false;
	this.left = false;
	this.right = false;

	this.speed = NORMAL_SPEED;
	this.fullhp = 1000;
	this.hp = this.fullhp;
	this.damage = -5;//boss伤害系数

	this.ability = 0;
	this.using = 0;
	this.dire = 1;

	this.boomTime = 3*1000;
	this.totalBoom = 0;
	this.lastHitTime = 0;
	
	this.w = 0;
	this.h = 0;
	this.x = canvas.width/2-this.w/2;
	this.y = canvas.height/3;

	this.move = function(){//boss常规移动
		var flag = 1;
		if(this.up==true) this.y -= this.speed;
		if(this.down==true) this.y += this.speed;
		if(this.left==true) this.x -= this.speed;
		if(this.right==true) this.x += this.speed;

		if(this.x<0) {this.x = 0; flag=0;}
		if(this.y<0) {this.y = 0; flag=0;}
		if(this.x>canvas.width-this.w) {this.x=canvas.width-this.w; flag=0;}
		if(this.y>canvas.height-this.h) {this.y=canvas.height-this.h; flag=0;}
		return flag;
	};

	this.autoMove = function(guyX,guyY){//boss自律移动
		this.left = false; this.right = false; this.up = false; this.down = false;
		if(this.x<guyX)
			this.right = true;
		else if(this.x>guyX)
			this.left = true;
		if(this.y<guyY)
			this.down = true;
		else if(this.y>guyY)
			this.up = true;
		this.move();
		//console.log("autoMoving");
	};

	this.draw = function(){//绘制boss形象
		ctx.save();
		ctx.fillStyle = "green";
		ctx.fillRect(this.x,this.y,this.w,this.h);
		ctx.fillStyle = "black";
		ctx.fillRect(this.x,this.y+this.h/3,this.w,this.h/3);
		ctx.restore();
	};

	this.gameover = function(){

	};

	this.isDead = function(){//判断boss死亡
		if(this.hp>0)
			return false;
		else
			return true;
	};

	this.work = function(){//每一帧boss需要做的事情
		this.draw();
		if(Date.now() - SPEEDDOWN_TIME <=5*1000)
			guy.speed = 1;
		else
			guy.speed = 4;
		if(enterflag==true){
			if(this.attack()==true && Date.now()-this.lastHitTime>=0.25*1000){
				guy.nowHp -= this.damage/5;
				this.lastHitTime = Date.now();
			}
			if(this.isDead()==false){
				if(Date.now() - this.lastTime>=this.CD){
					this.ability = parseInt(Math.random()*100);//设置几率随机出招
					//this.dire = parseInt(Math.random()*4);
					this.dire = this.getAttackDirection((guy.pos.x*2+guy.w)/2,(guy.pos.y*2+guy.h)/2);//获取攻击方向
					if(this.ability < 30)
						this.using = 1;
					else if(this.ability < 60)
						this.using = 2;
					else if(this.ability < 75)
						this.using = 3;
					else 
						this.using = 4;
					this.lastTime = Date.now();
				}
				//console.log("using:",this.using);
				if(this.using == 0){
					this.autoMove(guy.pos.x,guy.pos.y);
				}
				else 
					this.useAbility(this.using);
			}
			else
				this.gameover();
		}
		else{
			if(boss.w>=100)isGrow=1;
			if(isGrow==0)//boss快速成长
			{
				if(Date.now() - this.lastTime>=GROW_CYCLE){
					this.grow(1);
					this.lastTime = Date.now();
				}
			}else//boss慢速成长
			{
				if(Date.now() - this.lastTime>=GROW_CYCLE2){
					this.grow(0);
					this.lastTime = Date.now();
				}
			}	
		}
	};

	this.grow = function(flag){//boss成长
		if(flag)
		{
			this.w += 5;
			this.h += 5;
			this.x -= 2.5;
			this.y -= 2.5;
			this.fullhp += 5;
			this.hp += this.hp<this.fullhp?6:0;
			this.damage += 1;
		}
		else
		{
			this.w += 2;
			this.h += 2;
			this.x -= 1;
			this.y -= 1;
			this.fullhp += 50;
			this.hp += this.hp<this.fullhp?51:0;
			this.damage += 1;
		}
	};

	this.useAbility = function(mode){//boss施放技能
		// this.charging(mode);
		// this.charged();
		if(mode==1){
			this.hit(this.dire);
			if(this.move()== 0)
			{ 
				this.using = 0;
				this.speed = NORMAL_SPEED;
				this.lastTime = Date.now();
			}
		}
		else if(mode==2){
			if(this.boom((guy.pos.x*2+guy.w)/2,(guy.pos.y*2+guy.h)/2)==1)
			{
				this.using = 0;
				this.lastTime = Date.now();
			}
		}
		else if (mode==3){
			this.shootWater();
		}
		else if (mode==4){
			if (enemySiteCollection.elementList.size() <= 2)
				enemySiteCollection.addElement(new EnemySite(new Victor(rand(10, 630), rand(10, 730)), rand(3, 10), 1000));//调用接口生成召唤怪物的点
			else
			{
				this.using = 0;
				this.lastTime = Date.now();
			}
		}
	};




	this.getAttackDirection = function(guyX,guyY){//根据人物坐标判断攻击方向
		if(Math.abs((this.x+this.w)/2 - guyX)>=
			Math.abs((this.y+this.h)/2 - guyY)){
			if((this.x*2+this.w)/2<=guyX){//right
				return 0;
			}
			else{//left
				return 1;
			}
		}
		else{//down
			if((this.y*2+this.h)/2<=guyY){
				return 2;
			}
			else{//up
				return 3;
			}
		}
	};

	this.hit = function(direction){//boss撞击功能
		this.speed = INCREASE_SPEED;
		if(direction == 0) {this.left=false; this.right=true; this.up=false; this.down=false;}
		if(direction == 1) {this.left=true; this.right=false; this.up=false; this.down=false;}
		if(direction == 2) {this.left=false; this.right=false; this.up=false; this.down=true;}
		if(direction == 3) {this.left=false; this.right=false; this.up=true; this.down=false;}
	};


	this.boom = function(guyX,guyY){//boss施放延迟炸弹
		var flag=0;
		if(boom == null)
			boom = new waterBoom(guyX,guyY);
			if(boom.work()==true){
				flag = 1;
				if(boom.attack(guy.pos.x,guy.pos.y,guy.w,guy.h)==true)
					guy.nowHp -= boss.damage;
				boom = null;
			}
		return flag;
	};

	this.shootWater = function(){//boss吐泥减速
		if(Water==null)
			Water = new slowdownWater((guy.pos.x*2+guy.w)/2,(guy.pos.y*2+guy.h)/2);
		if(Water.left==false && Water.right==false && Water.up==false && Water.down==false)
			Water.getAttackDirection();
		if(Water.isOut()==true)
		{
			
			Water = null;
			this.using = 0;
			this.lastTime = Date.now();
		}
		else
		{
			Water.work();
			//console.log(guy);
		}
	};

	this.attack = function(){//攻击判定
		if (guy.pos.x>this.x-guy.w && guy.pos.x<this.x+this.w &&
			guy.pos.y>this.y-guy.h && guy.pos.y<this.y+this.h)
			return true;
		return false;
	}
}

function waterBoom(guyX,guyY){//炸弹类声明
	this.x = guyX;
	this.y = guyY;
	this.r = 30;
	this.damage = 30;
	this.alpha = 0;
	
	this.createTime = Date.now();
	this.waitTime = 0.5*1000;
	this.lastTime = 0;
	this.display = true;

	this.draw = function() {
		var fps = parseInt(1000 / (Date.now() - this.lastTime));
		this.alpha += 1000/fps/this.waitTime;//透明度随时间变化
		ctx.save();
		ctx.fillStyle = "rgba(0,0,0,"+this.alpha+")";
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);   
		ctx.fill(); 
		ctx.closePath();
		ctx.restore();
		this.lastTime = Date.now();
	};

	this.done = function(){
		if(Date.now() - this.createTime >= this.waitTime){
			this.display = false;
			return true;
		}
		return false;
	};

	this.work = function(){//每一帧炸弹要做的事情
		var flag = false;
		this.done();
		if(this.display == true)
			this.draw();
		else
		{
			flag = true;
		}
		return flag;	
	}

	this.attack = function(guyX,guyY,guyW,guyH){//伤害判定
	//	console.log("worked");
		var flag = false;
		var centerX = (guyX*2+guyW)/2;
		var centerY = (guyY*2+guyH)/2;
		var y1 = this.y+Math.sqrt(this.r*this.r-(centerX-this.x)*(centerX-this.x));
		var y2 = this.y-Math.sqrt(this.r*this.r-(centerX-this.x)*(centerX-this.x));
		if ((centerY>=y1&&centerY<=y2)||(centerY>=y2&&centerY<=y1))
			flag = true;
		return flag;
	}

}

// function summonPlace(x,y){ 废弃功能，本来用于建造怪物召唤点
// 	this.x = x;
// 	this.y = y;
// 	this.w = SUMMONPLACE_WIDTH;
// 	this.h = SUMMONPLACE_HEIGHT;
// 	this.colour = "#5B5B5B";

// 	if(this.x+this.w>canvas.width)
// 		this.x=canvas.width-this.w;
// 	if(this.y+this.h>canvas.height)
// 		this.y=canvas.height-this.h;

// 	this.fullhp = 60;
// 	this.hp = this.fullhp;
// 	this.summonTime = 0.5*1000;
// 	this.lastTime = 0;

// 	this.draw = function(){
// 		ctx.save();
// 		ctx.fillStyle = this.colour;
// 		ctx.fillRect(this.x,this.y,this.w,this.h);
// 		ctx.strokeStyle = "black";
// 		ctx.restore();
// 	};

// 	this.work = function(){
// 		this.draw();
// 		if(Date.now()-this.lastTime>= this.summonTime)
// 		{
// 			this.summonMonsters();
// 			this.lastTime = Date.now();
// 		}
// 	};

// 	this.summonMonsters = function(){

// 	};

// 	this.isDestoried = function(){
// 		if (this.hp<=0)
// 			return true;
// 		return false;
// 	}
// }

function slowdownWater(guyX,guyY){//减速泥类声明
	this.targetX = guyX;
	this.targetY = guyY;
	this.x = (boss.x*2+boss.w)/2;
	this.y = (boss.y*2+boss.h)/2;

	this.left = false;
	this.right = false;
	this.up = false;
	this.down = false;

	this.speed = 4;
	this.r = 50;

	this.draw = function(){//绘制
		ctx.save();
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
		ctx.fillStyle = "#737373";
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	};

	this.move = function(){//泥的移动
		// var flag = 1;
		if(this.up==true) this.y -= this.speed;	
		if(this.down==true) this.y += this.speed;
		if(this.left==true) this.x -= this.speed;
		if(this.right==true) this.x += this.speed;
	};

	this.getAttackDirection = function(){//根据人物的位置判断攻击方向
		if (this.x<=this.targetX)
			this.right = true;
		else if(this.x>this.targetX)
			this.left = true;
		if(this.y<=this.targetY)
			this.down = true;
		else if(this.y>this.targetY)
			this.up = true;	
	};

	this.work = function(){//每一帧泥需要做的事情
		this.draw();
		this.move();
		if(this.attack(guy.pos.x,guy.pos.y,guy.w,guy.h) == true){
			SPEEDDOWN_TIME = Date.now();
		}
		//if(Date.now() - this.lastTime <= this.lastingTime){
		//	guy.speed = 1;
		//}
		//else 
		//	guy.speed = 4;
	};

	this.isOut = function(){//判断泥是否超出可视范围
		if(this.x<-1*this.r||
			this.x>canvas.width+this.r||
			this.y<-1*this.r||
			this.y>canvas.height+this.r)
			return true;
		return false;
	};

	this.attack = function(guyX,guyY,guyW,guyH){//碰撞判定
		//console.log("worked");
		var flag = false;
		var centerX = (guyX*2+guyW)/2;
		var centerY = (guyY*2+guyH)/2;
		var y1 = this.y+Math.sqrt(this.r*this.r-(centerX-this.x)*(centerX-this.x));
		var y2 = this.y-Math.sqrt(this.r*this.r-(centerX-this.x)*(centerX-this.x));
		if ((centerY>=y1&&centerY<=y2)||(centerY>=y2&&centerY<=y1))
			flag = true;
		return flag;
	}

}


function rand(a, b) { //随机数函数
	return parseInt(Math.random() * (b - a + 1) + a); 
}
