/*
 Function  : Final project_mainGame
 Author    : Ripndip
 Build_Date: Jan. 3, 2019 
 Version   : 2.0
 */ 
//函数定义块...........................................................

//游戏主模式函数定义块...........................................................
//单人游戏模式函数
function singlePlay()
{	
	//光环动态效果时间更新
	cutsceneTime=+new Date();
	
	//判断是否死亡
	if(guy.isDead())
	{
		//移除相应的事件
		window.removeEventListener("keydown",solokeydown);
		window.removeEventListener("keyup",solokeyup);
		window.removeEventListener("keydown",keySoloStart);
		
		//增加单人死亡事件
		canvas2.addEventListener("mousedown",soloRestart);
		canvas2.addEventListener("mousemove",buttonRestart);
		
		//过场动画
		cutsceneTime=0;
		failCutscene();
	}else if(boss.isDead())
	{
		//移除相应的事件
		window.removeEventListener("keydown",solokeydown);
		window.removeEventListener("keyup",solokeyup);
		window.removeEventListener("keydown",keySoloStart);
		
		//增加单人死亡事件
		canvas2.addEventListener("mousedown",winRestart);
		canvas2.addEventListener("mousemove",buttonWinRestart);
		
		//过场动画
		cutsceneTime=0;
		winCutscene();
	}else
	{
		//绘制背景色
		drawCover(canvas2,ctx2);
		drawCover(canvas1,ctx1);
		
		//判定guy的位置
		if(guy.place==1)
		{
			canvas=canvas1;
			ctx=ctx1;
			
			drawState(canvas,ctx,guy,gamemode);//状态绘制
			drawHint(canvas,ctx,guy,0);//提示语绘制
			
			guy.work(enemyCollection);//人物的行动
			if(isBattle!=1)
				guy.nowMp=fixedMp1;
			if(isBattle==1)//战斗场景中
			{
				if(gameTime)//如果本回合时间剩余
				{
					//判定一秒
					if(Date.now()-LastTime>=1000)
					{
						LastTime=+new Date();
						gameTime--;		
					}
					
					//敌人行动并绘画
					enemyCollection.work(guy, {x : rand(10, 630), y : rand(10, 730)});
					enemyCollection.draw();
				}else
				{
					isBattle=2;//否则，行动阶段更改
					fixedMp1=guy.nowMp;
				}
			}
			
			//绘制光环效果
			drawEllipseCutscene(canvas,ctx,guy,1);
			
			canvas=canvas2;
			ctx=ctx2;
			boss.work();
			
			requestAnimationFrame(singlePlay);
		}else  
		{
			canvas=canvas2;
			ctx=ctx2;
			isBattle=1;
			
			drawState(canvas,ctx,guy,gamemode);
			drawHint(canvas,ctx,guy,0);
			guy.work(enemyCollection3);
			guy.workBoss(boss);    /* Dup4: 新添加方法 对Boss攻击*/
			
			if(boss.hp<boss.fullhp/2)
			{
				if(music.currentTime==0)
					music.play();
			}
			
			if(gameTime)//如果本回合时间剩余
			{
				//判定一秒
				if(Date.now()-LastTime>=1000)
				{
					LastTime=+new Date();
					gameTime--;		
				}
	
				//敌人行动并绘画
				boss.work();
				enemySiteCollection.work();
				enemyCollection3.work(guy, {x : rand(10, 630), y : rand(10, 730)});  
				enemyCollection3.draw();
			}else
			{
				enemyCollection3.clear();
				enemySiteCollection.clear();
				isBattle=2;
				gameTimes--;
				guy.place=1;
				enterflag = false;
			}
			requestAnimationFrame(singlePlay);
		}
		
	}
}

//双人游戏模式函数
function doublePlay()
{
	cutsceneTime=+new Date();
	
	if(guy.isDead()||guy2.isDead())
	{
		window.removeEventListener("keydown",doublekeydown);
		window.removeEventListener("keyup",doublekeyup);
		window.removeEventListener("keydown",keyDoubleStart);
		if(guy.isDead())
		{
			canvas1.addEventListener("mousedown",doubleRestart);
			canvas1.addEventListener("mousemove",buttonDoubleRestart);
		}
		else{
			canvas2.addEventListener("mousedown",doubleRestart);
			canvas2.addEventListener("mousemove",buttonDoubleRestart);
		}
		cutsceneTime=0;
		failCutscene();
	}else
	{
		//双人回蓝机制
		if(guy.nowMp<guy.maxMp)
			guy.nowMp+=guy.maxMp/1000;
		if(guy2.nowMp<guy2.maxMp)
			guy2.nowMp+=guy2.maxMp/1000;
		
		//canvas1相关绘制
		canvas=canvas1;
		ctx=ctx1;
		
		drawCover(canvas,ctx);
		drawState(canvas,ctx,guy,gamemode);
		drawHint(canvas,ctx,guy,1);
		
		guy.work(enemyCollection);
		drawEllipseCutscene(canvas,ctx,guy,0);
		
		if(isFirstPend)
			drawPend(canvas,ctx);


		//canvas2相关绘制
		canvas=canvas2;
		ctx=ctx2;
		
		drawCover(canvas,ctx);
		drawState(canvas,ctx,guy2,gamemode);
		drawHint(canvas,ctx,guy2,2);
		
		guy2.work(enemyCollection2);
		
		drawEllipseCutscene(canvas,ctx,guy2,0);
		
		if(isSecondPend)
			drawPend(canvas,ctx);
		
		if(isBattle!=1)
		{
			guy.nowMp=fixedMp1;
			guy2.nowMp=fixedMp2;
		}
		if(isBattle==1)
		{
			if(gameTime)
			{
				if(Date.now()-LastTime>=1000)
				{
					LastTime=+new Date();
					gameTime--;		
				}
				
				canvas=canvas1;
				ctx=ctx1;
				enemyCollection.work(guy, {x : rand(10, 630), y : rand(10, 730)});
				enemyCollection.draw();
				
				canvas=canvas2;
				ctx=ctx2;
				enemyCollection2.work(guy2, {x : rand(10, 630), y : rand(10, 730)});
				enemyCollection2.draw();
			}else
			{
				isBattle=2;
				fixedMp1=guy.nowMp;
				fixedMp2=guy2.nowMp;
			}
		}
		requestAnimationFrame(doublePlay);
	}
}

//游戏函数定义块...........................................................

//绘制背景函数
function drawCover(canvas,ctx)
{
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.fillStyle=backgroundColor;
	ctx.fillRect(0,0,canvas.width,canvas.height);
}

//绘制状态函数
function drawState(canvas,ctx,guy,gamemode)
{
	ctx.fillStyle="white";
	ctx.font="20px Arial";
	
	//设置属性文字
	ctx.textAlign="center";
	ctx.textBaseline="middle";
	ctx.fillText("MP :",30,canvas.height-20);
	ctx.fillText("HP :",30,canvas.height-50);
	ctx.fillText("Ex :",30,canvas.height-80);
	ctx.fillText("Lv :",30,canvas.height-110);
	
	//等级数字
	ctx.textAlign="start";
	ctx.textBaseline="top";
	ctx.fillText(""+parseInt(guy.lv),60,canvas.height-120);
	
	//血量条
	ctx.strokeStyle="white";
	ctx.strokeRect(60,canvas.height-60,guy.maxHp,20);
	ctx.fillStyle="#f391a9";
	ctx.fillRect(60,canvas.height-60,guy.nowHp,20);
	
	//蓝量条
	ctx.strokeRect(60,canvas.height-30,guy.maxMp,20);
	ctx.fillStyle="#90d7ec";
	ctx.fillRect(60,canvas.height-30,guy.nowMp,20);

	//经验条
	ctx.strokeRect(60,canvas.height-90,Math.min(200+guy.lv*20,560),20);
	ctx.fillStyle="#faa755";
	ctx.fillRect(60,canvas.height-90,guy.Exp,20);
	
	//判断是否单人
	if(gamemode==1)
	{
		if(guy.place==1)
		{
			//Boss进度条
			ctx.strokeRect(canvas.width/2-200,100,400,20);
			ctx.fillStyle="#abc88b";
			ctx.fillRect(canvas.width/2-200,100,Math.min(guy.Score-soloScore,800)/2,20);
		}else
		{
			//Boss血量条
			ctx.strokeRect(canvas.width/2-200,100,400,20);
			ctx.fillStyle="red";
			ctx.fillRect(canvas.width/2-200,100,boss.hp/boss.fullhp*400,20);
		}
	}
}

//绘制提示文字
function drawHint(canvas,ctx,guy,flag)
{
	if(isBattle==0)//判断游戏阶段
	{
		
		//显示回合数文字
		ctx.fillStyle="white";
		ctx.textAlign="center";
		ctx.textBaseline="top";
		ctx.font="50px 黑体";
		ctx.fillText("Wait",canvas.width/2,0);
		ctx.font="30px 黑体";
		ctx.fillText("Score: "+guy.Score,canvas.width/2,50);
		ctx.textAlign="left";
		ctx.fillText("回合数:"+gameTimes,20,20);

		//显示提示语文字
		ctx.fillStyle="white";
		ctx.textAlign="center";
		ctx.textBaseline="middle";
		ctx.font="30px 黑体";
		if(flag==2)
			ctx.fillText("站在白圈内并按下回车键开始",canvas.width/2,canvas.height/4);
		else
			ctx.fillText("站在白圈内并按下空格键开始",canvas.width/2,canvas.height/4);
		
		//下划线
		ctx.beginPath();
		ctx.lineWidth=3;
		ctx.lineCap="round";
		ctx.strokeStyle="white";
		ctx.moveTo(canvas.width/2-180,canvas.height/4+30);
		ctx.lineTo(canvas.width/2+180,canvas.height/4+30);
		ctx.stroke();
		ctx.closePath();

		//提示操作按钮 flag判断游戏模式
		if(flag==0)
		{
			ctx.strokeStyle="white";
			ctx.fillStyle="white";
			ctx.font-"10px 黑体";
			ctx.textAlign="left";
			ctx.textBaseline="top";
			ctx.strokeRect(canvas.width/4,canvas.height/2,30,30);
			ctx.fillText("2",canvas.width/4+7,canvas.height/2);
			ctx.strokeRect(canvas.width/4-35,canvas.height/2,30,30);
			ctx.fillText("1",canvas.width/4-28,canvas.height/2);
			ctx.strokeRect(canvas.width/4,canvas.height/2+35,30,30);
			ctx.fillText("W",canvas.width/4+7,canvas.height/2+35);
			ctx.strokeRect(canvas.width/4,canvas.height/2+70,30,30);
			ctx.fillText("S",canvas.width/4+7,canvas.height/2+70);
			ctx.strokeRect(canvas.width/4-35,canvas.height/2+70,30,30);
			ctx.fillText("A",canvas.width/4-28,canvas.height/2+70);
			ctx.strokeRect(canvas.width/4+35,canvas.height/2+70,30,30);
			ctx.fillText("D",canvas.width/4+42,canvas.height/2+70);

			ctx.strokeRect(3*canvas.width/4-35,canvas.height/2+35,30,30);
			ctx.fillText("I",3*canvas.width/4-28,canvas.height/2+35);
			ctx.strokeRect(3*canvas.width/4-35,canvas.height/2+70,30,30);
			ctx.fillText("K",3*canvas.width/4-28,canvas.height/2+70);
			ctx.strokeRect(3*canvas.width/4-70,canvas.height/2+70,30,30);
			ctx.fillText("J",3*canvas.width/4-63,canvas.height/2+70);
			ctx.strokeRect(3*canvas.width/4,canvas.height/2+70,30,30);
			ctx.fillText("L",3*canvas.width/4+7,canvas.height/2+70);
			ctx.strokeRect(3*canvas.width/4-70,canvas.height/2+35,30,30);
			ctx.fillText("U",3*canvas.width/4-63,canvas.height/2+35);
		}else if(flag==1)
		{
			ctx.strokeStyle="white";
			ctx.fillStyle="white";
			ctx.font-"10px 黑体";
			ctx.textAlign="left";
			ctx.textBaseline="top";
			ctx.strokeRect(canvas.width/4,canvas.height/2+35,30,30);
			ctx.fillText("W",canvas.width/4+7,canvas.height/2+35);
			ctx.strokeRect(canvas.width/4,canvas.height/2+70,30,30);
			ctx.fillText("S",canvas.width/4+7,canvas.height/2+70);
			ctx.strokeRect(canvas.width/4-35,canvas.height/2+70,30,30);
			ctx.fillText("A",canvas.width/4-28,canvas.height/2+70);
			ctx.strokeRect(canvas.width/4+35,canvas.height/2+70,30,30);
			ctx.fillText("D",canvas.width/4+42,canvas.height/2+70);
			
			ctx.strokeRect(3*canvas.width/4-35,canvas.height/2+70,30,30);
			ctx.fillText("K",3*canvas.width/4-28,canvas.height/2+70);
			ctx.strokeRect(3*canvas.width/4-70,canvas.height/2+70,30,30);
			ctx.fillText("J",3*canvas.width/4-63,canvas.height/2+70);
			ctx.strokeRect(3*canvas.width/4,canvas.height/2+70,30,30);
			ctx.fillText("L",3*canvas.width/4+7,canvas.height/2+70);
		}else if(flag==2)
		{
			ctx.strokeStyle="white";
			ctx.fillStyle="white";
			ctx.font-"10px 黑体";
			ctx.textAlign="left";
			ctx.textBaseline="top";
			ctx.strokeRect(canvas.width/4,canvas.height/2+35,30,30);
			ctx.fillText("↑",canvas.width/4,canvas.height/2+35);
			ctx.strokeRect(canvas.width/4,canvas.height/2+70,30,30);
			ctx.fillText("↓",canvas.width/4,canvas.height/2+70);
			ctx.strokeRect(canvas.width/4-35,canvas.height/2+70,30,30);
			ctx.fillText("←",canvas.width/4-35,canvas.height/2+70);
			ctx.strokeRect(canvas.width/4+35,canvas.height/2+70,30,30);
			ctx.fillText("→",canvas.width/4+35,canvas.height/2+70);
			
			ctx.strokeRect(3*canvas.width/4-35,canvas.height/2+70,30,30);
			ctx.fillText("2",3*canvas.width/4-28,canvas.height/2+70);
			ctx.strokeRect(3*canvas.width/4-70,canvas.height/2+70,30,30);
			ctx.fillText("1",3*canvas.width/4-63,canvas.height/2+70);
			ctx.strokeRect(3*canvas.width/4,canvas.height/2+70,30,30);
			ctx.fillText("3",3*canvas.width/4+7,canvas.height/2+70);
		}
		
		//显示提示语文字
		ctx.fillStyle="white";
		ctx.textAlign="center";
		ctx.textBaseline="middle";
		ctx.font="30px 黑体";
		ctx.fillText("请通过以上按钮尝试移动和释放技能",canvas.width/2,3*canvas.height/4);
	
		//下划线
		ctx.beginPath();
		ctx.lineWidth=3;
		ctx.lineCap="round";
		ctx.strokeStyle="white";
		ctx.moveTo(canvas.width/2-240,3*canvas.height/4+30);
		ctx.lineTo(canvas.width/2+240,3*canvas.height/4+30);
		ctx.stroke();
		ctx.closePath();

	}else if(isBattle==1)//游戏战斗阶段
	{
		//显示分数 回合数等
		ctx.lineWidth=3;
		ctx.fillStyle="white";
		ctx.textAlign="center";
		ctx.textBaseline="top";
		ctx.font="50px 黑体";
		ctx.fillText(""+gameTime,canvas.width/2,0);
		ctx.font="30px 黑体";
		ctx.fillText("Score: "+guy.Score,canvas.width/2,50);
		if(guy.place==1)
		{
			//不打BOSS时显示
			ctx.textAlign="left";
			ctx.font="30px 黑体";
			ctx.fillText("回合数:"+gameTimes,20,20);
		}
	}else//游戏回合结束阶段
	{
		//显示回合数文字
		enemyCollection.clear();
		ctx.fillStyle="white";
		ctx.textAlign="center";
		ctx.textBaseline="top";
		ctx.font="50px 黑体";
		ctx.fillText("Wait",canvas.width/2,0);
		ctx.font="30px 黑体";
		ctx.fillText("Score: "+guy.Score,canvas.width/2,50);
		ctx.textAlign="left";
		ctx.font="30px 黑体";
		ctx.fillText("回合数:"+gameTimes,20,20);
		
		//显示提示文字
		ctx.fillStyle="white";
		ctx.textAlign="center";
		ctx.textBaseline="middle";
		ctx.font="30px 黑体";
		ctx.fillText("选择相应圈并按下空格键以开始下一回合",canvas.width/2,canvas.height/4);
		
		ctx.beginPath();
		ctx.lineWidth=3;
		ctx.lineCap="round";
		ctx.strokeStyle="white";
		ctx.moveTo(canvas.width/2-260,canvas.height/4+30);
		ctx.lineTo(canvas.width/2+260,canvas.height/4+30);
		ctx.stroke();
		ctx.closePath();

		
		ctx.textAlign="center";
		ctx.textBaseline="middle";
		ctx.font="30px 黑体";
		ctx.fillStyle="#f391a9";
		ctx.fillText("这是一个回血的传送门",canvas.width/4,canvas.height/2+60);
		ctx.fillStyle="#90d7ec";
		ctx.fillText("这是一个回蓝的传送门",3*canvas.width/4,canvas.height/2+60);
		ctx.fillStyle="white";
		ctx.fillText("选择一个传送门以进入下个回合",canvas.width/2,3*canvas.height/4);

		ctx.beginPath();
		ctx.lineWidth=3;
		ctx.lineCap="round";
		ctx.strokeStyle="white";
		ctx.moveTo(canvas.width/2-220,3*canvas.height/4+30);
		ctx.lineTo(canvas.width/2+220,3*canvas.height/4+30);
		ctx.stroke();
		ctx.closePath();
	}
}

//绘制单个椭圆
function BezierEllipse(context, x, y, a, b){
        //关键是bezierCurveTo中两个控制点的设置
        //0.5和0.6是两个关键系数（在本函数中为试验而得）
        var ox = 0.5 * a,
        oy = 0.6 * b;
        context.save();
        context.translate(x, y);
        context.beginPath();
        //从椭圆纵轴下端开始逆时针方向绘制
        context.moveTo(0, b); 
        context.bezierCurveTo(ox, b, a, oy, a, 0);
        context.bezierCurveTo(a, -oy, ox, -b, 0, -b);
        context.bezierCurveTo(-ox, -b, -a, -oy, -a, 0);
        context.bezierCurveTo(-a, oy, -ox, b, 0, b);
        context.closePath();
        context.stroke();
        context.restore();
};

//绘制单个动态光环框
function drwaEllipse(canvas,ctx,x,y,color)
{
	ctx.lineWidth=3;
	ctx.strokeStyle=color;
	if(cutsceneTime%1000<330)
		BezierEllipse(ctx,x,y,20,5);
	else if(cutsceneTime%1000<660)
	{
		ctx.save();
		ctx.globalAlpha=0.5;
		BezierEllipse(ctx,x,y,20,5);
		ctx.restore();
		BezierEllipse(ctx,x,y,30,7.5);
	}
	else
	{
		ctx.save();
		ctx.globalAlpha=0.25;
		BezierEllipse(ctx,x,y,20,5);
		ctx.restore();
		ctx.save();
		ctx.globalAlpha=0.5;
		BezierEllipse(ctx,x,y,30,7.5);
		ctx.restore();
		BezierEllipse(ctx,x,y,40,10);
	}
}

//绘制光环动画
function drawEllipseCutscene(canvas,ctx,guy,flag)
{
	//判定战斗阶段
	if(isBattle==2)
	{
		drwaEllipse(canvas,ctx,canvas.width/2-90,canvas.height/2,"#f391a9");
		drwaEllipse(canvas,ctx,canvas.width/2+90,canvas.height/2,"#90d7ec");
	}else if(isBattle==0)
		drwaEllipse(canvas,ctx,canvas.width/2,canvas.height/2-90,"white");
	
	//判定是否开启BOSS传送门
	if(guy.Score-soloScore>=800&&flag==1)
		drwaEllipse(canvas,ctx,canvas.width/2,canvas.height/2-90,"#abc88b");
}

//绘制等待标识
function drawPend(canvas,ctx)
{
	ctx.fillStyle="#faa755";
	ctx.strokeStyle="white";
	ctx.font="80px Arial";
	ctx.textAlign="center";
	ctx.textBaseline="middle";
	ctx.strokeText("Pend",canvas.width/2,canvas.height/2);
	ctx.fillText("Pend",canvas.width/2,canvas.height/2);
}

//事件注册块...........................................................
//单人移动和射击
function solokeydown(e){
	if (e.keyCode == 87) guy.moveUp = true; 
	if (e.keyCode == 83) guy.moveDown = true; 
	if (e.keyCode == 65) guy.moveLeft = true;
	if (e.keyCode == 68) guy.moveRight = true; 
	if (e.keyCode == 73) guy.shootUp = true; 
	if (e.keyCode == 75) guy.shootDown = true;
	if (e.keyCode == 74) guy.shootLeft = true;
	if (e.keyCode == 76) guy.shootRight = true; 
	if (e.keyCode == 85&& guy.isLaser == 0) guy.isLaser = 1;
} 

function solokeyup(e){
	if (e.keyCode == 87) guy.moveUp = false; 
	if (e.keyCode == 83) guy.moveDown = false;
	if (e.keyCode == 65) guy.moveLeft = false;
	if (e.keyCode == 68) guy.moveRight = false;   
	if (e.keyCode == 73) guy.shootUp = false;
	if (e.keyCode == 75) guy.shootDown = false;
	if (e.keyCode == 74) guy.shootLeft = false;
	if (e.keyCode == 76) guy.shootRight = false;
	if (e.keyCode == 49) guy.isRectangleBomb = true;
	if (e.keyCode == 50) guy.isArcShieldopen ^= 1;
	if (e.keyCode == 85&& guy.isLaser == 1) guy.isLaser = 2;
}

//双人移动和射击
function doublekeydown(e){
	if (e.keyCode == 38) guy2.moveUp = true; 
	if (e.keyCode == 40) guy2.moveDown = true; 
	if (e.keyCode == 37) guy2.moveLeft = true;
	if (e.keyCode == 39) guy2.moveRight = true; 
	if (e.keyCode == 99&& guy2.isLaser == 0) guy2.isLaser = 1;
	if (e.keyCode == 87) guy.moveUp = true; 
	if (e.keyCode == 83) guy.moveDown = true;
	if (e.keyCode == 65) guy.moveLeft = true;
	if (e.keyCode == 68) guy.moveRight = true; 
	if (e.keyCode == 76&& guy.isLaser == 0) guy.isLaser = 1;
} 

function doublekeyup(e){
	if (e.keyCode == 38) guy2.moveUp = false; 
	if (e.keyCode == 40) guy2.moveDown = false; 
	if (e.keyCode == 37) guy2.moveLeft = false;
	if (e.keyCode == 39) guy2.moveRight = false; 
	if (e.keyCode == 97) guy2.isRectangleBomb = true;
	if (e.keyCode == 98) guy2.isArcShieldopen ^= 1;
	if (e.keyCode == 99&& guy2.isLaser == 1) guy2.isLaser = 2;
	if (e.keyCode == 87) guy.moveUp = false; 
	if (e.keyCode == 83) guy.moveDown = false;
	if (e.keyCode == 65) guy.moveLeft = false;
	if (e.keyCode == 68) guy.moveRight = false; 
	if (e.keyCode == 74) guy.isRectangleBomb = true;
	if (e.keyCode == 75) guy.isArcShieldopen ^= 1;
	if (e.keyCode == 76&& guy.isLaser == 1) guy.isLaser = 2;
}

//单人开始按钮
function keySoloStart(e){
	
	if(guy.pos.x>=canvas1.width/2-30&&guy.pos.x<=canvas1.width/2+30&&
	   guy.pos.y>=canvas1.height/2-105&&guy.pos.y<=canvas1.height/2-75&&e.which==32&&isBattle==0 )//判定白色开始光环位置
	{
		isBattle=1;//战斗阶段更新
		
		LastTime=+new Date();//时间判定更新
		
		//游戏回合和游戏时间更新
		gameTime=20+gameTimes*5;
		gameTimes++;
		isGrow=0;
	}else if(guy.pos.x>=canvas1.width/2+60&&guy.pos.x<=canvas1.width/2+120&&
	   guy.pos.y>=canvas1.height/2-15&&guy.pos.y<=canvas1.height/2+15&&e.which==32&&isBattle==2)//判定蓝色光环位置
	{
		isBattle=1;//战斗阶段更新
		
		LastTime=+new Date();//时间判定更新
		
		//游戏回合和游戏时间更新
		gameTime=20+gameTimes*5;
		gameTimes++;
		
		//光环选择后的状态更新
		guy.maxMp+=20;
		guy.nowMp+=20;
		
		enemyCollection.clear();//敌军属性清除
		enemyCollection.setwaitTime(Math.max(waitTime-gameTimes*25,50));//敌军更新频率加快
		totEnemy=Math.min(totEnemy*2,Number.MAX_VALUE/2-1);
		enemyCollection.settotEnemy(totEnemy);//敌军数量翻倍
		
	}else if(guy.pos.x>=canvas1.width/2-120&&guy.pos.x<=canvas1.width/2-60&&
	   guy.pos.y>=canvas1.height/2-15&&guy.pos.y<=canvas1.height/2+15&&e.which==32&&isBattle==2)//判定红色光环位置
	{
		isBattle=1;//战斗阶段更新
		
		LastTime=+new Date();//时间判定更新
		
		//游戏回合和游戏时间更新
		gameTime=20+gameTimes*5;
		gameTimes++;
		
		//光环选择后的状态更新
		guy.maxHp+=20;
		guy.nowHp+=20;
		
		enemyCollection.clear();//敌军属性清除
		enemyCollection.setwaitTime(Math.max(waitTime-gameTimes*25,50));//敌军更新频率加快
		totEnemy=Math.min(totEnemy*2,Number.MAX_VALUE/2-1);
		enemyCollection.settotEnemy(totEnemy);//敌军数量翻倍
		
	}else if(guy.pos.x>=canvas1.width/2-30&&guy.pos.x<=canvas1.width/2+30&&
	   guy.pos.y>=canvas1.height/2-105&&guy.pos.y<=canvas1.height/2-75&&e.which==32&&guy.Score-soloScore>=800)//选择BOSS传送门
	 {
		 soloScore=guy.Score;//分数线更新
		 
		 LastTime=+new Date();
		 
		 //guy属性更新
		 guy.place=2;
		 guy.pos.x=canvas2.width / 2-7.5;
		 guy.pos.y=canvas2.height / 2-7.5;
		 
		 enterflag = true;
		 
		 gameTime=bossTime;
		 
		 drawCover(canvas1,ctx1);
		 enemyCollection.clear();
	 }
}

function keyDoubleStart(e){
	if(isBattle==0)
	{
		if(guy.pos.x>=canvas1.width/2-30&&guy.pos.x<=canvas1.width/2+30&&
		   guy.pos.y>=canvas1.height/2-105&&guy.pos.y<=canvas1.height/2-75&&e.which==32 )
		{
			if(isSecondPend==0)
			{
				isFirstPend=1;
			}else
			{
				isFirstPend=0;
				isSecondPend=0;
				isBattle=1;
				gameTime=20+gameTimes*5;
				gameTimes++;
			}
		}
		if(guy2.pos.x>=canvas2.width/2-30&&guy2.pos.x<=canvas2.width/2+30&&
		   guy2.pos.y>=canvas2.height/2-105&&guy2.pos.y<=canvas2.height/2-75&&e.which==13 )
		{
			if(isFirstPend==0)
			{
				isSecondPend=1;
			}else
			{
				isFirstPend=0;
				isSecondPend=0;
				isBattle=1;
				gameTime=20+gameTimes*5;
				gameTimes++;
			}
		}
	}else
	{
		totEnemy=totEnemy*2;
		
		if(guy.pos.x>=canvas1.width/2+60&&guy.pos.x<=canvas1.width/2+120&&
		   guy.pos.y>=canvas1.height/2-15&&guy.pos.y<=canvas1.height/2+15&&e.which==32&&isBattle==2)
		{
			if(isSecondPend==0)
			{
				isFirstPend=1;
				guy.maxMp+=20;
				guy.nowMp+=20;
				enemyCollection.clear();
				enemyCollection.setwaitTime(Math.max(waitTime-gameTimes*25,50));
				enemyCollection.settotEnemy(totEnemy);
			}else
			{
				isFirstPend=0;
				isSecondPend=0;
				isBattle=1;
				gameTime=20+gameTimes*5;
				guy.maxMp+=20;
				guy.nowMp+=20;
				gameTimes++;
				enemyCollection.clear();
				enemyCollection.setwaitTime(Math.max(waitTime-gameTimes*25,50));
				enemyCollection.settotEnemy(totEnemy);
			}
		}else if(guy.pos.x>=canvas1.width/2-120&&guy.pos.x<=canvas1.width/2-60&&
		   guy.pos.y>=canvas1.height/2-15&&guy.pos.y<=canvas1.height/2+15&&e.which==32&&isBattle==2)
		{
			if(isSecondPend==0)
			{
				isFirstPend=1;
				guy.maxHp+=20;
				guy.nowHp+=20;
				enemyCollection.clear();
				enemyCollection.setwaitTime(Math.max(waitTime-gameTimes*25,50));
				enemyCollection.settotEnemy(totEnemy);
			}else
			{
				isFirstPend=0;
				isSecondPend=0;
				isBattle=1;
				gameTime=20+gameTimes*5;
				guy.maxHp+=20;
				guy.nowHp+=20;
				gameTimes++;
				enemyCollection.clear();
				enemyCollection.setwaitTime(Math.max(waitTime-gameTimes*25,50));
				enemyCollection.settotEnemy(totEnemy);
			}
		}
		
		if(guy2.pos.x>=canvas2.width/2+60&&guy2.pos.x<=canvas2.width/2+120&&
		   guy2.pos.y>=canvas2.height/2-15&&guy2.pos.y<=canvas2.height/2+15&&e.which==13&&isBattle==2)
		{
			if(isFirstPend==0)
			{
				isSecondPend=1;
				guy2.maxMp+=20;
				guy2.nowMp+=20;
				enemyCollection2.clear();
				enemyCollection2.setwaitTime(Math.max(waitTime-gameTimes*25,50));
				enemyCollection2.settotEnemy(totEnemy);
			}else
			{
				isFirstPend=0;
				isSecondPend=0;
				isBattle=1;
				gameTime=20+gameTimes*5;
				guy2.maxMp+=20;
				guy2.nowMp+=20;
				gameTimes++;
				enemyCollection2.clear();
				enemyCollection2.setwaitTime(Math.max(waitTime-gameTimes*25,50));
				enemyCollection2.settotEnemy(totEnemy);
			}
		}else if(guy2.pos.x>=canvas2.width/2-120&&guy2.pos.x<=canvas2.width/2-60&&
		   guy2.pos.y>=canvas2.height/2-15&&guy2.pos.y<=canvas2.height/2+15&&e.which==13&&isBattle==2)
		{
			if(isFirstPend==0)
			{
				isSecondPend=1;
				guy2.maxHp+=20;
				guy2.nowHp+=20;
				enemyCollection2.clear();
				enemyCollection2.setwaitTime(Math.max(waitTime-gameTimes*25,50));
				enemyCollection2.settotEnemy(totEnemy);
			}else
			{
				isFirstPend=0;
				isSecondPend=0;
				isBattle=1;
				gameTime=20+gameTimes*5;
				guy2.maxHp+=20;
				guy2.nowHp+=20;
				gameTimes++;
				enemyCollection2.clear();
				enemyCollection2.setwaitTime(Math.max(waitTime-gameTimes*25,50));
				enemyCollection2.settotEnemy(totEnemy);
			}
		}
		
		if(guy.Score<guy2.Score)
			enemyCollection.setwaitTime(Math.max(waitTime-gameTimes*25-25,50));
		else
			enemyCollection2.setwaitTime(Math.max(waitTime-gameTimes*25-25,50));
	}
}
