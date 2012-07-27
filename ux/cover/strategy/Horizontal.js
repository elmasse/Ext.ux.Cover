/**
 *
 */
Ext.define('Ext.ux.cover.strategy.Horizontal', {
	extend : 'Ext.Base',
	alias  : 'strategy.horizontal',

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
            sizeFactor = (cW > cH) ? 0.68 : 0.52,
            h, w;

        h = w = Math.min(containerBox.width, containerBox.height) * sizeFactor; 

        me.itemBox = {
            top: (containerBox.height - h) / 2,
            height: h * 1.5,
            width: w,
            left: (containerBox.width - w) / 2 
        }
    },

    calculateBoundaries : function () {
        var me = this.getCover(),
            direction = me.getDirection(),
            itemBox = me.itemBox,
            w = itemBox.width,
            gap = w / 3;

        Ext.apply(me.boundaries,{
            gap       : gap,
            threshold : gap / 2,
            delta     : w * 0.4
        });   
    },

    setItemTransformation : function (item, idx, offset) {
        var me = this.getCover(),
            gap = me.boundaries.gap,
            threshold = me.boundaries.threshold,
            delta = me.boundaries.delta,
            angle = me.boundaries.angle,
            x = idx * gap,
            ix = x + offset,
            transf = "";

        if(ix < threshold && ix >= - threshold){
            transf = "translate3d("+x+"px, 0, 0)"
            me.updateSelectedIndex(idx);
        }else if(ix > 0){
            transf = "translate3d("+(x+delta)+"px, 0, 0) rotateY(-"+angle+"deg)"
        }else{
            transf = "translate3d("+(x-delta)+"px, 0, 0) rotateY("+angle+"deg)"
        }   
        item.dom.style.webkitTransform = transf;
    },

    applyOffsetToScroller : function (offset) {
        this.getCover().innerElement.dom.style.webkitTransform = "translate3d(" + offset + "px, 0, 0)";
    } 
}); 