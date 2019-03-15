/*
 Function  : Final project_Public_function
 Author    : Ripndip
 Build_Date: Jan. 2, 2019 
 Version   : 1.0
 */ 

//公共函数声明块........................................................

//windowToCanvas函数
function windowToCanvas(sPoint,canvas,ctx){
	var oPoint={x:0,y:0};

	if(canvas==canvas1)
		var bbox = canvas1.getBoundingClientRect();
	else
		var bbox = canvas2.getBoundingClientRect();
    var styles = window.getComputedStyle(canvas1);

    oPoint.x = sPoint.x - bbox.left;
    oPoint.y = sPoint.y - bbox.top;
	
    oPoint.x =oPoint.x - parseFloat(styles["border-left-width"]);
    oPoint.y =oPoint.y - parseFloat(styles["border-top-width"]);

    // 处理比率
    //oPoint.x *= (canvas.width / bbox.width);
    //oPoint.y *= (canvas.height / bbox.height);
    
	return oPoint;
}

//随机函数
function rand(a, b) { 
	return parseInt(Math.random() * (b - a + 1) + a); 
}

function init(){
	waitTime=400;
	totEnemy=100;
	isBattle=0;
	soloScore=0;
	gameTimes=0;
	gameTime=0;
	cutsceneTime=0;
	isSecondPend=0;
	isFirstPend=0;
	LastTime=0;
	fixedMp1=100;
	fixedMp2=100;
	
	guy=null;
	guy=new Guy();

	guy2=null;
	guy2=new Guy();
	
	enterflag=0;
	isGrow=-1;
	
	boss=undefined;
	boss= new Boss();
	
	enemyCollection = null; 
	enemyCollection = new EnemyCollection(waitTime, totEnemy); 
	enemyCollection2 = null; 
	enemyCollection2 = new EnemyCollection(waitTime, totEnemy); 
	enemyCollection3.clear();
	enemySiteCollection.clear();
}
