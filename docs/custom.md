# Menu personnalisé

Il est possible d'ajouter autant de menus que vous voulez. Il suffit de créer une classe dans un nouveau fichier JS :

    $.ToggleMenuName(toggleMenu, options) {
        // A l'initialisation de la classe, on execute la méthode load()
        this.load();
    };
    
    $.ToggleMenuName.prototype = {
        /**
         * Initilisation du menu
         */
        load: function() {

        },

        /**
         * Méthode appelée à la suppression du menu
         */
        unload: function() {

        }
    };

Cependant, chaque menu doit pouvoir être retiré du DOM. Lors d'un appel à toggleMenu(), si un menu est déjà initialisé, ToggleMenu va exécuter la méthode unload() du menu actuel avant d'en charger un nouveau.
Cette méthode unload permet de supprimer toutes les actions effectuées par l'initialisation du menu et l'attachement des événements aux éléments HTML.