/**
 *
 */
Ext.define('Ext.ux.cover.strategy.Vertical', {
	extend : 'Ext.Base',
	alias  : 'strategy.vertical',

	config : {
		cover : undefined
	},

    itemBox: undefined,

    zIndex: 9999,

    boundaries: {
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
        var me = this,
            cover = this.getCover(),
            itemBox = me.itemBox,
            h = itemBox.height,
            gap = h * 0.1;

        Ext.apply(me.boundaries, {
            angle     : 0,
            gap       : gap,
            threshold : gap / 2,
            delta     : 0
        }); 
    },

    calculateOffsetOnDrag: function(e){
        var me = this,
            cover = me.getCover(),
            curr = cover.getOffset(),
            ln = cover.getVisibleItems().length,
            selectedIndex, 
            offset,
            delta = e.previousDeltaY;

        //slow down on border conditions
        selectedIndex = cover.getSelectedIndex();

        if((selectedIndex === 0 && e.deltaY < 0) || (selectedIndex === ln - 1 && e.deltaY > 0)){
            delta /= 100;
        }
        return (delta + curr);
    },

    calculateOffsetForIndex : function (idx){
        var me = this,
            cover = me.getCover(),
            items = cover.getVisibleItems(),
            l = items.length,
            gap = me.boundaries.gap;
        
        idx = Math.min(Math.max(idx, 0), l - 1);
        return (idx * gap);
    },

    setItemTransformation : function (item, idx, offset) {
        var me = this,
            cover = this.getCover(),
            gap = me.boundaries.gap,
            threshold = me.boundaries.threshold,
            delta = me.boundaries.delta,
            y = -me.calculateOffsetForIndex(idx),//idx * gap,
            iy = y + offset,
            z = iy*10,
            transf = "";

        if(iy < threshold && iy >= - threshold){
            transf = "translate3d(0, "+y+"px, 0px)";
            cover.updateSelectedIndex(idx);
        }else if(iy < 0){
            transf = "translate3d(0, "+(y+delta)+"px, "+(z)+"px)";
        }else{
            transf = "translate3d(0, "+(y-delta)+"px, 1000px) ";
        }
        item.dom.style.webkitTransform = transf;
    },

    applyOffsetToScroller : function (offset) {

        console.log(offset, "applyOffsetToScroller");
        this.getCover().innerElement.dom.style.webkitTransform = "translate3d(0," + offset + "px, 0)";
    },

    nextZIndex: function() {
        return this.zIndex--;
    }

});

