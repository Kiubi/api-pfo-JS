/** 
 * API Users
 * 
 * Copyright 2019 Kiubi
 */
(function($, kiubi) {
	'use strict';
	$.extend(kiubi.users, {
		/**
		 * Retourne les informations de l'utilisateur
		 * 
		 * @param Integer id
		 * @return Promise
		 */
		getInfos: function(id) {
			return kiubi.get('users/'+id);
		},
		/**
		 * Retourne les addresses de facturation et livraison de l'utilisateur
		 * 
		 * @param Integer id
		 * @return Promise
		 */
		getAddresses: function(id) {
			return kiubi.get('users/'+id+'/addresses');
		},
		/**
		 * Retourne la liste des commandes de l'utlisateur
		 * 
		 * @param Integer id
		 * @return Promise
		 */
		getOrders: function(id) {
			return kiubi.get('users/'+id+'/orders');
		},
		/**
		 * Retourne le détail d'une commande
		 * 
		 * @param Integer id
         * @param Object opts
		 * @return Promise
		 */
		getOrder: function(id, opts) {
            var qs = opts || {};
			return kiubi.get('orders/'+id, qs);
		}
		
	});
})(jQuery, kiubi);
