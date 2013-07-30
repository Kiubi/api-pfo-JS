/** 
 * Kiubi API - jQuery Client v1.0
 * 
 * Copyright 2013 Troll d'idees
 */
kiubi = window.kiubi || {};
(function($, kiubi) {
	'use strict';
	
	// variable privée accessible via la méthode kiubi.getRateRemaining()
	var rate_remaining;
	
	$.extend(kiubi, {
	
		api_version: 1,
		js_version: '1.0',
		base: '/api/',
		
		media: {},
		catalog: {},
		users: {},
		newsletter: {},
		prefs: {},
		search: {},
		forms: {},
		cms: {},
		blog: {},
		cart: {},
		
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
