# Documentation ToggleMenu

ToggleMenu est un gestionnaire de menu. Il permet de gérer un _display_ qui correspond à une classe JS précédement chargée.

Requis : jQuery 1.7

## Initialisation

    var ToggleMenu = new $.ToggleMenu([options]);

## Options

| Option                         | Type     | Valeur par défaut | Description                                |
|--------------------------------|----------|-------------------|--------------------------------------------|
| classes                        | object   | Voir ci-dessous   | Objet pour l'option ci-dessous             |
| &nbsp;&nbsp;&nbsp;&nbsp;prefix | string   | 'togglemenu'      | Préfix de classe                           |
| onDisplayLoad                  | function | undefined         | Callback au début du chargement du display |
| onDisplayComplete              | function | undefined         | Callback à la fin du chargement du display |
| onDisplayUnload                | function | undefined         | Callback à la suppression du display       |

## Méthodes

| Méthode             | Arguments                                                                                           | Description                                                |
|---------------------|-----------------------------------------------------------------------------------------------------|------------------------------------------------------------|
| setDisplay          | **display** *string* Nom du display, **[options]** *object* Options utilisateur à passer au display | Définition d'un display                                    |
| setOptions          | **display** *string* Nom du display, **options** *object* Options utilisateur à passer au display   | Enregistre les options pour un display                     |
| isCurrentDisplay    | **display** *string* Nom du display                                                                 | Test si le display actuel correspond à l'argument          |
| getDisplayClassName | **display** *string* Nom du display                                                                 | Récupère le nom de la classe JS correspondant à l'argument |
| getInstance         | -                                                                                                   | Récupère l'instance du display en cours                    |
| getItemsParent      | **search** *object* Élément jQuery dans lequel la recherche d'éléments parents sera effectée        | Récupère les éléments parents en fonction d'un contexte    |

## Displays

Un _display_ correspond à un type de menu (push, fixed, overlay, etc). Chaque display est une classe JS à part.

### Initialiser un display

Une fois ToggleMenu initialisé :

    ToggleMenu.setDisplay('name', [options]);

Lors de l'initialisation d'un display, ToggleMenu va exécuter une classe JS qui correspondra à **$.ToggleMenuName**. "Name" étant le nom du display.
Au niveau des styles CSS, ToggleMenu ajoute une classe CSS dans le &lt;body&gt;, correspondant au display courant.

### hover

Navigation classique en ligne. Permet d'afficher des sous-menus au survol de la souris.

#### Options

| Option                            | Type           | Valeur par défaut | Description                                                                                            |
|-----------------------------------|----------------|-------------------|--------------------------------------------------------------------------------------------------------|
| elements                          | object         | Voir ci-dessous   | Objet pour les options ci-dessous                                                                      |
| &nbsp;&nbsp;&nbsp;&nbsp;menu*     | Élément jQuery | undefined         | Élément wrapper du menu                                                                                |
| &nbsp;&nbsp;&nbsp;&nbsp;items     | Élément jQuery | undefined         | Éléments parents. Si la valeur n'est pas définie, les éléments sont cherchés automatiquement           |
| &nbsp;&nbsp;&nbsp;&nbsp;itemsLink | Élément jQuery | undefined         | Liens des éléments parents. Si la valeur n'est pas définie, les éléments sont cherchés automatiquement |
| classes                           | object         | Voir ci-dessous   | Objet pour l'option ci-dessous                                                                         |
| &nbsp;&nbsp;&nbsp;&nbsp;active    | string         | 'is-active'       | Nom de la classe à l'état actif                                                                        |
| disableItemsClick                 | boolean        | false             | Désactiver le clique sur les éléments parents ?                                                        |
| interval                          | integer        | 100               | Temps d'attente avant de déclencher le survol                                                          |
| onLoad                            | function       | undefined         | Callback au début du chargement                                                                        |
| afterEventsHandler                | function       | undefined         | Callback après la déclaration des événements                                                           |
| onComplete                        | function       | undefined         | Callback à la fin du chargement                                                                        |
| onOver                            | function       | undefined         | Callback une fois qu'un élément parent est survolé                                                     |
| onOut                             | function       | undefined         | Callback une fois qu'un élément parent n'est plus survolé                                              |

* Options obligatoires.

### push

Permet de pousser la page pour afficher le menu via un bouton d'ouverture. Les sous-menus s'affiche au choix en panel ou accordéon.

#### Options

| Option                                                | Type           | Valeur par défaut                                        | Description                                                                                                                                                                                                                                                                             |
|-------------------------------------------------------|----------------|----------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| elements                                              | object         | Voir ci-dessous                                          | Objet pour les options ci-dessous                                                                                                                                                                                                                                                       |
| &nbsp;&nbsp;&nbsp;&nbsp;content                       | object         | Voir ci-dessous                                          | Objet pour le contenu du menu                                                                                                                                                                                                                                                      |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;menu* | Élément jQuery | undefined                                                | Élément wrapper du menu                                                                                                                                                                                                                                                                 |
| &nbsp;&nbsp;&nbsp;&nbsp;items                         | Élément jQuery | undefined                                                | Éléments parents. Si la valeur n'est pas définie, les éléments sont cherchés automatiquement                                                                                                                                                                                            |
| &nbsp;&nbsp;&nbsp;&nbsp;itemLink                      | function       | function(item) { return item.children('a'); }            | Fonction retournant le lien d'un élément parent                                                                                                                                                                                                                                         |
| &nbsp;&nbsp;&nbsp;&nbsp;itemContent                   | function       | function(item) { return item.children('ul') ;}           | Fonction retournant le contenu d'un élément parent                                                                                                                                                                                                                                      |
| &nbsp;&nbsp;&nbsp;&nbsp;toggle                        | Élément jQuery | undefined                                                | Élément pour le bouton d'ouverture/fermeture. Si la valeur n'est pas définie, l'élément sera $('.togglemenu-toggle')                                                                                                                                                                    |
| &nbsp;&nbsp;&nbsp;&nbsp;page                          | Élément jQuery | undefined                                                | Élément wrapper de la page du site. Si la valeur n'est pas définie, l'élément sera $('body > div:first')                                                                                                                                                                                |
| &nbsp;&nbsp;&nbsp;&nbsp;back                          | Élément jQuery | undefined                                                | Élément wrapper pour revenir au niveau précédent (en mode panel). Si la valeur n'est pas définie, l'élément sera généré automatiquement                                                                                                                                                 |
| &nbsp;&nbsp;&nbsp;&nbsp;backBtn                       | function       | function(wrapper) { return wrapper.children('button'); } | Fonction retournant le bouton du wrapper "back" permettant de revenir au niveau précédent (en mode panel)                                                                                                                                                                               |
| layout                                                | string         | 'accordion'                                              | Mode d'affichage pour les sous-menus. Valeurs possibles : 'accordion', 'panel' ou 'data'. Si la valeur est 'data', le layout doit être défini en paramètre data-layout dans l'élément parent correspondant. Ainsi, il est possible de spécifier un layout différent par élément parent. |
| classes                                               | object         | Voir ci-dessous                                          | Objet pour les options ci-dessous                                                                                                                                                                                                                                                       |
| &nbsp;&nbsp;&nbsp;&nbsp;open                          | string         | 'is-{prefix}Open'                                        | Nom de la classe lorsque le menu est ouvert                                                                                                                                                                                                                                        |
| &nbsp;&nbsp;&nbsp;&nbsp;active                        | string         | 'is-active'                                              | Nom de la classe lorsque un élément parent est actif                                                                                                                                                                                                                                    |
| &nbsp;&nbsp;&nbsp;&nbsp;copy                          | string         | '{prefix}-copy'                                          | Nom de la classe des éléments copiés dans le menu                                                                                                                                                                                                                                  |
| &nbsp;&nbsp;&nbsp;&nbsp;back                          | string         | 'item-back'                                              | Nom de la classe de l'élément "back" permettant de revenir au niveau précédent                                                                                                                                                                                                          |
| onLoad                                                | function       | undefined                                                | Callback au début du chargement                                                                                                                                                                                                                                                         |
| beforeWrap                                            | function       | undefined                                                | Callback avant l'ajout du wrapper dans le DOM                                                                                                                                                                                                                                           |
| onAddContent                                          | function       | undefined                                                | Callback à chaque ajout d'un contenu dans le menu                                                                                                                                                                                                                                  |
| afterEventsHandler                                    | function       | undefined                                                | Callback après la déclaration des événements                                                                                                                                                                                                                                            |
| afterItemHandler                                      | function       | undefined                                                | Callback après le gestionnaire d'un élément parent                                                                                                                                                                                                                                      |
| onAddItemContent                                      | function       | undefined                                                | Callback à chaque ajout de contenu dans un élément parent                                                                                                                                                                                                                               |
| onComplete                                            | function       | undefined                                                | Callback à la fin du chargement                                                                                                                                                                                                                                                         |
| onToggle                                              | function       | undefined                                                | Callback à l'ouverture/fermeture du menu                                                                                                                                                                                                                                           |
| onToggleSubmenu                                       | function       | undefined                                                | Callback à l'ouverture/fermeture d'un sous-menu                                                                                                                                                                                                                                         |

* Options obligatoires.

### fixed

Permet de fixer un menu et d'afficher les sous-menus par dessus la page puis en accordéon.

#### Options

| Option                           | Type           | Valeur par défaut                             | Description                                                                                                          |
|----------------------------------|----------------|-----------------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| elements                         | object         | Voir ci-dessous                               | Objet pour les options ci-dessous                                                                                    |
| &nbsp;&nbsp;&nbsp;&nbsp;menu*    | Élément jQuery | undefined                                     | Élément wrapper du menu                                                                                              |
| &nbsp;&nbsp;&nbsp;&nbsp;items    | Élément jQuery | undefined                                     | Éléments parents. Si la valeur n'est pas définie, les éléments sont cherchés automatiquement                         |
| &nbsp;&nbsp;&nbsp;&nbsp;itemLink | function       | function(item) { return item.children('a'); } | Fonction retournant le lien d'un élément parent                                                                      |
| &nbsp;&nbsp;&nbsp;&nbsp;toggle   | Élément jQuery | undefined                                     | Élément pour le bouton d'ouverture/fermeture. Si la valeur n'est pas définie, l'élément sera $('.togglemenu-toggle') |
| classes                          | object         | Voir ci-dessous                               | Objet pour les options ci-dessous                                                                                    |
| &nbsp;&nbsp;&nbsp;&nbsp;open     | string         | 'is-{prefix}Open'                             | Nom de la classe lorsque le menu est ouvert                                                                          |
| &nbsp;&nbsp;&nbsp;&nbsp;active   | string         | 'is-active'                                   | Nom de la classe lorsque un élément parent est actif                                                                 |
| onLoad                           | function       | undefined                                     | Callback au début du chargement                                                                                      |
| afterEventsHandler               | function       | undefined                                     | Callback après la déclaration des événements                                                                         |
| afterItemHandler                 | function       | undefined                                     | Callback après le gestionnaire d'un élément parent                                                                   |
| onComplete                       | function       | undefined                                     | Callback à la fin du chargement                                                                                      |
| onToggle                         | function       | undefined                                     | Callback à l'ouverture/fermeture du menu                                                                             |
| onToggleSubmenu                  | function       | undefined                                     | Callback à l'ouverture/fermeture d'un sous-menu                                                                      |

* Options obligatoires.

### overlay

Permet d'afficher la navigation par dessus toute la page avec un overlay. La navigation se déclenche via un bouton.

#### Options

| Option                                                | Type           | Valeur par défaut                             | Description                                                                                                                                 |
|-------------------------------------------------------|----------------|-----------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| elements                                              | object         | Voir ci-dessous                               | Objet pour les options ci-dessous                                                                                                           |
| &nbsp;&nbsp;&nbsp;&nbsp;content                       | object         | Voir ci-dessous                               | Objet pour le contenu du menu                                                                                                               |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;menu* | Élément jQuery | undefined                                     | Élément wrapper du menu                                                                                                                     |
| &nbsp;&nbsp;&nbsp;&nbsp;items                         | Élément jQuery | undefined                                     | Éléments parents. Si la valeur n'est pas définie, les éléments sont cherchés automatiquement                                                |
| &nbsp;&nbsp;&nbsp;&nbsp;itemLink                      | function       | function(item) { return item.children('a'); } | Fonction retournant le lien d'un élément parent. Si la valeur est null, l'élément parent sera cliquable mais n'affichera pas son sous-menu  |
| &nbsp;&nbsp;&nbsp;&nbsp;toggle                        | Élément jQuery | undefined                                     | Élément pour le bouton d'ouverture/fermeture. Si la valeur n'est pas définie, l'élément sera $('.togglemenu-toggle')                        |
| closeOnEscape                                         | boolean        | true                                          | Permet de fermer le menu avec la touche "echap"                                                                                             |
| classes                                               | object         | Voir ci-dessous                               | Objet pour les options ci-dessous                                                                                                           |
| &nbsp;&nbsp;&nbsp;&nbsp;open                          | string         | 'is-{prefix}Open'                             | Nom de la classe lorsque le menu est ouvert                                                                                                 |
| &nbsp;&nbsp;&nbsp;&nbsp;active                        | string         | 'is-active'                                   | Nom de la classe lorsque un élément parent est actif                                                                                        |
| &nbsp;&nbsp;&nbsp;&nbsp;copy                          | string         | '{prefix}-copy'                               | Nom de la classe des éléments copiés dans le menu                                                                                           |
| onLoad                                                | function       | undefined                                     | Callback au début du chargement                                                                                                             |
| beforeWrap                                            | function       | undefined                                     | Callback avant l'ajout du wrapper dans le DOM                                                                                               |
| onAddContent                                          | function       | undefined                                     | Callback à chaque ajout d'un contenu dans le menu                                                                                           |
| afterEventsHandler                                    | function       | undefined                                     | Callback après la déclaration des événements                                                                                                |
| afterItemHandler                                      | function       | undefined                                     | Callback après le gestionnaire d'un élément parent                                                                                          |
| onComplete                                            | function       | undefined                                     | Callback à la fin du chargement                                                                                                             |
| onToggle                                              | function       | undefined                                     | Callback à l'ouverture/fermeture du menu                                                                                                    |
| onToggleSubmenu                                       | function       | undefined                                     | Callback à l'ouverture/fermeture d'un sous-menu                                                                                             |
                       
* Options obligatoires.

### mega

Permet d'afficher un mega-menu au clique sur un élément parent de 1er niveau.

#### Options

| Option                           | Type           | Valeur par défaut                             | Description                                                                                  |
|----------------------------------|----------------|-----------------------------------------------|----------------------------------------------------------------------------------------------|
| elements                         | object         | Voir ci-dessous                               | Objet pour les options ci-dessous                                                            |
| &nbsp;&nbsp;&nbsp;&nbsp;menu*    | Élément jQuery | undefined                                     | Élément wrapper du menu                                                                      |
| &nbsp;&nbsp;&nbsp;&nbsp;items    | Élément jQuery | undefined                                     | Éléments parents. Si la valeur n'est pas définie, les éléments sont cherchés automatiquement |
| &nbsp;&nbsp;&nbsp;&nbsp;itemLink | function       | function(item) { return item.children('a'); } | Fonction retournant le lien d'un élément parent                                              |
| &nbsp;&nbsp;&nbsp;&nbsp;close    | Élément jQuery | undefined                                     | Élément pour le bouton de fermeture                                                          |
| overlay                          | boolean        | true                                          | Ajout d'un overlay sur la page pour fermer le sous-menu                                      |
| closeOnEscape                    | boolean        | true                                          | Permet de fermer le sous-menu avec la touche "echap"                                         |
| classes                          | object         | Voir ci-dessous                               | Objet pour les options ci-dessous                                                            |
| &nbsp;&nbsp;&nbsp;&nbsp;open     | string         | 'is-{prefix}Open'                             | Nom de la classe lorsque le menu est ouvert                                                  |
| &nbsp;&nbsp;&nbsp;&nbsp;active   | string         | 'is-active'                                   | Nom de la classe lorsque un élément parent est actif                                         |
| &nbsp;&nbsp;&nbsp;&nbsp;copy     | string         | '{prefix}-copy'                               | Nom de la classe des éléments copiés dans le menu                                            |
| onLoad                           | function       | undefined                                     | Callback au début du chargement                                                              |
| beforeAddOverlay                 | function       | undefined                                     | Callback avant l'ajout de l'overlay dans le DOM (si overlay = true)                          |
| afterEventsHandler               | function       | undefined                                     | Callback après la déclaration des événements                                                 |
| afterItemHandler                 | function       | undefined                                     | Callback après le gestionnaire d'un élément parent                                           |
| onComplete                       | function       | undefined                                     | Callback à la fin du chargement                                                              |
| onToggleSubmenu                  | function       | undefined                                     | Callback à l'ouverture/fermeture d'un sous-menu                                              |

* Options obligatoires.

### Autre ?

Il est possible d'ajouter autant de display que vous voulez. Il suffit de créer une classe :

    $.ToggleMenuName(ToggleMenu, options) {
        // A l'initialisation de la classe, on execute la méthode load()
        this.load();
    };
    $.ToggleMenuName.prototype = {
        /**
         * Initilisation
         */
        load: function() {

        },

        /**
         * Méthode appelée à la suppression du display
         */
        unload: function() {

        }
    };

Cependant, chaque display doit avoir la possiblité d'être retiré de la page. Lors d'un appel à setDisplay(), si un display est déjà initialisé, ToggleMenu va exécuter la méthode unload() du display actuel avant d'en charger un nouveau.
Cette méthode unload permet de supprimer toutes les actions effectuées par l'initialisation du display et l'attachement des événements aux éléments HTML.