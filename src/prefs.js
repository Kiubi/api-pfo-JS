/** 
 * API Preferences
 * 
 * Copyright 2013 Troll d'idees
 */
(function($, kiubi) {
	'use strict';
	$.extend(kiubi.prefs, {
		/**
		 * Retourne les préférences de la médiathèque
		 * 
		 * @return Promise
		 */
		medias: function() {
			return kiubi.get('prefs/medias');
		},
		/**
		 * Retourne les préférences du site
		 * 
		 * @return Promise
		 */
		site: function() {
			return kiubi.get('prefs/site');
		},
		/**
		 * Retourne les préférences du catalogue
		 * 
		 * @return Promise
		 */
		catalog: function() {
			return kiubi.get('prefs/catalog');
		},
		/**
		 * Retourne les préférences du blog
		 * 
		 * @return Promise
		 */
		blog: function() {
			return kiubi.get('prefs/blog');
		}
	});
})(jQuery, kiubi);
