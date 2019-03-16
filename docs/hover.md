# Menu "hover"

Navigation classique en ligne. Permet d'afficher des sous-menus au survol de la souris.

## Options

| Option                            | Type           | Valeur par défaut | Description                                                                                            |
|-----------------------------------|----------------|-------------------|--------------------------------------------------------------------------------------------------------|
| elements                          | object         | Voir ci-dessous   | Objet pour les options ci-dessous                                                                      |
| &nbsp;&nbsp;&nbsp;&nbsp;menu/!\   | Élément jQuery | undefined         | Élément conteneur du menu, exemple : $('#nav')                                                         |
| &nbsp;&nbsp;&nbsp;&nbsp;items     | Élément jQuery | undefined         | Éléments parents, exemple : $('#nav').find('li.has-children')                                          |
| &nbsp;&nbsp;&nbsp;&nbsp;itemLink  | string         | '> a'             | Sélecteur vers le lien direct de l'élément parent survolé                                              |
| classes                           | object         | Voir ci-dessous   | Objet pour l'option ci-dessous                                                                         |
| &nbsp;&nbsp;&nbsp;&nbsp;active    | string         | 'is-active'       | Nom de la classe à l'état actif                                                                        |
| disableItemsClick                 | boolean        | false             | Permet de désactiver la possibilité de cliquer sur les éléments parents                                |
| interval                          | integer        | 100               | Temps d'attente en ms avant de déclencher le survol                                                    |
| timeout                           | integer        | 0                 | Temps d'attente en ms avant de désactiver le survol                                                    |
| beforeLoad                        | function       | undefined         | Callback au début du chargement                                                                        |
| afterEventsHandler                | function       | undefined         | Callback après la déclaration des événements                                                           |
| onComplete                        | function       | undefined         | Callback à la fin du chargement                                                                        |
| onOver                            | function       | undefined         | Callback une fois qu'un élément parent est survolé                                                     |
| onOut                             | function       | undefined         | Callback une fois qu'un élément parent n'est plus survolé                                              |

/!\ Options obligatoires.

## Exemple

    var toggleMenu = new $.ToggleMenu();
    
    toggleMenu.setDisplay('hover', {
        elements: {
            menu: $('#nav')
        }
    });

---