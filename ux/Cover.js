/**
 * @class Ext.ux.Cover
 * @extend Ext.DataView
 *
 * A Cover represents elements in a Store as visual elements in a Coverflow-like widget.
 * @author Maximiliano Fierro
 * @notes Inspired on zflow: http://css-vfx.googlecode.com/ By Charles Ying
*/
Ext.define('Ext.ux.Cover',{
	extend: 'Ext.DataView',
	xtype: 'cover',

	requires: ['Ext.util.Offset'],

	config:{
       /**
         * @cfg {Number} selectedIndex The idx from the Store that will be active first. Only one item can be active at a
         * time
         * @accessor
         * @evented
         */
        selectedIndex: 0,
		
        /**
         * @cfg {String} itemCls
         * A css class name to be added to each item element.
         */
		itemCls: '',
        /**
         * @cfg {Boolean} preventSelectionOnItemTap
         * Prevent selection when item is tapped. This is false by default.
         */
		preventSelectionOnItemTap: false,

		//private
		angle: 70,
		//private
		baseCls: 'ux-cover',
		//private
		itemBaseCls: 'ux-cover-item-inner',
		//private
		scrollable: false
		
	},

	//override
	initialize: function(){
		this.callParent();
		
		this.offset = new Ext.util.Offset();

		this.element.on({
			drag: 'onDrag',
			dragstart: 'onDragStart',
			dragend: 'onDragEnd',
			scope: this
		});
		
		this.on({
			painted: 'onPainted',
			itemtap: 'doItemTap',
			scope: this
		});	
	},
	

	getElementConfig: function(){
		return {
			reference: 'element',
			className: 'x-container',
			children:[{
				reference: 'innerElement',
				className: 'ux-cover-scroller'
			}]
		}
	},

	applyItemTpl: function(config){
		if(Ext.isArray(config)){
			config = config.join("");
		}
		return new Ext.XTemplate('<div class="' + this.getItemBaseCls() + ' ' + this.getItemCls() + ' ">'+config+'</div>');
	},

	onPainted: function(){
		this.refresh();	
	},

	//private
	getTargetEl: function(){
		return this.innerElement;	
	},

	onDragStart: function(){
		this.getTargetEl().dom.style.webkitTransitionDuration = "0s";
	},

	onDrag: function(e){
		var curr = this.getOffset(),
			offset,
			ln = this.getViewItems().length,
			selectedIndex,
			delta = {x: e.previousDeltaX, y: e.previousDeltaY};

		//slow down on border conditions
		selectedIndex = this.getSelectedIndex();
		if((selectedIndex === 0 && e.deltaX > 0) || (selectedIndex === ln - 1 && e.deltaX < 0)){
			delta.x = delta.x / 2;
		}

		offset = new Ext.util.Offset(delta.x + curr.x, delta.y+curr.y);
		
		this.setOffset(offset, true);	
	},

	onDragEnd: function(){
		var idx = this.getSelectedIndex(),
			x = - (idx * this.gap);
		this.getTargetEl().dom.style.webkitTransitionDuration = "0.4s";
		this.setOffset({x:x});
	},
	
	doItemTap: function(cover, index, item, evt){
		if(!this.getPreventSelectionOnItemTap() && this.getSelectedIndex() !== index){
			this.setSelectedIndex(index);
		}
	},

	getSelectedIndex: function(){
		var idx, ln;
		if(this.isRendered()){
			ln = this.getViewItems().length;
			idx = - Math.round(this.getOffset().x / this.gap);
			this.selectedIndex = Math.min(Math.max(idx, 0),  ln - 1);
		}
		return this.selectedIndex;
	},


	applySelectedIndex: function(idx){
		if(this.isRendered()){
			this.updateOffsetToIdx(idx);
		}else{
			this.selectedIndex = idx;
		}
	},

	updateOffsetToIdx: function(idx){
		var offset = new Ext.util.Offset()
			ln = this.getViewItems().length;
		idx = Math.min(Math.max(idx, 0), ln - 1);
		offset.x = -(idx * this.gap);
		this.setOffset(offset);	
	},

	setOffset: function(offset){
		var all = this.getViewItems();
		this.offset = offset;
		this.getTargetEl().dom.style.webkitTransform = "translate3d(" + offset.x + "px, 0, 0)";
		Ext.Array.each(all, function(el, idx) {
			var item = Ext.get(el); //??????
			this.setItemTransformation(item, idx, offset);
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
		this.delta = w * 0.4;
	},

	setItemTransformation: function(item, idx, offset){
		var x = idx * this.gap,
			ix = x + offset.x,
			transf = "";
		if(ix < this.threshold && ix >= - this.threshold){
			transf = "translate3d("+x+"px, 0, 150px)"
			this.selectedIndex = idx;
		}else if(ix > 0){
			transf = "translate3d("+(x+this.delta)+"px, 0, 0) rotateY(-"+this.getAngle()+"deg)"
		}else{
			transf = "translate3d("+(x-this.delta)+"px, 0, 0) rotateY("+this.getAngle()+"deg)"
		}	
		item.dom.style.webkitTransform = transf;
	},

	refresh: function(){
		var all = this.getViewItems(),
			itemBox; 
		
		this.callParent();
		
		if (!this.isRendered()) {
            return;
        }
        	
		itemBox = this.getBaseItemBox(this.element.getBox());

		this.setBoundaries(itemBox);

		Ext.Array.each(all, function(el, idx) {
			var item = Ext.get(el); 
			/**
				itemBox has an extra long in height to avoid reflection opacity over other items
				I needed to create a wrapper element with same bg to avoid that issue.
			*/
			item.setBox(itemBox);
			item.down('.'+this.getItemBaseCls()).setBox({height: itemBox.height/1.5, width: itemBox.width});
		}, this);

		this.setSelectedIndex(this.selectedIndex);
	}
});

