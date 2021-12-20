let isBall = true;
let isFill = false;
let isStroke = false;
let number = 3;
let sideLength = 200; 
const eIsBall = document.querySelector("#check_isBall");
const eIsFill = document.querySelector("#check_isFill");
const eIsStroke = document.querySelector("#check_isStroke");
const eNumber= document.querySelector("#number");
const eLength = document.querySelector("#length");
eNumber.value = number;
eLength.value = sideLength;
class Polygon{
    constructor(polyNumber,ctx,r){
        this.polyNumber = polyNumber;
        this.angleTerm = Math.PI*2/this.polyNumber; 
        this.r = r;
        this.ctx = ctx;
    }

    update(){
        this.ctx.beginPath();
        for(let i=0;i<this.polyNumber;i++){
                const x = Math.cos(this.angleTerm * i) * this.r;
                const y = Math.sin(this.angleTerm * i) * this.r;
                if(isBall){
                    this.ctx.beginPath();
                    this.ctx.arc(x,y,15,0,Math.PI*2,false);
                    this.ctx.fill();
                    this.ctx.closePath();
                }
                if(isFill || isStroke){console.log("emtoo");(i===0)?this.ctx.moveTo(x,y):this.ctx.lineTo(x,y)};
        }
        if(isStroke)this.ctx.stroke();
        if(isFill)this.ctx.fill();
        this.ctx.closePath();
    }
}



class App{
    constructor(polyNumber,r){
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);
        this.resize();

        this.rotateAngle = 0;
        this.rotateSpeed = 0;

        this.polyNumber = polyNumber;
        this.polygon = new Polygon(this.polyNumber,this.ctx,r);
        this.polygon.update();

        this.canvas.addEventListener("mousedown",this.down.bind(this));
        this.canvas.addEventListener("mousemove",this.move.bind(this));
        this.canvas.addEventListener("mouseup",this.up.bind(this));
        window.addEventListener("resize",()=>{
            this.resize();
        });

        requestAnimationFrame(this.update.bind(this));
    }

    resize(){
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;

        this.canvas.width = this.stageWidth;
        this.canvas.height= this.stageHeight;
    }

    down(e){
        this.isDown = true;
        this.startDown = e.clientX; 
    }

    move(e){
        if(this.isDown){
            this.rotateSpeed = (this.startDown - e.clientX)*0.001;
        }
    }

    up(){
        this.isDown = false;
    }

    update(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.ctx.save();
            this.ctx.translate(this.stageWidth/2,this.stageHeight/2);
            this.ctx.rotate(this.rotateAngle);
            this.rotateAngle += this.rotateSpeed;
            this.polygon.update();
            this.rotateSpeed *= 0.9;
        this.ctx.restore();
        
        requestAnimationFrame(this.update.bind(this));
    }
}
let app;
function reset(){
    app.polygon = new Polygon(number,app.ctx,sideLength);
}
window.onload = ()=>{
    app = new App(number,sideLength);
}

eIsBall.addEventListener("change",e=>{
    isBall = true;
    isFill = false;
    isStroke = false;
    console.log("ball ",isBall)
})

eIsFill.addEventListener("change",e=>{
    isBall = false;
    isFill = true;
    isStroke = false;
    console.log("fill ",isFill)
})

eIsStroke.addEventListener("change",e=>{
    isBall = false;
    isFill = false;
    isStroke = true;
    console.log("str ",isStroke)
})

eNumber.addEventListener("change",e=>{
    number=Number(e.target.value);
    reset()
})

eLength.addEventListener("change",e=>{
    sideLength=Number(e.target.value);
    reset()
})