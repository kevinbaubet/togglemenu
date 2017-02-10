(function($) {
    'use strict';

    $.ToggleMenuMega = function(ToggleMenu, options) {
        // Héritage
        this.ToggleMenu = ToggleMenu;

        // Config
        $.extend(true, (this.settings = {}), this.ToggleMenu.settings, $.ToggleMenuMega.defaults, options);

        // Éléments
        this.elements = this.settings.elements;
        delete this.settings.elements;

        // Variables
        this.events = {};

        // Init
        if (this.prepareOptions()) {
            this.load();
        }
    };

    $.ToggleMenuMega.defaults = {
        elements: {
            menu: undefined,
            items: undefined,
            itemLink: function(item) {
                return item.children('a');
            },
            close: undefined
        },
        overlay: true,
        classes: {
            open: 'is-{prefix}Open',
            active: 'is-active'
        },
        onLoad: undefined,
        beforeAddOverlay: undefined,
        afterEventsHandler: undefined,
        afterItemHandler: undefined,
        onComplete: undefined,
        onToggleSubmenu: undefined
    };

    $.ToggleMenuMega.prototype = {
        /**
         * Préparation des options utilisateur
         *
         * @return bool
         */
        prepareOptions: function() {
            // Classes
            this.ToggleMenu.replacePrefixClass.call(this);

            if (this.elements.menu === undefined) {
                this.ToggleMenu.setLog('error', 'Missing element "elements.menu" in options.');
                return false;
            }

            if (this.elements.items === undefined) {
                this.ToggleMenu.setLog('error', 'Missing element "elements.items" in options.');
                return false;
            }

            return true;
        },

        /**
         * Initialisation
         */
        load: function() {
            // User callback
            if (this.settings.onLoad !== undefined) {
                this.settings.onLoad.call({
                    ToggleMenuMega: this
                });
            }

            // Load
            if (this.settings.overlay) {
                this.addOverlay();
            }
            this.eventsHandler();
            this.itemsHandler();

            // User callback
            if (this.settings.onComplete !== undefined) {
                this.settings.onComplete.call({
                    ToggleMenuMega: this,
                    elements: this.elements
                });
            }
        },

        /**
         * Créer un overlay
         */
        addOverlay: function() {
            this.elements.overlay = $('<div>', {
                class: this.settings.classes.prefix + 'Mega-overlay'
            });

            // User callback
            if (this.settings.beforeAddOverlay !== undefined) {
                this.settings.beforeAddOverlay.call({
                    ToggleMenuMega: this,
                    overlay: this.elements.overlay
                });
            }

            // Ajout de l'overlay
            this.elements.overlay.appendTo(this.ToggleMenu.elements.body);
        },

        /**
         * Supprime l'overlay
         */
        removeOverlay: function() {
            this.elements.overlay.remove();
        },

        /**
         * Gestionnaire des événements
         */
        eventsHandler: function() {
            var self = this;

            // Fermeture
            if (self.elements.close !== undefined) {
                self.elements.close.on((self.events.close = 'click.togglemenu.close'), function() {
                    self.toggleSubmenu();
                });
            }

            // Overlay
            if (self.settings.overlay) {
                self.elements.overlay.on((self.events.overlay = 'click.togglemenu.overlay'), function() {
                    self.toggleSubmenu();
                });
            }

            // User callback
            if (self.settings.afterEventsHandler !== undefined) {
                self.settings.afterEventsHandler.call({
                    ToggleMenuMega: self,
                    elements: self.elements,
                    events: self.events
                });
            }
        },

        /**
         * Gestionnaire des éléments parent
         */
        itemsHandler: function() {
            var self = this;

            if (self.elements.items.length) {
                self.elements.items.each(function() {
                    var item = $(this);

                    // Events
                    self.elements.itemLink(item).on('click.togglemenu.itemLink', function(event) {
                        event.preventDefault();

                        self.toggleSubmenu(item);
                    });

                    // User callback
                    if (self.settings.afterItemHandler !== undefined) {
                        self.settings.afterItemHandler.call({
                            ToggleMenuMega: self,
                            elements: self.elements,
                            item: item
                        });
                    }
                });
            }
        },

        /**
         * Ouverture/fermeture d'un sous-menu
         *
         * @param jQueryObject item Élément parent
         */
        toggleSubmenu: function(item) {
            this.closeSubmenus(item);

            if (item !== undefined) {
                item.toggleClass(this.settings.classes.active);

                if (this.settings.overlay) {
                    this.ToggleMenu.elements.body.toggleClass(this.settings.classes.open);
                }
            }


            // User callback
            if (this.settings.onToggleSubmenu !== undefined) {
                this.settings.onToggleSubmenu.call({
                    ToggleMenuMega: this,
                    item: item
                });
            }
        },

        /**
         * Fermeture des sous menus
         *
         * @param jQueryObject item Élément parent (optionnel)
         */
        closeSubmenus: function(item) {
            var active = (item !== undefined) ? item.siblings('.' + this.settings.classes.active) : this.elements.items;
            var activeChildren = active.find('.' + this.settings.classes.active);

            // Suppression de l'état actif sur les frères
            if (active.length) {
                active.removeClass(this.settings.classes.active);

                // Overlay
                if (this.settings.overlay) {
                    this.ToggleMenu.elements.body.removeClass(this.settings.classes.open);
                }
            }

            // Si un frère a un enfant actif
            if (activeChildren.length) {
                activeChildren.removeClass(this.settings.classes.active);
            }

            // Si un enfant de l'item courant est actif
            if (item !== undefined) {
                var itemChildren = item.find('.' + this.settings.classes.active);

                if (itemChildren.length) {
                    itemChildren.removeClass(this.settings.classes.active);
                }
            }
        },

        /**
         * Destroy
         */
        unload: function() {
            var self = this;

            // Suppression des éléments
            if (self.settings.overlay) {
                self.removeOverlay();
            }

            // Désactivation des events
            $.each(self.events, function(element, event) {
                self.elements[element].off(event);
            });
            self.elements.items.each(function() {
                self.elements.itemLink($(this)).off('click.togglemenu.itemLink');
            });
        }
    };
})(jQuery);