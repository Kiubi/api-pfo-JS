/** 
 * API Newsletter
 * 
 * Copyright 2013 Troll d'idees
 */
(function($, kiubi) {
	'use strict';
	$.extend(kiubi.newsletter, {
		/**
		 * Inscrit un email à la newsletter
		 * 
		 * @param String email
		 * @return Promise
		 */
		subscribe: function(email) {
			return kiubi.post('newsletter', {newsletter: email});
		},
		/**
		 * Désinscrit un email à la newsletter
		 * 
		 * @param String email
		 * @return Promise
		 */
		unsubscribe: function(email) {
			return kiubi['delete']('newsletter', {newsletter: email});
		}
		
	});
})(jQuery, kiubi);
