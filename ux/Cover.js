/**
 * @class Ext.ux.Cover
 *
 */
Ext.define('Ext.ux.Cover', {
    extend : 'Ext.Container',
    xtype  : 'cover',

    require: [
        'Ext.data.StoreManager'
    ],

    config : {
        //private
        // baseCls : 'ux-cover',

        store : undefined,

        itemTpl: undefined,
        //private
        scrollable : false,

        listConfig: {
            xtype: 'container',
            baseCls: 'ux-cover-list'
        }
  
     },

 
    storeEvents: {
        'addrecords'    : 'onStoreAdd',
        'beforeload'    : 'onStoreBeforeLoad',
        'load'          : 'onStoreLoad',
        'refresh'       : 'onStoreRefresh',
        'removerecords' : 'onStoreRemove'
    },

    constructor : function() {
        var me = this;
        me.callParent(arguments);
    },

    initialize : function() {
        var me = this,
            list;

        list = me.list = me.add(me.getListConfig());

        me.callParent(arguments);

        //if store is already loaded no event is fired so we need to force it.
        if (me.getStore()) {
            me.onStoreRefresh();
        }
    },

    getElementConfig: function(){
        return {
            reference: 'element',
            className: 'ux-cover',
            children:[{
                reference: 'innerElement',
                className: 'ux-cover-scroller'
            }]
        }
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
        console.log('refresh', arguments);
        var me = this,
            store = me.getStore(),
            records = store.getRange();

        me.addRecords(records);
    },

    onStoreBeforeLoad: function(){
        console.log('beforeload', arguments);
    },

    onStoreLoad: function(){
        console.log('load', arguments);
    },

    onStoreAdd: function(store, records){
        console.log('add', arguments);
    },

    onStoreRemove: function() {
      console.log('remove', arguments);
    },

    //-- end Store Event Listeners

    addRecords: function(records) {
        var me = this,
            l = records.length,
            i = 0, item;

        for (; i < l; i ++) {
            item = me.prepareItem(records[i]);
            me.list.add(item);
        }
    },

    prepareItem : function(record) {
        var me = this,
            itemTpl = me.getItemTpl();
        return {
            xtype: 'component',
            html : itemTpl.apply(me.prepareData(record))
        }
    },

    prepareData : function(record) {
        return record.getData();
    }


    


});
