
//变量声明块----------------------------------------------------------------------------------------变量声明块
var canvas=document.getElementById("canvas");
var context=canvas.getContext('2d');
var body = document.querySelector("body");
body.style.cursor= 'url(static/images/firingmouse.ico),auto';
var nowSence=-1;    //0表示封面 1游戏画面 2表示介绍页面
var point={x:0,y:0};
var lastAdvance=+new Date();
var bullets=[];
var startChangeMag=+new Date();
var nowBulletNum=BULLET_MAG;
var nowBombNum=3;
var snakes=[],
    crows=[],
    lizards=[],
    wolfs=[],
    bombs=[];
var crowsNum=10,
    lizardsNum=6,
    snakesNum=5;
var isSprinting=false,
    isSprintReady=true,
    SprintingTime=2000,     //技能释放时间
    SprintingCD=10000;      //技能cd
var timeCountOfSprinting=+new Date(),   //用于判断技能释放时间的时间
    timeCountOfSprintCD=+new Date(); //用于判断技能cd的时间
var deadMonster=0;
var fireAudio = new Audio();
    fireAudio.src=FIRESOUNDURL;
    fireAudio.loop=true;
    fireAudio.volume=0.5;
var aowuAudio= new Audio();
    aowuAudio.src=AOWUSOUNDURL;
var attackAudio=new Audio();
    attackAudio.src=ATTACKSOUNDURL;
var backGroundMusic=new Audio();
    backGroundMusic.src=BACKGROUNDSOUNDURL;
    backGroundMusic.loop=true;
    backGroundMusic.volume=1;
var bombAudio=new Audio();
    bombAudio.src=BOMBSOUNDURL;
var startAudio=new Audio();
    startAudio.src=STARTSOUNDURL;
var winAudio=new Audio();
    winAudio.src=WINSOUNDURL;
var changemagAudio=new Audio();
    changemagAudio.src=CHANGEMAGSOUNDURL;
var hitAudio=new Audio();
    hitAudio.src=HITSOUNDURL;
var rushAudio=new Audio();
    rushAudio.src=RUSHSOUNDURL;
var dieAudio=new Audio();
    dieAudio.src=DIESOUNDURL;
var tankPainter=new ImagePainter(TANKURL,TANKECELLS),
    objTank=new Sprite('tank',tankPainter,[new ActionExecute('tankAction'),moveOfSprite]);
var gatlinPainter=new ImagePainter(GATLINURL,GATLINCELLS),
    objGatlin=new Sprite('gatlin',gatlinPainter,[new ActionExecute('gatlinAction'),moveOfSprite]),
    isOnFire=false;
var firePainter=new ImagePainter(FIREBULLETURL,FIREBULLETCELLS),
    objFire=new Sprite('fire',firePainter,[new ActionExecute('fireAction'),moveOfSprite]);
var wolfPainter=new ImagePainter(WOLFURL,WOLFCELLS),
    objWolf=new Sprite('wolf',wolfPainter,[new ActionExecute('wolfAction'),moveOfSprite]);
var objAngry=new Sprite('angry',new ImagePainter(ANGRYURL,ANGRYCELLS),[new ActionExecute('angryAction'),moveOfSprite])
var background={image:undefined,velocityX:0,velocityY:0,width:0,height:0,midX:0,midY:0};
var playface={image:undefined,TittleW:PLAYFACE[1].width,TittleH:PLAYFACE[1].height, TittleX:0,TittleY:0,
                                ButtonW:PLAYFACE[2].width, ButtonH:PLAYFACE[2].height, ButtonX:0,ButtonY:0,
                                HelpW:PLAYFACE[3].width, HelpH:PLAYFACE[3].height, HelpX:0,HelpY:0};
var tankAttribute={magImage:undefined,singleBombImage:undefined,changeMagImage:undefined,rushLoadImage:undefined};
var introduction = {image:undefined,x:0,y:0,width:PAGEWIDTH,height:PAGEHEIGHT,num:0};

var dead = new Image();
dead.src="static/images/dead.png";
var deadWord = new Image();
deadWord.src="static/images/youdied.png";
var win = new Image();
win.src="static/images/win.png";
var load = new Image();
load.src="static/images/load.png";
//事件注册块-----------------------------------------------------------------------------------------事件注册块
canvas.addEventListener("mousedown", onCanvasMousedown);
canvas.addEventListener("mousemove", onCanvasMousemove);
canvas.addEventListener("mouseup", onCanvasMouseup);
window.onkeydown=onKeyDown;
window.onkeyup=onKeyUp;

function onCanvasMousedown(e){
    point.x=e.x;
    point.y=e.y;
    point=windowToCanvas(canvas,point);
    if(nowSence==0){
        console.log(playface.ButtonX,playface.ButtonX+playface.ButtonW);
        if(point.x<=playface.ButtonX+playface.ButtonW && point.x>=playface.ButtonX &&   //开始游戏
            point.y<=playface.ButtonY+playface.ButtonH && point.y>=playface.ButtonY){
                startAudio.play();
                playSence1();
        }
        else if(point.x<=playface.HelpX+playface.HelpW && point.x>=playface.HelpX &&   //开始游戏
                point.y<=playface.HelpY+playface.HelpH && point.y>=playface.HelpY){
                introduction.num=0;
                playSence2(introduction.num);
        }
    }
    else if(nowSence==1 && objTank.isDead==false){//战斗画面 打枪
        isOnFire=true;
        if(nowBulletNum!=0){
            fireAudio.play();
        }
    }
    else if(nowSence==2){   //介绍画面
        if(point.x>=BOTTON[0].x && point.x<=BOTTON[0].x+BOTTON[0].width         //上一页
            && point.y>=BOTTON[0].y && point.y<=BOTTON[0].y+BOTTON[0].height && introduction.num>0){
                introduction.num -= 1;
                playSence2(introduction.num);
            }else if(point.x>=BOTTON[1].x && point.x<=BOTTON[1].x+BOTTON[1].width   //下一页
                && point.y>=BOTTON[1].y && point.y<=BOTTON[1].y+BOTTON[1].height && introduction.num<2){
                introduction.num += 1;
                playSence2(introduction.num);
            }
            else if(point.x>=BOTTON[2].x && point.x<=BOTTON[2].x+BOTTON[2].width    //返回
                && point.y>=BOTTON[2].y && point.y<=BOTTON[2].y+BOTTON[2].height && introduction.num==2){
                    introduction.num=0;
                    nowSence=-1;
                    playSence0();
            }
    }
    else if(nowSence==3){   //输了
        playSence0();
    }
    if(nowSence==4){    //赢了
        playSence0();
    }
    else if(nowSence==10){
        nowSence=1;
        requestAnimationFrame(animate1_1);
    }
    else if(nowSence==11){  //蛇到乌鸦过度动画 nowSence设为战斗
        nowSence=1;
        requestAnimationFrame(animate1_2);
    }
    else if(nowSence==12){  //乌鸦到蜥蜴过度动画 nowSence设为战斗
        nowSence=1;
        requestAnimationFrame(animate1_3);
    }
    else if(nowSence==13){  //蜥蜴到狼过度动画 nowSence设为战斗
        nowSence=1;
        requestAnimationFrame(animate1_4);
    }

}
function onCanvasMousemove(e){
    point.x=e.x;
    point.y=e.y;
    point=windowToCanvas(canvas,point);
}

function onCanvasMouseup(e){
    point.x=e.x;
    point.y=e.y;
    point=windowToCanvas(canvas,point);
    if(nowSence==1){
        isOnFire=false;
        fireAudio.pause();
    }
}
function onKeyDown(e){//左37 右39 上38 下40 上w87 左a65 下s83 右d68
    switch (e.keyCode){
        case 65:
            if(isSprinting) objTank.velocityX=-2*TANK_SPEAD;
            else objTank.velocityX=-TANK_SPEAD;
            break;
        case 68:
            if(isSprinting) objTank.velocityX=2*TANK_SPEAD;
            else objTank.velocityX=TANK_SPEAD;
            break;
        case 87:
            if(isSprinting) objTank.velocityY=-2*TANK_SPEAD;
            else objTank.velocityY=-TANK_SPEAD;
            break;
        case 83:
            if(isSprinting) objTank.velocityY=2*TANK_SPEAD;
            else objTank.velocityY=TANK_SPEAD;
            break;
        case 82:
            createBomb();
            break;
        case 32:    
            if(isSprinting==false && isSprintReady==true){
                rushAudio.play();
                objTank.velocityX*=2;
                objTank.velocityY*=2;
                timeCountOfSprinting=+new Date();
                isSprinting=true;
                isSprintReady=false;
            }
            break;
    }
}
function onKeyUp(e){
    switch (e.keyCode){
        case 65:
        case 68:
            objTank.velocityX=0;
            break;
        case 83:
        case 87:
            objTank.velocityY=0;
            break;
    }
}


//函数声明块----------------------------------------------------------------------------------------函数声明块
var playSence0=(function(){
    nowSence=100;
    var lastTime =+ new Date();
    var INTERVAL = 50;
    var tw=0,th=0;
    var bw=0;bh=0;
    var hw=0;hh=0;
    var face = new Image();
    face.src=FACEURL;
    face.onload=onImgload;
    function onImgload(){
        playface.image=face;
        playface.TittleX=canvas.width/2-tw/2;
        playface.TittleY=canvas.height/4-th/2;
        playface.ButtonX=canvas.width/2-bw/2,
        playface.ButtonY=canvas.height/3*2-bh/2;
        playface.HelpX=canvas.width/2-hw/2,
        playface.HelpY=canvas.height*4/5-hh/2;
        requestAnimationFrame(animate0);
    }
    function animate0(){
        var now =+ new Date();
        if(now-lastTime>INTERVAL){
            lastTime=now;
            context.clearRect(0, 0,canvas.width, canvas.height);
            if(tw<=playface.TittleW && th<=playface.TittleH){
                tw+=PLAYFACE[1].width*0.04;
                th+=PLAYFACE[1].height*0.04;
            }
            else{
                if(bw<=playface.ButtonW && bh<=playface.ButtonH){
                    bw+=PLAYFACE[2].width*0.04;
                    bh+=PLAYFACE[2].height*0.04;
                }
                if(hw<=playface.HelpW && hh<=playface.HelpH){
                    hw+=PLAYFACE[3].width*0.04;
                    hh+=PLAYFACE[3].height*0.04;
                }
            }
            playface.TittleX=canvas.width/2-tw/2;
            playface.TittleY=canvas.height/4-th/2;
            playface.ButtonX=canvas.width/2-bw/2,
            playface.ButtonY=canvas.height/3*2-bh/2;
            playface.HelpX=canvas.width/2-hw/2,
            playface.HelpY=canvas.height*4/5-hh/2;
            context.drawImage(playface.image,PLAYFACE[0].x,PLAYFACE[0].y,PLAYFACE[0].width,PLAYFACE[0].height,//背景
                0, 0, canvas.width, canvas.height);
            context.drawImage(playface.image,PLAYFACE[1].x,PLAYFACE[1].y,PLAYFACE[1].width,PLAYFACE[1].height,//标题
                playface.TittleX,playface.TittleY,tw,th);
            context.drawImage(playface.image,PLAYFACE[2].x,PLAYFACE[2].y,PLAYFACE[2].width,PLAYFACE[2].height,//按钮
                playface.ButtonX,playface.ButtonY,bw,bh);
            context.drawImage(playface.image,PLAYFACE[3].x,PLAYFACE[3].y,PLAYFACE[3].width,PLAYFACE[3].height,//按钮
                playface.HelpX,playface.HelpY,hw,hh);    
        }
        if(bw<=playface.ButtonW && bh<=playface.ButtonH) requestAnimationFrame(animate0);
        else{
            nowSence=0;
        }
    }
});


function playSence1(){  //战斗
    nowSence=1;
    initEyeryThing();
    var im=new Image();
    im.src=BACKGROUNDURL;
    im.onload=function(){
        background.image=im; 
        background.width=im.width;
        background.height=im.height;
        background.midX=im.width/2;
        background.midY=im.height/2;
        createSnakes();
        createCrows();
        createLizards();
        backGroundMusic.play();
        requestAnimationFrame(animate1_1);//先打蛇
    }
}

function animate1_1(){    //战斗 打蛇
    now = +new Date;
    context.clearRect(0, 0, canvas.width, canvas.height);       
    drawBackGround();
    drawBombs();
    drawSnakes();
    drawBullets(now);
    drawTank(now);
    if(now-lastAdvance>=BULLET_INTERVAL){   //射速
        lastAdvance=now;
        if(isOnFire==true  && objTank.isDead==false) fireBullet(now);
    } 

    if(objTank.isDead==true){
        fireAudio.pause();
        playSence3();//死亡
    } 
    else if(deadMonster<3*snakesNum){
        requestAnimationFrame(animate1_1);
    }
    else{       //打死蛇,过度,打乌鸦
        fireAudio.pause();
        isOnFire=false;
        transit(1);
    }
}
function animate1_2(){  //战斗 打乌鸦
    now = +new Date;
    context.clearRect(0, 0, canvas.width, canvas.height);       
    drawBackGround();
    drawBombs();
    drawSnakes();
    drawCrows();
    drawBullets(now);
    drawTank(now);
    if(now-lastAdvance>=BULLET_INTERVAL){   //射速
        lastAdvance=now;
        if(isOnFire==true  && objTank.isDead==false) fireBullet(now);
    } 

    if(objTank.isDead==true){
        fireAudio.pause();
        playSence3();//死亡
    } 
    else if(deadMonster<3*snakesNum+crowsNum && deadMonster>=3*snakesNum) 
        requestAnimationFrame(animate1_2);
    else{
        fireAudio.pause();
        isOnFire=false;
        transit(2);
    }
}

function animate1_3(){  //战斗 打蜥蜴
    console.log(objTank.isDead);

    now = +new Date;
    context.clearRect(0, 0, canvas.width, canvas.height);       
    drawBackGround();
    drawBombs();
    drawSnakes();
    drawCrows();
    drawLizards();
    drawBullets(now);
    drawTank(now);
    if(now-lastAdvance>=BULLET_INTERVAL){   //射速
        lastAdvance=now;
        if(isOnFire==true  && objTank.isDead==false) fireBullet(now);
    } 

    if(objTank.isDead==true){
        fireAudio.pause();
        playSence3();//死亡
    } 
    else if(deadMonster>=3*snakesNum+crowsNum && deadMonster<3*snakesNum+crowsNum+lizardsNum) 
        requestAnimationFrame(animate1_3);
    else{
        fireAudio.pause();
        isOnFire=false;
        transit(3);
    }
}

function animate1_4(){  //战斗 打狼
    now = +new Date;
    context.clearRect(0, 0, canvas.width, canvas.height);       
    drawBackGround();
    drawBombs();
    drawSnakes();
    drawCrows();
    drawLizards();
    drawBullets(now);
    drawTank(now);
    objAngry.paint(context);
    objWolf.paint(context);
    if(now-lastAdvance>=BULLET_INTERVAL){   //射速
        lastAdvance=now;
        if(isOnFire==true  && objTank.isDead==false) fireBullet(now);
    } 
    if(objTank.isDead==true){
        fireAudio.pause();
        playSence3();//死亡
    } 
    else if(objWolf.isDead==true){
        fireAudio.pause();
        playSence4();//赢
    }
    else 
        requestAnimationFrame(animate1_4);
}

function playSence2(num) {//介绍页面
    nowSence=2;
    var intropage = new Image();
    intropage.src = INTRODUCTION;
    intropage.onload=function(){
        introduction.image = intropage; 
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(playface.image,PLAYFACE[0].x,PLAYFACE[0].y,PLAYFACE[0].width,PLAYFACE[0].height,
            0, 0, canvas.width, canvas.height);
        context.drawImage(introduction.image, PAGES[num].x, PAGES[num].y, PAGES[num].width, PAGES[num].height,
            25,25,PAGES[num].width,PAGES[num].height);
    }
}

var playSence3=(function(){//输
    nowSence=100;//设为100不能点击
    backGroundMusic.pause();
    dieAudio.play();
    //获取背景改为灰度图，降低透明度
    var imagedata = context.getImageData(0, 0, canvas.width, canvas.height);
    var data = imagedata.data;
    for(i=0;i<data.length-4;i+=4){
        average = (data[i]+data[i+1]+data[i+2])/3;
        data[i] = average;
        data[i+1] = average;
        data[i+2] = average;
        data[i+3] = data[i+3]/5*4;
    }

    //重新开始提示的文字属性
    context.save();
    context.textAlign='center';
    context.textBaseline='middle';
    context.fillStyle='white';
    context.font='20px sans-serif';
    context.globalAlpha=0;

    //死亡画面的淡入绘制
    var id = setInterval(() => {
        context.globalAlpha+=0.05;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.putImageData(imagedata, 0, 0);//背景
        context.drawImage(dead, canvas.width/2-dead.width/2, canvas.height/2-dead.height/2);//黑色背景
        context.drawImage(deadWord, canvas.width/2-deadWord.width/2, canvas.height/2-deadWord.height/2);//YOU DIED
        context.fillText("单击左键重新开始", canvas.width/2, canvas.height/2+dead.height/2+30);//重新开始提示
        if(context.globalAlpha>=0.9) {
            clearInterval(id);
            nowSence=3;
            context.globalAlpha=1;
            context.restore();
        }
    }, 100);
    
}); 

var playSence4=(function(){ //胜利
    backGroundMusic.pause();
    winAudio.play();
    nowSence=100; //设为100使得不能点击
    var step = 0;   //用来判断等待时间
    var up=0;   //图片上移
    var flag=false;

    context.globalAlpha=0;
    var imagedata = context.getImageData(0, 0, canvas.width, canvas.height);

    function drawWin(){
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.putImageData(imagedata, 0, 0);  //绘制背景
        context.drawImage(win, canvas.width/2-win.width/2,0-up);    //绘制win的图片，up增加图片上移  
    }
   //淡入
    var id = setInterval(() => {
        context.globalAlpha+=0.05;  //增加透明度 实现淡入
        drawWin();
        step++;
        if(step==30) {
            clearInterval(id);  //等待3s后清除定时器
            context.globalAlpha=1;  //将透明度恢复
            flag=true; 
        }
        //淡入之后 图片上移
        if(flag==true){
            var idd=setInterval(() => {
                if(up<=win.height-canvas.height) {
                    up+=win.height*0.005;
                    drawWin();
                }
                else{
                    nowSence=4;
                    clearInterval(idd);
                }
            }, 100);
        }
    }, 100);
});

function transit(n){//0为开始到战斗过渡 1为蛇到乌鸦 2乌鸦到蜥蜴 3蜥蜴到狼 4为战斗到死亡过度 5为战斗到胜利过度
    if(n==1){
        nowSence=100; //设为100使得不能点击
        var imagedata = context.getImageData(0, 0, canvas.width, canvas.height);
        var str=["恭喜你","已突出了飞蛇的包围","下一波怪物是变种乌鸦","它们速度极快，攻击力很高","但是生命值很低","祝你能活下来","单击以继续"];
        var index=0;
        function drawText(){
            context.globalAlpha=1;
            imagedata = context.getImageData(0, 0, canvas.width, canvas.height);
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.putImageData(imagedata, 0, 0);  //绘制背景
            context.font="bold 20px Arial";
            context.fillStyle="white";
            context.textAlign="center";
            context.textBaseline="middle";
            context.fillText(str[index],canvas.width/2,200+index*30);    
            index++;  
        }
        var id = setInterval(() => {      
            drawText();
            if(index==7){
                nowSence=11; //放完文字可以点击，在mousedown中可以转到下一关
                clearInterval(id);
            }
        }, 500);
    }
    if(n==2){
        nowSence=100; //设为100使得不能点击
        var imagedata = context.getImageData(0, 0, canvas.width, canvas.height);
        var str=["恭喜你","已突出了变种乌鸦的包围","下一波怪物是变种蜥蜴","它们已经掌握了使用攻击的方法","他们生命值高，伤害也很高","但行动迟缓","祝你能活下来","单击以继续"];
        var index=0;
        function drawText(){
            context.globalAlpha=1;
            imagedata = context.getImageData(0, 0, canvas.width, canvas.height);
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.putImageData(imagedata, 0, 0);  //绘制背景
            context.font="bold 20px Arial";
            context.fillStyle="white";
            context.textAlign="center";
            context.textBaseline="middle";
            context.fillText(str[index],canvas.width/2,200+index*30);    
            index++;  
        }
        var id = setInterval(() => {      
            drawText();
            if(index==8){
                nowSence=12; //放完文字可以点击，在mousedown中可以转到下一关
                clearInterval(id);
            }
        }, 500);
    }
    if(n==3){       
        nowSence=100; //设为100使得不能点击
        var imagedata = context.getImageData(0, 0, canvas.width, canvas.height);
        var str=["恭喜你","已突出了变种蜥蜴的包围","下一波怪物只有一个——————狼人！","它速度快，攻击力高，生命值高","它在血量只有1/3时会进入狂暴模式","见过这种状况下的人没有一个活下来.....","祝你好运，突出变异生物的包围！","单击以继续"];
        var index=0;
        function drawText(){
            context.globalAlpha=1;
            imagedata = context.getImageData(0, 0, canvas.width, canvas.height);
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.putImageData(imagedata, 0, 0);  //绘制背景
            context.font="bold 20px Arial";
            context.fillStyle="white";
            context.textAlign="center";
            context.textBaseline="middle";
            context.fillText(str[index],canvas.width/2,200+index*30);    
            index++;  
        }
        var id = setInterval(() => {      
            drawText();
            if(index==8){
                nowSence=13; //放完文字可以点击，在mousedown中可以转到下一关
                clearInterval(id);
            }
        }, 500);
    }
}

function init(){
    var magImage=new Image();
    var singleBombImage=new Image();
    var changeMagImage=new Image();
    // var rushLoadImage=new Image();
    magImage.src=MAGURL;
    singleBombImage.src=SINGLEBOMBURL;
    changeMagImage.src=CHANGEMAGURL;
    tankAttribute.magImage=magImage;
    tankAttribute.singleBombImage=singleBombImage;
    tankAttribute.changeMagImage=changeMagImage;
    // tankAttribute.rushLoadImage=rushLoadImage;
    playSence0();
}

init();
