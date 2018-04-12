/** 
 * API Blog
 * 
 * Copyright 2018 Kiubi
 */
(function($, kiubi) {
	'use strict';
	$.extend(kiubi.blog, {
		/**
		 * Retourne la liste des billets
		 * 
		 * @param Object opts
		 * @return Promise
		 */
		getPosts: function(opts) {
			var qs =  opts || {};
			return kiubi.get('blog/posts', qs);
		},
		/**
		 * Retourne la liste des catégories
		 * 
		 * @param Object opts
		 * @return Promise
		 */
		getCategories: function(opts) {
			var qs =  opts || {};
			return kiubi.get('blog/categories', qs);
		},
		/**
		 * Retourne la liste des billets d'une catégorie
		 * 
		 * @param Integer id
		 * @param Object opts
		 * @return Promise
		 */
		getPostsByCategory: function(id, opts) {
			var qs =  opts || {};
			return kiubi.get('blog/categories/'+id+'/posts', qs);
		},
		/**
		 * Retourne la liste des billets d'une année
		 * 
		 * @param Integer year
		 * @param Object opts
		 * @return Promise
		 */
		getPostsByYear: function(year, opts) {
			var qs =  opts || {};
			return kiubi.get('blog/'+year+'/posts', qs);
		},
		/**
		 * Retourne la liste des billets d'un mois
		 * 
		 * @param Integer year
		 * @param Integer month
		 * @param Object opts
		 * @return Promise
		 */
		getPostsByMonth: function(year, month, opts) {
			var qs =  opts || {};
			return kiubi.get('blog/'+year+'/'+month+'/posts', qs);
		},
		/**
		 * Retourne la liste des billets d'un jour
		 * 
		 * @param Integer year
		 * @param Integer month
		 * @param Integer day
		 * @param Object opts
		 * @return Promise
		 */
		getPostsByDay: function(year, month, day, opts) {
			var qs =  opts || {};
			return kiubi.get('blog/'+year+'/'+month+'/'+day+'/posts', qs);
		},
		/**
		 * Retourne la liste des billets d'une catégorie d'une année
		 * 
		 * @param Integer id
		 * @param Integer year
		 * @param Object opts
		 * @return Promise
		 */
		getPostsByCategoryAndYear: function(id, year, opts) {
			var qs =  opts || {};
			return kiubi.get('blog/categories/'+id+'/'+year+'/posts', qs);
		},
		/**
		 * Retourne la liste des billets d'une catégorie d'un mois
		 * 
		 * @param Integer id
		 * @param Integer year
		 * @param Integer month
		 * @param Object opts
		 * @return Promise
		 */
		getPostsByCategoryAndMonth: function(id, year, month, opts) {
			var qs =  opts || {};
			return kiubi.get('blog/categories/'+id+'/'+year+'/'+month+'/posts', qs);
		},
		/**
		 * Retourne la liste des billets d'une catégorie d'un jour
		 * 
		 * @param Integer id
		 * @param Integer year
		 * @param Integer month
		 * @param Integer day
		 * @param Object opts
		 * @return Promise
		 */
		getPostsByCategoryAndDay: function(id, year, month, day, opts) {
			var qs =  opts || {};
			return kiubi.get('blog/categories/'+id+'/'+year+'/'+month+'/'+day+'/posts', qs);
		},
		/**
		 * Retourne la liste liste des archives
		 * 
		 * @param Object opts
		 * @return Promise
		 */
		getArchives: function(opts) {
			var qs =  opts || {};
			return kiubi.get('blog/archives', qs);
		},
		/**
		 * Retourne le détail d'un billet
		 * 
		 * @param Integer id
		 * @return Promise
		 */
		getPost: function(id) {
			return kiubi.get('blog/posts/'+id);
		},
		/**
		 * Retourne un captcha pour un billet
		 * 
		 * @param Integer id
		 * @return Promise
		 */
		getCaptcha: function(id) {
			return kiubi.get('blog/posts/'+id+'/captcha');
		},
		/**
		 * Retourne la liste des commmentaires
		 * 
		 * @param Object opts
		 * @return Promise
		 */
		getComments: function(opts) {
			var qs = opts || {};
			return kiubi.get('blog/comments', qs);
		},
		/**
		 * Retourne la liste des commentaires d'un billet
		 * 
		 * @param Integer id
		 * @param Object opts
		 * @return Promise
		 */
		getPostComments: function(id, opts) {
			var qs = opts || {};
			return kiubi.get('blog/posts/'+id+'/comments', qs);
		},
		/**
		 * Poste un commentaire sur un billet
		 * 
		 * @param Integer id
		 * @param String comment
		 * @param String author
		 * @param String email
		 * @param String website
		 * @param String captcha
		 * @param String consent
		 * @return Promise
		 */
		addComment: function(id, comment, author, email, website, captcha, consent) {
			var qs = {id: id, comment: comment};
			if(author) qs.author = author;
			if(email) qs.email = email;
			if(website) qs.website = website;
			if(captcha) qs.captcha = captcha;
			if(consent) qs.consent = consent;
			return kiubi.post('blog/posts/'+id+'/comments');
		}
	});
})(jQuery, kiubi);
