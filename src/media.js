/** 
 * API Media
 * 
 * Copyright 2013 Troll d'idees
 */
(function($, kiubi) {
	'use strict';
	$.extend(kiubi.media, {
		/**
		 * Retourne la liste des médias d'un dossier
		 * 
		 * @param String key
		 * @return Promise
		 */
		getFiles: function(key, opts) {
			var qs =  opts || {};
			return kiubi.get('media/folders/'+key, qs);
		},
		/**
		 * Retourne le détail d'un média
		 * 
		 * @param String key
		 * @return Promise
		 */
		getFile: function(id) {
			return kiubi.get('media/files/'+id);
		}
		
	});
})(jQuery, kiubi);
