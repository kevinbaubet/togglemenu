(function ($) {
    'use strict';

    $.ToggleMenuFixed = function (toggleMenu, options) {
        // Héritage
        this.toggleMenu = toggleMenu;

        // Config
        $.extend(true, (this.settings = {}), this.toggleMenu.settings, $.ToggleMenuFixed.defaults, options);

        // Éléments
        this.elements = this.settings.elements;
        delete this.settings.elements;

        // Variables
        this.events = {};
        this.isOpen = false;

        // Init
        if (this.prepareOptions()) {
            return this.load();
        }

        return false;
    };

    $.ToggleMenuFixed.defaults = {
        elements: {
            menu: undefined,
            items: undefined,
            itemLink: function (item) {
                return item.children('a');
            },
            toggle: undefined
        },
        toggle: true,
        classes: {
            open: 'is-{prefix}Open',
            active: 'is-active'
        },
        onLoad: undefined,
        afterEventsHandler: undefined,
        afterItemHandler: undefined,
        onComplete: undefined,
        onToggle: undefined,
        onToggleSubmenu: undefined
    };

    $.ToggleMenuFixed.prototype = {
        /**
         * Préparation des options utilisateur
         *
         * @return bool
         */
        prepareOptions: function () {
            var self = this;

            // Classes
            $.each(self.settings.classes, function (key, value) {
                self.settings.classes[key] = value.replace(/{prefix}/, self.settings.classes.prefix);
            });

            // Éléments
            if (self.elements.toggle === undefined) {
                self.elements.toggle = $('.' + this.settings.classes.prefix + '-toggle');

                if (self.elements.toggle.length === 0) {
                    self.toggleMenu.setLog('error', 'Missing elements.toggle parameter');
                    return false;
                }
            }

            if (self.elements.menu === undefined) {
                self.toggleMenu.setLog('error', 'Missing element.menu parameter');
                return false;
            }

            if (self.elements.items === undefined) {
                self.elements.items = self.toggleMenu.getItemsParent(self.elements.menu.find('li'));

            } else if (typeof self.elements.items === 'function') {
                self.elements.items = self.elements.items(content);
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
                    toggleMenuFixed: this
                });
            }

            // Load
            this.eventsHandler();
            this.itemsHandler();

            // User callback
            if (this.settings.onComplete !== undefined) {
                this.settings.onComplete.call({
                    toggleMenuFixed: this,
                    elements: this.elements
                });
            }

            return this;
        },

        /**
         * Gestionnaire des événements
         */
        eventsHandler: function () {
            var self = this;

            // Bouton toggle
            if (self.settings.toggle) {
                self.elements.toggle.on((self.events.toggle = 'click.togglemenu.toggle'), function () {
                    self.toggle();
                });
            } else {
                self.elements.menu.on((self.events.menu = 'mouseenter.togglemenu.toggle mouseleave.togglemenu.toggle'), function () {
                    self.toggle();
                });
            }

            // User callback
            if (self.settings.afterEventsHandler !== undefined) {
                self.settings.afterEventsHandler.call({
                    toggleMenuFixed: self,
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

                        if (!self.isOpen) {
                            self.toggle();
                        }
                        self.toggleSubmenu(item);
                    });

                    // User callback
                    if (self.settings.afterItemHandler !== undefined) {
                        self.settings.afterItemHandler.call({
                            toggleMenuFixed: self,
                            elements: self.elements,
                            item: item
                        });
                    }
                });
            }
        },

        /**
         * Ouverture/fermeture du toggleMenu
         */
        toggle: function () {
            // Statut
            this.toggleMenu.elements.body.toggleClass(this.settings.classes.open);
            this.isOpen = (this.toggleMenu.elements.body.hasClass(this.settings.classes.open));

            if (!this.isOpen) {
                this.closeSubmenus();
            }

            // User callback
            if (this.settings.onToggle !== undefined) {
                this.settings.onToggle.call({
                    toggleMenuFixed: this,
                    body: this.toggleMenu.elements.body,
                    isOpen: this.isOpen
                });
            }
        },

        /**
         * Ouverture/fermeture d'un sous-menu
         *
         * @param jQueryObject item Élément parent
         */
        toggleSubmenu: function (item) {
            this.closeSubmenus(item);

            item.toggleClass(this.settings.classes.active);

            // User callback
            if (this.settings.onToggleSubmenu !== undefined) {
                this.settings.onToggleSubmenu.call({
                    toggleMenuFixed: this,
                    item: item
                });
            }
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
        unload: function () {
            var self = this;

            // Fermeture du menu
            if (self.isOpen) {
                self.toggle();
            }

            // Désactivation des events
            $.each(self.events, function (element, event) {
                self.elements[element].off(event);
            });
            self.elements.items.each(function (i, item) {
                self.elements.itemLink($(item)).off('click.togglemenu.itemLink');
            });

            return self;
        }
    };
})(jQuery);