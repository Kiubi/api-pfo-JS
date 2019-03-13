/** 
 * API Search
 * 
 * Copyright 2019 Kiubi
 */
(function($, kiubi) {
	'use strict';
	$.extend(kiubi.search, {
		/**
		 * Recherche dans les pages du cms
		 * 
		 * @param String term
		 * @param Object opts
		 * @return Promise
		 */
		pages: function(term, opts) {
			var qs =  opts || {};
			qs.term = term;
			return kiubi.get('search/cms/pages', qs);
		},
		/**
		 * Recherche dans les billets du blog
		 * 
		 * @param String term
		 * @param Object opts
		 * @return Promise
		 */
		posts: function(term, opts) {
			var qs =  opts || {};
			qs.term = term;
			return kiubi.get('search/blog/posts', qs);
		},
		/**
		 * Recherche dans les produits du catalogue
		 * 
		 * @param String term
		 * @param Object opts
		 * @return Promise
		 */
		products: function(term, opts) {
			var qs =  opts || {};
			qs.term = term;
			return kiubi.get('search/catalog/products', qs);
		}
		
	});
})(jQuery, kiubi);
