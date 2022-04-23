var Sprite = function (name, painter, behaviors) {
    if (name !== undefined) this.name = name;
    if (painter !== undefined) this.painter = painter;
    if (behaviors !== undefined) this.behaviors = behaviors;
};
Sprite.prototype={
    left: 0,        //绘制在canvas上的位置和大小
    top: 0,
    width: 50,
    height: 50,
    velocityX: 0,       //坦克的横向速度
    velocityY: 0,       //坦克的纵向速度    
    angle:0,
    deadAngle:0,
    velocity:0,         //子弹飞行速度 敌人运动的速度
    lastUpdate:0,       //上一次更新动画
    distanceToTank:0,      //用于比较敌人与tank     
    isDead:false,
    unconquered:false,
    isAngry:false,
    isAttacked:false,           //怪物是否被攻击    
    isAttacking:false,           //怪物是否在攻击
    firstAttacked:false,            //用于判断在视野外被打中，执行一次受攻击动画 
    bebombed:false,
    damage:0,
    attackRange:0,
    eyeRange:0,
    visible:true,
    bloodVolume:100,
    nowbloodVolume:100,
    painter: undefined, // object with paint(sprite, context)
    behaviors: [], 
    paint: function (context) {
        if (this.painter !== undefined && this.visible) {
            this.painter.paint(this, context);
        }
    },
    update: function (context, time) {
        for (var i = this.behaviors.length; i > 0; --i) {
            if(this.visible)this.behaviors[i - 1].execute(this, context, time);
        }
    },
}

var ImagePainter = function(imgUrl,cells){
    this.image=new Image;
    this.image.src=imgUrl;
    this.cells = cells || [];
    this.cellIndex = 0;
    this.cell=this.cells[this.cellIndex];
    this.nextAttack=4;      //用于绘制不同的攻击方式
    this.spead;             //运动速度  此速度为标定速度
    this.waitIndex;         //等待状态的index
    this.deadIndex;
    this.attackedIndex;     
    this.attackingIndex;     //攻击状态的index
    this.runIndex;          //运动状态的index
};
ImagePainter.prototype={
    advance : function(sprite){
        if(sprite.name=='tank'){        //对于坦克绘制行驶时的动画
            if(sprite.velocityX==0 && sprite.velocityY==0);
            else{
                sprite.painter.cell.left=(sprite.painter.cell.left+TANKWIDTH)%(4*TANKWIDTH);
            }
        }
        else if(sprite.name=='gatlin'){
            if(isOnFire==true){
                sprite.painter.cellIndex=(sprite.painter.cellIndex+1)%5;
                sprite.painter.cell=sprite.painter.cells[sprite.painter.cellIndex];
            }
        }
        else if(sprite.name=='fire'){
            if(isOnFire==true){
                sprite.painter.cellIndex=(sprite.painter.cellIndex+1)%2;
                sprite.painter.cell=sprite.painter.cells[sprite.painter.cellIndex];
            }
            else{
                sprite.painter.cellIndex=0;
                sprite.painter.cell=sprite.painter.cells[sprite.painter.cellIndex];
            }
        }
        else if(sprite.name=='bullet'){   
            sprite.painter.cellIndex=2;
            sprite.painter.cell=sprite.painter.cells[sprite.painter.cellIndex];
        }
        else if(sprite.name=='bomb'){
            sprite.painter.cellIndex=(sprite.painter.cellIndex+1)%13;
            sprite.painter.cell=sprite.painter.cells[sprite.painter.cellIndex];
            if((sprite.painter.cellIndex+1)%13==0){
                sprite.visible=false;
            }
        }
        else if(sprite.name=='angry'){
            sprite.painter.cellIndex=(sprite.painter.cellIndex+1)%7;
            sprite.painter.cell=sprite.painter.cells[sprite.painter.cellIndex];
        }
        else if(sprite.name=='wolf'){
            sprite.painter.cell.left=(sprite.painter.cell.left+WOLFWIDTH)%(4*WOLFWIDTH);
            if((sprite.painter.cell.left+WOLFWIDTH)%(4*WOLFWIDTH)==0 &&         //攻击动画结束：更换攻击方式，对tank造成伤害
                (sprite.painter.cellIndex==4||sprite.painter.cellIndex==5)){
                    sprite.isAttacking=false;
                    sprite.distanceToTank=Math.sqrt(Math.pow((sprite.left+sprite.width/2-objTank.left-objTank.width/2),2)
                                                    +Math.pow((sprite.top+sprite.height/2-objTank.top-objTank.height/2),2));
                    if(sprite.distanceToTank<=sprite.attackRange && objTank.isDead==false) 
                        objTank.nowbloodVolume-=sprite.damage;
                    if(objTank.nowbloodVolume<=0)
                        objTank.isDead=true;
                    if(sprite.painter.cellIndex==4)this.nextAttack=5
                    else this.nextAttack=4;
                }
            if(sprite.painter.cellIndex==7){{
                    sprite.width+=1;
                    sprite.height+=1;
                    if(sprite.width>=150 && sprite.isAngry==false){
                        sprite.nowbloodVolume+=sprite.bloodVolume/2;
                        sprite.isAngry=true;
                        sprite.unconquered=false;
                        sprite.painter.cellIndex=this.runIndex;
                        sprite.painter.cell=sprite.painter.cells[this.runIndex];
                        aowuAudio.pause();
                    }
                }
            }
            if((sprite.painter.cell.left+WOLFWIDTH)%(4*WOLFWIDTH)==0 &&             //用于判断第一次受到攻击
                (sprite.painter.cellIndex==sprite.painter.attackedIndex)){
                sprite.firstAttacked=true;
            }      
        }
        else if(sprite.name=='snake'){
            sprite.painter.cell.left=(sprite.painter.cell.left+SNAKEWIDTH)%(4*SNAKEWIDTH);
            if((sprite.painter.cell.left+SNAKEWIDTH)%(4*SNAKEWIDTH)==0 && 
                (sprite.painter.cellIndex==4||sprite.painter.cellIndex==5)){
                    sprite.isAttacking=false;
                    sprite.distanceToTank=Math.sqrt(Math.pow((sprite.left+sprite.width/2-objTank.left-objTank.width/2),2)
                                                    +Math.pow((sprite.top+sprite.height/2-objTank.top-objTank.height/2),2));
                    if(sprite.distanceToTank<=sprite.attackRange && objTank.isDead==false) 
                        objTank.nowbloodVolume-=sprite.damage;
                    if(objTank.nowbloodVolume<=0)
                        objTank.isDead=true;
                    if(sprite.painter.cellIndex==4)this.nextAttack=5
                    else this.nextAttack=4;
                }   
            if((sprite.painter.cell.left+SNAKEWIDTH)%(4*SNAKEWIDTH)==0 &&         
                (sprite.painter.cellIndex==sprite.painter.attackedIndex)){
                sprite.firstAttacked=true;
            }   
        }
        else if(sprite.name=='crow'){
            sprite.painter.cell.left=(sprite.painter.cell.left+CROWWIDTH)%(4*CROWWIDTH);
            if((sprite.painter.cell.left+CROWWIDTH)%(4*CROWWIDTH)==0 && 
                (sprite.painter.cellIndex==4||sprite.painter.cellIndex==5)){
                    sprite.isAttacking=false;
                    sprite.distanceToTank=Math.sqrt(Math.pow((sprite.left+sprite.width/2-objTank.left-objTank.width/2),2)
                                                    +Math.pow((sprite.top+sprite.height/2-objTank.top-objTank.height/2),2));
                    if(sprite.distanceToTank<=sprite.attackRange && objTank.isDead==false) 
                        objTank.nowbloodVolume-=sprite.damage;
                    if(objTank.nowbloodVolume<=0)
                        objTank.isDead=true;
                    if(sprite.painter.cellIndex==4)this.nextAttack=5
                    else this.nextAttack=4;
                }
            if((sprite.painter.cell.left+CROWWIDTH)%(4*CROWWIDTH)==0 &&         
                (sprite.painter.cellIndex==sprite.painter.attackedIndex)){
                sprite.firstAttacked=true;
            }   
        }
        else if(sprite.name=='lizard'){
            if(sprite.painter.cellIndex==this.runIndex){
                if(sprite.painter.cell.top==2*LIZARDHEIGHT)sprite.painter.cell.top=7*LIZARDHEIGHT;
                else sprite.painter.cell.top=(sprite.painter.cell.top+LIZARDHEIGHT)%(8*LIZARDHEIGHT);
            }
            else sprite.painter.cell.left=(sprite.painter.cell.left+LIZARDWIDTH)%(4*LIZARDWIDTH);
            if((sprite.painter.cell.left+LIZARDWIDTH)%(4*LIZARDWIDTH)==0 &&        
                (sprite.painter.cellIndex==4||sprite.painter.cellIndex==5)){
                    sprite.distanceToTank=Math.sqrt(Math.pow((sprite.left+sprite.width/2-objTank.left-objTank.width/2),2)
                                                    +Math.pow((sprite.top+sprite.height/2-objTank.top-objTank.height/2),2));
                    if(sprite.distanceToTank<=sprite.attackRange && objTank.isDead==false) 
                        objTank.nowbloodVolume-=sprite.damage;
                    if(objTank.nowbloodVolume<=0)
                        objTank.isDead=true;
                    sprite.isAttacking=false;
                    if(sprite.painter.cellIndex==4)this.nextAttack=5
                    else this.nextAttack=4;
                }
            if((sprite.painter.cell.left+LIZARDWIDTH)%(4*LIZARDWIDTH)==0 &&         
                (sprite.painter.cellIndex==sprite.painter.attackedIndex)){
                sprite.firstAttacked=true;
            }
        }
    },
    //选择方向
    chooseDirection :function(sprite){
        if(sprite.name='tank'){         //0下 1左 2右 3上
            var x = sprite.velocityX,
                y = sprite.velocityY;
            if (x == 0 && y < 0) this.cellIndex = 3;
            else if (x == 0 && y > 0) this.cellIndex = 0;
            else if (x < 0) this.cellIndex = 2;
            else if (x > 0) this.cellIndex = 1;
            this.cell=this.cells[this.cellIndex];
        }
    },
    chooseState:function(sprite){   //用于怪物
        sprite.distanceToTank=Math.sqrt(Math.pow((sprite.left+sprite.width/2-objTank.left-objTank.width/2),2)
                                        +Math.pow((sprite.top+sprite.height/2-objTank.top-objTank.height/2),2));
        for(var i = 0;i<bullets.length;i++){//判断是否被打中
            var bulletX=bullets[i].left+bullets[i].height/2,
                bulletY=bullets[i].top+bullets[i].width*4/5,
                spriteX=sprite.left+sprite.width/2,
                spriteY=sprite.top+sprite.height/2,
                spriteR=(sprite.width+sprite.height)/4;
            var cd=Math.sqrt((Math.pow((bulletX-spriteX),2)+Math.pow((bulletY-spriteY),2)));
            if(bulletX>=canvas.width+10 || bulletX<=-10 ||bulletY>=canvas.height+10||bulletY<=-10)
                bullets[i].visible=false;
            if(cd<=spriteR && bullets[i].visible==true && sprite.unconquered==false){   
                if(sprite.nowbloodVolume>0){        //打中
                    if(bullets[i].firstAttacked==false){
                        bullets[i].firstAttacked=true;
                        hitAudio.play();
                    }
                    bullets[i].visible=false;
                    sprite.isAttacked=true;
                    sprite.nowbloodVolume-=bullets[i].damage;
                }
            }
        }
        for(var i=0;i<bombs.length;i++){
            var bombX=bombs[i].left+bombs[i].height/2,
                bombY=bombs[i].top+bombs[i].width/2,
                spriteX=sprite.left+sprite.width/2,
                spriteY=sprite.top+sprite.height/2,
                spriteR=(sprite.width+sprite.height)/3;
            var cd=Math.sqrt((Math.pow((bombX-spriteX),2)+Math.pow((bombY-spriteY),2)));
            if(bombs[i].firstAttacked==false  && bombs[i].painter.cellIndex==8){//bomb的声音
                bombs[i].firstAttacked=true;
                bombAudio.play();
            }
            if(bombs[i].attackRange+spriteR>cd && (bombs[i].painter.cellIndex==8||bombs[i].painter.cellIndex==9)&&(sprite.bebombed==false)){ 
                sprite.bebombed=true
                sprite.isAttacked=true;
                sprite.nowbloodVolume-=bombs[i].damage;
            }
            if(sprite.nowbloodVolume<=0 && sprite.isDead==false){
                deadMonster++;              //死亡怪物加1
                sprite.isDead=true;
                sprite.deadAngle=sprite.angle+Math.PI/2;    //记录死亡时的角度，不再根据tank移动而改变
            }
        }
        if(sprite.name=='wolf'){
            if(sprite.isAngry==false){
                sprite.attackRange=WOLF_ATTACK_RANGE;
                sprite.eyeRange=WOLF_EYE_RANGE;
                this.spead=WOLF_SPEAD;
            }
            else{
                this.spead=WOLF_ANGRY_SPEAD;
                sprite.damage=WOLF_ANGRY_DAMAGE;
                sprite.attackRange=WOLF_ANGRY_ATTACK_RANGE;
            }
            this.waitIndex=1;
            this.attackingIndex=[4,5];
            this.runIndex=0;
            this.attackedIndex=3;
            this.deadIndex=6;
        }
        else if(sprite.name=='snake'){
            this.spead=SNAKE_SPEAD;
            this.waitIndex=1;
            this.attackingIndex=[4,5];
            this.runIndex=1;
            this.attackedIndex=3;
            this.deadIndex=0;
        }
        else if(sprite.name=='crow'){
            this.spead=CROW_SPEAD;
            this.waitIndex=7;
            this.attackingIndex=[4,5];
            this.runIndex=0;
            this.attackedIndex=3;
            this.deadIndex=6;
        }
        else if(sprite.name=='lizard'){
            this.spead=LIZARD_SPEAD;
            this.waitIndex=7;
            this.attackingIndex=[4,5];
            this.runIndex=0;
            this.attackedIndex=3;
            this.deadIndex=6;
        }
        //开始判断状态
        if((sprite.distanceToTank >= sprite.eyeRange && sprite.firstAttacked==false)||sprite.isAttacking==true||sprite.nowbloodVolume<=0)  sprite.velocity=0;
        else  sprite.velocity=this.spead;
        if(sprite.distanceToTank>sprite.eyeRange && sprite.isAttacked==true && sprite.firstAttacked==false && sprite.isDead==false){//在视野外，正在被攻击，第一次被打 被攻击状态
            sprite.painter.cellIndex=this.attackedIndex;
            sprite.painter.cell=sprite.painter.cells[this.attackedIndex];
        }
        else if(sprite.name=="wolf" && objWolf.nowbloodVolume==objWolf.bloodVolume/3 && sprite.isAngry==false){       //狼的狂暴状态
            sprite.unconquered=true;
            sprite.velocity=0;
            aowuAudio.play();
            sprite.painter.cellIndex=7;
            sprite.painter.cell=sprite.painter.cells[7];
        }
        else if(sprite.velocity==0 && sprite.nowbloodVolume<=0){//死亡
            sprite.painter.cellIndex=this.deadIndex;
            sprite.painter.cell=sprite.painter.cells[this.deadIndex];
        }
        else if(sprite.velocity==0 && sprite.isAttacking==false){          //等待状态
            sprite.isAttacking=false;
            sprite.painter.cellIndex=this.waitIndex;
            sprite.painter.cell=sprite.painter.cells[this.waitIndex];
        }
        else if(sprite.velocity!=0 && sprite.distanceToTank>=sprite.attackRange){    //行走状态
            sprite.painter.cellIndex=this.runIndex;
            sprite.painter.cell=sprite.painter.cells[this.runIndex];
        }
        else if(sprite.distanceToTank<sprite.attackRange){                       //攻击
            attackAudio.play();
            sprite.isAttacking=true;
            sprite.painter.cellIndex=this.nextAttack;
            sprite.painter.cell=sprite.painter.cells[this.nextAttack];
        }
    },
    paint :function(sprite,context){
        if(sprite.name=='tank'){
            this.chooseDirection(sprite);
            drawBlood(sprite,context);
            if (this.image !== undefined) {   
                if ( ! this.image.complete) {
                    var r=this;
                    this.image.onload = function (e) {
                        context.drawImage(this,
                            r.cell.left,r.cell.top,r.cell.width,r.cell.height,
                            sprite.left,sprite.top,sprite.width,sprite.height);
                    }
                }
                else {
                    if(objTank.isDead==false)
                        context.drawImage(this.image, 
                            this.cell.left,this.cell.top,this.cell.width,this.cell.height,
                            sprite.left,sprite.top,sprite.width,sprite.height); //绘制在canvas上的位置
                        if(isSprinting==true){
                            switch(sprite.painter.cellIndex){
                                case 0:
                                    context.save();
                                    context.translate(sprite.left+sprite.width/2,sprite.top+sprite.height/2);
                                    context.rotate(Math.PI);
                                    context.drawImage(this.image,
                                        this.cells[4].left,this.cells[4].top,this.cells[4].width,this.cells[4].height,
                                        -30,15,sprite.width,sprite.height);
                                    context.restore();
                                    break;
                                case 1:
                                    context.save();
                                    context.translate(sprite.left,sprite.top);
                                    context.rotate(Math.PI/2);
                                    context.drawImage(this.image,
                                        this.cells[4].left,this.cells[4].top,this.cells[4].width,this.cells[4].height,
                                        0,-20,sprite.width,sprite.height);
                                    context.restore();
                                    break;
                                case 2:
                                    context.save();
                                    context.translate(sprite.left+sprite.width,sprite.top+sprite.height);
                                    context.rotate(-Math.PI/2);
                                    context.drawImage(this.image,
                                        this.cells[4].left,this.cells[4].top,this.cells[4].width,this.cells[4].height,
                                        0,-20,sprite.width,sprite.height);
                                    context.restore();
                                    break;
                                case 3:
                                    context.drawImage(this.image,
                                        this.cells[4].left,this.cells[4].top,this.cells[4].width,this.cells[4].height,
                                        sprite.left,sprite.top+40,sprite.width,sprite.height);
                                        break;
                            }
                        }    
                    else{
                        context.save();
                        context.globalAlpha=0.6;
                        context.drawImage(this.image, 
                            this.cell.left,this.cell.top,this.cell.width,this.cell.height,
                            sprite.left,sprite.top,sprite.width,sprite.height);
                        context.restore();
                    }
                }
            }    
        }
        else if(sprite.name=='gatlin'){
           sprite.update(context,(+ new Date));
           if (this.image !== undefined) {   
                if ( ! this.image.complete) {
                    var r=this;
                    this.image.onload = function (e) {
                        //加特林跟随鼠标旋转
                        context.save();
                        context.translate(sprite.left+sprite.width/2, sprite.top+sprite.height/2);
                        var angle = -Math.atan2((point.x-sprite.left-sprite.width/2),(point.y-sprite.top-sprite.height/2)) + Math.PI;
                        context.rotate(angle);
                        context.drawImage(this, 
                            r.cell.left,r.cell.top,r.cell.width,r.cell.height,
                             -sprite.width/2,-sprite.height/2,sprite.width,sprite.height);
                        context.restore();
                        }
                }
                else {
                    if(objTank.isDead==false){
                        context.save();
                        context.translate(sprite.left+sprite.width/2, sprite.top+sprite.height/2);
                        var angle = -Math.atan2((point.x-sprite.left-sprite.width/2),(point.y-sprite.top-sprite.height/2)) + Math.PI;
                        context.rotate(angle);
                        context.drawImage(this.image, 
                                this.cell.left,this.cell.top,this.cell.width,this.cell.height,
                                -sprite.width/2,-sprite.height/2,sprite.width,sprite.height);
                        context.restore();
                    }
                    else{
                        context.save();
                        context.translate(objTank.left+objTank.width/2-35,objTank.top+objTank.height/2+10);
                        context.rotate(Math.PI/3);
                        context.globalAlpha=0.6;
                        context.drawImage(this.image, 
                                this.cell.left,this.cell.top,this.cell.width,this.cell.height,
                                -sprite.width/2-10,-sprite.height/2-10,sprite.width,sprite.height);
                        context.restore();
                    }  
                }
            }    
        }
        else if(sprite.name=='fire' && objTank.isDead==false){
            sprite.update(context,(+ new Date));
            if (this.image !== undefined) {   
                if ( ! this.image.complete) {
                    var r=this;
                    this.image.onload = function (e) {
                        context.save();
                        context.translate(sprite.left+objGatlin.width/2, sprite.top+objGatlin.height/2);
                        var angle = -Math.atan2((point.x-objGatlin.left-objGatlin.width/2),(point.y-objGatlin.top-objGatlin.height/2)) + Math.PI/2;
                        context.rotate(angle);
                        context.drawImage(this, 
                            r.cell.left,r.cell.top,r.cell.width,r.cell.height,
                            objGatlin.width/2-sprite.width/2+20,objGatlin.height/2-sprite.height/2-27,sprite.width,sprite.height);
                        context.restore();
                        }
                }
                else {
                    context.save();
                    context.translate(sprite.left+objGatlin.width/2, sprite.top+objGatlin.height/2);
                    var angle = -Math.atan2((point.x-objGatlin.left-objGatlin.width/2),(point.y-objGatlin.top-objGatlin.height/2)) + Math.PI/2;
                    context.rotate(angle);
                    context.drawImage(this.image, 
                        this.cell.left,this.cell.top,this.cell.width,this.cell.height,
                        objGatlin.width/2-sprite.width/2+20,objGatlin.height/2-sprite.height/2-27,sprite.width,sprite.height);
                    context.restore();
                        
                }
            }    
        }
        else if(sprite.name=='bullet'){
            sprite.update(context,(+ new Date));
            context.save();
            context.translate(sprite.left+objGatlin.width/2-2, sprite.top+objGatlin.height/2);
            context.rotate(sprite.angle);
            context.drawImage(this.image, 
                this.cell.left,this.cell.top,this.cell.width,this.cell.height,
                -sprite.width/2+20,-sprite.height/2,sprite.width,sprite.height);
            context.restore();
        }
        else if(sprite.name=="bomb"){
            sprite.update(context,(+new Date));
            context.drawImage(this.image,
                this.cell.left,this.cell.top,this.cell.width,this.cell.height,
                sprite.left,sprite.top,sprite.width,sprite.height);
        }
        else if(sprite.name=='snake'||sprite.name=='crow'||sprite.name=='lizard'){
            drawBlood(sprite,context);
            this.chooseState(sprite);
            sprite.update(context,(+ new Date));
            if (this.image !== undefined) {   
                if ( ! this.image.complete) {
                    var r=this;
                    this.image.onload = function (e) {
                        sprite.paint(context);
                    }
                }
                else {
                    if(sprite.isDead==false){
                        if(sprite.angle+Math.PI/2<=0){
                            context.save();
                                context.drawImage(this.image, 
                                    this.cell.left,this.cell.top,this.cell.width,this.cell.height,
                                    sprite.left,sprite.top,sprite.width,sprite.height);
                            context.restore();
                        }
                        else{
                            context.save();
                            context.translate(sprite.left+sprite.width/2, sprite.top+sprite.height/2);
                            context.scale(-1, 1);
                                context.drawImage(this.image, 
                                    this.cell.left,this.cell.top,this.cell.width,this.cell.height,
                                    -sprite.width/2,-sprite.height/2,sprite.width,sprite.height);
                            context.restore();
                        }
                    }
                    else{       //死后
                        if(sprite.deadAngle<=0){
                            context.save();
                            context.globalAlpha=0.6;
                            context.drawImage(this.image, 
                                    this.cell.left,this.cell.top,this.cell.width,this.cell.height,
                                    sprite.left,sprite.top,sprite.width,sprite.height);
                            context.restore();
                        }
                        else{
                            context.save();
                            context.globalAlpha=0.6;
                            context.translate(sprite.left+sprite.width/2, sprite.top+sprite.height/2);
                            context.scale(-1, 1);
                                context.drawImage(this.image, 
                                    this.cell.left,this.cell.top,this.cell.width,this.cell.height,
                                    -sprite.width/2,-sprite.height/2,sprite.width,sprite.height);
                            context.restore();
                        }
                    }
                }
            }    
        }
        else if(sprite.name=='wolf'){
            drawBlood(sprite,context);
            this.chooseState(sprite);
            sprite.update(context,(+ new Date));
            if (this.image !== undefined) {   
                if ( ! this.image.complete) {
                    var r=this;
                    this.image.onload = function (e) {
                        sprite.paint(context);
                    }
                }
                else {
                    if(sprite.isDead==false){
                        if(sprite.angle+Math.PI/2<=0){
                            context.save();
                                context.drawImage(this.image, 
                                    this.cell.left,this.cell.top,this.cell.width,this.cell.height,
                                    sprite.left,sprite.top,sprite.width,sprite.height);
                            context.restore();
                        }
                        else{
                            context.save();
                            context.translate(sprite.left+sprite.width/2, sprite.top+sprite.height/2);
                            context.scale(-1, 1);
                                context.drawImage(this.image, 
                                    this.cell.left,this.cell.top,this.cell.width,this.cell.height,
                                    -sprite.width/2,-sprite.height/2,sprite.width,sprite.height);
                            context.restore();             
                        }
                    }
                    else{       //死后
                        if(sprite.deadAngle<=0){
                            context.save();
                            context.globalAlpha=0.6;
                            context.drawImage(this.image, 
                                    this.cell.left,this.cell.top,this.cell.width,this.cell.height,
                                    sprite.left,sprite.top,sprite.width,sprite.height);
                            context.restore();
                        }
                        else{
                            context.save();
                            context.globalAlpha=0.6;
                            context.translate(sprite.left+sprite.width/2, sprite.top+sprite.height/2);
                            context.scale(-1, 1);
                                context.drawImage(this.image, 
                                    this.cell.left,this.cell.top,this.cell.width,this.cell.height,
                                    -sprite.width/2,-sprite.height/2,sprite.width,sprite.height);
                            context.restore();
                        }
                    }
                }
            }    
        }
        else if(sprite.name=='angry'){
            if(objWolf.isAngry==true){
                sprite.update(context,(+ new Date));
                context.drawImage(this.image, 
                    this.cell.left,this.cell.top,this.cell.width,this.cell.height,
                    sprite.left,sprite.top,sprite.width,sprite.height);
            }
        }
    }
};

// 动作执行构造器
var ActionExecute = function (name) {
    this.lastUpdate = 0;
    this.name = name || "";
    if(name=="tankAction")   this.interval=TANK_INTERVAL;
    else if(name=="gatlinAction") this.interval=GATLIN_INTERVAL;
    else if(name=='fireAction') this.interval=FIRE_INTERVAL;
    else if(name=='bulletAction') this.interval=BULLET_INTERVAL;
    else if(name=='wolfAction') this.interval=WOLF_INTERVAL;
    else if(name=="snakeAction") this.interval=SNAKE_INTERVAL;
    else if(name=='crowAction') this.interval=CROW_INTERVAL;
    else if(name=='lizardAction')   this.interval=LIZARD_INTERVAL;
    else if(name=='angryAction')this.interval=ANGRY_INTERVAL;
    else if(name=="bombAction")this.interval=BOMB_INTERVAL;
    this.execute = function (sprite, context, time) {
        if (time - this.lastUpdate > this.interval) {
            this.lastUpdate = time;
            sprite.painter.advance(sprite);
        }
    }
};


// 移动执行器
var moveOfSprite = {
    execute: function (sprite, context, time) {
        // 动画跟踪
        if (sprite.name == "tank" && sprite.isDead==false ) {
            sprite.left += sprite.velocityX+background.velocityX;
            sprite.top += sprite.velocityY+background.velocityY;
        } 
        else if (sprite.name == "gatlin") {
            sprite.left = objTank.left+10;  
            sprite.top = objTank.top-8;
        }
        else if (sprite.name == "fire") {
            sprite.left = objGatlin.left;
            sprite.top = objGatlin.top;
        }
        else if(sprite.name=='bullet'){
            sprite.left += Math.cos(sprite.angle)*sprite.velocity;      
            sprite.top += Math.sin(sprite.angle)*sprite.velocity;
        }
        else if(sprite.name=='wolf'||sprite.name=='snake'||sprite.name=='crow'||sprite.name=='lizard'){       
            sprite.angle=-Math.PI/2+Math.atan2((sprite.left+sprite.width/2-objTank.left-objTank.width/2),(sprite.top+sprite.height/2-objTank.top-objTank.height/2));
            sprite.left -= Math.cos(sprite.angle)*sprite.velocity-background.velocityX;      
            sprite.top += Math.sin(sprite.angle)*sprite.velocity+background.velocityY;
        }
        else if(sprite.name=='bomb'){
            sprite.left+=background.velocityX;
            sprite.top+=background.velocityY;
        }
        else if(sprite.name=='angry'){
            objAngry.width=objWolf.width*1.5;
            objAngry.height=objWolf.height*1.5;
            sprite.left=objWolf.left-(sprite.width/2-objWolf.width/2);
            sprite.top=objWolf.top-(sprite.height/2-objWolf.height/2);
        }
    }
};