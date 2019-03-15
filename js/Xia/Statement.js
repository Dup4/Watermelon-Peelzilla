/*
 Function  : Final project_Statement
 Author    : Ripndip
 Build_Date: Jan. 2, 2019 
 Version   : 1.0
 */ 

//公共变量声明块........................................................

//canvas 声明
var canvas1=document.getElementById("canvas1");
	  ctx1=canvas1.getContext("2d");

var canvas2=document.getElementById("canvas2");
	  ctx2=canvas2.getContext("2d");

	canvas=canvas1;
	ctx=ctx1;



//canvas声背景声明块........................................................

//canvas1的背景图声明
var cover1= new Image();
	  cover1.src="../pic/KUNKKA.png";

//canvas2的背景图声明
var cover2= new Image();//绘制canvas2的背景图
	  cover2.src="../pic/TIDEHUNTER.png";

//背景色声明
var backgroundColor=ctx.createLinearGradient(canvas.width/2,0,canvas.width/2,canvas.height);
backgroundColor.addColorStop(0,"#33a3dc");
backgroundColor.addColorStop(1,"black");



//变量声明块........................................................

var music = document.getElementById("music");

var cutsceneTime=0;//动画时间变量声明
var gamemode;//游戏模式声明

var waitTime=400,totEnemy=100;


var isBattle=0;//战斗阶段声明
var gameTimes=0,gameTime=0;//回合时间和回合次数声明
var soloScore=0;//目标分数线

var bossTime=20;

var isSecondPend=0,isFirstPend=0;//双人模式的就绪声明

var LastTime=0;

var  fixedMp1=0,fixedMp2=0;//蓝量固定记录值

//类声明块........................................................

//玩家声明
var guy=new Guy();
var guy2=new Guy();

//BOSS声明
var boss = new Boss();

//小怪群声明
var enemyCollection = new EnemyCollection(waitTime, totEnemy); 
var enemyCollection2 = new EnemyCollection(waitTime,totEnemy); 

var enemyCollection3 = new EnemyCollection(200, 0); 
var enemySiteCollection = new EnemySiteCollection(enemyCollection3);

//测试用作弊码
//guy.Score=800;
