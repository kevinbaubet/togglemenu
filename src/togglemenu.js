(function ($) {
    'use strict';

    /**
     * ToggleMenu
     *
     * @param {object=undefined} options
     *
     * @return {$.ToggleMenu}
     */
    $.ToggleMenu = function (options) {
        // Config
        $.extend(this.settings = {}, $.ToggleMenu.defaults, options);

        // Variables
        this.menu = {
            current: null
        };
        this.instances = [];
        this.options = {};

        return this;
    };

    $.ToggleMenu.defaults = {
        classes: {
            prefix: 'togglemenu',
            open: 'is-{prefix}-open',
            active: 'is-active',
            current: 'is-current'
        },
        menuBeforeLoad: undefined,
        menuComplete: undefined,
        menuUnload: undefined
    };

    $.ToggleMenu.prototype = {
        /**
         * Enregistre les options pour un menu
         *
         * @param {string} type Type de menu
         * @param {object} options Options du menu
         */
        setOptions: function (type, options) {
            this.options[type] = options;

            return this;
        },

        /**
         * Switch le menu courant vers un nouveau
         *
         * @param {string} type Type de menu
         * @param {object=undefined} options Options du menu
         */
        toggleMenu: function (type, options) {
            // On stop si le menu courant est le même que le nouveau demandé
            if (this.isCurrentMenu(type)) {
                return;
            }

            // Si un menu est déjà initilisé, on l'enlève
            this.removeMenu();

            return this.addMenu(type, options);
        },

        /**
         * Ajout d'un menu
         *
         * @param {string} type Type de menu
         * @param {object=undefined} options Options du menu
         */
        addMenu: function (type, options) {
            // On stop l'initialisation si le menu est déjà initialisé
            if (this.isCurrentMenu(type)) {
                return;
            }

            // Formatage du nom de la classe à init
            this.menu.className = this.getMenuClassName(type);

            // User Callback
            if (this.settings.menuBeforeLoad !== undefined) {
                this.settings.menuBeforeLoad.call(this);
            }

            // Si le display est chargé, on l'init
            if ($[this.menu.className] !== undefined) {
                // On défini le display courant
                this.menu.current = type;

                // Options définies ?
                if (options === undefined && this.options[type] !== undefined) {
                    options = this.options[type];
                }

                // Appel de la classe
                this.instances[type] = new $[this.menu.className](this, options);

            } else {
                this.setLog('Menu "' + type + '" not found. Checks if the file ' + this.menu.className + ' has been loaded.', 'error');
            }

            // User Callback
            if (this.settings.menuComplete !== undefined) {
                this.settings.menuComplete.call(this);
            }

            return this;
        },

        /**
         * Suppression d'un menu
         *
         * @param {string=undefined} type Type de menu
         */
        removeMenu: function (type) {
            type = type || this.menu.current;

            if (type !== undefined && type !== null) {
                // Appel du unload du display correspondant
                if ($[this.menu.className].prototype.hasOwnProperty('unload')) {
                    $[this.menu.className].prototype.unload.call(this.instances[this.menu.current]);
                }

                // User Callback
                if (this.settings.menuUnload !== undefined) {
                    this.settings.menuUnload.call(this);
                }

                // On remet le menu courant par défaut
                this.menu.current = null;
                delete this.menu.className;
            }

            return this;
        },

        /**
         * Détermine si c'est le menu courant
         *
         * @param {string} type Type de menu
         *
         * @return {boolean}
         */
        isCurrentMenu: function (type) {
            return this.menu.current === type;
        },

        /**
         * Récupère le nom de la classe du menu correspondant
         *
         * @param  {string} type Type de menu
         *
         * @return {string}
         */
        getMenuClassName: function (type) {
            return 'ToggleMenu' + type.charAt(0).toUpperCase() + type.substr(1);
        },

        /**
         * Récupère les instances en cours
         *
         * @return {object}
         */
        getInstances: function () {
            return this.instances;
        },

        /**
         * Récupère les éléments parents en fonction d'un contexte
         *
         * @param  {object} search Élément jQuery dans lequel la recherche d'éléments parents sera effectée
         *
         * @return {object}
         */
        getItemsParent: function (search) {
            var itemsParent = [];

            if (search.length) {
                search.each(function (i, item) {
                    item = $(item);

                    if (item.find('ul').length) {
                        itemsParent.push(item.get(0));
                    }
                });
            }

            return $(itemsParent);
        },

        /**
         * Une fois ToggleMenu prêt
         *
         * @param {function} callback Fonction à exécuter
         */
        onReady: function (callback) {
            setTimeout(function () {
                callback();
            }, 0);

            return this;
        },

        /**
         * Retourne tous les éléments de toggleMenu
         *
         * @return {object}
         */
        getElements: function () {
            return this.elements;
        },

        /**
         * Retourne tous les éléments de contenu
         *
         * @return {object}
         */
        getContentElements: function () {
            return this.getElements().content;
        },

        /**
         * Retourne le wrapper global
         *
         * @return {object}
         */
        getWrapper: function () {
            return this.getElements().wrapper;
        },

        /**
         * Créer un log
         *
         * @param {string} log
         * @param {string=undefined} type
         */
        setLog: function (log, type) {
            type = type || 'log';

            console[type]('ToggleMenu: ' + log);
        },

        /**
         * Remplace la chaine {prefix} par la classe de préfix dans toutes les classes
         */
        replacePrefixClass: function () {
            var self = this;

            $.each(self.settings.classes, function (key, value) {
                if (typeof value === 'string') {
                    self.settings.classes[key] = value.replace(/{prefix}/, self.settings.classes.prefix);
                }
            });

            return self;
        }
    };
})(jQuery);