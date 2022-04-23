
//坐标转换
function windowToCanvas(canvas,point){
	// 获取canvas元素的所有样式属性
	var canvasStyle=window.getComputedStyle(canvas);
    
	// 获取元素的位置属性
	var bbox=canvas.getBoundingClientRect();
	// 除去canvas在文档坐标系的左边和顶部距离
	point.x-=bbox.left;
	point.y-=bbox.top;
	
	// 除去canvas的边框宽度
	point.x-=parseFloat(canvasStyle["border-left-width"]);
	point.y-=parseFloat(canvasStyle["border-top-width"]);
	
	// 除去canvas的内边距宽度
	point.x-=parseFloat(canvasStyle["padding-left"]);
	point.y-=parseFloat(canvasStyle["padding-top"]);

	// 绘图环境和canvas的大小比例调整 
	var xRatio=canvas.width/parseFloat(canvasStyle["width"]);
	var yRatio=canvas.height/parseFloat(canvasStyle["height"]);
	
	// 从文档坐标系调整到canvas坐标系
	point.x*=xRatio;
	point.y*=yRatio;
	point.x+=10;
	point.y+=8;
	
	// 返回调整后的坐标值
	return point;
}


//坦克的绘制-------坦克的操作------------------------------------------------------------------------------------
function drawTank(){    //绘制炸弹数目、子弹数目、冲刺条进度 、怪物进度条
	//判断条件，更改是否开枪
    if(nowBulletNum==0||objWolf.isDead==true){
        fireAudio.pause();
        isOnFire=false;
    }
	//绘制怪物进度条
    context.save();
    context.beginPath();
    context.fillStyle="orange";
    if(deadMonster<3*snakesNum){
        context.fillRect(canvas.width/2-load.width/4,16+load.height/4,deadMonster/(snakesNum*3)*(load.width/6),8);
    }
    else if(deadMonster<3*snakesNum+crowsNum){
        context.fillRect(canvas.width/2-load.width/4,16+load.height/4,(load.width/6)+(deadMonster-3*snakesNum)/crowsNum*(load.width/6),8);
    }
    else if(deadMonster<3*snakesNum+crowsNum+lizardsNum){
        context.fillRect(canvas.width/2-load.width/4,16+load.height/4,(load.width/3)+(deadMonster-3*snakesNum-crowsNum)/lizardsNum*(load.width/6),8);
    }
    else{
        context.fillRect(canvas.width/2-load.width/4,16+load.height/4,load.width/2,8);
    }
    context.restore();
    context.drawImage(load,canvas.width/2-load.width/4,20,load.width/2,load.height/2);
    //绘制子弹数
	context.drawImage(tankAttribute.magImage,canvas.width-tankAttribute.magImage.width/2-30-20,canvas.height-tankAttribute.magImage.height/2-30,tankAttribute.magImage.width/2,tankAttribute.magImage.height/2);
    context.save();
    context.font="20px Arial";
    context.fillStyle="yellow";
    context.fillText(nowBulletNum+"/"+BULLET_MAG,canvas.width-tankAttribute.magImage.width/2-40,canvas.height-tankAttribute.magImage.height/2-30);  //绘制子弹数目
    context.restore();
	//绘制炸弹
    for(var i=0;i<nowBombNum;i++){  
        context.drawImage(tankAttribute.singleBombImage,canvas.width-tankAttribute.singleBombImage.width*2-tankAttribute.magImage.width/2-i*(tankAttribute.singleBombImage.width+10)-30,canvas.height-tankAttribute.magImage.height/2-30,tankAttribute.singleBombImage.width,tankAttribute.singleBombImage.height);
    }
    if(now-timeCountOfSprinting>=SprintingTime && isSprinting==true){	//若在冲刺，到了技能释放时间，则
		isSprinting=false;
		isSprintReady=false;
		timeCountOfSprinting=now;		//用于判断技能释放的时间
	}
	if(now-timeCountOfSprintCD>=SprintingCD && isSprintReady==false){
        timeCountOfSprintCD=now;
		isSprintReady=true;
	}
    //绘制冲刺进度条
    context.save();
    if(isSprintReady==false){   //设置渐变
        context.beginPath();
        var linearGradient= context.createLinearGradient(canvas.width/2-70,canvas.height-50,canvas.width/2+70,canvas.height-50);
        linearGradient.addColorStop(0,"skyblue");
        linearGradient.addColorStop(1,"darkturquoise");
        context.fillStyle=linearGradient;
        context.fillRect(canvas.width/2-71,canvas.height-50,(now-timeCountOfSprintCD)/SprintingCD*140,10);
    }
    else {
        context.beginPath();
        var linearGradient= context.createLinearGradient(canvas.width/2-70,canvas.height-50,canvas.width/2+70,canvas.height-50);
        linearGradient.addColorStop(0,"yellow");
        linearGradient.addColorStop(1,"red");
        context.fillStyle=linearGradient;
        context.fillRect(canvas.width/2-70,canvas.height-50,140,10);
    }
    context.beginPath();
    context.strokeStyle='black';
    context.strokeRect(canvas.width/2-71,canvas.height-51,142,12);
    context.restore();
	//绘制坦克、加特林、开火
	objTank.update(context,(now));
    objTank.paint(context);
    objGatlin.update(context,(now));
    objGatlin.paint(context);
    if(nowBulletNum!=0)objFire.paint(context);   
}

function fireBullet(now){
    if(nowBulletNum>0){
        nowBulletNum--;
        var bullet=new Sprite('bullet',new ImagePainter(FIREBULLETURL,FIREBULLETCELLS),[new ActionExecute('bulletAction'),moveOfSprite]);
        bullet.angle = -Math.atan2((point.x-objGatlin.left-objGatlin.width/2),(point.y-objGatlin.top-objGatlin.height/2)) + Math.PI/2;
        bullet.left = objGatlin.left;       
        bullet.top = objGatlin.top;         
        bullet.width=84/3;                  //设置子弹大小
        bullet.height=37/3;
        bullet.velocity=BULLET_SPEAD;
        bullet.damage=BULLET_DAMAGE;
        bullets.push(bullet);
        if(nowBulletNum==0){
            changemagAudio.play();
            startChangeMag=now;
        }
    }
}

function drawBullets(now){	
    if(now-startChangeMag>=CHANGE_MAG_TIME && nowBulletNum==0){
        nowBulletNum=BULLET_MAG;
    }
    else if(nowBulletNum==0){
        context.save();
        context.font="bold 20px Arial";
        context.fillStyle="grey";
        context.drawImage(tankAttribute.changeMagImage,objTank.left,objTank.top,objTank.width,objTank.height);
        context.fillText("装弹中",objTank.left,objTank.top+10+objTank.width+10);
        context.restore();
    }
    var cd=bullets.length;
    for(var i=0;i<cd;i++){
        if(bullets[i].visible==true)
            bullets[i].paint(context);
        else{           //如果不可见 踢出数组 i--
            bullets.splice(i,1);
            i--;
            cd--;
        }
    }
}
function createBomb(){
    if(nowBombNum>0){
        nowBombNum--;
        var bomb=new Sprite('bomb',new ImagePainter(BOMBURL,BOMBCELLS),[new ActionExecute('bombAction'),moveOfSprite]);
        bomb.left=objTank.left;
        bomb.top=objTank.top;
        bomb.width=BOMBWIDTH*1.5;
        bomb.height=BOMBHEIGHT*1.5;
        bomb.damage=BOMB_DAMAGE;
        bomb.attackRange=BOMB_ATTACK_RANGE;
        bombs.push(bomb);
    }
}
function drawBombs(){
    var cd=bombs.length;
    for(var i=0;i<cd;i++){
        if(bombs[i].visible==true){
            bombs[i].paint(context);
        }
        else{           //如果不可见 踢出数组 i--
            bombs.splice(i,1);
            i--;
            cd--;
        }
    }
}

//坦克和怪物血量的绘制-----------------------
function drawBlood(sprite,context){
	var bloodWidth=50;
	if(sprite.name=='tank'){
		context.save();
		context.beginPath();
		context.fillStyle = "red";
		if(sprite.nowbloodVolume>0)
			context.fillRect(sprite.left+sprite.width/2-25,sprite.top-10,sprite.nowbloodVolume/sprite.bloodVolume*bloodWidth,4);
		context.beginPath();
		context.strokeStyle='black';
		if(sprite.nowbloodVolume>0)
			context.strokeRect(sprite.left+sprite.width/2-26,sprite.top-11,bloodWidth,6);
		context.restore();
	}
	else{
		context.save();
		context.beginPath();
		context.fillStyle = "purple";
		if(sprite.nowbloodVolume>0)
			context.fillRect(sprite.left+sprite.width/2-25,sprite.top-10,sprite.nowbloodVolume/sprite.bloodVolume*bloodWidth,4);
		context.beginPath();
		context.strokeStyle='black';
		if(sprite.nowbloodVolume>0)
			context.strokeRect(sprite.left+sprite.width/2-26,sprite.top-11,bloodWidth,6);
		context.restore();
		if(sprite.nowbloodVolume<=0 && sprite.isDead==false){
			deadMonster++;              //死亡怪物加1
			sprite.isDead=true;
			sprite.deadAngle=sprite.angle+Math.PI/2;    //记录死亡时的角度，不再根据tank移动而改变
		}
	}
}


//怪物的创建和绘制-----------------------
function createSnakes(){	//创建蛇
    for(var i=0;i<snakesNum;i++){
        var snakeDistanceRange = canvas.width/5;
        var randomPointX = Math.random()*(background.width-canvas.width*2/5)-(background.width/2-canvas.width*7/10);
        var randomPointY = Math.random()*(background.height-canvas.height*2/5)-(background.height/2-canvas.height*7/10);
        for(var j=0;j<3;j++){
            var objSnake=new Sprite('snake',new ImagePainter(SNAKEURL,SNAKECELLS),[new ActionExecute('snakeAction'),moveOfSprite]);
            objSnake.visible=false;
            objSnake.left=randomPointX-snakeDistanceRange/2+Math.random()*snakeDistanceRange;
            objSnake.top=randomPointY-snakeDistanceRange/2+Math.random()*snakeDistanceRange;
            objSnake.width=SNAKEWIDTH/1.5;
            objSnake.height=SNAKEHEIGHT/1.5;
            objSnake.bloodVolume=SNAKE_BLOODVOLUME;
            objSnake.nowbloodVolume=SNAKE_BLOODVOLUME;
            objSnake.eyeRange=SNAKE_EYE_RANGE;
            objSnake.attackRange=SNAKE_ATTACK_RANGE;
            objSnake.damage=SNAKE_DAMAGE;
            snakes.push(objSnake);
        }
    }
}

function drawSnakes(){
    for(var i=0;i<snakes.length;i++){
        snakes[i].visible=true;
        snakes[i].paint(context);
    }
}

function createCrows(){
    for(var i=0;i<crowsNum;i++){
        var randomPointX = Math.random()*(background.width-canvas.width*2/5)-(background.width/2-canvas.width*7/10);
        var randomPointY = Math.random()*(background.height-canvas.height*2/5)-(background.height/2-canvas.height*7/10);
        var objCrow = new Sprite('crow',new ImagePainter(CROWURL,CROWCELLS),[new ActionExecute('crowAction'),moveOfSprite]);
            objCrow.visible=false;
            objCrow.left=randomPointX;
            objCrow.top=randomPointY;
            objCrow.width=CROWWIDTH/1.5;
            objCrow.height=CROWHEIGHT/1.5;
            objCrow.bloodVolume=CROW_BLOODVOLUME;
            objCrow.nowbloodVolume=CROW_BLOODVOLUME;
            objCrow.attackRange=CROW_ATTACK_RANGE;
            objCrow.eyeRange=CROW_EYE_RANGE;
            objCrow.damage=CROW_DAMAGE;
            crows.push(objCrow);
    }
}
function drawCrows(){
    for(var i=0;i<crows.length;i++){
        crows[i].visible=true;
        crows[i].paint(context);
    }
}

function createLizards(){
    for(var i=0;i<lizardsNum;i++){
        var randomPointX = Math.random()*(background.width-canvas.width*2/5)-(background.width/2-canvas.width*7/10);
        var randomPointY = Math.random()*(background.height-canvas.height*2/5)-(background.height/2-canvas.height*7/10);
        var objLizard = new Sprite('lizard',new ImagePainter(LIZARDURL,LIZARDCELLS),[new ActionExecute('lizardAction'),moveOfSprite]);
            objLizard.visible=false;
            objLizard.left=randomPointX;
            objLizard.top=randomPointY;
            objLizard.width=LIZARDWIDTH;
            objLizard.height=LIZARDHEIGHT;
            objLizard.bloodVolume=LIZARD_BLOODVOLUME;
            objLizard.nowbloodVolume=LIZARD_BLOODVOLUME;
            objLizard.attackRange=LIZARD_ATTACK_RANGE;
            objLizard.eyeRange=LIZARD_EYE_RANGE;
            objLizard.damage=LIZARD_DAMAGE;
            lizards.push(objLizard);
    }
}
function drawLizards(){
    for(var i=0;i<lizards.length;i++){
        lizards[i].visible=true;
        lizards[i].paint(context);
    }
}

//-------------------------------初始化参数
function initEyeryThing(){
    deadMonster=0;
    objTank.left=canvas.width/2;    //初始时出生在地图中间
    objTank.top=canvas.height/2;
    objTank.width=TANKWIDTH/3;
    objTank.height=TANKHEIGHT/3;
    objTank.nowbloodVolume=100;
    objTank.isDead=false;
    objGatlin.width=GATLINWIDTH/3;      //初始化机枪大小
    objGatlin.height=GATLINHEIGHT/3;

    objWolf.width=100;
    objWolf.height=80;
    objWolf.left=canvas.width-100;
    objWolf.top=canvas.height/2;
    objWolf.eyeRange=WOLF_EYE_RANGE;
    objWolf.attackRange=WOLF_ATTACK_RANGE;
    objWolf.damage=WOLF_DAMAGE;
    objWolf.isDead=false;
    objWolf.nowbloodVolume=WOLF_BLOOD;
    objWolf.bloodVolume=WOLF_BLOOD;
    objWolf.isAngry=false;

    nowBombNum=3;				//炸弹数为3
    nowBulletNum=BULLET_MAG;
    snakes=[];
    bullets=[];
    bombs=[];
    lizards=[];
    crows=[];
}


//--------------绘制背景函数-----------
function drawBackGround(){
    background.velocityX=0;
    background.velocityY=0;
    if(objTank.left+objTank.width/2>=canvas.width*4/5 && objTank.velocityX>0 ) {
        if(background.midX+canvas.width/2>=background.width){//如果到最右边
            objTank.velocityX=0;
        }
        else{background.velocityX=-objTank.velocityX;}
    }
    if(objTank.left+objTank.width/2<=canvas.width*1/5 && objTank.velocityX<0){
        if(background.midX-canvas.width/2<=0){//如果到最左边
            objTank.velocityX=0;
        }
        else{background.velocityX=-objTank.velocityX;}
    }
    if(objTank.top+objTank.height/2>=canvas.height*4/5 && objTank.velocityY>0){
        if(background.midY+canvas.height/2>=background.height){//如果到最下边
            objTank.velocityY=0;
        }
        else{background.velocityY=-objTank.velocityY;}
    }
    if(objTank.top+objTank.height/2<=canvas.height*1/5 && objTank.velocityY<0){
        if(background.midY-canvas.height/2<=0){//如果到最上边
            objTank.velocityY=0;
        }
        else{background.velocityY=-objTank.velocityY;}
    }
	if(objTank.isDead==true){
		background.velocityX=0;
		background.velocityY=0;
	}
	else{
		background.midX-=background.velocityX;
		background.midY-=background.velocityY;
	}
	updateMonstersLocation();
    context.drawImage(background.image, background.midX-canvas.width/2, background.midY-canvas.height/2, canvas.width, canvas.height,0,0,canvas.width,canvas.height);
}


function updateMonstersLocation(){
	for(var i=0;i<snakes.length;i++){
		if(snakes[i].visible==false){
			snakes[i].left +=background.velocityX;      
            snakes[i].top += background.velocityY;
		}
	}
	for(var i=0;i<crows.length;i++){
		if(crows[i].visible==false){
			crows[i].left +=background.velocityX;      
            crows[i].top += background.velocityY;
		}
	}
	for(var i=0;i<lizards.length;i++){
		if(lizards[i].visible==false){
			lizards[i].left +=background.velocityX;      
            lizards[i].top += background.velocityY;
		}
	}
}