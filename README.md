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

| Option                         | Type     | Valeur par défaut  | Description                                           |
|--------------------------------|----------|--------------------|-------------------------------------------------------|
| classes                        | object   | Voir ci-dessous    | Objet pour l'option ci-dessous                        |
| &nbsp;&nbsp;&nbsp;&nbsp;prefix | string   | 'togglemenu'       | Préfix de classe                                      |
| &nbsp;&nbsp;&nbsp;&nbsp;open   | string   | 'is-{prefix}-open' | Nom de la classe lorsque le menu est ouvert           |
| &nbsp;&nbsp;&nbsp;&nbsp;active | string   | 'is-active'        | Nom de la classe lorsque un élément parent est actif  |                               
| menuBeforeLoad                 | function | undefined          | Callback au début du chargement du menu               |
| menuComplete                   | function | undefined          | Callback à la fin du chargement du menu               |
| menuUnload                     | function | undefined          | Callback à la suppression du menu                     |


## API ToggleMenu

**API utilisable seulement avec l'objet ToggleMenu.**


#### setOptions()

Enregistre les options pour un menu

* @param *{string}* **type** Type de menu
* @param *{object}* **options** Options du menu

        toggleMenu.setOptions('push', {
            onToggle: function () {
                console.log('open/close menu');
            }
        });


#### toggleMenu()

Switch le menu courant vers un nouveau

* @param *{string}* **type** Type de menu
* @param *{object=undefined}* **options** Options du menu

        toggleMenu.toggleMenu('push');


#### addMenu()

Ajout d'un menu

* @param *{string}* **type** Type de menu
* @param *{object=undefined}* **options** Options du menu

        toggleMenu.addMenu('hover');
        toggleMenu.addMenu('push');


#### removeMenu()

Suppression du menu courant

* @param *{string=undefined}* **type** Type de menu

        toggleMenu.removeMenu(); // remove current menu
        toggleMenu.removeMenu('hover');


#### isCurrentMenu()

Détermine si c'est le menu courant

* @param *{string}* **type** Type de menu
* @return *{boolean}*

        if (toggleMenu.isCurrentMenu('hover')) {
            toggleMenu.removeMenu();
        }


#### getMenuClassName()

Récupère le nom de la classe du menu correspondant

* @param *{string}* **type** Type de menu
* @return *{string}*


#### getInstances()

Récupère les instances en cours

* @return *{object}*

---

## API Menus

**API globale à tous les menus de ToggleMenu.**


#### getItemsParent()

Récupère les éléments parents en fonction d'un contexte

* @param *{object}* **search** Élément jQuery dans lequel la recherche d'éléments parents sera effectée
* @return *{object}*


#### onReady()

Une fois ToggleMenu prêt

* @param *{function}* **callback** Fonction à exécuter


#### getElements()

Retourne tous les éléments de toggleMenu

* @return *{object}*


#### getContentElements()

Retourne tous les éléments de contenu

* @return *{object}*


#### getWrapper()

Retourne le wrapper global

* @return *{object}*


#### setLog()

Créer un log

* @param *{string}* **log**
* @param *{string=undefined}* **type**

        toggleMenu.setLog('information message');
        toggleMenu.setLog('warning!', 'warn');
        toggleMenu.setLog('error message', 'error');
        
        
#### replacePrefixClass()

Remplace la chaine {prefix} par la classe de préfix dans toutes les classes