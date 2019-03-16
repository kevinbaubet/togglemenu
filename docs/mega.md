# Mega

Permet d'afficher un mega-menu au clique sur un élément parent de 1er niveau.

* Nom du menu : **mega**
* Nom du fichier : **togglemenu-mega.js**
* Nom de la classe : **$.ToggleMenuMega**


## Initialisation

    var toggleMenu = new $.ToggleMenu();
    
    toggleMenu.addMenu('mega', {
        elements: {
            menu: $('#nav')
        }
    });


## Options

| Option                           | Type           | Valeur par défaut                              | Description                                                                                  |
|----------------------------------|----------------|------------------------------------------------|----------------------------------------------------------------------------------------------|
| elements                         | object         | Voir ci-dessous                                | Objet pour les options ci-dessous                                                            |
| &nbsp;&nbsp;&nbsp;&nbsp;menu     | Élément jQuery | undefined                                      | Élément conteneur du menu, exemple : $('#nav')                                               |
| &nbsp;&nbsp;&nbsp;&nbsp;items    | Élément jQuery | undefined                                      | Éléments parents, exemple : $('#nav').find('li.is-parent')                                   |
| &nbsp;&nbsp;&nbsp;&nbsp;itemLink | function       | function (item) { return item.children('a'); } | Fonction retournant le lien d'un élément parent                                              |
| &nbsp;&nbsp;&nbsp;&nbsp;close    | Élément jQuery | undefined                                      | Élément pour le bouton de fermeture                                                          |
| overlay                          | boolean        | true                                           | Ajout d'un overlay sur la page pour fermer le sous-menu                                      |
| closeOnEscape                    | boolean        | true                                           | Permet de fermer le sous-menu avec la touche "echap"                                         |
| classes                          | object         | Voir ci-dessous                                | Objet pour les options ci-dessous                                                            |
| &nbsp;&nbsp;&nbsp;&nbsp;overlay  | string         | '{prefix}-overlay'                             | Nom de la classe utilisée pour l'overlay                                                     |
| beforeLoad                       | function       | undefined                                      | Callback au début du chargement                                                              |
| beforeAddOverlay                 | function       | undefined                                      | Callback avant l'ajout de l'overlay dans le DOM (si overlay = true)                          |
| afterEventsHandler               | function       | undefined                                      | Callback après la déclaration des événements                                                 |
| afterItemHandler                 | function       | undefined                                      | Callback après le gestionnaire d'un élément parent                                           |
| onComplete                       | function       | undefined                                      | Callback à la fin du chargement                                                              |
| onToggleSubmenu                  | function       | undefined                                      | Callback à l'ouverture/fermeture d'un sous-menu                                              |