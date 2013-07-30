/** 
 * API Cart
 * 
 * Copyright 2013 Troll d'idees
 */
(function($, kiubi) {
	'use strict';
	$.extend(kiubi.cart, {
		/**
		 * Retourne le panier
		 * 
		 * @param Object opts
		 * @return Promise
		 */
		get: function(opts) {
			var qs =  opts || {};
			return kiubi.get('cart', qs);
		},
		/**
		 * Vide le panier
		 * 
		 * @return Promise
		 */
		empty: function() {
			return kiubi['delete']('cart');
		},
		/**
		 * Ajoute une variante au panier
		 * 
		 * @param Integer id
		 * @param Integer qt
		 * @param Integer mode
		 * @param Object opts
		 * @return Promise
		 */
		addItem: function(id, qt, mode, opts) {
			var qs = opts || {}
			if(qt) qs.quantity = qt;
			if(mode) qs.mode = mode;
			return kiubi.put('cart/items/'+id, qs);
		},
		/**
		 * Ajoute des variantes au panier
		 * 
		 * @param Object items
		 * @param Integer mode
		 * @param Object opts
		 * @return Promise
		 */
		addItems: function(items, mode, opts) {
			var qs = opts || {};
			qs.items = items;
			if(mode) qs.mode = mode;
			return kiubi.put('cart/items', qs);
		},
		/**
		 * Retire une variante du panier
		 * 
		 * @param Integer id
		 * @return Promise
		 */
		removeItem: function(id) {
			return kiubi['delete']('cart/items/'+id);
		},
		/**
		 * Récupère le bon de réduction
		 * 
		 * @return Promise
		 */
		getVoucher: function() {
			return kiubi.get('cart/voucher');
		},
		/**
		 * Retire le bon de réduction
		 * 
		 * @return Promise
		 */
		removeVoucher: function() {
			return kiubi['delete']('cart/voucher');
		},
		/**
		 * Ajout un bon de réduction
		 * 
		 * @param String code
		 * @param Object opts
		 * @return Promise
		 */
		addVoucher: function(code, opts) {
			var qs = opts || {};
			qs.code = code;
			return kiubi.put('cart/voucher', qs);
		},
		/**
		 * Récupère une sauvegarde du panier
		 * 
		 * @return Promise
		 */
		backup: function() {
			return kiubi.get('cart/backup');
		},
		/**
		 * Restaure une sauvegarde du panier
		 * 
		 * @param String backup
		 * @return Promise
		 */
		restore: function(backup) {
			return kiubi.put('cart/backup', {backup: backup});
		},
		/**
		 * Retourne la liste des transporteurs disponibles
		 * 
		 * @return Promise
		 */
		getCarriers: function() {
			return kiubi.get('cart/carriers');
		},
		/**
		 * Définis un transporteur
		 * 
		 * @param Integer id
		 * @return Promise
		 */
		setShipping: function(id) {
			return kiubi.put('cart/shipping', {carrier_id: id});
		},
		/**
		 * Définis les adresses de facturation et livraison
		 * 
		 * @param Object billing
		 * @param Object shipping
		 * @return Promise
		 */
		setAdresses: function(billing, shipping) {
			var qs = {billing: billing};
			if(shipping) {
				qs.shipping = shipping;
				qs.use_billing_as_shipping = false;
			} else {
				qs.use_billing_as_shipping = true;
			}
			return kiubi.put('cart/addresses', qs);
		},
		/**
		 * Retourne les adresses de facturation et livraison
		 * 
		 * @return Promise
		 */
		getAdresses: function() {
			return kiubi.get('cart/addresses');
		}
	});
})(jQuery, kiubi);
