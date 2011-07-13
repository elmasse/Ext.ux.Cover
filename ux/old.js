Ext.ns('Ext.ux');

Ext.ux.Cover = Ext.extend(Ext.DataView, {
	scroll: false, // 'horizontal',
	componentCls: 'ux-cover',
	itemSelectorCls: 'ux-cover-item', 
	itemCls: '',
	activeItem: 0,
	
	delta: 30,
	itemDelta: 40,
	constrainBox: {},
	angle: 60,
	
	initComponent: function(){
		this.itemSelector = '.'+this.itemSelectorCls;
		
		this.tpl = new Ext.XTemplate(
			'<tpl for=".">',
				'<div class="'+this.itemSelectorCls+' '+this.itemCls+'">'+this.itemTpl+'</div>',
			'</tpl>'
		);
		
		Ext.ux.Cover.superclass.initComponent.apply(this);
		
		this.offset = new Ext.util.Offset();
		this.animation = new Ext.util.Draggable.Animation.Linear();
	},
	
	afterRender: function(){
		Ext.ux.Cover.superclass.afterRender.apply(this, arguments);
		console.log('afterrender');
		this.mon(this.el, {
			dragstart: this.onDragStart,
		            drag: this.onDrag,
		            dragend: this.onDragEnd,
		            direction: 'horizontal',
		            scope: this
		        });
	},

	onDragStart: function(e){
		console.log('DragStart', arguments);
	},
	
	onDrag: function(e){
		var offset = new Ext.util.Offset(e.deltaX, e.previousDeltaY);
		this.setOffset(offset, true);
	},
	
	onDragEnd: function(){
		console.log('DragEnd', arguments);
	},
	
	scrollTo: function(offset, duration){
		this.startAnimation(offset, duration);
	},
	
	stopAnimation: function(){
		clearInterval(this.animationTimer);
		this.animationTimer = 0;
	},
	
	startAnimation: function(offset, duration){
		var me = this;
		var currentTime = Date.now();
        
		this.animation.set({
            startOffset: this.offset.x,
            endOffset: offset.x,
            startTime: currentTime,
            duration: duration
		});
		
		if(!this.animationTimer)
			this.animationTimer = setInterval(function(){
				me.isAnimated = true;
	            me.handleAnimationFrame();
	        }, 1000 / 50); //70fps
	},
	
	handleAnimationFrame: function(){
		var newOffset = new Ext.util.Offset();
		
        newOffset.x = this.animation.getOffset();

        this.setOffset(newOffset);

        if (newOffset.x === this.animation.endOffset) {
            this.stopAnimation();
        }
      
	},
	
	setOffset: function(offset, animate){
		var left = !(offset.x > 0),
			curr = this.activeItem, 
			prev = curr - 1, 
			next = curr + 1;

		if(animate){
			this.startAnimation(offset, 40);
		}else{
			console.log(offset);
			this.offset = offset;
			Ext.Element.cssTransform(this.el, {translate:[this.offset.x, 0, 0]});
			
			if(Math.abs(offset.x) >= (this.delta * (1+this.activeItem))){
				var sel = this.all.items(curr),
					newSel;
				if(left){
					newSel = this.all.items(next);
					this.activeItem += 1;
					Ext.Element.cssTransform(sel, this.getItemTransform())
				}else{
					newSel = this.all.items(prev);
					this.activeItem -= 1;
				}
				
				
			}
			// all = true;
			// currBox = this.all.item(this.activeItem).getBox();
			// 
			// if(left){
			// 	if(currBox.x + offset.x <= this.getLeftConstrain()){
			// 		all = false;
			// 		activeItem = next;
			// 	}
			// }else{
			// 	 if(currBox.x + offset.x + currBox.width >= this.getRightConstrain()){
			// 		all = false;
			// 		activeItem = prev;
			// 	}
			// }
			// 
			// this.all.each(function(item,ds, idx){
			// 	
			// }, this);
			// this.activeItem = activeItem;
		}
	},

	
	getBaseItemBox: function(containerBox){
		var h = containerBox.height * 0.7,
			w = h;
		return {
			top: 40,
			height: h, 
			width: w 
		};
	},
	
	getItemDistance: function(idx){
		return idx - this.activeItem; 
	},
	
	getItemZIndex: function(idx){
		var dist = this.getItemDistance(idx),
			z = 999;
		return (dist < 0) ? z+dist : (dist === 0) ? z : z-dist;
	},
	
	getItemBox: function(idx){
		var dist = this.getItemDistance(idx),
		var containerBox = this.el.getBox(),
		var box = this.getBaseItemBox(containerBox);
		box.left = 
			(dist < 0) ? this.getLeftConstrain(containerBox.width, box.width) + (dist * this.itemDelta) 
			: (dist === 0) ? (containerBox.width - box.width) / 2
			: this.getRightConstrain(containerBox.width, box.width) - box.width + (dist * this.itemDelta);
		return box;
	},
	
	getLeftConstrain: function(containerWidth, boxWidth){
		if(containerWidth && boxWidth){
			this.constrainBox.left = ((containerWidth - boxWidth) / 2) -  this.delta;
		}
		return this.constrainBox.left;
	},
	
	getRightConstrain: function(containerWidth, boxWidth){
		if(containerWidth && boxWidth){
			this.constrainBox.right = ((containerWidth + boxWidth) / 2) + this.delta;
		}
		return this.constrainBox.right;
	},
	
	getItemCls: function(idx){
		var dist = this.getItemDistance(idx),
			c = this.itemSelectorCls;
		return (dist < 0) ? this.itemClsLeft : (dist === 0) ? this.itemClsSelected : this.itemClsRight;
	},

	getItemAngle: function(idx){
		var dist = this.getItemDistance(idx);
		return ((dist != 0) ? -(dist/Math.abs(dist) * this.angle) : 0);
	},

	getItemTranslate3d: function(idx, offset){
		var dist = this.getItemDistance(idx),
			translate = [0,0,0];

		if(offset){
			translate[0] = offset.x;
		}
		if(!dist){
			translate[2] = 150;
		}
		
		return translate;
			
	},	

	getItemTransform: function(idx, offset){
		var dist = this.getItemDistance(idx),
			angle = this.getItemAngle(idx),
			translate3d = this.getItemTranslate3d(idx, offset),
			transform = {};
		transform.rotate = [0,angle,0];
		transform.translate = translate3d;
		
		return transform;	
	},

	refresh: function(){
		var itemBox, containerBox;
		if (!this.rendered) {
            return;
        }

		Ext.ux.Cover.superclass.refresh.apply(this);
		
		this.all.each(function(item, el, idx) {
			// item.addCls(this.getItemCls(idx));
			Ext.Element.cssTransform(item, this.getItemTransform(idx));
			item.setBox(this.getItemBox(idx));
			item.setStyle('z-index', this.getItemZIndex(idx));
		}, this);
	}
	
});


Ext.reg('cover', Ext.ux.Cover);
