# Hover

Navigation classique en ligne. Permet d'afficher des sous-menus au survol de la souris.

* Nom du menu : **hover**
* Nom du fichier : **togglemenu-hover.js**
* Nom de la classe : **$.ToggleMenuHover**


## Initialisation

    var toggleMenu = new $.ToggleMenu();
    
    toggleMenu.addMenu('hover', {
        elements: {
            menu: $('#nav')
        }
    });


## Options

| Option                            | Type           | Valeur par défaut | Description                                                                                            |
|-----------------------------------|----------------|-------------------|--------------------------------------------------------------------------------------------------------|
| elements                          | object         | Voir ci-dessous   | Objet pour les options ci-dessous                                                                      |
| &nbsp;&nbsp;&nbsp;&nbsp;menu      | Élément jQuery | undefined         | Élément conteneur du menu, exemple : $('#nav')                                                         |
| &nbsp;&nbsp;&nbsp;&nbsp;items     | Élément jQuery | undefined         | Éléments parents, exemple : $('#nav').find('li.is-parent')                                             |
| &nbsp;&nbsp;&nbsp;&nbsp;itemLink  | string         | '> a'             | Sélecteur vers le lien direct de l'élément parent survolé                                              |                                                                   |
| disableItemsClick                 | boolean        | false             | Permet de désactiver la possibilité de cliquer sur les éléments parents                                |
| interval                          | integer        | 100               | Temps d'attente en ms avant de déclencher le survol                                                    |
| timeout                           | integer        | 0                 | Temps d'attente en ms avant de désactiver le survol                                                    |
| beforeLoad                        | function       | undefined         | Callback au début du chargement                                                                        |
| afterEventsHandler                | function       | undefined         | Callback après la déclaration des événements                                                           |
| onComplete                        | function       | undefined         | Callback à la fin du chargement                                                                        |
| onOver                            | function       | undefined         | Callback une fois qu'un élément parent est survolé                                                     |
| onOut                             | function       | undefined         | Callback une fois qu'un élément parent n'est plus survolé                                              |


## API

[Hérite de l'API des menus.](../README.md#api-menus)