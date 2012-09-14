/**
 *
 */
Ext.define('Ext.ux.cover.strategy.Horizontal', {
	extend : 'Ext.Base',
	alias  : 'strategy.horizontal',

	config : {
		cover : undefined
	},
    
    zIndex: 0,

    itemBox: undefined,

    boundaries: {
        angle     : 70,
        gap       : 0,
        threshold : 0,
        delta     : 0
     }, 

	constructor : function (config) {
		this.initConfig(config);
		return this;
	},

    calculateItemBox : function () {
        var me = this,
            cover = this.getCover(),
            containerBox = cover.element.getBox(),
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
        var me = this,
            itemBox = me.itemBox,
            w = itemBox.width,
            gap = w / 3;

        Ext.apply(me.boundaries,{
            gap       : gap,
            threshold : gap / 2,
            delta     : w * 0.4
        });
    },

    calculateOffsetOnDrag: function(e){
        var me = this,
            cover = me.getCover(),
            curr = cover.getOffset(),
            ln = cover.getVisibleItems().length,
            selectedIndex, 
            offset,
            delta = e.previousDeltaX;

        //slow down on border conditions
        selectedIndex = cover.getSelectedIndex();
        if((selectedIndex === 0 && e.deltaX > 0) || (selectedIndex === ln - 1 && e.deltaX < 0)){
            delta *= 0.5;
        }
        return delta + curr;
    },

    calculateOffsetForIndex : function (idx){
        var me = this,
            cover = me.getCover(),
            items = cover.getVisibleItems(),
            l = items.length,
            gap = me.boundaries.gap;
        
        idx = Math.min(Math.max(idx, 0), l - 1);
        return -(idx * gap);
    },

    setItemTransformation : function (item, idx, offset) {
        var me = this,
            cover = this.getCover(),
            gap = me.boundaries.gap,
            threshold = me.boundaries.threshold,
            delta = me.boundaries.delta,
            angle = me.boundaries.angle,
            x = -(me.calculateOffsetForIndex(idx)),
            ix = x + offset,
            transf = "";

        if(ix < threshold && ix >= - threshold){
            transf = "translate3d("+x+"px, 0, 100px)";
            cover.updateSelectedIndex(idx);
        }else if(ix > 0){
            transf = "translate3d("+(x+delta)+"px, 0, 0) rotateY(-"+angle+"deg)";
        }else{
            transf = "translate3d("+(x-delta)+"px, 0, 0) rotateY("+angle+"deg)";
        }   
        item.dom.style.webkitTransform = transf;
    },

    applyOffsetToScroller : function (offset) {
        this.getCover().innerElement.dom.style.webkitTransform = "translate3d(" + offset + "px, 0, 0)";
    },

    nextZIndex: function() {
        return this.zIndex++;
    }
}); 