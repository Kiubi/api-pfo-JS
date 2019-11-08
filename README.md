# Kiubi API Public Front-office Client JS
---

## Description

La plateforme [Kiubi](http://www.kiubi.com) offre une API publique front-office ( *API FO* ) pour chacun de ses sites web. Cette API permet de requêter dynamiquement le contenu d'un site afin de rajouter des fonctionnalités sur celui-ci et proposer aux visiteurs un contenu plus riche et plus fonctionnel.

L'API FO est de type REST avec en sortie des données au format JSON. Afin de faciliter son utilisation, Kiubi propose une librairie javascript complète permettant la récupération des données via l'API de façon simple et optimisé. Pour en savoir plus, vous pouvez [consulter la documentation en ligne](https://aide.kiubi.com/api-front-generalites.html).


## Sandbox

Chaque site Kiubi possède un environnement de bac à sable pour tester et débugger les appels à l'API. L'accès se fait à partir du back-office du site, dans les préférences. Un lien "Accéder à l'API Sandbox" est affiché. 

L'accès au sandbox est privé et nécessite un compte back-office. Seul le lien dans le back-office permet d'accéder au sandbox.


## Pré-requis

- jQuery >= 1.8.2

*Le thème Bootstrap4 fourni par Kiubi intègre jQuery 3.2.1*	

## Déploiement

La librairie doit être inclue dans les templates de page du thème, après l'inclusion de jQuery, afin de pouvoir utiliser l'API de façon globale ou directement dans un widget :

	<script type="text/javascript" src="{cdn}/js/kiubi.api.pfo.jquery-1.2.min.js"></script>
	
La librairie est mise à disposition sur le CDN de la plateforme. Le domaine du CDN est récupérable automatiquement avec la balise `{cdn}`.


## Utilisation

Une fois la librairie inclue, un objet javascript `kiubi` est disponible et permet d'utiliser l'ensemble des fonctionnalités de l'API.

Les méthodes disponibles retourne un objet `Promise` issu d'un objet `Deferred`. Cette méthode asynchrone permet de gérer facilements un ou plusieurs callbacks sur chaque appel à l'API. 

La librarie comprend un ensemble de méthodes facilitant l'appel aux différents endpoints de l'API. Ces méthodes sont classées par service.

* kiubi : Objet principal, permet la gestion élémentaire du requêtage de l'api
* kiubi.media : Permet de récupérer les médias de la médiathèque
* kiubi.catalog : Permet de consulter les produits du catalogue
* kiubi.users : Permet d'obtenir des informations sur l'utilisateur
* kiubi.newsletter : Permet de gérer l'abonnement à la newsletter
* kiubi.prefs : Permet de récupérer les préféfences du site
* kiubi.search : Permet de faire des recherches dans le blog, le catalogue et le cms
* kiubi.forms : Permet de récupérer un formulaire Dismoi et d'envoyer des réponses
* kiubi.geo : Aides pour l'affichage d'informations géographiques
* kiubi.cms : Permet de récupérer les pages et leurs contenus
* kiubi.blog : Permet de récupérer les billets du blog
* kiubi.cart : Permet de gérer le panier de l'utilisateur

Les sources de chaque service sont disponibles séparement dans le dossier `src`.

Le dossier `dist` contient les versions aggrégées et minifiées de tous les services.


## Méthodes disponibles

Voici par service la liste des méthodes disponibles dans le client JS :

- kiubi
    - query(type, endpoint, params, ajax_options) : Effectue une requête concrète vers l'api puis résout ou rejette la demande suivant le retour
    - post(endpoint, params) : Effectue une requête de type POST
    - get(endpoint, params) : Effectue une requête de type GET
    - put(endpoint, params) : Effectue une requête de type PUT
    - delete(endpoint, params) : Effectue une requête de type DELETE
    - login(login, password) : Effectue une connexion d'un utilisateur
    - logout() : Effectue une déconnexion de l'utilisateur courant
	- getSession() : Vérifie la validité de la session et retourne les informations de l'utilisateur connecté
    - getFirstPage(meta) : Parse la première page d'une liste de résultats
    - getPreviousPage(meta) : Parse la page précédente d'une liste de résultats
    - getNextPage(meta) : Parse la page suivante d'une liste de résultats
    - getLastPage(meta) : Parse la dernière page d'une liste de résultats
    - getPage(meta, num) : Parse la page numéro X d'une liste de résultats
    - hasNextPage(meta) : Indique si une page suivante existe
    - hasPreviousPage(meta) : Indique si une page précédente existe
    - escape(bytes) : Encode une chaine de texte unicode dans l'encodage utilisé par la plateforme
    - getRateRemaining(remote_check) : Retourne le quota de requêtes restantes
    - api_navigator(opts) : Helper permettant de faciliter la navigation dans un listing
- kiubi.blog
    - getPosts(opts) : Retourne la liste des billets
    - getCategories(opts) : Retourne la liste des catégories
    - getPostsByCategory(id, opts) : Retourne la liste des billets d'une catégorie
    - getPostsByYear(year, opts) : Retourne la liste des billets d'une année
    - getPostsByMonth(year, month, opts) : Retourne la liste des billets d'un mois
    - getPostsByDay(year, month, day, opts) : Retourne la liste des billets d'un jour
    - getPostsByCategoryAndYear(id, year, opts) : Retourne la liste des billets d'une catégorie d'une année
    - getPostsByCategoryAndMonth(id, year, month, opts) : Retourne la liste des billets d'une catégorie d'un mois
    - getPostsByCategoryAndDay(id, year, month, day, opts) : Retourne la liste des billets d'une catégorie d'un jour
    - getArchives() : Retourne la liste liste des archives
    - getPost(id) : Retourne le détail d'un billet
    - getCaptcha(id) : Retourne un captcha pour un billet
    - getComments(opts) : Retourne la liste des commmentaires
    - getPostComments(id, opts) : Retourne la liste des commentaires d'un billet
    - addComment(id, comment, author, email, website, captcha, consent) : Poste un commentaire sur un billet
- kiubi.cart
    - get(opts) : Retourne le panier
    - empty() : Vide le panier
    - addItem(id, qt, mode, opts) : Ajoute une variante au panier
    - addItems(items, mode, opts) : Ajoute des variantes au panier
    - removeItem(id) : Retire une variante du panier
    - getVoucher() : Récupère le bon de réduction
    - removeVoucher() : Retire le bon de réduction
    - addVoucher(code, opts) : Ajout un bon de réduction
	- getOptions(opts) : Récupère les options à la commande
	- addOption(id, value, opts) : Ajoute une option à la commande
	- removeOption(id) : Supprime une option à la commande 
    - backup() : Récupère une sauvegarde du panier
    - restore(backup) : Restaure une sauvegarde du panier
    - getCarriers() : Retourne la liste des transporteurs disponibles
	- testCarrierSchedule: function(id, scheduled_date, scheduled_hour) : Teste la disponibilité d'un date de livraison
    - setShipping(id, scheduled_date, scheduled_hour) : Définis un transporteur
    - setAdresses(billing, shipping, consent) : Définis les adresses de facturation et livraison
    - getAdresses() : Retourne les adresses de facturation et livraison
- kiubi.catalog
    - getProducts(opts) : Retourne la liste des produits
    - getProductsByCategory(id, opts) : Retourne la liste des produits d'une catégorie
    - getProductsByTags(tags, opts) : Retourne la liste des produits d'un ou plusieurs tag
    - getCategories(opts) : Retourne la liste des catégories
    - getTags(opts) : Retourne la liste des tags
    - getCategoryTags(id, opts) : Retourne la liste des tags d'une catégorie
    - getComments(opts) : Retourne la liste des commentaires
    - getProduct(id, opts) : Retourne le détail d'un produit
    - getProductComments(id, opts) : Retourne la liste des commentaires d'un produits
    - getCaptcha(id) : Retourne un captcha pour un produit
    - addComment(id, comment, author, rate, captcha, consent) : Poste un commentaire produit
    - getLinkedProducts(id, opts) : Retourne la liste des produits associés à un produit
    - getAlsoBoughtProducts(id, opts) : Retourne la liste des produits également achetés d'un produit
    - getProductImages(id, opts) : Retourne la liste des images d'un produit
    - getProductAvailability(id) : Retourne si un produit est disponible ou non
    - getVariantAvailability(id) : Retourne si une variante est disponible ou non
- kiubi.cms
    - getPosts(opts) : Retourne la liste des billets
    - getPostsOfPage(name, opts) : Retourne la liste des billets d'une page
    - getPages(key, opts) : Retourne la liste des pages d'un menu
    - getChildren(name, opts) : Retourne la liste des pages enfants d'une page
    - getParent(name) : Retourne la page parente d'une page
- kiubi.forms
    - get(key) : Retourne la liste des champs d'un formulaire Dismoi
    - submit(key, form) : Poste une réponse à un formulaire Dismoi
    - getFormCaptcha(key) : Retourne un captcha pour un formulaire Dismoi
- kiubi.geo
    - getCountries() : Liste les pays
    - getCountry(id) : Détail d'un pays
    - getRegions(id) : Liste les régions d'un pays
    - getDepartements(id) : Liste les départements d'un pays
- kiubi.media
    - getFiles(key, opts) : Retourne la liste des médias d'un dossier
    - getFile(id) : Retourne le détail d'un média
- kiubi.newsletter
    - subscribe(email, consent) : Inscrit un email à la newsletter
    - unsubscribe(email) : Désinscrit un email à la newsletter
- kiubi.prefs
    - medias() : Retourne les préférences de la médiathèque
    - site() : Retourne les préférences du site
    - catalog() : Retourne les préférences du catalogue
    - blog() : Retourne les préférences du blog
- kiubi.search
    - pages(term, opts) : Recherche dans les pages du cms
    - posts(term, opts) : Recherche dans les billets du blog
    - products(term, opts) : Recherche dans les produits du catalogue
- kiubi.users
    - getInfos(id) : Retourne les informations de l'utilisateur
    - getAddresses(id) : Retourne les addresses de facturation et livraison de l'utilisateur
    - getOrders(id) : Retourne la liste des commandes de l'utlisateur
    - getOrder(id, opts) : Retourne le détail d'une commande 


## Exemples

	<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
	<script type="text/javascript" src="{cdn}/js/kiubi.api.pfo.jquery-1.2.min.js"></script>
	<script type="text/javascript">
		jQuery(function($){
		
			// Vérification de l'état connecté du visiteur
			var query = kiubi.getSession().done(function(meta, data){
				if(data.is_logged) {
					alert('Membre connecté');
				} else {
					alert('Visiteur non connecté');
				}
			});
			
			// Récupération d'un produit du catalogue
			var query = kiubi.catalog.getProduct(7).done(function(meta, data){
				alert("Le produit " + data.name + " existe !");
			}).fail(function(meta, error, data){
				if(meta.status_code == 404) {
					alert("Le produit n'existe pas : " + error.message);
				}
			});
		});
	</script>

Chaque requête retourne un objet `Promise` qui gère deux méthodes `done()`et `fail()` lesquelles sont exécutées si une requête est réussie ou échouée.

Il est possible de définir plusieurs callbacks `done()` et `fail()` sur une requête afin d'effectuer plusieurs actions différentes.

Il existe également une méthode `always()` qui est appelée dans tous les cas, si la requête se déroule correctement ou si elle échoue.
