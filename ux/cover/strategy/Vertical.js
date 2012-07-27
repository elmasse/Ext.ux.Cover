/**
 *
 */
Ext.define('Ext.ux.cover.strategy.Vertical', {
	extend : 'Ext.Base',
	alias  : 'strategy.vertical',

	config : {
		cover : undefined
	},

	constructor : function (config) {
		this.initConfig(config);
		return this;
	},


    calculateItemBox : function () {
        var me = this.getCover(),
            containerBox = me.element.getBox(),
            cH = containerBox.height,
            cW = containerBox.width,
            sizeFactor = (cW > cH) ? 0.52 : 0.68,
            h, w;

        h = w = Math.min(containerBox.width, containerBox.height) * sizeFactor; 

        me.itemBox = {
            top: (containerBox.height - h) / 2,
            height: h,
            width: w,
            left: (containerBox.width - w) / 2 
        }
    },

    calculateBoundaries : function () {
        var me = this.getCover(),
            direction = me.getDirection(),
            itemBox = me.itemBox,
            h = itemBox.height,
            gap = h / 5;

        Ext.apply(me.boundaries, {
            angle     : 60,
            gap       : gap,
            threshold : gap * 0.5,
            delta     : h * 0.4
        }); 
    },

   setItemTransformation : function (item, idx, offset) {
        var me = this.getCover(),
            gap = me.boundaries.gap,
            threshold = me.boundaries.threshold,
            delta = me.boundaries.delta,
            angle = me.boundaries.angle,
            y = idx * gap,
            iy = y + offset,
            transf = "";

        if(iy < threshold && iy >= - threshold){
            transf = "translate3d(0, "+y+"px, 0)"
            me.updateSelectedIndex(idx);
        }else if(iy > 0){
            transf = "translate3d(0, "+(y+delta)+"px, 0) rotateX("+angle+"deg)"
        }else{
            transf = "translate3d(0, "+(y-delta)+"px, 0) rotateX(-"+angle+"deg)"
        }   
        item.dom.style.webkitTransform = transf;
    },

    applyOffsetToScroller : function (offset) {
        this.getCover().innerElement.dom.style.webkitTransform = "translate3d(0, " + offset + "px, 0)";
    }

});

