(function ($) {
    'use strict';

    /**
     * ToggleMenuFixed
     *
     * @param {object} toggleMenu
     * @param {object=undefined} options
     *
     * @return {$.ToggleMenuFixed}
     */
    $.ToggleMenuFixed = function (toggleMenu, options) {
        // Héritage
        this.toggleMenu = toggleMenu;
        $.extend($.ToggleMenuFixed.prototype, $.ToggleMenu.prototype);

        // Config
        $.extend(true, this.settings = {}, this.toggleMenu.settings, $.ToggleMenuFixed.defaults, options);

        // Éléments
        this.elements = $.extend(true, {body: $('body')}, this.settings.elements);
        delete this.settings.elements;

        // Variables
        this.events = {};
        this.isOpen = false;

        // Init
        if (this.prepareUserOptions()) {
            this.load();
        }

        return this;
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
        beforeLoad: undefined,
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
         * @return {boolean}
         */
        prepareUserOptions: function () {
            var self = this;

            // Classes
            this.replacePrefixClass();

            // Éléments
            if (self.getElements().toggle === undefined) {
                self.elements.toggle = $('.' + this.settings.classes.prefix + '-toggle');

                if (self.getElements().toggle.length === 0) {
                    self.setLog('Missing elements.toggle parameter', 'error');
                    return false;
                }
            }

            if (self.getElements().menu === undefined) {
                self.setLog('Missing element.menu parameter', 'error');
                return false;
            }

            if (self.getElements().items === undefined) {
                self.elements.items = self.getItemsParent(self.getElements().menu.find('li'));

            } else if (typeof self.getElements().items === 'function') {
                self.elements.items = self.getElements().items();
            }

            return true;
        },

        /**
         * Initialisation
         */
        load: function () {
            // User callback
            if (this.settings.beforeLoad !== undefined) {
                this.settings.beforeLoad.call({
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
                    elements: this.getElements()
                });
            }

            return this;
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
                self.getElements()[element].off(event);
            });
            self.getElements().items.each(function (i, item) {
                self.getElements().itemLink($(item)).off('click.togglemenuFixed');
            });

            return self;
        },

        /**
         * Gestionnaire des événements
         */
        eventsHandler: function () {
            var self = this;

            // Bouton toggle
            if (self.settings.toggle) {
                self.getElements().toggle.on(self.events.toggle = 'click.togglemenuFixed', {self: self}, self.toggle);

            } else {
                self.getElements().menu.on(self.events.menu = 'mouseenter.togglemenuFixed mouseleave.togglemenuFixed', {self: self}, self.toggle);
            }

            // User callback
            if (self.settings.afterEventsHandler !== undefined) {
                self.settings.afterEventsHandler.call({
                    toggleMenuFixed: self,
                    elements: self.getElements(),
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

            if (self.getElements().items.length) {
                self.getElements().items.each(function (i, item) {
                    item = $(item);

                    // Events
                    self.getElements().itemLink(item).on('click.togglemenuFixed', function (event) {
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
                            elements: self.getElements(),
                            item: item
                        });
                    }
                });
            }

            return self;
        },

        /**
         * Ouverture/fermeture du menu
         *
         * @param {object=undefined} event
         */
        toggle: function (event) {
            var self = (event !== undefined && event.data !== undefined && event.data.self !== undefined) ? event.data.self : this;

            // Statut
            self.getElements().body.toggleClass(self.settings.classes.open);
            self.isOpen = self.getElements().body.hasClass(self.settings.classes.open);

            if (!self.isOpen) {
                self.closeSubmenus();
            }

            // User callback
            if (self.settings.onToggle !== undefined) {
                self.settings.onToggle.call({
                    toggleMenuFixed: self,
                    isOpen: self.isOpen
                });
            }

            return self;
        },

        /**
         * Ouverture/fermeture d'un sous-menu
         *
         * @param {object} item Élément parent
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

            return this;
        },

        /**
         * Fermeture des sous menus
         *
         * @param {object=undefined} item Élément parent
         */
        closeSubmenus: function (item) {
            var active = item !== undefined ? item.siblings('.' + this.settings.classes.active) : this.getElements().items;
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

            return this;
        }
    };
})(jQuery);