/*
* @Author: COE
* @Date:   2018-07-25 10:07:43
* @Last Modified by:   COE
* @Last Modified time: 2018-07-25 10:07:56
*/

window.onload=function(){
	var hhardyy=new Hardy();
	hhardyy.init();
}

function Hardy(){
	this.oBox=document.querySelectorAll(".gameBox")[0];
	this.oBtn=this.oBox.querySelectorAll(".StartGame")[0];
	this.oSun=this.oBox.querySelectorAll(".sun")[0];

	this.GameData={
	//敌人
    	oEmpty : {
    		'e1':{'style':'enemy1','blood':1,'speed':5,'score':1},
	    	'e2':{'style':'enemy2','blood':2,'speed':7,'score':2},
	    	'e3':{'style':'enemy3','blood':3,'speed':9,'score':3}
	    },

	//关卡
	    checkpoint:[
	    {
		eMap : [
		    'e3','e3','e3','e3','e3','e3','e3','e3','e3','e3',
	    	'e3','e3','e3','e3','e3','e3','e3','e3','e3','e3',
	    	'e3','e3','e3','e3','e3','e3','e3','e3','e3','e3',
	    	'e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
	    	'e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
	    	'e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
	    	'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
	    	'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
	    	'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
		],
	    	colNum : 10,
	    	iSpeedX : 10,
	    	iSpeedY : 10,
	    	times : 2000
	    }
	    ],
	//飞机
	    air : {   
		    style : 'air1',
		    bulletStyle : 'bullet'
	    }
    }
}

Hardy.prototype={
	init(){
		var this_=this;
		this.oBtn.addEventListener("click", function(){
			this_.hiddenFun();
			this_.creatScore();
			this_.creatEnemy(0);
			this_.creatAir();
		}, false);
	},
	hiddenFun(){
		var _this=this;
		this.oSun.style.opacity="0";
		this.oSun.style.transition="all 1s";
		var timer=null;
		timer=setTimeout(function(){
			_this.oSun.style.display="none";
		}, 800)
	},
	//创建积分
	creatScore(){
		var oS=document.createElement("div");
		oS.id='score';
		oS.innerHTML="积分：<span>0</span>";
		this.oBox.appendChild(oS);
		var oSpanNum=oS.querySelectorAll("span")[0];
		this.oSpanNum=oSpanNum;
	},
	//创建敌机
	creatEnemy(iNow){
		if (this.oEnemyBox) {
			clearInterval(this.oEnemyBox.timer);
			this.oBox.removeChild(this.oEnemyBox);
		}
		var arr=[];
		var checkpoint=this.GameData.checkpoint[iNow];
		var oEnemyBox=document.createElement("ul");
		oEnemyBox.id='bee';
		oEnemyBox.style.width=checkpoint.colNum*40+'px';
		this.oBox.appendChild(oEnemyBox);
		oEnemyBox.style.left=(this.oBox.offsetWidth-oEnemyBox.offsetWidth)/2+'px';

		for(var i=0;i<checkpoint.eMap.length;i++){
			var ali=document.createElement("li");
			ali.className=this.GameData.oEmpty[checkpoint.eMap[i]].style;

			ali.blood=this.GameData.oEmpty[checkpoint.eMap[i]].blood;
			ali.speed=this.GameData.oEmpty[checkpoint.eMap[i]].speed;
			ali.score=this.GameData.oEmpty[checkpoint.eMap[i]].score;

			oEnemyBox.appendChild(ali);
		}
		this.oEnemyBox=oEnemyBox;
		this.aLi=oEnemyBox.querySelectorAll('li');
		for(var q=0;q<this.aLi.length;q++){
			arr.push([this.aLi[q].offsetLeft,this.aLi[q].offsetTop]);
		}

		for(var j=0;j<this.aLi.length;j++){
			this.aLi[j].style.position="absolute";
			this.aLi[j].style.left=arr[j][0]+'px';
			this.aLi[j].style.top=arr[j][1]+'px';
		}

		this.runEnemy(checkpoint);
	},
	//敌机移动
	runEnemy(data){
		var This=this;
		var L=0;
		var R=this.oBox.offsetWidth-this.oEnemyBox.offsetWidth;
		this.oEnemyBox.timer=setInterval(function(){
			if (This.oEnemyBox.offsetLeft>R) {
				data.iSpeedX*=-1;
				This.oEnemyBox.style.top=This.oEnemyBox.offsetTop+data.iSpeedY+'px';
			}else if(This.oEnemyBox.offsetLeft<=L){
				data.iSpeedX*=-1;
				This.oEnemyBox.style.top=This.oEnemyBox.offsetTop+data.iSpeedY+'px';
			}
			This.oEnemyBox.style.left=This.oEnemyBox.offsetLeft+data.iSpeedX+'px';
		}, 1000)

		setInterval(function(){
			This.oneEnmyRun();
		},data.times);
	},
	//单个敌机乱飞
	oneEnmyRun(){
		var nowLi=this.aLi[Math.floor(Math.random()*this.aLi.length)];
		var This=this;
		nowLi.timer=setInterval(function(){
			var a=(This.oAir.offsetLeft+This.oAir.offsetWidth/2)-(nowLi.offsetLeft+This.oEnemyBox.offsetLeft+This.oAir.offsetWidth/2);
			var b=(This.oAir.offsetTop+This.oAir.offsetHeight/2)-(nowLi.offsetTop+This.oEnemyBox.offsetTop+This.oAir.offsetHeight/2);
			var c=Math.sqrt(a*a+b*b);

			var iSx=nowLi.speed*a/c;
			var iSy=nowLi.speed*b/c;

			nowLi.style.left=nowLi.offsetLeft+iSx+'px';
			nowLi.style.top=nowLi.offsetTop+iSy+'px';

			if (This.collisionEnmy(This.oAir,nowLi)) {
				This.oSun.style.display="block";
				window.location.reload();
			}
		},30);
	},
	//创建小飞机
	creatAir(){
		var oAir=document.createElement("div");
		oAir.className=this.GameData.air.style;
		this.oBox.appendChild(oAir);

		oAir.style.left=(this.oBox.offsetWidth-oAir.offsetWidth)/2+'px';
		oAir.style.top=this.oBox.offsetHeight-oAir.offsetHeight+'px';
        this.oAir=oAir;
		this.runAir();
	},
	//操作飞机
	runAir(){
		var This=this;
		var timer=null;
		var iNumber=0;

		document.addEventListener('keydown',function(ev){
			if (!timer) {
				timer=setInterval(show, 30);
			}
			var ev=ev||window.event;
			if (ev.keyCode==37) {
				iNumber=1;
			}else if(ev.keyCode==39){
				iNumber=2;
			}
		},false)

		document.addEventListener('keyup',function(ev){
			var ev=ev||window.event;
			clearInterval(timer);
			timer=null;
			iNumber=0;

			if (ev.keyCode==65) {
				This.creatBoom();
			}
		},false)

		function show(){
			if (iNumber==1) {
				This.oAir.style.left=This.oAir.offsetLeft-10+'px';
			}else if (iNumber==2) {
				This.oAir.style.left=This.oAir.offsetLeft+10+'px';
			}
		}
	},
	//创建子弹
	creatBoom(){
		var boom=document.createElement('div');
		boom.className=this.GameData.air.bulletStyle;
		this.oBox.appendChild(boom);
		boom.style.left=this.oAir.offsetLeft+this.oAir.offsetWidth/2+'px';
		boom.style.top=this.oAir.offsetTop-boom.offsetHeight+'px';
		this.runBoom(boom);
	},
	//子弹运动
	runBoom(obj){
		var This=this;
		obj.timer=setInterval(function(){
			if (obj.offsetTop<-obj.offsetHeight) {
				clearInterval(obj.timer);
				This.oBox.removeChild(obj);
			}else{
				obj.style.top=obj.offsetTop-obj.offsetHeight+'px';
			}
			
			for(var i=0;i<This.aLi.length;i++){
				if (This.collisionEnmy(obj,This.aLi[i])) {
					if (This.aLi[i].blood==1) {
						clearInterval(This.aLi[i].timer);
						This.oSpanNum.innerHTML=Number(This.oSpanNum.innerHTML)+This.aLi[i].score;
						This.oEnemyBox.removeChild(This.aLi[i]);
					}else{
						This.aLi[i].blood--;
					}
					clearInterval(obj.timer);
					This.oBox.removeChild(obj);
				}
			}
		},30)
	},
	//子弹与敌机碰撞
	collisionEnmy(obj1,obj2){
		var l1 = obj1.offsetLeft;
		var r1 = obj1.offsetLeft + obj1.offsetWidth;
		var t1 = obj1.offsetTop;
		var b1 = obj1.offsetTop + obj1.offsetHeight;
		
		var l2 = obj2.offsetLeft + this.oEnemyBox.offsetLeft;
		var r2 = obj2.offsetLeft + obj2.offsetWidth + this.oEnemyBox.offsetLeft;
		var t2 = obj2.offsetTop + this.oEnemyBox.offsetTop;
		var b2 = obj2.offsetTop + obj2.offsetHeight + this.oEnemyBox.offsetTop;
		
		if( r1<l2 || l1>r2 || b1<t2 || t1>b2 ){
			return false;
		}
		else{
			return true;
		}
	}
}