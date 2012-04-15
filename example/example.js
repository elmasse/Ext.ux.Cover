Ext.application({
	name: 'MyAlbums',
	requires: ['Ext.ux.Cover'],

	launch: function(){
		var store, cover;
		//create a store
		store = Ext.create('Ext.data.Store',{
		    fields: ['album', 'artist', 'year', 'artwork'],
		    data: [
			    {album: 'In Between Dreams', artist: 'Jack Johnson', year:'2005', artwork: './artwork/InBetweenDreams.jpg'},
			    {album: 'On and On', artist: 'Jack Johnson', year:'2003'},
			    {album: 'Back in Black', artist: 'AC/DC', year:'1980'},
			    {album: 'Jailbreak 74', artist: 'AC/DC', year:'1974'}

			]
		});

		//create the coverflow
        cover = Ext.create('Ext.ux.Cover', {
        	fullscreen: true,
            store: store,
            itemCls: 'album-cover',
            itemTpl: [
            	'<div class="artwork">',
            	'	<tpl if="artwork"><img src="{artwork}">',
            	'	<tpl else><img src="./artwork/album.png"></tpl>',
            	'</div>',
            	'<div class="description">{album} <br/> {artist} ({year})</div>'
            ]
        });

        store.sort("artist", "ASC");

        //add it to viewport
        Ext.Viewport.add(cover);

	}

});