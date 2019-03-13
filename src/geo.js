/** 
 * API Geo
 * 
 * Copyright 2019 Kiubi
 */
(function($, kiubi) {
	'use strict';
	$.extend(kiubi.media, {
        /**
		 * Liste les pays
		 * 
		 * @return Promise
		 */
		getCountries: function() {
			return kiubi.get('geo/countries');
		},
        /**
		 * Détail d'un pays
		 * 
		 * @param Number|String id Identifiant ou code iso
		 * @return Promise
		 */
		getCountry: function(id) {
			return kiubi.get('geo/countries/'+id);
		},
        /**
		 * Liste les régions d'un pays
		 * 
		 * @param Number id
		 * @return Promise
		 */
		getRegions: function(id) {
			return kiubi.get('geo/countries/'+id+'/regions');
		},
        /**
		 * Liste les départements d'un pays
		 * 
		 * @param Number id
		 * @return Promise
		 */
		getDepartements: function(id) {
			return kiubi.get('geo/countries/'+id+'/departements');
		}
	});
})(jQuery, kiubi);
