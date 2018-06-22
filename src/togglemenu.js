(function ($) {
    'use strict';

    $.ToggleMenu = function (options) {
        // Éléments
        this.elements = {
            body: $('body')
        };

        // Config
        $.extend((this.settings = {}), $.ToggleMenu.defaults, options);

        // Variables
        this.display = {
            current: null
        };
        this.instance = null;
        this.options = {};

        return this;
    };

    $.ToggleMenu.defaults = {
        classes: {
            prefix: 'togglemenu'
        },
        onDisplayLoad: undefined,
        onDisplayComplete: undefined,
        onDisplayUnload: undefined
    };

    $.ToggleMenu.prototype = {
        /**
         * Met en place un display
         *
         * @param string display Nom du display
         * @param object options Options utilisateur du display
         */
        setDisplay: function (display, options) {
            // On stop si le display courant est le même que le nouveau demandé
            if (this.isCurrentDisplay(display)) {
                return false;
            }

            // Si un display est déjà initilisé, on l'enlève
            this.removeDisplay();

            return this.addDisplay(display, options);
        },

        /**
         * Enregistre les options pour un display
         *
         * @param string display Nom du display
         * @param object options Options du display
         */
        setOptions: function (display, options) {
            this.options[display] = options;

            return this;
        },

        /**
         * Détermine si c'est le display courant
         *
         * @return bool
         */
        isCurrentDisplay: function (display) {
            return (this.display.current === display);
        },

        /**
         * Ajout d'un display
         */
        addDisplay: function (display, options) {
            // On stop l'initialisation si le display est déjà initialisé
            if (this.isCurrentDisplay(display)) {
                return false;
            }

            // Formatage du nom de la classe à init
            this.display.className = this.getDisplayClassName(display);

            // User Callback
            if (this.settings.onDisplayLoad !== undefined) {
                this.settings.onDisplayLoad.call(this);
            }

            // Si le display est chargé, on l'init
            if ($[this.display.className] !== undefined) {
                // On défini le display courant
                this.display.current = display;
                this.elements.body.addClass(this.settings.classes.prefix + '-' + display);

                // Options définies ?
                if (options === undefined && this.options[display] !== undefined) {
                    options = this.options[display];
                }

                // Appel de la classe
                this.instance = new $[this.display.className](this, options);

            } else {
                this.setLog('error', 'Display "' + this.display.className + '" not found.');
            }

            // User Callback
            if (this.settings.onDisplayComplete !== undefined) {
                this.settings.onDisplayComplete.call(this);
            }

            return this;
        },

        /**
         * Suppression du display courant
         *
         * @return bool
         */
        removeDisplay: function () {
            if (this.display.current !== null) {
                this.elements.body.removeClass(this.settings.classes.prefix + '-' + this.display.current);

                // Appel du unload du display correspondant
                if ($[this.display.className].prototype.hasOwnProperty('unload')) {
                    $[this.display.className].prototype.unload.call(this.instance);
                }

                // User Callback
                if (this.settings.onDisplayUnload !== undefined) {
                    this.settings.onDisplayUnload.call(this);
                }

                // On remet le display courant par défaut
                this.display.current = null;
                delete this.display.className;
            }

            return this;
        },

        /**
         * Récupère le nom de la classe du display correspondant
         *
         * @param  string display Nom du display
         * @return string
         */
        getDisplayClassName: function (display) {
            return 'ToggleMenu' + display.charAt(0).toUpperCase() + display.substr(1);
        },

        /**
         * Récupère l'instance en cours
         *
         * @return object
         */
        getInstance: function () {
            return this.instance;
        },

        /**
         * Récupère les éléments parents en fonction d'un contexte
         *
         * @param  jQuery object search Élément jQuery dans lequel la recherche d'éléments parents sera effectée
         * @return jQuery object
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
         * Utils
         */
        setLog: function (type, log) {
            console[type]('ToggleMenu: ' + log);
        },
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