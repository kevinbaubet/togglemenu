(function ($) {
    'use strict';

    $.ToggleMenuMega = function (toggleMenu, options) {
        // Héritage
        this.toggleMenu = toggleMenu;

        // Config
        $.extend(true, (this.settings = {}), this.toggleMenu.settings, $.ToggleMenuMega.defaults, options);

        // Éléments
        this.elements = this.settings.elements;
        delete this.settings.elements;

        // Variables
        this.events = {};

        // Init
        if (this.prepareOptions()) {
            return this.load();
        }

        return false;
    };

    $.ToggleMenuMega.defaults = {
        elements: {
            menu: undefined,
            items: undefined,
            itemLink: function (item) {
                return item.children('a');
            },
            close: undefined
        },
        overlay: true,
        closeOnEscape: true,
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
        prepareOptions: function () {
            // Classes
            this.toggleMenu.replacePrefixClass.call(this);

            if (this.elements.menu === undefined) {
                this.toggleMenu.setLog('error', 'Missing elements.menu parameter');
                return false;
            }

            if (this.elements.items === undefined) {
                this.toggleMenu.setLog('error', 'Missing elements.items parameter');
                return false;
            }

            return true;
        },

        /**
         * Initialisation
         */
        load: function () {
            // User callback
            if (this.settings.onLoad !== undefined) {
                this.settings.onLoad.call({
                    toggleMenuMega: this
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
                    toggleMenuMega: this,
                    elements: this.elements
                });
            }

            return this;
        },

        /**
         * Créer un overlay
         */
        addOverlay: function () {
            this.elements.overlay = $('<div>', {
                'class': this.settings.classes.prefix + 'Mega-overlay'
            });

            // User callback
            if (this.settings.beforeAddOverlay !== undefined) {
                this.settings.beforeAddOverlay.call({
                    toggleMenuMega: this,
                    overlay: this.elements.overlay
                });
            }

            // Ajout de l'overlay
            this.elements.overlay.appendTo(this.toggleMenu.elements.body);

            return this;
        },

        /**
         * Supprime l'overlay
         */
        removeOverlay: function () {
            this.elements.overlay.remove();

            return this;
        },

        /**
         * Gestionnaire des événements
         */
        eventsHandler: function () {
            var self = this;

            // Fermeture
            if (self.elements.close !== undefined) {
                self.elements.close.on((self.events.close = 'click.togglemenu.close'), function () {
                    self.toggleSubmenu();
                });
            }

            // Overlay
            if (self.settings.overlay) {
                self.elements.overlay.on((self.events.overlay = 'click.togglemenu.overlay'), function () {
                    self.toggleSubmenu();
                });
            }

            // User callback
            if (self.settings.afterEventsHandler !== undefined) {
                self.settings.afterEventsHandler.call({
                    toggleMenuMega: self,
                    elements: self.elements,
                    events: self.events
                });
            }

            return self;
        },

        /**
         * Gestionnaire des éléments parent
         */
        itemsHandler: function () {
            var self = this;

            if (self.elements.items.length) {
                self.elements.items.each(function (i, item) {
                    item = $(item);

                    // Events
                    self.elements.itemLink(item).on('click.togglemenu.itemLink', function (event) {
                        event.preventDefault();
                        self.toggleSubmenu(item);
                    });

                    // User callback
                    if (self.settings.afterItemHandler !== undefined) {
                        self.settings.afterItemHandler.call({
                            toggleMenuMega: self,
                            elements: self.elements,
                            item: item
                        });
                    }
                });
            }

            return self;
        },

        /**
         * Ouverture/fermeture d'un sous-menu
         *
         * @param jQueryObject item Élément parent
         */
        toggleSubmenu: function (item) {
            var self = this;
            
            self.closeSubmenus(item);

            if (item !== undefined) {
                item.toggleClass(self.settings.classes.active);

                if (self.settings.overlay) {
                    self.toggleMenu.elements.body.toggleClass(self.settings.classes.open);
                }

                // Fermeture avec "echap"
                if (self.settings.closeOnEscape) {
                    $(document).one('keyup.togglemenuMega', function (keyupEvent) {
                        if (keyupEvent.keyCode === 27) {
                            self.toggleSubmenu();
                        }
                    });
                }
            }

            // User callback
            if (self.settings.onToggleSubmenu !== undefined) {
                self.settings.onToggleSubmenu.call({
                    toggleMenuMega: self,
                    item: item
                });
            }

            return self;
        },

        /**
         * Fermeture des sous menus
         *
         * @param jQueryObject item Élément parent (optionnel)
         */
        closeSubmenus: function (item) {
            var active = (item !== undefined) ? item.siblings('.' + this.settings.classes.active) : this.elements.items;
            var activeChildren = active.find('.' + this.settings.classes.active);

            // Suppression de l'état actif sur les frères
            if (active.length) {
                active.removeClass(this.settings.classes.active);

                // Overlay
                if (this.settings.overlay) {
                    this.toggleMenu.elements.body.removeClass(this.settings.classes.open);
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

            return this;
        },

        /**
         * Destroy
         */
        unload: function () {
            var self = this;

            // Suppression des éléments
            if (self.settings.overlay) {
                self.removeOverlay();
            }

            // Désactivation des events
            $.each(self.events, function (element, event) {
                self.elements[element].off(event);
            });
            self.elements.items.each(function (i, item) {
                self.elements.itemLink($(item)).off('click.togglemenu.itemLink');
            });
            $(document).off('keyup.togglemenuMega');

            return self;
        }
    };
})(jQuery);