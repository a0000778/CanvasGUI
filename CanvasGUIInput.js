/*
CanvasGUI 擴充模組 Input by a0000778
需要調用JS全域函式庫 - DOM
*/
function CanvasGUIDrawInputText(drawX,drawY,defaultText,size,color,font){
	//繪製物件必要屬性，便於群組處理
	this.drawX=drawX;
	this.drawY=drawY;
	
	this.canvasObj=null;
	this.domParent=null;
	this.domObj=null;
	this.domInput=null;//實際輸入物件
	this.text=(defaultText? defaultText:'');
	this.color=(color? color:'#000000');
	this.font=(font? font:'');
	this.size=(size? size:12);
	
	this.status={
		'mousein': false,//當前鼠標是否在內
		'draw': true,//是否繪製此物件
		'inputing': false,//是否輸入中
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
CanvasGUIDrawInputText.prototype.draw=function(canvasObj,nowTime){
	if(!this.status.draw) return;
	this.configStyle(canvasObj);
	canvasObj.fillText(this.text+((this.status.inputing && nowTime%1000>=500)? '|':' '),this.drawX,this.drawY);
}
CanvasGUIDrawInputText.prototype.eventFirstDraw=function(){
	var thisobj=this;
	this.domInput=this.domParent.$add('input',{
		'type':'text',
		'style':{
			'border':0,
			'margin':0,
			'opacity':0,
			'padding':0,
			'position':'relative',
			'zIndex':-1,
			
			'left':this.drawX,
			'top':this.drawY
		}
	},this.domObj);
	this.domInput.addEventListener('input',function(e){
		thisobj.eventInput(e,this);
		if(this.clientWidth<thisobj.canvasObj.measureText(thisobj.text).width)
			this.style.width=thisobj.canvasObj.measureText(thisobj.text).width+'px';
		thisobj.configStyle(thisobj.canvasObj);
		console.log('nowWidth='+this.clientWidth+',fixwidth='+thisobj.canvasObj.measureText(thisobj.text).width);
	});
	this.domInput.addEventListener('focus',function(){
		thisobj.status.inputing=true;
	});
	this.domInput.addEventListener('blur',function(){
		thisobj.status.inputing=false;
	});
}
CanvasGUIDrawInputText.prototype.configStyle=function(canvasObj){
	canvasObj.fillStyle=this.color;
	canvasObj.font=this.size+'px'+' '+this.font;
}
CanvasGUIDrawInputText.prototype.inRange=function(x,y){
	this.configStyle(this.canvasObj);
	return (x>=this.drawX && y<=this.drawY && x<=this.drawX+this.canvasObj.measureText(this.text).width && y>=this.drawY-this.size)? true:false;
}
CanvasGUIDrawInputText.prototype.eventInput=function(e,o){
	this.text=o.value;
}
CanvasGUIDrawInputText.prototype.eventMouseDown=function(e,x,y){
	if(!(this.status.draw && this.inRange(x,y))) return false;
	e.preventDefault();
	this.domInput.style.left=this.drawX;
	this.domInput.style.top=this.drawY;
	this.domInput.value=this.text;
	this.domInput.focus();
}
CanvasGUIDrawInputText.prototype.eventMouseUp=function(e,x,y){
	if(!(this.status.draw && this.inRange(x,y))) return false;
}
CanvasGUIDrawInputText.prototype.eventMouseMove=function(e,x,y){
	if(!(this.status.draw && this.inRange(x,y))) return false;
}
CanvasGUIDrawInputText.prototype.eventMouseClick=function(e,x,y){
	if(!(this.status.draw && this.inRange(x,y))) return false;
}
CanvasGUIDrawInputText.prototype.on=function(eventName,func){
	if(!this.event[eventName]) return false;
	this.event[eventName].push(func);
}