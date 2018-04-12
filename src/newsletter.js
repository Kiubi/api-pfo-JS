/** 
 * API Newsletter
 * 
 * Copyright 2018 Kiubi
 */
(function($, kiubi) {
	'use strict';
	$.extend(kiubi.newsletter, {
		/**
		 * Inscrit un email à la newsletter
		 * 
		 * @param String email
		 * @param Boolean consent
		 * @return Promise
		 */
		subscribe: function(email, consent) {
			var qs = {newsletter: email};
			if (consent) qs.consent = consent;
			return kiubi.post('newsletter', qs);
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
