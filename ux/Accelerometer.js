Ext.ns("Ext.ux");

Ext.ux.Accelerometer = Ext.extend(Ext.util.Observable, {
	dmcnt:0,
	fliping: false,
	
	init: function(cmp){
		this.cmp = cmp;
		this.cmp.addEvents('devicemotion');
		this.cmp.on('render', this.initAccelerometerHandlers, this);
		window.addEventListener('devicemotion', Ext.createDelegate(this.onDeviceMotion, this), false);
	},
	
	onDeviceMotion: function(ev){
		var acceleration = ev.accelerationIncludingGravity,	
			dEvent, me = this;
		if(acceleration && this.dmcnt % 10){
			if((acceleration.x > 10 || acceleration.x < -10) && !this.flipping){
				console.log(acceleration);
				
				this.flipping = true;
				dEvent = {
					direction: (acceleration.x < -10) ? "left" : "right"
				};
				this.cmp.fireEvent('devicemotion', this.cmp, dEvent);
				setTimeout(function(){
					me.flipping = false;
				}, 1000);
			}	
		}
		this.dmcnt++;
	},
	
	
	initAccelerometerHandlers: function(){
		this.cmp.on('devicemotion', this.handleDeviceMotion, this);
	},
	
	handleDeviceMotion: function(cmp, ev){
		console.log(ev);
		if(ev.direction == "left"){
			cmp.setActiveItem(cmp.getActiveItem() + 1);
		}else if(ev.direction == "right"){
			cmp.setActiveItem(cmp.getActiveItem() - 1);
		}
	}
});