(function ($) {
    'use strict';

    $.ToggleMenuOverlay = function (ToggleMenu, options) {
        // Héritage
        this.ToggleMenu = ToggleMenu;

        // Config
        $.extend(true, (this.settings = {}), this.ToggleMenu.settings, $.ToggleMenuOverlay.defaults, options);

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

    $.ToggleMenuOverlay.defaults = {
        elements: {
            content: {
                menu: undefined
            },
            items: undefined,
            itemLink: function (item) {
                return item.children('a');
            },
            toggle: undefined
        },
        closeOnEscape: true,
        classes: {
            open: 'is-{prefix}Open',
            active: 'is-active',
            copy: '{prefix}-copy'
        },
        onLoad: undefined,
        beforeWrap: undefined,
        onAddContent: undefined,
        afterEventsHandler: undefined,
        afterItemHandler: undefined,
        onComplete: undefined,
        onToggle: undefined,
        onToggleSubmenu: undefined
    };

    $.ToggleMenuOverlay.prototype = {
        /**
         * Préparation des options utilisateur
         *
         * @return bool
         */
        prepareOptions: function () {
            // Classes
            this.ToggleMenu.replacePrefixClass.call(this);

            // Éléments
            if (this.elements.toggle === undefined) {
                this.elements.toggle = $('.' + this.settings.classes.prefix + '-toggle');

                if (this.elements.toggle.length === 0) {
                    this.ToggleMenu.setLog('error', 'Missing elements.toggle parameter');
                    return false;
                }
            }

            if (this.elements.content.menu === undefined) {
                this.ToggleMenu.setLog('error', 'Missing elements.content.menu parameter');
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
                    ToggleMenuOverlay: this
                });
            }

            // Load
            this.wrap();
            this.addContent();
            this.eventsHandler();
            this.itemsHandler();

            // User callback
            if (this.settings.onComplete !== undefined) {
                this.settings.onComplete.call({
                    ToggleMenuOverlay: this,
                    elements: this.elements
                });
            }
        },

        /**
         * Créer un wrapper
         */
        wrap: function () {
            // Wrapper global
            this.elements.wrapper = $('<nav>', {
                'class': 'nav nav--' + this.settings.classes.prefix + 'Overlay'
            });

            // User callback
            if (this.settings.beforeWrap !== undefined) {
                this.settings.beforeWrap.call({
                    ToggleMenuOverlay: this,
                    wrapper: this.elements.wrapper
                });
            }

            // Ajout du wrapper
            this.elements.wrapper.appendTo(this.ToggleMenu.elements.body);
        },

        /**
         * Supprime le wrapper
         */
        unWrap: function () {
            this.elements.wrapper.remove();
        },

        /**
         * Ajout les contenus dans le wrapper
         */
        addContent: function () {
            var self = this;

            // Contenu utilisateur
            $.each(self.elements.content, function (type, element) {
                var content = null;

                // Copie du contenu
                if (typeof element === 'object' && element.length) {
                    content = element.clone();
                    content.removeAttr('id');
                    element.addClass(self.settings.classes.copy);
                }

                // Ajout du contenu
                if (content !== undefined && content !== null) {
                    content.appendTo(self.elements.wrapper);
                    content.wrap($('<div>', {
                        'class': self.settings.classes.prefix + '-' + type
                    }));

                    // Ajout des éléments
                    if (type === 'menu') {
                        self.elements[type + 'Content'] = content;
                        self.elements[type] = content.parent();

                        if (self.elements.items === undefined) {
                            self.elements.items = self.ToggleMenu.getItemsParent(content.find('li'));

                        } else if (typeof self.elements.items === 'function') {
                            self.elements.items = self.elements.items(content);
                        }
                    }
                }

                // User callback
                if (self.settings.onAddContent !== undefined) {
                    self.settings.onAddContent.call({
                        ToggleMenuOverlay: self,
                        type: type,
                        element: element,
                        content: content,
                        contentWrapper: self.elements[type]
                    });
                }
            });
        },

        /**
         * Gestionnaire des événements
         */
        eventsHandler: function () {
            var self = this;

            // Bouton toggle
            self.elements.toggle.on((self.events.toggle = 'click.togglemenu.toggle'), function () {
                self.toggle();
            });

            // User callback
            if (self.settings.afterEventsHandler !== undefined) {
                self.settings.afterEventsHandler.call({
                    ToggleMenuOverlay: self,
                    elements: self.elements,
                    events: self.events
                });
            }
        },

        /**
         * Gestionnaire des éléments parent
         */
        itemsHandler: function () {
            var self = this;

            if (self.elements.items.length) {
                self.elements.items.each(function () {
                    var item = $(this);

                    // Events
                    if (self.elements.itemLink !== null) {
                        self.elements.itemLink(item).on('click.togglemenu.itemLink', function (event) {
                            event.preventDefault();

                            if (!self.isOpen) {
                                self.toggle();
                            }
                            self.toggleSubmenu(item);
                        });
                    }

                    // User callback
                    if (self.settings.afterItemHandler !== undefined) {
                        self.settings.afterItemHandler.call({
                            ToggleMenuOverlay: self,
                            elements: self.elements,
                            item: item
                        });
                    }
                });
            }
        },

        /**
         * Ouverture/fermeture du ToggleMenu
         */
        toggle: function () {
            var self = this;

            // Statut
            self.ToggleMenu.elements.body.toggleClass(self.settings.classes.open);
            self.isOpen = (self.ToggleMenu.elements.body.hasClass(self.settings.classes.open));

            // A la fermeture du menu, on ferme tous les sous-menus
            if (!self.isOpen) {
                self.closeSubmenus();
                $(document).off('keyup.togglemenuOverlay');
            }

            // Si le menu est ouvert, on ajoute un événement pour le fermer avec "echap"
            if (self.settings.closeOnEscape && self.isOpen) {
                $(document).one('keyup.togglemenuOverlay', function (keyupEvent) {
                    if (keyupEvent.keyCode === 27) {
                        self.toggle();
                    }
                });
            }

            // User callback
            if (this.settings.onToggle !== undefined) {
                this.settings.onToggle.call({
                    ToggleMenuOverlay: this,
                    body: this.ToggleMenu.elements.body,
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
                    ToggleMenuOverlay: this,
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

            // Suppression des éléments
            self.unWrap();

            // Désactivation des events
            $.each(self.events, function (element, event) {
                self.elements[element].off(event);
            });
            if (self.elements.itemLink !== null) {
                self.elements.items.each(function () {
                    self.elements.itemLink($(this)).off('click.togglemenu.itemLink');
                });
            }
            $(document).off('keyup.togglemenuOverlay');

            // Suppression des classes "copy"
            $.each(self.elements.content, function (type, element) {
                element.removeClass(self.settings.classes.copy);
            });
        }
    };
})(jQuery);