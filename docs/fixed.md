# Menu "fixed"

Permet de fixer un menu et d'afficher les sous-menus par dessus la page puis en accordéon.

## Options

| Option                           | Type           | Valeur par défaut                              | Description                                                                                                          |
|----------------------------------|----------------|------------------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| elements                         | object         | Voir ci-dessous                                | Objet pour les options ci-dessous                                                                                    |
| &nbsp;&nbsp;&nbsp;&nbsp;menu/!\  | Élément jQuery | undefined                                      | Élément conteneur du menu, exemple : $('#nav')                                                                       |
| &nbsp;&nbsp;&nbsp;&nbsp;items    | Élément jQuery | undefined                                      | Éléments parents, exemple : $('#nav').find('li.has-children')                                                        |
| &nbsp;&nbsp;&nbsp;&nbsp;itemLink | function       | function (item) { return item.children('a'); } | Fonction retournant le lien d'un élément parent                                                                      |
| &nbsp;&nbsp;&nbsp;&nbsp;toggle   | Élément jQuery | undefined                                      | Élément pour le bouton d'ouverture/fermeture. Si la valeur n'est pas définie, l'élément sera $('.togglemenu-toggle') |
| classes                          | object         | Voir ci-dessous                                | Objet pour les options ci-dessous                                                                                    |
| &nbsp;&nbsp;&nbsp;&nbsp;open     | string         | 'is-{prefix}-open'                             | Nom de la classe lorsque le menu est ouvert                                                                          |
| &nbsp;&nbsp;&nbsp;&nbsp;active   | string         | 'is-active'                                    | Nom de la classe lorsque un élément parent est actif                                                                 |
| beforeLoad                       | function       | undefined                                      | Callback au début du chargement                                                                                      |
| afterEventsHandler               | function       | undefined                                      | Callback après la déclaration des événements                                                                         |
| afterItemHandler                 | function       | undefined                                      | Callback après le gestionnaire d'un élément parent                                                                   |
| onComplete                       | function       | undefined                                      | Callback à la fin du chargement                                                                                      |
| onToggle                         | function       | undefined                                      | Callback à l'ouverture/fermeture du menu                                                                             |
| onToggleSubmenu                  | function       | undefined                                      | Callback à l'ouverture/fermeture d'un sous-menu                                                                      |

/!\ Options obligatoires.

## Exemple

    var toggleMenu = new $.ToggleMenu();
    
    toggleMenu.setDisplay('fixed', {
        elements: {
            menu: $('#nav')
        }
    });

---