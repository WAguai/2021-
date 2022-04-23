//----------------------------坦克参数------------------------
var TANKURL="static/images/tank1.png",
    TANKWIDTH=175,
    TANKHEIGHT=175,
    TANKECELLS=[
        {left: 0, top: 128,             width:TANKWIDTH, height: TANKHEIGHT},
        {left: 0, top: 128+TANKHEIGHT,  width: TANKWIDTH, height: TANKHEIGHT},
        {left: 0, top: 128+2*TANKHEIGHT, width: TANKWIDTH, height: TANKHEIGHT},
        {left: 0, top: 128+3*TANKHEIGHT, width: TANKWIDTH, height: TANKHEIGHT},
        {left: 0, top: 0, width: 64, height: 128},
    ],
    TANK_INTERVAL=100,
    TANK_SPEAD=0.8;

//----------------------------加特林参数------------------------
var GATLINURL='static/images/gatlin1.png',
    GATLINWIDTH=80,
    GATLINHEIGHT=144,
    GATLINCELLS=[
        {left: 0,   top: 0,   width: GATLINWIDTH, height: GATLINHEIGHT},
        {left: 80,  top: 0,   width: GATLINWIDTH, height: GATLINHEIGHT},
        {left: 160, top: 0,   width: GATLINWIDTH, height: GATLINHEIGHT},
        {left: 240, top: 0,   width: GATLINWIDTH, height: GATLINHEIGHT},
        {left: 0,   top: 144, width: GATLINWIDTH, height: GATLINHEIGHT},
        
    ],
    GATLIN_INTERVAL=50;
//---------------------------开火/子弹参数------------------------
var FIREBULLETURL='static/images/firebullet.png',
    MAGURL="static/images/mag.png",
    CHANGEMAGURL="static/images/changemag.gif",
    FIREBULLETCELLS=[
        {left: 0,   top: 0,   width: 10, height: 10},
        {left: 0,   top: 0,   width: 80, height: 80},
        {left: 80,  top: 0,   width: 84, height: 37},
    ],
    FIRE_INTERVAL=50,
    BULLET_INTERVAL=200,
    BULLET_SPEAD=10,
    BULLET_DAMAGE=10,
    BULLET_MAG=35,
    CHANGE_MAG_TIME=2000;

//----------------------------狼参数------------------------
var WOLFURL='static/images/wolf.png',
    WOLFWIDTH=100,
    WOLFHEIGHT=80,
    WOLFCELLS=[
        {left: 0,   top: 0,   width: WOLFWIDTH, height: WOLFHEIGHT},//走
        {left: 0,   top: 80,  width: WOLFWIDTH, height: WOLFHEIGHT},//停
        {left: 0,   top: 160, width: WOLFWIDTH, height: WOLFHEIGHT},//防御
        {left: 0,   top: 240, width: WOLFWIDTH, height: WOLFHEIGHT},//受到攻击
        {left: 0,   top: 320, width: WOLFWIDTH, height: WOLFHEIGHT},//右🤛
        {left: 0,   top: 400, width: WOLFWIDTH, height: WOLFHEIGHT},//左🤜
        {left: 0,   top: 480, width: WOLFWIDTH, height: WOLFHEIGHT},//死
        {left: 0,   top: 560, width: WOLFWIDTH, height: WOLFHEIGHT},//等待攻击
    ],
    WOLF_INTERVAL=80,
    WOLF_ATTACK_RANGE=30,
    WOLF_EYE_RANGE=600,//600
    WOLF_DAMAGE=20,
    WOLF_BLOOD=150,
    WOLF_SPEAD=1.5,
    WOLF_ANGRY_SPEAD=2*WOLF_SPEAD,
    WOLF_ANGRY_DAMAGE=2*WOLF_DAMAGE,
    WOLF_ANGRY_ATTACK_RANGE=2*WOLF_ATTACK_RANGE,
    WOLF_ANGRY_INTERVAL=WOLF_INTERVAL/2;
    
//----------------------------蛇参数------------------------
var SNAKEURL='static/images/snake.png',
    SNAKEWIDTH=80,
    SNAKEHEIGHT=80,
    SNAKECELLS=[
        {left: 0,   top: 0,   width: SNAKEWIDTH, height: SNAKEHEIGHT},//走
        {left: 0,   top: 80,  width: SNAKEWIDTH, height: SNAKEHEIGHT},//停
        {left: 0,   top: 160, width: SNAKEWIDTH, height: SNAKEHEIGHT},//防御
        {left: 0,   top: 240, width: SNAKEWIDTH, height: SNAKEHEIGHT},//受到攻击
        {left: 0,   top: 320, width: SNAKEWIDTH, height: SNAKEHEIGHT},//右🤛
        {left: 0,   top: 400, width: SNAKEWIDTH, height: SNAKEHEIGHT},//左🤜
        {left: 0,   top: 480, width: SNAKEWIDTH, height: SNAKEHEIGHT},//死
        {left: 0,   top: 560, width: SNAKEWIDTH, height: SNAKEHEIGHT},//等待攻击
    ],
    SNAKE_INTERVAL=100,
    SNAKE_ATTACK_RANGE=20,
    SNAKE_EYE_RANGE=200,//200
    SNAKE_DAMAGE=10,
    SNAKE_SPEAD=1.2,
    SNAKE_BLOODVOLUME=40;



//----------------------------乌鸦参数------------------------
var CROWURL='static/images/crow.png',
    CROWWIDTH=100,
    CROWHEIGHT=80,
    CROWCELLS=[
        {left: 0,   top: 0,   width: CROWWIDTH, height: CROWHEIGHT},//走
        {left: 0,   top: 80,  width: CROWWIDTH, height: CROWHEIGHT},//停
        {left: 0,   top: 160, width: CROWWIDTH, height: CROWHEIGHT},//防御
        {left: 0,   top: 240, width: CROWWIDTH, height: CROWHEIGHT},//受到攻击
        {left: 0,   top: 320, width: CROWWIDTH, height: CROWHEIGHT},//右🤛
        {left: 0,   top: 400, width: CROWWIDTH, height: CROWHEIGHT},//左🤜
        {left: 0,   top: 480, width: CROWWIDTH, height: CROWHEIGHT},//死
        {left: 0,   top: 560, width: CROWWIDTH, height: CROWHEIGHT},//等待攻击
    ],
    CROW_INTERVAL=100,
    CROW_ATTACK_RANGE=30,
    CROW_EYE_RANGE=400,//400
    CROW_DAMAGE=30,
    CROW_SPEAD=2,
    CROW_BLOODVOLUME=30;

//----------------------------蜥蜴参数------------------------
var LIZARDURL='static/images/lizard.png',
    LIZARDWIDTH=110,
    LIZARDHEIGHT=80,
    LIZARDCELLS=[
        {left: 0,   top: 0,   width: LIZARDWIDTH, height: LIZARDHEIGHT},//走
        {left: 0,   top: 80,  width: LIZARDWIDTH, height: LIZARDHEIGHT},//停
        {left: 0,   top: 160, width: LIZARDWIDTH, height: LIZARDHEIGHT},//防御
        {left: 0,   top: 240, width: LIZARDWIDTH, height: LIZARDHEIGHT},//受到攻击
        {left: 0,   top: 320, width: LIZARDWIDTH, height: LIZARDHEIGHT},//右🤛
        {left: 0,   top: 400, width: LIZARDWIDTH, height: LIZARDHEIGHT},//左🤜
        {left: 0,   top: 480, width: LIZARDWIDTH, height: LIZARDHEIGHT},//死
        {left: 0,   top: 560, width: LIZARDWIDTH, height: LIZARDHEIGHT},//等待攻击
    ],
    LIZARD_INTERVAL=100,
    LIZARD_ATTACK_RANGE=20,
    LIZARD_EYE_RANGE=300,//300
    LIZARD_DAMAGE=30,
    LIZARD_SPEAD=1.2,
    LIZARD_BLOODVOLUME=60;
//--------------------封面参数--------------------
var BACKGROUNDURL='static/images/grass.jpeg';
var FACEURL="static/images/playface.png";
var PLAYFACE=[
    {x:10 ,y:10 ,width:1269 ,height: 1275}, //background
    {x:1299 ,y:10 ,width:400 ,height: 190}, //tittle
    {x:1299 ,y:300 ,width:200 ,height: 55}, //button_play
    {x:1299 ,y:220 ,width:200 ,height: 60}, //botton_help
];
//------------------介绍页面参数--------------
var INTRODUCTION='static/images/introduction.png',
    PAGEWIDTH = 750,
    PAGEHEIGHT = 550,
    PAGES =[
        {x:10,y:580,width:PAGEWIDTH,height:PAGEHEIGHT},
        {x:780,y:10,width:PAGEWIDTH,height:PAGEHEIGHT},
        {x:10,y:10,width:PAGEWIDTH,height:PAGEHEIGHT}
    ],
    BOTTON=[
        {x:580,y:490,width:60,height:60},
        {x:670,y:490,width:60,height:60},
        {x:380,y:490,width:180,height:50}
    ];

//----------------------------生气参数------------------------

var ANGRYEYEURL="static/images/angryEye.png",
    ANGRYURL="static/images/angry2.png",
    ANGRYCELLS=[
        {left:0,    top:0, width:300, height:210},
        {left:300,  top:0, width:312, height:210},
        {left:612,  top:0, width:315, height:210},
        {left:927,  top:0, width:326, height:210},
        {left:1253, top:0, width:326, height:210},
        {left:1579, top:0, width:326, height:210},
        {left:1905, top:0, width:326, height:210},
    ],
    ANGRY_INTERVAL=100;
//-----------------------炸弹参数------------
var BOMBURL="static/images/bomb.png",
    SINGLEBOMBURL="static/images/singlebomb.png",
    BOMBWIDTH=32,
    BOMBHEIGHT=64,
    BOMBCELLS=[
        {left:BOMBWIDTH*0,  top:0, width:BOMBWIDTH, height:BOMBHEIGHT},
        {left:BOMBWIDTH*1,  top:0, width:BOMBWIDTH, height:BOMBHEIGHT},
        {left:BOMBWIDTH*2,  top:0, width:BOMBWIDTH, height:BOMBHEIGHT},
        {left:BOMBWIDTH*3,  top:0, width:BOMBWIDTH, height:BOMBHEIGHT},
        {left:BOMBWIDTH*4,  top:0, width:BOMBWIDTH, height:BOMBHEIGHT},
        {left:BOMBWIDTH*5,  top:0, width:BOMBWIDTH, height:BOMBHEIGHT},
        {left:BOMBWIDTH*6,  top:0, width:BOMBWIDTH, height:BOMBHEIGHT},
        {left:BOMBWIDTH*7,  top:0, width:BOMBWIDTH, height:BOMBHEIGHT},
        {left:BOMBWIDTH*8,  top:0, width:BOMBWIDTH, height:BOMBHEIGHT},
        {left:BOMBWIDTH*9,  top:0, width:BOMBWIDTH, height:BOMBHEIGHT},
        {left:BOMBWIDTH*10, top:0, width:BOMBWIDTH, height:BOMBHEIGHT},
        {left:BOMBWIDTH*11, top:0, width:BOMBWIDTH, height:BOMBHEIGHT},
        {left:BOMBWIDTH*12, top:0, width:BOMBWIDTH, height:BOMBHEIGHT},
    ],
    BOMB_INTERVAL=100,
    BOMB_DAMAGE=20,
    BOMB_ATTACK_RANGE=20;


//-----------------------音频参数---------------
var FIRESOUNDURL="static/audios/fire.mp3";
var AOWUSOUNDURL="static/audios/aowu.mp3";
var BACKGROUNDSOUNDURL="static/audios/bgm.mp3";
var HITSOUNDURL="static/audios/hit.mp3";
var ATTACKSOUNDURL="static/audios/attack.wav";
var STARTSOUNDURL="static/audios/start1.mp3";
var WINSOUNDURL="static/audios/win.mp3";
var CHANGEMAGSOUNDURL="static/audios/changemag.wav";
var BOMBSOUNDURL="static/audios/bomb.mp3";
var DIESOUNDURL="static/audios/die.mp3";
var RUSHSOUNDURL="static/audios/rush.mp3";
var FIRESOUNDURL="static/audios/fire.mp3";