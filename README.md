# Documentation ToggleMenu

ToggleMenu est un gestionnaire de menu. Il permet de gérer plusieurs types de menu (hover, megamenu, menu overlay, etc...). Chaque type de menu correspond à un fichier JS à charger.
Le principe est de d'abord initialiser le gestionnaire (ToggleMenu), puis ensuite d'initialiser un type de menu, par exemple _hover_.

* Compatibilité : IE10+
* Dépendance : jQuery


## Initialiser ToggleMenu

    var toggleMenu = new $.ToggleMenu([options]);
    
* @param *{object}* **options**  (optionnel) [Options de ToggleMenu](README.md#options-togglemenu)

        var toggleMenu = new $.ToggleMenu({
            menuComplete: function () {
                console.log(this.type + ' loaded');
            }
        });
        
        
## Initialiser un menu

    toggleMenu.addMenu('hover', [options]);
    
   
## Menus

Liste des menus présents dans ToggleMenu :

* [Hover](docs/hover.md)
* [Push](docs/push.md)
* [Overlay](docs/overlay.md)
* [Mega](docs/mega.md)
* [Fixed](docs/fixed.md)


## Menu supplémentaire

* [Créer un menu](docs/custom.md)


## Options ToggleMenu

| Option                         | Type     | Valeur par défaut | Description                                |
|--------------------------------|----------|-------------------|--------------------------------------------|
| classes                        | object   | Voir ci-dessous   | Objet pour l'option ci-dessous             |
| &nbsp;&nbsp;&nbsp;&nbsp;prefix | string   | 'togglemenu'      | Préfix de classe                           |
| menuBeforeLoad                 | function | undefined         | Callback au début du chargement du menu    |
| menuComplete                   | function | undefined         | Callback à la fin du chargement du menu    |
| menuUnload                     | function | undefined         | Callback à la suppression du menu          |


## API ToggleMenu

todo