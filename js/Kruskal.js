const BOX_SPEED = 0.008;
const MAX_ROTATION = 10;

const ctx = document.querySelector("canvas").getContext("2d");
const graph = [];
let edges = [];
let nextParent = [];
let parent = [];

let arr = []

function find_parent(parent,x){
    if(parent[x] != x)
        parent[x] = find_parent(parent,parent[x]);
    return parent[x];
}

function union_parent(parent,a,b){
    const a_p = find_parent(parent,a);
    const b_p = find_parent(parent,b);
    
    if(parent[a]<parent[b]){
        nextParent[b] = a;
    }
    else{
        nextParent[a] = b;
    }

    arr.push([a,b]);

    if(a_p<b_p){
        parent[b_p] = a_p;
    }
    else{ 
        parent[a_p] = b_p;
    }

}

function getDis(a,b){
    let width = a.x-b.x;
    let height = a.y-b.y;
    const dis = Math.sqrt(width*width+height*height);
    return Math.round(dis);
}

function solution(){
    let tempArr = edges.map(v=>v[0]);
    tempArr = tempArr.sort((a,b)=>a-b);

    for(let i=0;i<tempArr.length;i++){
        let num = tempArr[i];
        let edge = edges.find(v=>v[0]===num);
        const [cost,a,b] = edge;
        const a_p = find_parent(parent,a);
        const b_p = find_parent(parent,b);

        if(a_p != b_p){
            union_parent(parent,a,b);
        }
    }

}

class Point{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    add(pos){
        this.x += pos.x;
        this.y += pos.y;
        return this;
    }

    subtract(pos){
        this.x -= pos.x;
        this.y -= pos.y;
        return this;
    }

    product(value){
        this.x *= value;
        this.y *= value;
        return this;
    }

    clone(){
        return new Point(this.x,this.y);
    }
}

function random(x,op=0){
    return Math.random() * (x-op);
}

class Box{
    constructor(index,canvas,ctx){
        this.index = index;
        this.canvas = canvas;
        this.ctx = ctx;

        this.rotation = 0;

        this.width = 150*2;
        this.height = 150*2;
 
        this.curPosition = new Point(random(this.canvas.width,this.width + 100),random(this.canvas.height,this.height + 100)); // 현재위치
        this.clickStartPosition = new Point(this.curPosition.x,this.curPosition.y);
        this.clickPosition = new Point(this.curPosition.x + this.width/2,this.curPosition.y + this.height/2); // 클릭 시작위치
        this.target = new Point(this.curPosition.x + this.width/2,this.curPosition.y + this.height/2); // 타겟 위치
        this.clickPositionInBox = new Point(this.width/2,this.height/2); // 박스안에서 클릭위치
    }

    draw(){

        const moveAdd = (this.target.clone().subtract(this.clickPositionInBox)).subtract(this.curPosition).product(BOX_SPEED);
        const moveMent = this.curPosition.clone().add(moveAdd);
        this.curPosition = moveMent;

        this.setRotation();
        
    }

    setRotation(){
        
        const allDiff = this.target.clone().subtract(this.clickPositionInBox).subtract(this.clickStartPosition);
        const allDistance = Math.sqrt(allDiff.x*allDiff.x+allDiff.y*allDiff.y);

        const curDiff = this.target.clone().subtract(this.clickPositionInBox).subtract(this.curPosition);
        const curDistance = Math.sqrt(curDiff.x*curDiff.x+curDiff.y*curDiff.y);
        const halfDistance = allDistance / 2;
        let rotation = MAX_ROTATION-(MAX_ROTATION * (Math.abs(halfDistance - curDistance)/halfDistance));

        if(this.curPosition.x > this.target.x)
            rotation *= -1;
        
        

        ctx.save();
        ctx.translate(this.curPosition.x+this.width/2,this.curPosition.y+this.height/2);
        this.rotation = rotation;

        ctx.rotate(Math.PI / 180 *(this.rotation));
        
        this.drawBox();
        
        ctx.restore();
    }

    drawBox(){
        this.ctx.beginPath();
        this.ctx.fillStyle = "rgb(218, 39, 203)";
        // this.ctx.fillRect(this.curPosition.x,this.curPosition.y,this.width,this.height);
        this.ctx.fillRect(0-this.width/2,0-this.height/2,this.width,this.height);
        this.ctx.fillStyle = "white";

        this.ctx.font = "60px Arial";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";

        // this.ctx.fillText(this.index,this.curPosition.x+(this.width/2),this.curPosition.y+(this.height/2));
        this.ctx.fillText(this.index,0,0);
    }

    isCollide(mousePos){
        // console.log("index :",this.index);
        // console.log(`x : ${this.x} < ${mousePos.x} < ${this.x + this.width}`);
        // console.log(`y : ${this.y} < ${mousePos.y} < ${this.y + this.height}`);
        const result = (this.curPosition.x <= mousePos.x && this.curPosition.y <= mousePos.y && mousePos.x <= this.curPosition.x + this.width && mousePos.y <= this.curPosition.y + this.height);
        return result;
    }

    down(mousePos){
        this.clickPositionInBox = mousePos.subtract(this.curPosition);
        this.clickPosition = this.curPosition;
        this.clickStartPosition = this.curPosition; 
    }

    move(mousePos){
        this.target = mousePos;

    }

}

class App{
    constructor(){
        this.canvas = document.querySelector("#canvas");
        this.ctx = this.canvas.getContext("2d");

        this.boxNum = 10;
        this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1

        this.ctx.scale(this.pixelRatio,this.pixelRatio);

        this.resize();

        window.addEventListener("resize",this.resize.bind(this));
        
        
        this.canvas.addEventListener("mousemove",this.onMove.bind(this));
        this.canvas.addEventListener("mousedown",this.onDown.bind(this));
        this.canvas.addEventListener("mouseup",this.onUp.bind(this));

        this.boxArr = [];

        for(let i=0;i<this.boxNum;i++){
            this.boxArr[i] = new Box(i,this.canvas,this.ctx);
            graph[i] = [];
        }
        
        this.setGraph();

        this.render();

    }

    resize(){
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;

        this.canvas.width = this.stageWidth * this.pixelRatio;
        this.canvas.height = this.stageHeight * this.pixelRatio;

        this.ctx.shadowOffsetX = 3;
        this.ctx.shadowOffsetY = 3;
        this.ctx.shdowBlur = 16;
        this.ctx.shadowColor = `rgba(0,0,0,0.1)`;
    }

    render(){
        window.requestAnimationFrame(this.render.bind(this));

        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.setGraph();
        for(let i=0;i<this.boxArr.length;i++){
            let box = this.boxArr[i];
            box.draw();
        }

        if(this.curBox){
            this.ctx.fillStyle = "rgb(68, 50, 165)";
            // this.ctx.lineWidth = 7;
            // this.ctx.strokeStyle = 'rgb(68, 50, 165)';
            // this.ctx.moveTo(this.curBox.curPosition.x+this.curBox.clickPositionInBox.x,this.curBox.curPosition.y+this.curBox.clickPositionInBox.y);
            // this.ctx.lineTo(this.curBox.target.x,this.curBox.target.y);
            // this.ctx.stroke();
            this.ctx.arc(this.curBox.curPosition.x+this.curBox.clickPositionInBox.x,this.curBox.curPosition.y+this.curBox.clickPositionInBox.y,20,Math.PI*2,false);
            this.ctx.arc(this.curBox.target.x,this.curBox.target.y,20,Math.PI*2,false);
            this.ctx.fill()    
        }

        // this.setGraph();
        
    }

    onDown(e){
        const position = new Point(e.clientX,e.clientY);
        position.product(this.pixelRatio);
        for(let i=0;i<this.boxArr.length;i++){
            let index = this.boxArr.length-i-1;
            let box = this.boxArr[index];
            if(box.isCollide(position)){
                this.curBox = box;
                this.boxArr.push(this.boxArr.splice(index,1)[0]);
                this.curBox.down(position.clone());
                break;
            }
        }
    }

    onMove(e){
        if(this.curBox){
            const position = new Point(e.clientX,e.clientY);
            position.product(this.pixelRatio);
            this.curBox.move(position.clone());
        }
    }

    onUp(e){
        this.curBox = null;
    }

    setGraph(){
        arr = [];
        for(let i=0;i<this.boxArr.length;i++){
            let curBox = this.boxArr[i];
            let curBoxPos = new Point(curBox.curPosition.x+curBox.width/2,curBox.curPosition.y+curBox.height/2);
            for(let j=0;j<this.boxArr.length;j++){
                let compBox = this.boxArr[j];
                let compBoxPos = new Point(compBox.curPosition.x+compBox.width/2,compBox.curPosition.y+compBox.height/2);
                graph[curBox.index][compBox.index] = getDis(curBoxPos,compBoxPos);
            }
        }
        edges = [];
        for(let i = 0;i<this.boxNum-1;i++){
            for(let j=0;j<this.boxNum-1-i;j++){
                edges.push([graph[i][this.boxNum-1-j],i,this.boxNum-1-j]);
            }
        }
        for(let i=0;i<this.boxNum;i++){
            parent[i] = i;
            nextParent[i] = null;
        }

        solution();

        // nextParent.forEach((value,i)=>{
        //     if(value !== null){

        //         const startBox = this.boxArr.find(v=>v.index === i);
        //         const endBox = this.boxArr.find(v=>v.index === value);
        //         this.ctx.lineWidth = 13;
        //         this.ctx.strokeStyle = 'rgb(218, 39, 203)';
        //         this.ctx.moveTo(startBox.curPosition.x+startBox.width/2,startBox.curPosition.y+startBox.height/2);
        //         this.ctx.lineTo(endBox.curPosition.x+endBox.width/2,endBox.curPosition.y+endBox.height/2);
        //         this.ctx.stroke();
        //     }
        // })

        arr.forEach((value)=>{
            const [a,b] = value
            const startBox = this.boxArr.find(v=>v.index === a);
            const endBox = this.boxArr.find(v=>v.index === b);
            this.ctx.lineWidth = 13;
            this.ctx.strokeStyle = 'rgb(218, 39, 203)';
            this.ctx.moveTo(startBox.curPosition.x+startBox.width/2,startBox.curPosition.y+startBox.height/2);
            this.ctx.lineTo(endBox.curPosition.x+endBox.width/2,endBox.curPosition.y+endBox.height/2);
            this.ctx.stroke();
        })

    }
}



window.onload = ()=>{
    new App();
}