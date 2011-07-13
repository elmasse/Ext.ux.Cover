Ext.ns('Ext.ux');
/**
	@class Ext.ux.Cover
    @author Maximiliano Fierro
	@notes Inspired by zflow: http://css-vfx.googlecode.com/ By Charles Ying
*/
Ext.ux.Cover = Ext.extend(Ext.DataView, {
	scroll: false, 
	componentCls: 'ux-cover',
	itemSelectorCls: 'ux-cover-item-wrap', 
	itemBaseCls: 'ux-cover-item',
	activeItem: 0,
	
	delta: 40,
	angle: 70,
	
	initComponent: function(){
		this.itemSelector = '.'+this.itemSelectorCls;
		
		
		if (Ext.isArray(this.itemTpl)) {
            this.itemTpl = this.itemTpl.join('');
		}
        
		this.tpl = new Ext.XTemplate(
			'<tpl for=".">',
				'<div class="'+this.itemSelectorCls+'"><div class="'+this.itemBaseCls+' '+this.itemCls+'">'+this.itemTpl+'</div></div>',
			'</tpl>'
		);
		
		Ext.ux.Cover.superclass.initComponent.apply(this);
		
		this.offset = new Ext.util.Offset();
	},
	
	onRender: function(){
		Ext.ux.Cover.superclass.onRender.apply(this, arguments);
		this.scrollerElement = this.getTargetEl().createChild();
		this.scrollerElement.addCls(this.componentCls + '-scroller');
	},
	
	getTargetEl: function(){
		return this.scrollerElement || this.el;
	},
	
	afterRender: function(){
		Ext.ux.Cover.superclass.afterRender.apply(this, arguments);
		this.mon(this.el, {
			dragstart: this.onDragStart,
            drag: this.onDrag,
            dragend: this.onDragEnd,
            scope: this
		});
	},
	
	afterComponentLayout: function(){
		Ext.ux.Cover.superclass.afterComponentLayout.apply(this, arguments);
		this.refresh();
	},
	
	onDragStart: function(){
		this.getTargetEl().dom.style.webkitTransitionDuration = "0s";
	},

	onDrag: function(e){
		var curr = this.getOffset(),
			offset,
			activeItem,
			vel;
			
		vel = Math.abs(e.deltaX/e.deltaTime);
		e.deltaX *= (vel / 2);
		
		//slow down on border conditions
		activeItem = this.getActiveItem();
		if((activeItem === 0 && e.deltaX > 0) || (activeItem === this.all.getCount() - 1 && e.deltaX < 0)){
			e.deltaX = e.deltaX / 4;
		}
		
		offset = new Ext.util.Offset(e.deltaX + curr.x, e.deltaY+curr.y);
		
		this.setOffset(offset, true);
	},
	
	onDragEnd: function(){
		var idx = this.getActiveItem(),
			x = - (idx * this.gap);
		this.getTargetEl().dom.style.webkitTransitionDuration = "0.4s";
		this.setOffset({x:x});
	},
	
	getActiveItem: function(){
		var idx = - Math.round(this.getOffset().x / this.gap);
		this.activeItem = Math.min(Math.max(idx, 0), this.all.getCount() - 1);
		return this.activeItem;
	},
	
	setActiveItem: function(idx){
		var offset = new Ext.util.Offset();
		idx = Math.min(Math.max(idx, 0), this.all.getCount() - 1);
		offset.x = -(idx * this.gap);
		this.setOffset(offset);
	},
	
	setOffset: function(offset){
		this.offset = offset;
		this.getTargetEl().dom.style.webkitTransform = "translate3d(" + offset.x + "px, 0, 0)";
		this.all.each(function(item, el, idx) {
			this.setItemTransformation(item, idx, this.getOffset());
		}, this);
	},
	
	getOffset: function(){
		return this.offset;
	},
	
	getBaseItemBox: function(containerBox){
		var h, w;
		
		h = w = Math.min(containerBox.width, containerBox.height) * 0.6; 
			
		return {
			top: 40  ,
			height: h * 1.5, 
			width: w,
			left: (containerBox.width - w) / 2 
		};
	},
	
	setBoundaries: function(itemBox){
		var w = itemBox.width;
		this.gap = w / 3;
		this.threshold = this.gap / 2; 
	},
	
	setItemTransformation: function(item, idx, offset){
		var x = idx * this.gap,
			ix = x + offset.x,
			zi = 999,
			dist,
			transf = "";//{rotate: [0,0,0], translate:[0,0,0]};
		
		if(ix < this.threshold && ix >= - this.threshold){
			transf = "translate3d("+x+"px, 0, 150px)"
			this.activeItem = idx;
			//	transf.translate = [x, 0, 150];
		}else if(ix > 0){
			transf = "translate3d("+(x+this.delta)+"px, 0, 0) rotateY(-"+this.angle+"deg)"
			// transf.rotate = [0, -this.angle,0];
			// transf.translate = [x+this.delta,0,0];
		}else{
			transf = "translate3d("+(x-this.delta)+"px, 0, 0) rotateY("+this.angle+"deg)"
			// transf.rotate = [0, this.angle,0];
			// transf.translate = [x-this.delta,0,0];
		}	
		// Ext.Element.cssTransform(item,transf);
		item.dom.style.webkitTransform = transf;
		dist = idx - this.activeItem;
		//chrome needs to have zindex set in order to display correctly 
		item.dom.style.zIndex = zi - (dist > 0 ? dist:-dist);
	},
	
	refresh: function(){
		var itemBox; 
		if (!this.rendered) {
            return;
        }
		
		Ext.ux.Cover.superclass.refresh.apply(this);
		
		itemBox = this.getBaseItemBox(this.el.getBox());
	
		this.setBoundaries(itemBox);
		
		this.all.each(function(item, el, idx) {
			/**
				itemBox has an extra long in height to avoid reflection opacity over other items
				I needed to create a wrapper element with same bg to avoid that issue.
			*/
			item.setBox(itemBox);
			item.down('.'+this.itemBaseCls).setBox({height: itemBox.height/1.5, width: itemBox.width});
		}, this);

		this.setActiveItem(this.activeItem);
	}
	
});


Ext.reg('cover', Ext.ux.Cover);
