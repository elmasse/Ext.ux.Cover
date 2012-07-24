Ext.require('Ext.ux.Cover');

Ext.application({
	name: 'CoverDemo',
	
	viewport: {
		autoMaximize: true
	},

	launch: function(){

        Ext.Viewport.add({
            xtype: 'tabpanel',
            tabBarPosition: 'bottom',
            items:[{
                xtype: 'titlebar',
                title: 'Cover Demo',
                docked: 'top'
            },{
                title: 'Horizontal',
                iconCls: 'favorites',
                layout: 'fit',
                items: [{
                    xtype: 'cover',
                    itemTpl : [
                        '<div>',
                            '<div class="dev">{firstName} {lastName}</div>',
                            '<div class="company">{company}</div>',
                            '<div class="image"><tpl if="image"><img  src="{image}"></tpl></div>',
                        '</div>'
                    ],
                    store : {
                        storeId: 'store1',
                        fields: ['firstName', 'lastName', 'company', 'image'],
                        data: [
                            {firstName: 'Tommy',   lastName: 'Maintz', company: 'Sencha', image: './images/sencha.png'},
                            {firstName: 'Rob',     lastName: 'Dougan', company: 'Sencha', image: './images/sencha.png'},
                            {firstName: 'Max',     lastName: 'Fierro', company: 'Sencha', image: './images/sencha.png'},
                            {firstName: 'Ed',      lastName: 'Spencer', company: 'Sencha', image: './images/sencha.png'},
                            {firstName: 'Jamie',   lastName: 'Avins', company: 'Sencha', image: './images/sencha.png'},
                            {firstName: 'Aaron',   lastName: 'Conran', company: 'Sencha', image: './images/sencha.png'},
                            {firstName: 'Dave',    lastName: 'Kaneda', company: 'Sencha', image: './images/sencha.png'},
                            {firstName: 'Michael', lastName: 'Mullany', company: 'Sencha', image: './images/sencha.png'},
                            {firstName: 'Abraham', lastName: 'Elias', company: 'Sencha', image: './images/sencha.png'},
                            {firstName: 'Jay',     lastName: 'Robinson', company: 'Sencha', image: './images/sencha.png'}
                        ]
                    }
                }]
            },{
                title: 'Vertical',
                iconCls: 'favorites',
                layout: 'fit',
                items: [{
                    xtype: 'cover',
                    itemTpl : [
                        '<div>',
                            '<div class="dev">{firstName} {lastName}</div>',
                            '<div class="company">{company}</div>',
                            '<div class="image"><tpl if="image"><img  src="{image}"></tpl></div>',
                        '</div>'
                    ],
                    store : {
                        storeId: 'store2',
                        fields: ['firstName', 'lastName', 'company', 'image'],
                        data: [
                            {firstName: 'Dave',    lastName: 'Kaneda', company: 'Sencha', image: './images/sencha.png'},
                            {firstName: 'Michael', lastName: 'Mullany', company: 'Sencha', image: './images/sencha.png'},
                            {firstName: 'Abraham', lastName: 'Elias', company: 'Sencha', image: './images/sencha.png'},
                            {firstName: 'Jay',     lastName: 'Robinson', company: 'Sencha', image: './images/sencha.png'}
                        ]
                    }
                }]
            }]

        });
	}
});