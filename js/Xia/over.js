/*
 Function  : Final project_over
 Author    : Ripndip
 Build_Date: Jan. 1, 2019 
 Version   : 1.0
 */ 

//绘制单人失败标识
function drawSoloFail()
{
	ctx1.drawImage(cover1,0,0);
	ctx2.drawImage(cover2,0,0);
	finishIntroduction(canvas1,ctx1,0);
	drawRestart(canvas2,ctx2);
}

//绘制双人失败标识
function drawDoubleFail()
{
	ctx1.drawImage(cover1,0,0);
	ctx2.drawImage(cover2,0,0);
	drawDoubleRestart();
}

//绘制单人胜利标识
function drawWin()
{
	ctx1.drawImage(cover1,0,0);
	ctx2.drawImage(cover2,0,0);
	console.log(1);
	finishIntroduction(canvas1,ctx1,1);
	drawWinOver(canvas2,ctx2);
}

//结束动画函数
function failCutscene()
{
	if(cutsceneTime>100){
		if(gamemode==1)
			drawSoloFail();
		else
			drawDoubleFail();
	}else{
		cutsceneTime++;
			
		canvas=canvas1;
		ctx=ctx1;
		ctx.fillStyle=coverPattern1;
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.fillStyle=backgroundColor;
		ctx.fillRect(cutsceneTime*(canvas.width-5)/200,cutsceneTime*(canvas.height-5)/200,canvas.width-cutsceneTime*canvas.width/100,canvas.height-cutsceneTime*canvas.height/100);
			
		canvas=canvas2;
		ctx=ctx2;
		ctx.fillStyle=coverPattern2;
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.fillStyle=backgroundColor;
		ctx.fillRect(cutsceneTime*(canvas.width-5)/200,cutsceneTime*(canvas.height-5)/200,canvas.width-cutsceneTime*canvas.width/100,canvas.height-cutsceneTime*canvas.height/100);
		requestNextAnimationFrame(failCutscene);
	}
}

//胜利动画函数
function winCutscene()
{
	if(cutsceneTime>100){
		drawWin();
	}else{
		cutsceneTime++;
			
		canvas=canvas1;
		ctx=ctx1;
		ctx.fillStyle=coverPattern1;
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.fillStyle=backgroundColor;
		ctx.fillRect(cutsceneTime*(canvas.width-5)/200,cutsceneTime*(canvas.height-5)/200,canvas.width-cutsceneTime*canvas.width/100,canvas.height-cutsceneTime*canvas.height/100);
			
		canvas=canvas2;
		ctx=ctx2;
		ctx.fillStyle=coverPattern2;
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.fillStyle=backgroundColor;
		ctx.fillRect(cutsceneTime*(canvas.width-5)/200,cutsceneTime*(canvas.height-5)/200,canvas.width-cutsceneTime*canvas.width/100,canvas.height-cutsceneTime*canvas.height/100);
		requestNextAnimationFrame(winCutscene);
	}
}

//游戏结束文字函数
function finishIntroduction(canvas,ctx,isWin){
	if(isWin==1)
	{
		ctx.fillStyle="black";
		ctx.textAlign="start";
		ctx.textBaseline="top";
		ctx.font="600 25px 黑体";
		ctx.fillText("在伟大的船长昆卡的带领下",20,20);
		ctx.fillText("人类奋起反抗",20,60);
		ctx.fillText("最终扭转与了恶魔西瓜皮斯拉对峙的局势",20,140);
		ctx.fillText("海怪和西瓜皮斯拉被人类所击败",20,180);
		ctx.fillText("船长昆卡带领着人类获得了最终的胜利",20,220);
		ctx.fillText("你的最终分数: "+guy.Score,20,300);
	}else
	{
		ctx.fillStyle="black";
		ctx.textAlign="start";
		ctx.textBaseline="top";
		ctx.font="600 25px 黑体";
		ctx.fillText("技不如人 甘拜下风",20,20);
		ctx.fillText("即使是伟大的船长昆卡",20,60);
		ctx.fillText("也无法抵御西瓜皮斯拉的进攻",20,140);
		ctx.fillText("在西瓜皮斯拉的带领下",20,180);
		ctx.fillText("海怪们依然为所欲为",20,220);
		ctx.fillText("你的最终分数: "+guy.Score,20,300);
	}
}

//游戏重开绘制函数
function drawRestart(canvas,ctx){
	ctx.fillStyle="white";
	ctx.textAlign="start";
	ctx.textBaseline="top";
	ctx.font="900 70px 黑体";
	ctx.fillText("Bad Ending",150,50);
	ctx.font="900 40px 黑体";
	ctx.fillText("再来一次",220,150);
	ctx.fillText("退出",260,200);
}

//游戏胜利绘制函数
function drawWinOver(canvas,ctx)
{
	ctx.fillStyle="white";
	ctx.textAlign="start";
	ctx.textBaseline="top";
	ctx.font="900 70px 黑体";
	ctx.fillText("Victory",170,50);
	ctx.font="900 40px 黑体";
	ctx.fillText("结束",260,150);
}

//双人结束显示函数
function drawDoubleRestart(){
	if(guy.isDead())
	{
		canvas=canvas1;
		ctx=ctx1;
		ctx.fillStyle="black";
		ctx.textAlign="center";
		ctx.textBaseline="middle";
		ctx.font="900 70px 黑体";
		ctx.fillText("技不如人 甘拜下风",canvas.width/2,50);
		ctx.font="900 40px 黑体";
		ctx.fillText("再来一次",canvas.width/2,150);
		ctx.fillText("退出",canvas.width/2,200);
		ctx.font="900 70px 黑体";
		ctx.fillText("Your Score: "+guy.Score,canvas.width/2,250);

		canvas=canvas2;
		ctx=ctx2;
		ctx.fillStyle="white";
		ctx.textAlign="center";
		ctx.textBaseline="middle";
		ctx.font="900 70px 黑体";
		ctx.fillText("WINNER",canvas.width/2,50);
		ctx.font="900 70px 黑体";
		ctx.fillText("Your Score: "+guy2.Score,canvas.width/2,150);
	}else
	{
		canvas=canvas2;
		ctx=ctx2;
		ctx.fillStyle="white";
		ctx.textAlign="center";
		ctx.textBaseline="middle";
		ctx.font="900 70px 黑体";
		ctx.fillText("技不如人 甘拜下风",canvas.width/2,50);
		ctx.font="900 40px 黑体";
		ctx.fillText("再来一次",canvas.width/2,150);
		ctx.fillText("退出",canvas.width/2,200);
		ctx.font="900 70px 黑体";
		ctx.fillText("Your Score: "+guy2.Score,canvas.width/2,250);

		canvas=canvas1;
		ctx=ctx1;
		ctx.fillStyle="black";
		ctx.textAlign="center";
		ctx.textBaseline="middle";
		ctx.font="900 70px 黑体";
		ctx.fillText("WINNER",canvas.width/2,50);
		ctx.font="900 70px 黑体";
		ctx.fillText("Your Score: "+guy.Score,canvas.width/2,150);
	}
	
}

//事件注册块...........................................................

//重新开始函数
function soloRestart(e){
	var point={x:e.clientX,y:e.clientY};
		point=windowToCanvas(point,canvas2,ctx2);

	if(point.x>=220&&point.x<=380&&point.y>=150&&point.y<=190)
	{
		//移除死亡事件
		canvas2.removeEventListener("mousedown",soloRestart);
		canvas2.removeEventListener("mousemove",buttonRestart);
		
		init();
		
		//增加键盘事件
		window.addEventListener("keydown",solokeydown);
		window.addEventListener("keyup",solokeyup);
		window.addEventListener("keydown",keySoloStart);

		gamemode=1;
		
		requestNextAnimationFrame(cutscene);
	}
	else if(point.x>=260&&point.x<=340&&point.y>=200&&point.y<=240)
	{
		canvas2.removeEventListener("mousedown",soloRestart);
		canvas2.removeEventListener("mousemove",buttonRestart);
		window.close();
	}
}

//胜利重新开始函数
function winRestart(e){
	var point={x:e.clientX,y:e.clientY};
		point=windowToCanvas(point,canvas2,ctx2);

	if(point.x>=260&&point.x<=340&&point.y>=150&&point.y<=190)
	{
		canvas2.removeEventListener("mousedown",winRestart);
		canvas2.removeEventListener("mousemove",buttonWinRestart);
		window.location.reload();
	}
}

//按钮绘制函数
function buttonRestart(e){
	var point={x:e.clientX,y:e.clientY};
	point=windowToCanvas(point,canvas2,ctx2);

	if(point.x>=220&&point.x<=380&&point.y>=150&&point.y<=190)
	{
		ctx2.strokeStyle="black";
		ctx2.font="900 40px 黑体";
		ctx2.strokeText("再来一次",220,150);
	}
	else if(point.x>=260&&point.x<=340&&point.y>=200&&point.y<=240)
	{
		ctx2.strokeStyle="black";
		ctx2.font="900 40px 黑体";
		ctx2.strokeText("退出",260,200);
	}
	else
	{
		ctx2.clearRect(0,0,canvas1.width,canvas1.height);
		ctx2.drawImage(cover2,0,0);
		drawRestart(canvas2,ctx2);
	}
}

//胜利时按钮绘制函数
function buttonWinRestart(e){
	var point={x:e.clientX,y:e.clientY};
	point=windowToCanvas(point,canvas2,ctx2);

	if(point.x>=220&&point.x<=380&&point.y>=150&&point.y<=190)
	{
		ctx2.strokeStyle="black";
		ctx2.font="900 40px 黑体";
		ctx2.strokeText("结束",260,150);
	}
	else
	{
		ctx2.clearRect(0,0,canvas1.width,canvas1.height);
		ctx2.drawImage(cover2,0,0);
		drawWinOver(canvas2,ctx2);
	}
}

//双人重新开始函数
function doubleRestart(e){
	var point={x:e.clientX,y:e.clientY};
	if(guy.isDead())
		point=windowToCanvas(point,canvas1,ctx1);
	else
		point=windowToCanvas(point,canvas2,ctx2);
	
	if(point.x>=240&&point.x<=400&&point.y>=130&&point.y<=170)
	{
		if(guy.isDead())
		{
			canvas1.removeEventListener("mousedown",doubleRestart);
			canvas1.removeEventListener("mousemove",buttonDoubleRestart);
		}
		else{
			canvas2.removeEventListener("mousedown",doubleRestart);
			canvas2.removeEventListener("mousemove",buttonDoubleRestart);
		}
		
		init();
		
		window.addEventListener("keydown",doublekeydown);
		window.addEventListener("keyup",doublekeyup);
		window.addEventListener("keydown",keyDoubleStart);
		
		gamemode=2;
		requestNextAnimationFrame(cutscene);
	}
	else if(point.x>=280&&point.x<=360&&point.y>=180&&point.y<=220)
	{
		if(guy.isDead())
		{
			canvas1.removeEventListener("mousedown",doubleRestart);
			canvas1.removeEventListener("mousemove",buttonDoubleRestart);
		}
		else{
			canvas2.removeEventListener("mousedown",doubleRestart);
			canvas2.removeEventListener("mousemove",buttonDoubleRestart);
		}
		window.close();
	}
}

//双人按钮绘制函数
function buttonDoubleRestart(e){
	ctx1.textAlign="center";
	ctx1.textBaseline="middle";
	ctx1.lineWidth=1;
	ctx2.textAlign="center";
	ctx2.textBaseline="middle";
	ctx2.lineWidth=1;
	var point={x:e.clientX,y:e.clientY};
	if(guy.isDead()){
		canvas=canvas1;
		ctx=ctx1;
		point=windowToCanvas(point,canvas,ctx);
		if(point.x>=240&&point.x<=400&&point.y>=130&&point.y<=170)
		{
			ctx.strokeStyle="white";
			ctx.font="900 40px 黑体";
			ctx.strokeText("再来一次",canvas.width/2,150);
		}
		else if(point.x>=280&&point.x<=360&&point.y>=180&&point.y<=220)
		{
			ctx.strokeStyle="white";
			ctx.font="900 40px 黑体";
			ctx.strokeText("退出",canvas.width/2,200);
		}else
		{
			ctx1.clearRect(0,0,canvas1.width,canvas1.height);
			ctx2.clearRect(0,0,canvas2.width,canvas2.height);
			ctx1.drawImage(cover1,0,0);
			ctx2.drawImage(cover2,0,0);
			drawDoubleFail();
		}
	}
	else{
		canvas=canvas2;
		ctx=ctx2;
		point=windowToCanvas(point,canvas,ctx);
		if(point.x>=240&&point.x<=400&&point.y>=130&&point.y<=170)
		{
			ctx.strokeStyle="black";
			ctx.font="900 40px 黑体";
			ctx.strokeText("再来一次",canvas.width/2,150);
		}
		else if(point.x>=280&&point.x<=360&&point.y>=180&&point.y<=220)
		{
			ctx.strokeStyle="black";
			ctx.font="900 40px 黑体";
			ctx.strokeText("退出",canvas.width/2,200);
		}else
		{
			ctx1.clearRect(0,0,canvas1.width,canvas1.height);
			ctx2.clearRect(0,0,canvas2.width,canvas2.height);
			ctx1.drawImage(cover1,0,0);
			ctx2.drawImage(cover2,0,0);
			drawDoubleFail();
		}
	}

	
}
