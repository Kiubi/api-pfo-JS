/** 
 * API CMS
 * 
 * Copyright 2013 Troll d'idees
 */
(function($, kiubi) {
	'use strict';
	$.extend(kiubi.cms, {
		/**
		 * Retourne la liste des billets
		 * 
		 * @param Object opts
		 * @return Promise
		 */
		getPosts: function(opts) {
			var qs =  opts || {};
			return kiubi.get('cms/posts', qs);
		},
		/**
		 * Retourne la liste des billets d'une page
		 * 
		 * @param String name
		 * @param Object opts
		 * @return Promise
		 */
		getPostsOfPage: function(name, opts) {
			var qs =  opts || {};
			return kiubi.get('cms/pages/'+name+'/posts', qs);
		},
		/**
		 * Retourne la liste des pages d'un menu
		 * 
		 * @param String key
		 * @param Object opts
		 * @return Promise
		 */
		getPages: function(key, opts) {
			var qs = opts || {};
			return kiubi.get('cms/menus/'+key+'/pages', qs);
		},
		/**
		 * Retourne la liste des pages enfants d'une page
		 * 
		 * @param String name
		 * @param Object opts
		 * @return Promise
		 */
		getChildren: function(name, opts) {
			var qs = opts || {};
			return kiubi.get('cms/pages/'+name+'/children', qs);
		},
		
		/**
		 * Retourne la page parente d'une page
		 * 
		 * @param String name
		 * @return Promise
		 */
		getParent: function(name) {
			return kiubi.get('cms/pages/'+name+'/parent');
		}
		
	});
})(jQuery, kiubi);
