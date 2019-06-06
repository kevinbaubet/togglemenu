(function ($) {
    'use strict';

    /**
     * ToggleMenuMega
     *
     * @param {object} toggleMenu
     * @param {object=undefined} options
     *
     * @return {$.ToggleMenuMega}
     */
    $.ToggleMenuMega = function (toggleMenu, options) {
        // Héritage
        this.toggleMenu = toggleMenu;
        $.extend($.ToggleMenuMega.prototype, $.ToggleMenu.prototype);

        // Config
        $.extend(true, this.settings = {}, this.toggleMenu.settings, $.ToggleMenuMega.defaults, options);

        // Éléments
        this.elements = $.extend(true, {body: $('body')}, this.settings.elements);
        delete this.settings.elements;

        // Variables
        this.events = {};

        // Init
        if (this.prepareUserOptions()) {
            this.load();
        }

        return this;
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
            overlay: '{prefix}-overlay'
        },
        beforeLoad: undefined,
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
         * @return {boolean}
         */
        prepareUserOptions: function () {
            // Classes
            this.replacePrefixClass();

            if (this.getElements().menu === undefined) {
                this.setLog('Missing elements.menu parameter', 'error');
                return false;
            }

            if (this.getElements().items === undefined) {
                this.setLog('Missing elements.items parameter', 'error');
                return false;
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

            // Suppression des éléments
            if (self.settings.overlay) {
                self.removeOverlay();
            }

            // Désactivation des events
            $.each(self.events, function (element, event) {
                if (self.getElements()[element] !== undefined) {
                    self.getElements()[element].off(event);
                }
            });
            self.getElements().items.each(function (i, item) {
                self.getElements().itemLink($(item)).off('click.togglemenuMega');
            });
            $(document).off('keyup.togglemenuMega');

            return self;
        },

        /**
         * Créer un overlay
         */
        addOverlay: function () {
            this.elements.overlay = $('<div>', {
                'class': this.settings.classes.overlay
            });

            // User callback
            if (this.settings.beforeAddOverlay !== undefined) {
                this.settings.beforeAddOverlay.call({
                    toggleMenuMega: this,
                    overlay: this.getElements().overlay
                });
            }

            // Ajout de l'overlay
            this.getElements().overlay.appendTo(this.getElements().body);

            return this;
        },

        /**
         * Supprime l'overlay
         */
        removeOverlay: function () {
            this.getElements().overlay.remove();

            return this;
        },

        /**
         * Gestionnaire des événements
         */
        eventsHandler: function () {
            var self = this;

            // Fermeture
            if (self.getElements().close !== undefined) {
                self.getElements().close.on(self.events.close = 'click.togglemenuMega', {self: self}, self.toggleSubmenu);
            }

            // Overlay
            if (self.settings.overlay) {
                self.getElements().overlay.on(self.events.overlay = 'click.togglemenuMega', {self: self}, self.toggleSubmenu);
            }

            // User callback
            if (self.settings.afterEventsHandler !== undefined) {
                self.settings.afterEventsHandler.call({
                    toggleMenuMega: self,
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
                    self.getElements().itemLink(item).on('click.togglemenuMega', function (event) {
                        event.preventDefault();
                        self.toggleSubmenu(item);
                    });

                    // User callback
                    if (self.settings.afterItemHandler !== undefined) {
                        self.settings.afterItemHandler.call({
                            toggleMenuMega: self,
                            elements: self.getElements(),
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
         * @param {object=undefined} item Élément parent
         */
        toggleSubmenu: function (item) {
            var self = this;

            if (item !== undefined && item.data !== undefined && item.data.self !== undefined) {
                self = item.data.self;
                item = undefined;
            }
            
            self.closeSubmenus(item);

            if (item !== undefined) {
                item.toggleClass(self.settings.classes.active);

                if (self.settings.overlay) {
                    self.getElements().body.toggleClass(self.settings.classes.open);
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
         * @param {object=undefined} item Élément parent
         */
        closeSubmenus: function (item) {
            var active = item !== undefined ? item.siblings('.' + this.settings.classes.active) : this.getElements().items;
            var activeChildren = active.find('.' + this.settings.classes.active);

            // Suppression de l'état actif sur les frères
            if (active.length) {
                active.removeClass(this.settings.classes.active);

                // Overlay
                if (this.settings.overlay) {
                    this.getElements().body.removeClass(this.settings.classes.open);
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
        }
    };
})(jQuery);