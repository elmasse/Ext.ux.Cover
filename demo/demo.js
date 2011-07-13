Ext.regApplication({
	launch: function(){
		Ext.regModel('Contact', {
		    fields: ['firstName', 'lastName']
		});

		var store = new Ext.data.JsonStore({
		    model  : 'Contact',

		    data: [
		        {firstName: 'Tommy',   lastName: 'Maintz', company: 'Sencha', image: './images/sencha.png'},
		        {firstName: 'Rob',     lastName: 'Dougan', company: 'Sencha', image: './images/sencha.png'},
		        {firstName: 'Max',     lastName: 'Fierro', company: 'elmasse!'},
		        {firstName: 'Ed',      lastName: 'Spencer', company: 'Sencha', image: './images/sencha.png'},
		        {firstName: 'Jamie',   lastName: 'Avins', company: 'Sencha', image: './images/sencha.png'},
		        {firstName: 'Aaron',   lastName: 'Conran', company: 'Sencha', image: './images/sencha.png'},
		        {firstName: 'Dave',    lastName: 'Kaneda', company: 'Sencha', image: './images/sencha.png'},
   		        {firstName: 'Michael', lastName: 'Mullany', company: 'Sencha', image: './images/sencha.png'},
   		        {firstName: 'Abraham', lastName: 'Elias', company: 'Sencha', image: './images/sencha.png'},
			    {firstName: 'Jay',     lastName: 'Robinson', company: 'Sencha', image: './images/sencha.png'}
		    ]
		});
		
		var cover = new Ext.ux.Cover({
			itemCls: 'my-cover-item',
			//These are just for demo purposes.
			height: !Ext.is.Phone? 400: undefined,
			width: !Ext.is.Phone? 800: undefined,
			//end-demo
		    itemTpl : [
				'<div>',
					'<div class="dev">{firstName} {lastName}</div>',
					'<div class="company">{company}</div>',
					'<div class="image"><tpl if="image"><img  src="{image}"></tpl></div>',
				'</div>'
			],
		    store: store,
			activeItem: 2
		});

				
		new Ext.TabPanel({
			fullscreen: true,
			tabBar:{
				dock: 'bottom',
				layout: {pack: 'center'}
			},
			items:[{
				title: 'cover',
				iconCls: 'favorites',
				//Demo purpose
				layout: Ext.is.Phone ? 'fit': {
					type: 'vbox',
					pack:'center',
					align: 'center'
				},
				//end demo
				items: [cover]
			}]
		})
	}
});