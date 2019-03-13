/** 
 * Kiubi API - jQuery Client v1.2
 * 
 * Copyright 2019 Kiubi
 */
kiubi = window.kiubi || {};
(function($, kiubi) {
	'use strict';
	
	// variable privée accessible via la méthode kiubi.getRateRemaining()
	var rate_remaining;
	
	$.extend(kiubi, {
	
		api_version: 1,
		js_version: '1.2',
		base: '/api/',
		
        blog: {},
        cart: {},
		catalog: {},
		cms: {},
        forms: {},
        geo: {},
        media: {},
		newsletter: {},
		prefs: {},
		search: {},
		users: {},
		
		/**
		 * Effectue une requête concrète vers l'api 
		 * puis résout ou rejette la demande suivant le retour
		 * 
		 * @param String type
		 * @param String endpoint
		 * @param Object params
		 * @return Promise
		 */
		query: function(type, endpoint, params, ajax_options) {
			var d = $.Deferred();
			var k = this;
			if(endpoint.indexOf('/')!=0) endpoint = '/'+endpoint;
			var url = this.base+'v'+this.api_version+endpoint;
			if(url.indexOf('.json')==-1) url += '.json';
			params = params || {};
			
			var query = $.ajax($.extend({
				type: type,
				dataType: 'json',
				data: params,
				url: url,
				headers: {'X-API': 'Kiubi API jQuery Client v'+k.js_version}
			}, ajax_options || {}))
			.done(function(s){
				if(s.meta.status_code != 200) {
					d.reject(s.meta, s.error, s.data);
				} else {
					d.resolve(s.meta, s.data);
				}
			})
			.fail(function(s){
				if(s.responseText=='') { // vide en cas de requête cross domain
					d.reject({}, {}, {});
				} else {
					// sur un fail jquery stocke le retour json sous forme de texte
					var j = $.parseJSON(s.responseText);
				}
				d.reject(j.meta, j.error, j.data);
			})
			.always(function(s){
				if(!s.meta) {
					s = $.parseJSON(s.responseText);
				}
				rate_remaining = s.meta.rate_remaining;
			});
			return d.promise();
		},
		
		/**
		 * Effectue une requête de type POST
		 * 
		 * @param String endpoint
		 * @param Object params
		 * @return Promise
		 */
		post: function(endpoint, params) {
			$.ajaxSetup({cache: false});
			return this.query('POST', endpoint, params);
		},
		
		/**
		 * Effectue une requête de type GET
		 * 
		 * @param String endpoint
		 * @param Object params
		 * @return Promise
		 */
		get: function(endpoint, params) {
			$.ajaxSetup({cache: true});
			return this.query('GET', endpoint, params);
		},
		
		/**
		 * Effectue une requête de type PUT
		 * 
		 * @param String endpoint
		 * @param Object params
		 * @return Promise
		 */
		put: function(endpoint, params) {
			$.ajaxSetup({cache: false});
			return this.query('PUT', endpoint, params);
		},
		
		/**
		 * Effectue une requête de type DELETE
		 * 
		 * @param String endpoint
		 * @param Object params
		 * @return Promise
		 */
		'delete': function(endpoint, params) {
			$.ajaxSetup({cache: false});
			return this.query('DELETE', endpoint, params);
		},
		
		/**
		 * Effectue une connexion d'un utilisateur
		 * 
		 * @param String login
		 * @param String password
		 * @return Promise
		 */
		login: function(login, password) {
			return this.put('session', {login:login, password:password});
		},
		
		/**
		 * Effectue une déconnexion de l'utilisateur courant
		 * 
		 * @return Promise
		 */
		logout: function() {
			return this['delete']('session');
		},
        
        /**
		 * Vérifie la validité de la session et retourne les informations de 
         * l'utilisateur connecté.
		 * 
		 * @return Promise
		 */
		getSession: function() {
			return this.get('session');
		},
		
		/**
		 * Parse la première page d'une liste de résultats
		 * 
		 * @param Object meta
		 * @return Promise
		 */
		getFirstPage: function(meta) {
			if(meta && meta.link && meta.link.first_page) {
				return this.crawl(meta.link.first_page);
			} else {
				return this.fail();
			}
		},
	
		/**
		 * Parse la page précédente d'une liste de résultats
		 * 
		 * @param Object meta
		 * @return Promise
		 */
		getPreviousPage: function(meta) {
			if(meta && meta.link && meta.link.previous_page) {
				return this.crawl(meta.link.previous_page);
			} else {
				return this.fail();
			}
		},
		
		/**
		 * Parse la page suivante d'une liste de résultats
		 * 
		 * @param Object meta
		 * @return Promise
		 */
		getNextPage: function(meta) {
			if(meta && meta.link && meta.link.next_page) {
				return this.crawl(meta.link.next_page);
			} else {
				return this.fail();
			}
		},
		
		/**
		 * Parse la dernière page d'une liste de résultats
		 * 
		 * @param Object meta
		 * @return Promise
		 */
		getLastPage: function(meta) {
			if(meta && meta.link && meta.link.last_page) {
				return this.crawl(meta.link.last_page);
			} else {
				return this.fail();
			}
		},
		
		/**
		 * Parse la page numéro X d'une liste de résultats
		 * 
		 * @param Object meta
		 * @param Integer num
		 * @return Promise
		 */
		getPage: function(meta, num) {
			if(meta && meta.link && meta.link.first_page) {
				return this.crawl(meta.link.first_page+'&page='+parseInt(num));
			} else {
				return this.fail();
			}
		},
		
		/**
		 * Indique si une page suivante existe
		 * 
		 * @param Object meta
		 * @return Boolean
		 */
		hasNextPage: function(meta) {
			return meta && meta.link && meta.link.next_page;
		},
		
		/**
		 * Indique si une page précédente existe
		 * 
		 * @param Object meta
		 * @return Boolean
		 */
		hasPreviousPage: function(meta) {
			return meta && meta.link && meta.link.previous_page;
		},
		
		/**
		 * Requete un lien
		 * 
		 * @param String link
		 * @return Promise
		 */
		crawl: function(link) {
			link = link.replace(this.base+'v'+this.api_version, '');
			return this.get(link);
		},
		
		/**
		 * Gestion de l'erreur sur la requête d'un lien
		 * 
		 * @return Promise
		 */
		fail: function() {
			var d = new $.Deferred();
			d.reject({}, {}, {});
			return d.promise();
		},
		
		/**
		 * Encode une chaine de texte unicode dans 
		 * l'encodage utilisé par la plateforme
		 * 
		 * @param String
		 * @return String
		 */
		escape : function(bytes) {
			var cp1252  = "\x80\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8E\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9E\x9F";
			var unicode = "\u20AC\u201A\u0192\u201E\u2026\u2020\u2021\u02C6\u2030\u0160\u2039\u0152\u017D\u2018\u2019\u201C\u201D\u2022\u2013\u2014\u02DC\u2122\u0161\u203A\u0153\u017E\u0178";
			var n = bytes.length;
			var chars = new Array(n);
			for (var i= 0; i<n; i++) {
				var index = unicode.indexOf(bytes[i]);
				if(index < 0) chars[i] = bytes[i];
				else chars[i] = cp1252.charAt(index);
			}
			return window.escape(chars.join(''));
		},
		
		/**
		 * Retourne le quota de requêtes restantes
		 * 
		 * @param Boolean remote_check si ce paramètre est à true, le quota est
		 *     vérifié sur le serveur, dans le cas contraire, lorsque
		 *     sa valeur est disponible, le quota est recherché dans 
		 *     l'objet kiubi, mis à jour lors de chaque appelle à la
		 *     méthode kiubi.query()
		 * @return Integer
		 */
		getRateRemaining: function(remote_check) {
			if(remote_check || rate_remaining == undefined) {
				var result = $.ajax({
					dataType : 'json',
					url : this.base+'v'+this.api_version+'/rate',
					async : false
				});
				var meta = $.parseJSON(result.responseText).meta;
				rate_remaining = meta && meta.rate_remaining;
			}
			return rate_remaining;
		},
		
		/**
		 * Helper permettant de faciliter la navigation dans un listing
		 * 
		 * Le navigateur se construit avec les paramètres opts.endpoint
		 * et opts.params correspondant aux URL et paramètres d'une
		 * requête API 
		 * 
		 * exemple : 
		 * nav = new kiubi.api_navigator({
		 *    endpoint : '/catalog/products',
		 *    params : { tags : "Nouveauté", limit : 6 }
		 * });
		 * 
		 * L'objet nav créé dispose des méthodes suivantes :
		 * nav.getPage(__num__); // chargera la page "__num__"
		 * nav.getNextPage(); // chargera la page suivante de la dernière page chargée
		 * @param Object opts Options
		 */		
		api_navigator : function(opts) {
	
			var options = opts || {};
			
			var loading		  = false;
			var complete	 = false;
			var last_meta	 = null;
			var current_page = options.current_page || 0;
			
			/**
			 * Charge les élements de la page dont le numéro est passé en
			 * paramètre. La première page est la page 0.
			 * 
			 * @param page
			 * @return Promise
			 */
			this.getPage = function(page) {
				
				// Paramètres de la requête API
				var params = $.extend(options.params || {}, {
					'page' : page ? page : 0
				});
				
				return kiubi
					.get(options.endpoint, params)
					.done(function(meta, data) {
						// Mise à jour du numéro de la page courante
						current_page = meta.current_page;
						last_meta = meta;
						complete = !meta.link.next_page;
					})
					.always(function(){
						// libère le verrou évitant des requêtes concurrentes
						loading = false;
					});
			}
			
			/**
			 * Determine si la navigation contient une page suivante
			 * @return Boolean|undefined
			 */
			this.hasNextPage = function() {
				return (!complete);
			}
			
			/**
			 * Charge les élements de la page suivante s'il y en a une
			 * @return Promise
			 */
			this.getNextPage = function(){
				// Si un verrou est posé, on return.
				if(loading || complete) return kiubi.fail();

				loading = true; // pose un verrou évitant des requêtes concurrentes

				if(!last_meta) {
					// Aucune donné de meta n'est disponible dans l'objet
					// on forward vers la méthode loadPage
					return this.getPage(current_page + 1);
				}
				
				return kiubi
					.getNextPage(last_meta)
					.done(function(meta, data) {
						// Mise à jour du numéro de la page courante
						current_page = meta.current_page;
						last_meta = meta;
						complete = !meta.link.next_page;
					})
					.always(function(){
						// libère le verrou évitant des requêtes concurrentes
						loading = false;
					});
			}
		}
	});
	
})(jQuery, kiubi);
/** 
 * API Blog
 * 
 * Copyright 2019 Kiubi
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
		 * @return Promise
		 */
		getArchives: function() {
			return kiubi.get('blog/archives');
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
			return kiubi.post('blog/posts/'+id+'/comments', qs);
		}
	});
})(jQuery, kiubi);
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
/** 
 * API Cart
 * 
 * Copyright 2019 Kiubi
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
		 * Récupère les options à la commande
         *
         * @param Object opts
		 * @return Promise
		 */
		getOptions: function(opts) {
            var qs = opts || {};
			return kiubi.get('cart/options', qs);
		},
        /**
		 * Ajoute une option à la commande
		 * 
		 * @param Object items
		 * @param Integer mode
		 * @param Object opts
		 * @return Promise
		 */
		addOption: function(id, value, opts) {
			var qs = opts || {};
			qs.value = value;
			return kiubi.put('cart/options/'+id, qs);
		},
		/**
		 * Supprime une option à la commande 
		 * 
		 * @param Integer id
		 * @return Promise
		 */
		removeOption: function(id) {
			return kiubi['delete']('cart/options/'+id);
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
		 * Teste la disponibilité d'un date de livraison
		 * 
		 * @param Integer id
		 * @param String scheduled_date
		 * @param String scheduled_hour
		 * @return Promise
		 */
		testCarrierSchedule: function(id, scheduled_date, scheduled_hour) {
			var qs = {scheduled_date: scheduled_date};
			if (scheduled_hour) qs.scheduled_hour = scheduled_hour;
			return kiubi.get('cart/carriers/'+id+'/schedule', qs);
		},		
		/**
		 * Définis un transporteur
		 * 
		 * @param Integer id
		 * @param String scheduled_date
		 * @param String scheduled_hour
		 * @return Promise
		 */
		setShipping: function(id, scheduled_date, scheduled_hour) {
			var qs = {carrier_id: id};
			if (scheduled_date) qs.scheduled_date = scheduled_date;
			if (scheduled_hour) qs.scheduled_hour = scheduled_hour;
			return kiubi.put('cart/shipping', qs);
		},
		/**
		 * Définis les adresses de facturation et livraison
		 * 
		 * @param Object billing
		 * @param Object shipping
		 * @param Boolean consent
		 * @return Promise
		 */
		setAdresses: function(billing, shipping, consent) {
			var qs = {billing: billing};
			if(shipping) {
				qs.shipping = shipping;
				qs.use_billing_as_shipping = false;
			} else {
				qs.use_billing_as_shipping = true;
			}
			if(consent) {
				qs.consent = consent;
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
		},
		/**
		 * Retourne le commentaire sur la commande
		 * 
		 * @return Promise
		 */
		getComment: function() {
			return kiubi.get('cart/comment');
		},
		/**
		 * Ajoute un commentaire sur la commande
		 * 
		 * @param String comment
		 * @return Promise
		 */
		setComment: function(comment) {
			return kiubi.put('cart/comment', {comment:comment});
		}
	});
})(jQuery, kiubi);
/** 
 * API CMS
 * 
 * Copyright 2019 Kiubi
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
/** 
 * API Forms
 * 
 * Copyright 2019 Kiubi
 */
(function($, kiubi) {
	
	'use strict';
	
	/**
	 * Variable privée utilisée par kiubi.forms.submit()
	 */
	var _counter = 0;
	
	$.extend(kiubi.forms, {
		/**
		 * Retourne la liste des champs d'un formulaire Dismoi
		 * 
		 * @param String key
		 * @return Promise
		 */
		get: function(key) {
			return kiubi.get('forms/'+key);
		},
		/**
		 * Poste une réponse à un formulaire Dismoi?
		 * 
		 * Si le formulaire contient des fichiers à uploader et que le
		 * navigateur utilisé par l'internaute ne supporte pas l'envoie
		 * de fichier via XMLHttpRequest, la librairie utilise une iframe
		 * masqué afin de procéder à l'envoie de la ou les pièces jointes
		 * 
		 * @param String key
		 * @param String|jQuery Element|Node form Formulaire à soumettre
		 * @return Promise
		 */
		submit: function(key, form) {
			var data;
			var $form = $(form);
			var endpoint = 'forms/' + key + '.json';
			var isMultipart = ($('input[type=file]', $form).length > 0);
			var hasRequiredFeatures = (window.XMLHttpRequest && (new XMLHttpRequest).upload && window.FormData);
			
			if(isMultipart) {
				if(!hasRequiredFeatures) {
					// Le navigateur utilisé par l'internaute ne supporte 
					// pas l'envoie de fichier via XMLHttpRequest, on envoie
					// donc le formulaire vers une iframe. La réponse sera
					// ensuite résolue ou rejettée en fonction de 
					// contentDocument.body.innerText
					
					// Génération d'un nom unique d'iframe
					var api_target = "API_target_" + (++_counter);
					var $iframe = $('<iframe>', {'id':api_target, 'name':api_target}).hide();
					
					$form.attr({
						// Les données seront envoyées en POST
						'method' : 'POST',
						
						// Les données sont encodées au format multipart/form-data UTF-8
						'enctype' : 'multipart/form-data',
						'accept-charset' : 'UTF-8',
					
						// On route le formulaire vers le endpoint API e précisant
						// l'iframe comme target
						'action' : kiubi.base + 'v' + kiubi.api_version + '/' + endpoint,
						'target' : api_target,
						'onsubmit' : ""
					});
						
					// force_response_mime est requis pour un fonctionnement sans erreurs sous IE
					// sans cette option, Internet Explorer propose de télécharger un fichier json
					$form.append($('<input>', {type:'hidden', name:'force_response_mime', value:'text/plain'}))
					// suppress_response_code est requis pour un fonctionnement sans erreurs sous IE
					// cette option a pour effet de toujours retourner un code 200, car dans le cas 
					// contraire, l'accès au contenu de l'iframe est refusé par Internet Explorer
					$form.append($('<input>', {type:'hidden', name:'suppress_response_code', value:'1'}));
					
					// Mise à jour du domaine de l'iframe afin d'autorisé sont  
					// accès via javascript une fois le formulaire soumis
					$(document.body).append($iframe[0]);
					
					var d = $.Deferred();
					
					$iframe.on('load', function() {
						try {
							var data = $.parseJSON(this.contentWindow.document.body.innerText);
							if(typeof data.meta != "object") {
								// lance une exception attrapée plus loin
								$.error('data.meta is not an object');
							}
							if(data.meta.success) {
								// Résout la promesse avec meta et data
								d.resolve(data.meta, data.data);
							} else {
								// Rejete la promesse avec meta, error et data
								d.reject(data.meta, data.error, data.data);
							}
						}
						catch(e) {
							// attrape les exceptions liées au parse JSON
							// ou à l'incohérence du retour
							var meta = { success : false, status_code : 400 };
							var error = { message : "L'envoi de fichiers n'est pas support\xE9 par ce navigateur" };
							d.reject(meta, error, {});
						}
						
						$form.attr('action', "");
						$form.attr('target', "");
						$(this).remove();
					});
					
					$form[0].submit();
					return d.promise();
				}
				// envoie des données à l'aide de FormData
				data = new FormData($form[0]);
				return kiubi.query('POST', endpoint, data, {
					cache: false,
					contentType: false,
					processData: false
				});
			}
			
			data = $form.serialize();
			// mapping consentement_ok => consent
			data.consent = data.consentement_ok;
			delete data.consentement_ok;
			return kiubi.post(endpoint, data);
		},
		/**
		 * Retourne un captcha pour un formulaire Dismoi
		 * 
		 * @param String key
		 * @return Promise
		 */
		getFormCaptcha: function(key) {
			return kiubi.get('forms/'+key+'/captcha');
		}
	});
})(jQuery, kiubi);
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
/** 
 * API Media
 * 
 * Copyright 2019 Kiubi
 */
(function($, kiubi) {
	'use strict';
	$.extend(kiubi.media, {
		/**
		 * Retourne la liste des médias d'un dossier
		 * 
		 * @param String key
		 * @return Promise
		 */
		getFiles: function(key, opts) {
			var qs =  opts || {};
			return kiubi.get('media/folders/'+key, qs);
		},
		/**
		 * Retourne le détail d'un média
		 * 
		 * @param String key
		 * @return Promise
		 */
		getFile: function(id) {
			return kiubi.get('media/files/'+id);
		}
		
	});
})(jQuery, kiubi);
/** 
 * API Newsletter
 * 
 * Copyright 2019 Kiubi
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
/** 
 * API Preferences
 * 
 * Copyright 2019 Kiubi
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
