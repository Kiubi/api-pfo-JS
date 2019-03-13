/** 
 * API Catalog
 * 
 * Copyright 2019 Kiubi
 */
(function($, kiubi) {
	'use strict';
	$.extend(kiubi.catalog, {
		/**
		 * Retourne la liste des produits
		 * 
		 * @param Object opts
		 * @return Promise
		 */
		getProducts: function(opts) {
			var qs = opts || {};
			return kiubi.get('catalog/products', qs);
		},
		/**
		 * Retourne la liste des produits d'une catégorie
		 * 
		 * @param Integer id
		 * @param Object opts
		 * @return Promise
		 */
		getProductsByCategory: function(id, opts) {
			var qs = opts || {};
			return kiubi.get('catalog/categories/'+id+'/products', qs);
		},
		/**
		 * Retourne la liste des produits d'un ou plusieurs tag
		 * 
		 * @param String tags
		 * @param Object opts
		 * @return Promise
		 */
		getProductsByTags: function(tags, opts) {
			var qs = opts || {};
			qs.tags = tags;
			return kiubi.get('catalog/products', qs);
		},
		/**
		 * Retourne la liste des catégories
		 * 
		 * @param Object opts
		 * @return Promise
		 */
		getCategories: function(opts) {
			var qs = opts || {};
			return kiubi.get('catalog/categories', qs);
		},
		/**
		 * Retourne la liste des tags
		 * 
		 * @param Object opts
		 * @return Promise
		 */
		getTags: function(opts) {
			var qs = opts || {};
			return kiubi.get('catalog/tags', qs);
		},
		/**
		 * Retourne la liste des tags d'une catégorie
		 * 
		 * @param Integer id
		 * @param Object opts
		 * @return Promise
		 */
		getCategoryTags: function(id, opts) {
			var qs = opts || {};
			return kiubi.get('catalog/categories/'+id+'/tags', qs);
		},
		/**
		 * Retourne la liste des commentaires
		 * 
		 * @param Object opts
		 * @return Promise
		 */
		getComments: function(opts) {
			var qs = opts || {};
			return kiubi.get('catalog/comments', qs);
		},
		/**
		 * Retourne le détail d'un produit
		 * 
		 * @param Integer id
		 * @param Object opts
		 * @return Promise
		 */
		getProduct: function(id, opts) {
			var qs = opts || {};
			return kiubi.get('catalog/products/'+id, qs);
		},		
		/**
		 * Retourne la liste des commentaires d'un produits
		 * 
		 * @param Integer id
		 * @param Object opts
		 * @return Promise
		 */
		getProductComments: function(id, opts) {
			var qs = opts || {};
			return kiubi.get('catalog/products/'+id+'/comments', qs);
		},
		/**
		 * Retourne un captcha pour un produit
		 * 
		 * @param Integer id
		 * @return Promise
		 */
		getCaptcha: function(id) {
			return kiubi.get('catalog/products/'+id+'/captcha');
		},
		/**
		 * Poste un commentaire produit
		 * 
		 * @param Integer id
		 * @param String comment
		 * @param String author
		 * @param String rate
		 * @param String captcha
		 * @param String consent
		 * @return Promise
		 */
		addComment: function(id, comment, author, rate, captcha, consent) {
			var qs = {id: id, comment: comment};
			if(author) qs.author = author;
			if(rate) qs.rate = rate;
			if(captcha) qs.captcha = captcha;
			if(consent) qs.consent = consent;
			return kiubi.post('catalog/products/'+id+'/comments', qs);
		},
		/**
		 * Retourne la liste des produits associés à un produit
		 * 
		 * @param Integer id
		 * @param Object opts
		 * @return Promise
		 */
		getLinkedProducts: function(id, opts) {
			var qs = opts || {};
			return kiubi.get('catalog/products/'+id+'/linked', qs);
		},
		/**
		 * Retourne la liste des produits également achetés d'un produit
		 * 
		 * @param Integer id
		 * @param Object opts
		 * @return Promise
		 */
		getAlsoBoughtProducts: function(id, opts) {
			var qs = opts || {};
			return kiubi.get('catalog/products/'+id+'/alsobought', qs);
		},
		/**
		 * Retourne la liste des images d'un produit
		 * 
		 * @param Integer id
		 * @param Object opts
		 * @return Promise
		 */
		getProductImages: function(id, opts) {
			var qs = opts || {};
			return kiubi.get('catalog/products/'+id+'/images', qs);
		},
		/**
		 * Retourne si un produit est disponible ou non
		 * 
		 * @param Integer id
		 * @return Promise
		 */
		getProductAvailability: function(id) {
			return kiubi.get('catalog/products/'+id+'/availability');
		},
		/**
		 * Retourne si une variante est disponible ou non
		 * 
		 * @param Integer id
		 * @return Promise
		 */
		getVariantAvailability: function(id) {
			return kiubi.get('catalog/variants/'+id+'/availability');
		}
	});
})(jQuery, kiubi);
