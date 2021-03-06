# Overlay

Permet d'afficher la navigation par dessus toute la page avec un overlay. La navigation se déclenche via un bouton.

* Nom du menu : **overlay**
* Nom du fichier : **togglemenu-overlay.js**
* Nom de la classe : **$.ToggleMenuOverlay**


## Initialisation

    var toggleMenu = new $.ToggleMenu();
    
    toggleMenu.addMenu('overlay', {
        elements: {
            content: {
                menu: $('#nav--main'),
                footer: $('#nav--footer')
            }
        }
    });


## Options

| Option                                                  | Type           | Valeur par défaut                              | Description                                                                                                                                 |
|---------------------------------------------------------|----------------|------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| elements                                                | object         | Voir ci-dessous                                | Objet pour les options ci-dessous                                                                                                           |
| &nbsp;&nbsp;&nbsp;&nbsp;content                         | object         | Voir ci-dessous                                | Objet pour le contenu du menu                                                                                                               |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;menu    | Élément jQuery | undefined                                      | Élément conteneur du menu, exemple : $('#nav')                                                                                              |
| &nbsp;&nbsp;&nbsp;&nbsp;items                           | Élément jQuery | undefined                                      | Éléments parents, exemple : $('#nav').find('li.is-parent')                                                                                  |
| &nbsp;&nbsp;&nbsp;&nbsp;itemLink                        | function       | function (item) { return item.children('a'); } | Fonction retournant le lien d'un élément parent. Si la valeur est null, l'élément parent sera cliquable mais n'affichera pas son sous-menu  |
| &nbsp;&nbsp;&nbsp;&nbsp;toggle                          | Élément jQuery | undefined                                      | Élément pour le bouton d'ouverture/fermeture. Si la valeur n'est pas définie, l'élément sera $('.togglemenu-toggle')                        |
| closeOnEscape                                           | boolean        | true                                           | Permet de fermer le menu avec la touche "echap"                                                                                             |
| classes                                                 | object         | Voir ci-dessous                                | Objet pour les options ci-dessous                                                                                                           |
| &nbsp;&nbsp;&nbsp;&nbsp;copy                            | string         | '{prefix}-copy'                                | Nom de la classe des éléments copiés dans le menu                                                                                           |
| beforeLoad                                              | function       | undefined                                      | Callback au début du chargement                                                                                                             |
| beforeWrap                                              | function       | undefined                                      | Callback avant l'ajout du wrapper dans le DOM                                                                                               |
| onAddContent                                            | function       | undefined                                      | Callback à chaque ajout d'un contenu dans le menu                                                                                           |
| afterEventsHandler                                      | function       | undefined                                      | Callback après la déclaration des événements                                                                                                |
| afterItemHandler                                        | function       | undefined                                      | Callback après le gestionnaire d'un élément parent                                                                                          |
| onComplete                                              | function       | undefined                                      | Callback à la fin du chargement                                                                                                             |
| onToggle                                                | function       | undefined                                      | Callback à l'ouverture/fermeture du menu                                                                                                    |
| onToggleSubmenu                                         | function       | undefined                                      | Callback à l'ouverture/fermeture d'un sous-menu                                                                                             |


## API

[Hérite de l'API des menus.](../README.md#api-menus)


#### toggle()

Ouverture/fermeture du menu

* @param *{object}* **event**


#### toggleSubmenu()

Ouverture/fermeture d'un sous-menu

* @param *{object}* **item** Élément parent


#### closeSubmenus()

Fermeture des sous menus

* @param *{object=undefined}* **item** Élément parent


