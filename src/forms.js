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
