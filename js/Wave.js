
class Point{
    constructor(initX,initY,initAngle,initAgngleR,speed=0.05){//시작점x,시작점y,시작 각도,반지름
        this.x = initX;
        this.y = initY;
        this.initY = initY;
        this.r = 5;
        this.speed = speed;
        this.angle = initAngle;
        this.angleR = initAgngleR;
    }

    move(){
        this.angle += this.speed;
        this.y = this.initY + Math.sin(this.angle)*this.angleR;
        // console.log(this.y);
    }

    setPosition(setX,setY){
        this.x = setX;
        this.y = setY;
        this.initY = setY;
    }

    update(ctx){
        this.move();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        if(isFill){
            ctx.fillStyle = "black"; 
            ctx.fill();
        }
    }
}

let isStroke = false;
let isFill = false;
let pointNumber = 8;
let waveR = 120;
let waveTerm = 30; 
class groupPoints{
    constructor(length,stageWidth,stageHeight,ctx,angleR,color,startAngle){//점 개수,cavnas width,canvas height,context,반지름,색깔,시작각도
        this.pointLength = length;//점 개수
        this.stageWidth = stageWidth;//canvas width
        this.stageHeight = stageHeight;//canvas height
        this.pointDistance = this.stageWidth/(this.pointLength-1);// 점들 간격
        this.angleTerm = 360/this.pointLength;//각도의 격차 360/점들의 개수
        this.midY = this.stageHeight/ 2; 
        this.angleR = angleR;
        this.ctx = ctx;
        this.arr = [];
        this.fillStyle=color;
        this.startAngle = startAngle;

        this.arrInit();
    }

    arrInit(){
        this.arr[0] = new Point(0,this.midY,0,0,0);
        for(let i=1;i<this.pointLength-1;i++){
            this.arr[i] = new Point(this.pointDistance*i,this.midY,this.angleTerm * i+this.startAngle,this.angleR);
        }
        this.arr[this.pointLength-1] = new Point(this.stageWidth,this.midY,0,0,0);
    }

    update(){
        for(let i in this.arr){
            let point = this.arr[i];
            point.update(this.ctx);
        }
        this.joinPoint();
    }

    joinPoint(){
        let point = this.arr[1];
        let prevPoint = this.arr[0];
        this.ctx.moveTo(0,this.midY);
        for(let i = 0 ;i< this.arr.length; i++){
            point = this.arr[i];
            if(isStroke) this.ctx.lineTo(point.x, point.y);
            else this.ctx.quadraticCurveTo(prevPoint.x,prevPoint.y,(prevPoint.x+point.x)/2,(prevPoint.y+point.y)/2);
            prevPoint = point;
        }
        if(isStroke)this.ctx.lineTo(point.x,point.y);
        else this.ctx.quadraticCurveTo(prevPoint.x,prevPoint.y,point.x,point.y);
        this.ctx.lineTo(this.stageWidth,this.stageHeight);
        this.ctx.lineTo(0,this.stageHeight);
        this.ctx.fillStyle =this.fillStyle;
        this.ctx.fill();
    }

    setPosition(stageWidth,stageHeight){
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
        this.pointDistance = this.stageWidth/(this.pointLength-1);// 
        this.midY = this.stageHeight/ 2; 
        this.arrInit();
    }
}

let c;
class App{
    constructor(){
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);
        c = this.canvas;

        window.addEventListener("resize",this.resize.bind(this),false);
        this.groupArr = [
            new groupPoints(pointNumber,document.body.clientWidth,document.body.clientHeight,this.ctx,waveR,"rgba(255,0,0,0.4)",waveTerm*0),
            new groupPoints(pointNumber,document.body.clientWidth,document.body.clientHeight,this.ctx,waveR,"rgba(0,255,0,0.4)",waveTerm*1),
            new groupPoints(pointNumber,document.body.clientWidth,document.body.clientHeight,this.ctx,waveR,"rgba(0,0,255,0.4)",waveTerm*2),
        ];
        this.resize();
        this.loop = requestAnimationFrame(this.animate.bind(this));
    }

    resize(){
        this.stageWidth =document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;
        this.canvas.width = this.stageWidth;
        this.canvas.height = this.stageHeight;
        for(let i in this.groupArr){
            let group = this.groupArr[i];
            group.setPosition(this.stageWidth,this.stageHeight);
        }
        // this.ctx.scale(1,1);
    }

    reset(){
        this.groupArr = [
            new groupPoints(pointNumber,document.body.clientWidth,document.body.clientHeight,this.ctx,waveR,"rgba(255,0,0,0.4)",waveTerm*0),
            new groupPoints(pointNumber,document.body.clientWidth,document.body.clientHeight,this.ctx,waveR,"rgba(0,255,0,0.4)",waveTerm*1),
            new groupPoints(pointNumber,document.body.clientWidth,document.body.clientHeight,this.ctx,waveR,"rgba(0,0,255,0.4)",waveTerm*2),
        ];
    }

    animate(t){
        this.ctx.clearRect(0,0,this.stageWidth,this.stageHeight);
        for(let i in this.groupArr){
            this.groupArr[i].update();
        }
        requestAnimationFrame(this.animate.bind(this));
    }
}
let wave;
window.onload = () =>{
    wave = new App();
}

function resetWave(){
    wave.reset();
}
