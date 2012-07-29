/**
 * @class Ext.ux.Cover
 *
 */
Ext.define('Ext.ux.cover.Cover', {
    extend : 'Ext.Container',
    altenateClassName  : 'Ext.ux.Cover',
    xtype  : 'cover',

    requires: [
        'Ext.data.StoreManager',
        'Ext.ux.cover.strategy.Horizontal',
        'Ext.ux.cover.strategy.Vertical',
    ],

    config : {
       /**
         * @cfg {Number} selectedIndex The idx from the Store that will be active first. Only one item can be active at a
         * time
         * @accessor
         */
        selectedIndex: 0,

        store : undefined,

        itemTpl: undefined,

        //private
        scrollable : false,

        listConfig: {
            xtype: 'container',
            baseCls: 'ux-cover-list'
        },

        direction: 'horizontal',

        //private
        offset: undefined
  
     },

    //private
    storeEvents: {
        'addrecords'    : 'onStoreAdd',
        'beforeload'    : 'onStoreBeforeLoad',
        'load'          : 'onStoreLoad',
        'refresh'       : 'onStoreRefresh',
        'removerecords' : 'onStoreRemove'
    },


    initialize : function() {
        var me = this,
            list;

        list = me.list = me.add(me.getListConfig());

        me.callParent(arguments);

        me.on({
            painted : 'onPainted',
            scope: me
        })

        me.element.on({
            drag: 'onDrag',
            dragstart: 'onDragStart',
            dragend: 'onDragEnd',
            scope: me
        });
    },

    getElementConfig : function(){
        return {
            reference: 'element',
            className: 'ux-cover',
            children:[{
                reference: 'innerElement',
                className: 'ux-cover-scroller'
            }]
        }
    },

    applyDirection : function(direction, old) {
        var me = this;
        if(direction != old) {
            me.strategy = Ext.create('strategy.'+direction, {
                cover: me
            });
            me.element.removeCls('ux-cover-'+old);
            me.element.addCls('ux-cover-'+direction);
        }

        return direction;
    },

    applySelectedIndex : function (selectedIndex) {
        console.log('apply selected index', arguments);
        var me = this,
            offset;
        if(me.isPainted()) {
            offset = me.strategy.calculateOffsetForIndex(selectedIndex);
            me.setOffset(offset);
        }

        return selectedIndex;
    },

    updateSelectedIndex : function (selectedIndex) {
        this._selectedIndex = selectedIndex;
    },

    applyOffset : function(offset) {
        console.log('apply offset', arguments);
        var me = this;
        if(me.isPainted()){
            me.updateItemsOffset(offset);
        }
        return offset;
    },

    updateOffset : function(offset) {
        this._offset = offset;
    },

    applyStore : function(store) {
        var me = this,
            eventBind = Ext.apply(me.storeEvents, {scope: me});

        if (store) {
            store = Ext.data.StoreManager.lookup(store);
            if (store && store.isStore) {
                store.on(eventBind);
            }
        }

        return store;          
    },


    updateStore : function(store, oldStore) {
        var me = this,
            eventBind = Ext.apply(me.storeEvents, {scope: me});

        if (oldStore && oldStore.isStore) {
            oldStore.un(eventBind);
        }
    },

    applyItemTpl: function(config) {
        return (Ext.isObject(config) && config.isTemplate) ? config : new Ext.XTemplate(config);
    },

    // -- Store Event Listeners

    onStoreRefresh: function(){
        var me = this,
            store = me.getStore(),
            records = store.getRange(),
            selectedIndex = me.getSelectedIndex();

        me.list.removeAll(true, true);

        me.addRecords(records);
        me.setSelectedIndex(selectedIndex);
    },

    onStoreBeforeLoad: function(){
        console.log('beforeload', arguments);
    },

    onStoreLoad: function(){
        console.log('load', arguments);
    },

    onStoreAdd: function(store, records){
    	this.addRecords(records);
    },

    onStoreRemove: function() {
      console.log('remove', arguments);
    },

    //-- end Store Event Listeners

    //-- List add/remove items

    addRecords: function(records) {
        var me = this,
            l = records.length,
            i = 0, item;

        if (me.isPainted()) {
            console.log('add records')

            for (; i < l; i ++) {
                item = me.prepareItem(records[i]);
                me.list.add(item);
            }
        }
    },

    prepareItem : function(record) {
        var me = this,
            itemTpl = me.getItemTpl(),
            itemBox = me.strategy.itemBox;

        return Ext.apply({
            xtype  : 'component',
            baseCls: 'ux-cover-item',
            styleHtmlContent: true,
            styleHtmlCls: 'ux-cover-item-inner',
            html   : itemTpl.apply(me.prepareData(record)),
            zIndex : me.strategy.nextZIndex(), 
        }, itemBox);
    },

    prepareData : function(record) {
        return record.getData();
    },

    //-- End List add/remove items

    // -- Scroller Listeners

    onDragStart : function() {
    	console.log('dragStart');
    },
    
    onDrag : function(){
    	console.log('drag');
    },

    onDragEnd : function() {
    	console.log('dragEnd');
    },

    // -- End Scroller Listeners


    onPainted : function() {
        var me = this,
            store = me.getStore();

        me.strategy.calculateItemBox(); 
        me.strategy.calculateBoundaries();

        if (store && store.isLoaded()) {
            me.onStoreRefresh();
        }
    },

    getVisibleItems : function() {
        return this.list.getItems().items;
    },

    updateItemsOffset : function(offset) {
        console.log('updat items off', arguments);
        var me = this,
            items = me.getVisibleItems(),
            l = items.length,
            i = 0,
            direction = me.getDirection(),
            item;

        me.strategy.applyOffsetToScroller(offset);

        for(;i < l; i++){
            item = items[i].element;
            me.strategy.setItemTransformation(item, i, offset);
        }
    }


});
