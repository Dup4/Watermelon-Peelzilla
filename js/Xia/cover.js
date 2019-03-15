/*
 Function  : Final project_Cover
 Author    : Ripndip
 Build_Date: Jan. 1, 2019 
 Version   : 1.3
 */ 

//函数定义块...........................................................
//游戏名绘制函数
function drawtitle(canvas,ctx){
	ctx.fillStyle="rgb(7,82,41)";
	ctx.textAlign="start";
	ctx.textBaseline="top";
	ctx.font="900 70px 黑体";
	ctx.fillText("西瓜皮斯拉",150,50);
	ctx.font="900 40px 黑体";
	ctx.fillText("单人进入游戏",200,150);
	ctx.fillText("双人进入游戏",200,200);
}

//游戏文字介绍绘制函数
function Introduction(canvas,ctx){
	ctx.fillStyle="white";//"rgb(64,120,119)";
	ctx.textAlign="start";
	ctx.textBaseline="top";
	ctx.font="600 25px 黑体";
	ctx.fillText("人类破坏了曾经给予他们无限馈赠的大海",20,20);
	ctx.fillText("大量西瓜皮混入海洋之中",20,60);
	ctx.fillText("海洋生物开始发生异变",20,140);
	ctx.fillText("强大的西瓜皮斯拉由此产生",20,180);
	ctx.fillText("它带领无数的海怪，开始向人类发起进攻",20,220);
	ctx.fillText("在瓜皮斯拉作祟下，伟大船长昆卡在海难中失踪",20,300);
	ctx.fillText("不久昆卡化身为幽灵舰队队长带领他的部下",20,340);
	ctx.fillText("来向西瓜皮斯拉复仇",20,380);
}

//动画函数
function cutscene()
{
	if(cutsceneTime>100){//模式选择
		cutsceneTime=0;
		if(gamemode==1)
			singlePlay();
		else
			doublePlay();
	}else{//过场动画效果
		cutsceneTime++;
		
		canvas=canvas1;
		ctx=ctx1;
		ctx.fillStyle=backgroundColor;
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.fillStyle=coverPattern1;
		ctx.fillRect(cutsceneTime*(canvas.width-5)/200,cutsceneTime*(canvas.height-5)/200,canvas.width-cutsceneTime*canvas.width/100,canvas.height-cutsceneTime*canvas.height/100);
		
		canvas=canvas2;
		ctx=ctx2;
		ctx.fillStyle=backgroundColor;
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.fillStyle=coverPattern2;
		ctx.fillRect(cutsceneTime*(canvas.width-5)/200,cutsceneTime*(canvas.height-5)/200,canvas.width-cutsceneTime*canvas.width/100,canvas.height-cutsceneTime*canvas.height/100);
		
		requestNextAnimationFrame(cutscene);
	}	
}
//事件注册块...........................................................
//开始mousedown函数
function start(e){

	canvas=canvas1;
	ctx=ctx1;

	var point={x:e.clientX,y:e.clientY};
	point=windowToCanvas(point,canvas,ctx);
	
	if(point.x>=200&&point.x<=440&&point.y>=150&&point.y<=190)
	{
		canvas.removeEventListener("mousedown",start);
		canvas.removeEventListener("mousemove",button);
		window.addEventListener("keydown",solokeydown);
		window.addEventListener("keyup",solokeyup);
		window.addEventListener("keydown",keySoloStart);
		gamemode=1;
		fixedMp1=guy.nowMp;
		requestNextAnimationFrame(cutscene);
	}
	else if(point.x>=200&&point.x<=440&&point.y>=200&&point.y<=240)
	{
		canvas.removeEventListener("mousedown",start);
		canvas.removeEventListener("mousemove",button);
		window.addEventListener("keydown",doublekeydown);
		window.addEventListener("keyup",doublekeyup);
		window.addEventListener("keydown",keyDoubleStart);
		gamemode=2;
		fixedMp1=guy.nowMp;
		fixedMp2=guy2.nowMp;
		requestNextAnimationFrame(cutscene);
	}
}

//mousemove按钮绘制动画效果函数
function button(e){

	canvas=canvas1;
	ctx=ctx1;
	
	var point={x:e.clientX,y:e.clientY};
	point=windowToCanvas(point,canvas,ctx);
	
	if(point.x>=200&&point.x<=440&&point.y>=150&&point.y<=190)
	{
		ctx.strokeStyle="white";
		ctx.font="900 40px 黑体";
		ctx.strokeText("单人进入游戏",200,150);
	}
	else if(point.x>=200&&point.x<=440&&point.y>=200&&point.y<=240)
	{
		ctx.strokeStyle="white";
		ctx.font="900 40px 黑体";
		ctx.strokeText("双人进入游戏",200,200);
	}
	else
	{
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.drawImage(cover1,0,0);
		drawtitle(canvas,ctx);
	}
}

canvas1.addEventListener("mousedown",start);
canvas1.addEventListener("mousemove",button);

//初始化块............................................................

//封面1初始化
cover1.onload=function(e){
	  ctx1.drawImage(cover1,0,0);
	  drawtitle(canvas1,ctx1);
	  coverPattern1=ctx1.createPattern(cover1,"no-repeat");
}

//封面2初始化
cover2.onload=function(e){
	  ctx2.drawImage(cover2,0,0);
	  Introduction(canvas2,ctx2);
	  coverPattern2=ctx2.createPattern(cover2,"no-repeat");
}
