/*
CanvasGUI 圖形介面繪製函式庫(HTML5) by a0000778
*/
function CanvasGUI(createAt,config){
	var thisobj=this;
	//設定處理
	this.config={
		//'statusUpdateFreq': 1000//狀態更新頻率(間隔ms)，僅於創建物件時有效
		'width': 800,//畫面寬度
		'height': 600,//畫面高度
		'bgColor': '#000000',//基底顏色
	};
	if(typeof config=='object'){
		for(i in config){
			if(this.config[i]){
				this.config[i]=config[i];
			}
		}
	}
	
	//物件繪製陣列
	this.drawObj=[];
	
	//建立canvas元素，並掛上相關事件
	this.domParent=createAt;
	this.domObj=document.createElement('canvas');
	this.domObj.setAttribute('width',this.config.width);
	this.domObj.setAttribute('height',this.config.height);
	this.domObj.addEventListener('contextmenu',function(e){e.preventDefault();});//停用右鍵選單
	this.domObj.addEventListener('mousedown',function(e){thisobj.eventMouseDown(e);});
	this.domObj.addEventListener('mouseup',function(e){thisobj.eventMouseUp(e);});
	this.domObj.addEventListener('mousemove',function(e){thisobj.eventMouseMove(e);});
	this.domObj.addEventListener('click',function(e){thisobj.eventMouseClick(e);});
	this.domParent.appendChild(this.domObj);
	this.obj=this.domObj.getContext('2d');
	
	//執行狀態
	this.status={
		'fps': 0,
		'fpsUpdateTime': new Date().getTime(),//上次fps計算時間
		'fpsCountScreen': 0 //本次累計更新次數
	}
	
	//事件處理
	this.update={
		'screen': null,
		'status': setInterval(function(){thisobj.statusUpdate();},(config.statusUpdateFreq? config.statusUpdateFreq:1000)),
	}
	this.screenUpdate();
}
CanvasGUI.prototype.createDrawObject=function(drawObject){
	if('undefined'!==typeof drawObject.domParent) drawObject.domParent=this.domParent;
	if('undefined'!==typeof drawObject.domObj) drawObject.domObj=this.domObj;
	if('undefined'!==typeof drawObject.canvasObj) drawObject.canvasObj=this.obj;
	this.drawObj.push(drawObject);
	if('undefined'!==typeof drawObject.eventFirstDraw) drawObject.eventFirstDraw();
}
CanvasGUI.prototype.eventMouseDown=function(e){
	//座標兼容
	if(e.offsetX || e.offsetX===0){//Chrome,Opera,Safari?
		var x=e.offsetX;
		var y=e.offsetY;
	}else{//Chrome,FireFox
		var x=e.layerX;
		var y=e.layerY;
	}
	
	var scanAt=this.drawObj.length-1;
	while(scanAt>=0){
		if(this.drawObj[scanAt].eventMouseDown(e,x,y)) break;
		scanAt--;
	}
}
CanvasGUI.prototype.eventMouseUp=function(e){
	//座標兼容
	if(e.offsetX || e.offsetX===0){//Chrome,Opera,Safari?
		var x=e.offsetX;
		var y=e.offsetY;
	}else{//Chrome,FireFox
		var x=e.layerX;
		var y=e.layerY;
	}
	
	var scanAt=this.drawObj.length-1;
	while(scanAt>=0){
		if(this.drawObj[scanAt].eventMouseUp(e,x,y)) break;
		scanAt--;
	}
}
CanvasGUI.prototype.eventMouseMove=function(e){
	//座標兼容
	if(e.offsetX || e.offsetX===0){//Chrome,Opera,Safari?
		var x=e.offsetX;
		var y=e.offsetY;
	}else{//Chrome,FireFox
		var x=e.layerX;
		var y=e.layerY;
	}
	
	var scanAt=this.drawObj.length-1;
	while(scanAt>=0){
		if(this.drawObj[scanAt].eventMouseMove(e,x,y)) break;
		scanAt--;
	}
}
CanvasGUI.prototype.eventMouseClick=function(e){
	//座標兼容
	if(e.offsetX || e.offsetX===0){//Chrome,Opera,Safari?
		var x=e.offsetX;
		var y=e.offsetY;
	}else{//Chrome,FireFox
		var x=e.layerX;
		var y=e.layerY;
	}
	
	var scanAt=this.drawObj.length-1;
	while(scanAt>=0){
		if(this.drawObj[scanAt].eventMouseClick(e,x,y)) break;
		scanAt--;
	}
}
CanvasGUI.prototype.screenUpdate=function(){
	var nowTime=new Date().getTime();
	//清空畫面
	this.obj.fillStyle=this.config.bgColor;
	this.obj.fillRect(0,0,this.config.width,this.config.height);
	
	//依序繪製畫面
	var drawcount=0;
	while(drawcount<this.drawObj.length){
		this.drawObj[drawcount].draw(this.obj,nowTime);
		drawcount++;
	}
	
	this.status.fpsCountScreen++;
	var thisobj=this;
	this.update.screen=requestAnimationFrame(function(){thisobj.screenUpdate();});
}
CanvasGUI.prototype.statusUpdate=function(){
	//更新fps資料
	var nowTime=new Date().getTime();
	this.status.fps=Math.floor(this.status.fpsCountScreen/(nowTime-this.status.fpsUpdateTime)*1000);
	this.status.fpsCountScreen=0;
	this.status.fpsUpdateTime=nowTime;
}

function CanvasGUIDrawGroup(){
	this.domParent=null;
	this.domObj=null;
	this.canvasObj=null;

	this.drawObj=[];
	
	this.status={
		'mousein': false,//當前鼠標是否在內
		'draw': true,//是否繪製此群組
		'drawed': false,//是否調用過eventFirstDraw
	};
	this.event={
		'down': [],
		'up': [],
		'move': [],
		'movein': [],
		'moveout': [],
		'click': []
	};
}
CanvasGUIDrawGroup.prototype.add=function(drawObject){
	if(!this.status.drawed){
		this.drawObj.push(drawObject);
		return;
	}
	if('undefined'!==typeof drawObject.domParent) drawObject.domParent=this.domParent;
	if('undefined'!==typeof drawObject.domObj) drawObject.domObj=domObj;
	if('undefined'!==typeof drawObject.canvasObj) drawObject.canvasObj=this.obj;
	this.drawObj.push(drawObject);
	if('undefined'!==typeof drawObject.eventFirstDraw) drawObject.eventFirstDraw();
}
CanvasGUIDrawGroup.prototype.move=function(movedrawX,movedrawY){
	this.drawObj.forEach(function(o){
		if(o instanceof CanvasGUIDrawGroup){
			o.move(this.x,this.y);
			return;
		}
		o.drawX+=this.x;
		o.drawY+=this.y;
	},{'x':movedrawX,'y':movedrawY});
}
CanvasGUIDrawGroup.prototype.draw=function(canvasObj,nowTime){
	if(!this.status.draw) return;
	var groupdrawcount=0;
	while(groupdrawcount<this.drawObj.length){
		this.drawObj[groupdrawcount].draw(canvasObj,nowTime);
		groupdrawcount++;
	}
}
CanvasGUIDrawGroup.prototype.eventFirstDraw=function(){
	var groupdrawcount=0;
	while(groupdrawcount<this.drawObj.length){
		if('undefined'!==typeof this.drawObj[groupdrawcount].domParent) this.drawObj[groupdrawcount].domParent=this.domParent;
		if('undefined'!==typeof this.drawObj[groupdrawcount].domObj) this.drawObj[groupdrawcount].domObj=this.domObj;
		if('undefined'!==typeof this.drawObj[groupdrawcount].canvasObj) this.drawObj[groupdrawcount].canvasObj=this.obj;
		if('undefined'!==typeof this.drawObj[groupdrawcount].eventFirstDraw) this.drawObj[groupdrawcount].eventFirstDraw();
		groupdrawcount++;
	}
	this.status.drawed=true;
}
CanvasGUIDrawGroup.prototype.eventMouseDown=function(e,x,y){
	if(!this.status.draw) return false;
	var scanAt=this.drawObj.length-1;
	var inRange=false;
	while(scanAt>=0){
		if(!inRange && (this.drawObj[scanAt].eventMouseDown(e,x,y) || this.drawObj[scanAt].inRange(x,y))) inRange=true;
		else if(inRange) this.drawObj[scanAt].eventMouseDown(e,x,y);
		scanAt--;
	}
	if(!inRange) return false;
	this.event.down.forEach(function(func){
		func.call(this.t,this.e,this.x,this.y);
	},{'t':this,'e':e,'x':x,'y':y});
	return true;
}
CanvasGUIDrawGroup.prototype.eventMouseUp=function(e,x,y){
	if(!this.status.draw) return false;
	var scanAt=this.drawObj.length-1;
	var inRange=false;
	while(scanAt>=0){
		if(!inRange && (this.drawObj[scanAt].eventMouseUp(e,x,y) || this.drawObj[scanAt].inRange(x,y))) inRange=true;
		else if(inRange) this.drawObj[scanAt].eventMouseUp(e,x,y);
		scanAt--;
	}
	if(!inRange) return false;
	this.event.up.forEach(function(func){
		func.call(this.t,this.e,this.x,this.y);
	},{'t':this,'e':e,'x':x,'y':y});
	return true;
}
CanvasGUIDrawGroup.prototype.eventMouseMove=function(e,x,y){
	if(!this.status.draw) return false;
	var scanAt=this.drawObj.length-1;
	while(scanAt>=0){
		if(this.drawObj[scanAt].eventMouseMove(e,x,y)) break;
		scanAt--;
	}
	if(scanAt<0){
		//處理事件mouseout
		if(this.status.mousein){
			this.status.mousein=false;
			this.event.moveout.forEach(function(func){
				func.call(this.t,this.e,this.x,this.y);
			},{'t':this,'e':e,'x':x,'y':y});
		}
		return false;
	}
	//處理事件mousein
	if(!this.status.mousein){
		this.status.mousein=true;
		this.event.movein.forEach(function(func){
			func.call(this.t,this.e,this.x,this.y);
		},{'t':this,'e':e,'x':x,'y':y});
	}
	this.event.move.forEach(function(func){
		func.call(this.t,this.e,this.x,this.y);
	},{'t':this,'e':e,'x':x,'y':y});
	return true;
}
CanvasGUIDrawGroup.prototype.eventMouseClick=function(e,x,y){
	if(!this.status.draw) return false;
	var scanAt=this.drawObj.length-1;
	var inRange=false;
	while(scanAt>=0){
		if(!inRange && (this.drawObj[scanAt].eventMouseClick(e,x,y) || this.drawObj[scanAt].inRange(x,y))) inRange=true;
		else if(inRange) this.drawObj[scanAt].eventMouseClick(e,x,y);
		scanAt--;
	}
	if(!inRange) return false;
	this.event.click.forEach(function(func){
		func.call(this.t,this.e,this.x,this.y);
	},{'t':this,'e':e,'x':x,'y':y});
	return true;
}
CanvasGUIDrawGroup.prototype.on=function(eventName,func){
	if(!this.event[eventName]) return false;
	this.event[eventName].push(func);
}

function CanvasGUIDrawLine(sx,sy,ex,ey,color,width){
	if(sx<=ex){
		this.drawX=sx;
		this.startX=0;
		this.endX=ex-sx;
	}else{
		this.drawX=ex;
		this.startX=sx-ex;
		this.endX=0
	}
	if(sy<=ey){
		this.drawY=sy;
		this.startY=0;
		this.endY=ey-sy;
	}else{
		this.drawY=ey;
		this.startY=sy-ey;
		this.endY=0
	}
	this.color=color;
	this.width=width;
	this.status={
		'mousein': false,
		'draw': true,
	};
	this.event={
		'down': [],
		'up': [],
		'move': [],
		'movein': [],
		'moveout': [],
		'click': []
	};
}
CanvasGUIDrawLine.prototype.draw=function(canvasObj){
	canvasObj.lineWidth=this.width;
	canvasObj.strokeStyle=this.color;
	canvasObj.beginPath();
	canvasObj.moveTo(this.drawX+this.startX,this.drawY+this.startY);
	canvasObj.lineTo(this.drawX+this.endX,this.drawY+this.endY);
	canvasObj.stroke();
	canvasObj.closePath();
}
CanvasGUIDrawLine.prototype.inRange=function(x,y){
	
}
CanvasGUIDrawLine.prototype.eventMouseDown=function(e,x,y){
	
}
CanvasGUIDrawLine.prototype.eventMouseUp=function(e,x,y){
	
}
CanvasGUIDrawLine.prototype.eventMouseMove=function(e,x,y){
	
}
CanvasGUIDrawLine.prototype.eventMouseClick=function(e,x,y){
	
}
CanvasGUIDrawLine.prototype.on=function(eventName,func){
	if(!this.event[eventName]) return false;
	this.event[eventName].push(func);
}

function CanvasGUIDrawText(drawX,drawY,text,size,color,font){
	//繪製物件必要屬性，便於群組處理
	this.drawX=drawX;
	this.drawY=drawY;
	
	//this.width=this.canvasObj.measureText(this.text);
	//this.height=this.size;
	this.canvasObj=null;
	this.status={
		'mousein': false,//當前鼠標是否在內
		'draw': true,//是否繪製此物件
	};
	this.event={
		'down': [],
		'up': [],
		'move': [],
		'movein': [],
		'moveout': [],
		'click': []
	};
	
	this.color=(color? color:'#000000');
	this.font=(font? font:'');
	this.size=(size? size:12);
	this.text=text;
}
CanvasGUIDrawText.prototype.draw=function(canvasObj,nowTime){
	if(!this.status.draw) return;
	this.configStyle(canvasObj);
	canvasObj.fillText(this.text,this.drawX,this.drawY);
}
CanvasGUIDrawText.prototype.configStyle=function(canvasObj){
	canvasObj.fillStyle=this.color;
	canvasObj.font=this.size+'px'+' '+this.font;
}
CanvasGUIDrawText.prototype.inRange=function(x,y){
	this.configStyle(this.canvasObj);
	return (x>=this.drawX && y<=this.drawY && x<=this.drawX+this.canvasObj.measureText(this.text).width && y>=this.drawY-this.size)? true:false;
}
CanvasGUIDrawText.prototype.eventMouseDown=function(e,x,y){
	if(!(this.status.draw && this.inRange(x,y))) return false;
	this.event.down.forEach(function(func){
		func.call(this.t,this.e,this.x,this.y);
	},{'t':this,'e':e,'x':x,'y':y});
	return true;
}
CanvasGUIDrawText.prototype.eventMouseUp=function(e,x,y){
	if(!(this.status.draw && this.inRange(x,y))) return false;
	this.event.up.forEach(function(func){
		func.call(this.t,this.e,this.x,this.y);
	},{'t':this,'e':e,'x':x,'y':y});
	return true;
}
CanvasGUIDrawText.prototype.eventMouseMove=function(e,x,y){
	if(!this.status.draw) return false;
	if(!this.inRange(x,y)){
		//處理事件mouseout
		if(this.status.mousein){
			this.status.mousein=false;
			this.event.moveout.forEach(function(func){
				func.call(this.t,this.e,this.x,this.y);
			},{'t':this,'e':e,'x':x,'y':y});
		}
		return false;
	}
	//處理事件mousein
	if(!this.status.mousein){
		this.status.mousein=true;
		this.event.movein.forEach(function(func){
			func.call(this.t,this.e,this.x,this.y);
		},{'t':this,'e':e,'x':x,'y':y});
	}
	this.event.move.forEach(function(func){
		func.call(this.t,this.e,this.x,this.y);
	},{'t':this,'e':e,'x':x,'y':y});
	return true;
}
CanvasGUIDrawText.prototype.eventMouseClick=function(e,x,y){
	if(!(this.status.draw && this.inRange(x,y))) return false;
	this.event.click.forEach(function(func){
		func.call(this.t,this.e,this.x,this.y);
	},{'t':this,'e':e,'x':x,'y':y});
	return true;
}
CanvasGUIDrawText.prototype.on=function(eventName,func){
	if(!this.event[eventName]) return false;
	this.event[eventName].push(func);
}

function CanvasGUIDrawImage(drawX,drawY,width,height,type,imgData){
	//繪製物件必要屬性，便於群組處理
	this.drawX=drawX;
	this.drawY=drawY;
	
	this.status={
		'mousein': false,//當前鼠標是否在內
		'draw': true,//是否繪製此物件
	};
	this.event={
		'down': [],
		'up': [],
		'move': [],
		'movein': [],
		'moveout': [],
		'click': []
	};
	this.width=width;
	this.height=height;
	this.type=type;
	switch(this.type){
		case 'static'://非動畫
			this.img=imgData;
		break;
		case 'anis'://多圖輪替
			this.firstTime=new Date().getTime();//播放第1張圖的時間，以此計算此時該放哪張圖
			this.freq=imgData.freq;
			this.imgs=[];
			imgData.imgs.forEach(function(img){
				this.push(img);
			},this.imgs);
		break;
		case 'anix'://由左至右
			this.firstTime=new Date().getTime();
			this.freq=imgData.freq;
			this.img=imgData.img;
			this.sourceWidth=imgData.width;
			this.sourceHeight=imgData.height;
			this.imgs=[];
			while(this.imgs.length<this.img.width/this.sourceWidth){
				this.imgs.push(this.sourceWidth*this.imgs.length);
			}
		break;
		case 'aniy'://由上至下
			this.firstTime=new Date().getTime();
			this.freq=imgData.freq;
			this.img=imgData.img;
			this.sourceWidth=imgData.width;
			this.sourceHeight=imgData.height;
			this.imgs=[];
			while(this.imgs.length<this.img.height/this.sourceHeight){
				this.imgs.push(this.sourceHeight*this.imgs.length);
			}
		break;
	}
}
CanvasGUIDrawImage.prototype.draw=function(canvasObj,nowTime){
	if(!this.status.draw) return;
	//drawImage(圖,X,Y,寬,高)
	//drawImage(圖,從X,從Y,取寬,取高,X,Y,寬,高)
	switch(this.type){
		case 'static'://非動畫
			canvasObj.drawImage(
				this.img,
				this.drawX,
				this.drawY,
				this.width,
				this.height
			);
		break;
		case 'anis'://多圖輪替
			canvasObj.drawImage(
				this.imgs[Math.floor((nowTime-this.firstTime)/this.freq)%this.imgs.length],
				this.drawX,
				this.drawY,
				this.width,
				this.height
			);
		break;
		case 'anix'://由左至右
			canvasObj.drawImage(
				this.img,
				this.imgs[Math.floor((nowTime-this.firstTime)/this.freq)%this.imgs.length],
				0,
				this.sourceWidth,
				this.sourceHeight,
				this.drawX,
				this.drawY,
				this.width,
				this.height
			);
		break;
		case 'aniy'://由上至下
			canvasObj.drawImage(
				this.img,
				0,
				this.imgs[Math.floor((nowTime-this.firstTime)/this.freq)%this.imgs.length],
				this.sourceWidth,
				this.sourceHeight,
				this.drawX,
				this.drawY,
				this.width,
				this.height
			);
		break;
	}
}
CanvasGUIDrawImage.prototype.inRange=function(x,y){//必要方法
	return (x>=this.drawX && y>=this.drawY && x<=this.drawX+this.width && y<=this.drawY+this.height)? true:false;
}
CanvasGUIDrawImage.prototype.eventMouseDown=function(e,x,y){
	if(!(this.status.draw && this.inRange(x,y))) return false;
	this.event.down.forEach(function(func){
		func.call(this.t,this.e,this.x,this.y);
	},{'t':this,'e':e,'x':x,'y':y});
	return true;
}
CanvasGUIDrawImage.prototype.eventMouseUp=function(e,x,y){
	if(!(this.status.draw && this.inRange(x,y))) return false;
	this.event.up.forEach(function(func){
		func.call(this.t,this.e,this.x,this.y);
	},{'t':this,'e':e,'x':x,'y':y});
	return true;
}
CanvasGUIDrawImage.prototype.eventMouseMove=function(e,x,y){
	if(!this.status.draw) return false;
	if(!this.inRange(x,y)){
		//處理事件mouseout
		if(this.status.mousein){
			this.status.mousein=false;
			this.event.moveout.forEach(function(func){
				func.call(this.t,this.e,this.x,this.y);
			},{'t':this,'e':e,'x':x,'y':y});
		}
		return false;
	}
	//處理事件mousein
	if(!this.status.mousein){
		this.status.mousein=true;
		this.event.movein.forEach(function(func){
			func.call(this.t,this.e,this.x,this.y);
		},{'t':this,'e':e,'x':x,'y':y});
	}
	this.event.move.forEach(function(func){
		func.call(this.t,this.e,this.x,this.y);
	},{'t':this,'e':e,'x':x,'y':y});
	return true;
}
CanvasGUIDrawImage.prototype.eventMouseClick=function(e,x,y){
	if(!(this.status.draw && this.inRange(x,y))) return false;
	this.event.click.forEach(function(func){
		func.call(this.t,this.e,this.x,this.y);
	},{'t':this,'e':e,'x':x,'y':y});
	return true;
}
CanvasGUIDrawImage.prototype.on=function(eventName,func){
	if(!this.event[eventName]) return false;
	this.event[eventName].push(func);
}
