(function ($) {
    'use strict';

    $.ToggleMenuPush = function (toggleMenu, options) {
        // Héritage
        this.toggleMenu = toggleMenu;

        // Config
        $.extend(true, (this.settings = {}), this.toggleMenu.settings, $.ToggleMenuPush.defaults, options);

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

    $.ToggleMenuPush.defaults = {
        elements: {
            content: {
                menu: undefined
            },
            items: undefined,
            itemLink: function (item) {
                return item.children('a');
            },
            itemContent: function (item) {
                return item.children('ul');
            },
            toggle: undefined,
            page: undefined,
            back: undefined,
            backBtn: function (wrapper) {
                return wrapper.children('button');
            }
        },
        layout: 'accordion',
        backLink: false,
        classes: {
            open: 'is-{prefix}Open',
            submenuOpen: 'is-{prefix}SubmenuOpen',
            active: 'is-active',
            copy: '{prefix}-copy',
            back: 'item-back'
        },
        onLoad: undefined,
        beforeWrap: undefined,
        onAddContent: undefined,
        afterEventsHandler: undefined,
        afterItemHandler: undefined,
        onAddItemContent: undefined,
        onComplete: undefined,
        onToggle: undefined,
        onToggleSubmenu: undefined
    };

    $.ToggleMenuPush.prototype = {
        /**
         * Préparation des options utilisateur
         *
         * @return bool
         */
        prepareOptions: function () {
            // Classes
            this.toggleMenu.replacePrefixClass.call(this);

            // Éléments
            if (this.elements.toggle === undefined) {
                this.elements.toggle = $('.' + this.settings.classes.prefix + '-toggle');

                if (this.elements.toggle.length === 0) {
                    this.toggleMenu.setLog('error', 'Missing elements.toggle parameter');
                    return false;
                }
            }

            if (this.elements.content.menu === undefined) {
                this.toggleMenu.setLog('error', 'Missing element.content.menu parameter');
                return false;
            }

            if (this.elements.page === undefined) {
                this.elements.page = this.toggleMenu.elements.body.children('div:first');

                if (this.elements.page.length === 0) {
                    this.toggleMenu.setLog('error', 'Missing element.page parameter');
                    return false;
                }
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
                    toggleMenuPush: this
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
                    toggleMenuPush: this,
                    elements: this.elements,
                    wrapper: this.elements.wrapper
                });
            }

            return this;
        },

        /**
         * Créer un wrapper
         */
        wrap: function () {
            // Wrapper global
            this.elements.wrapper = $('<nav>', {
                'class': 'nav nav--' + this.settings.classes.prefix + 'Push'
            });

            // User callback
            if (this.settings.beforeWrap !== undefined) {
                this.settings.beforeWrap.call({
                    toggleMenuPush: this,
                    wrapper: this.elements.wrapper
                });
            }

            // Ajout du wrapper
            this.elements.wrapper.appendTo(this.toggleMenu.elements.body);

            return this;
        },

        /**
         * Supprime le wrapper
         */
        unWrap: function () {
            this.elements.wrapper.remove();

            return this;
        },

        /**
         * Ajout des contenus dans le wrapper
         */
        addContent: function () {
            var self = this;

            // Contenu utilisateur
            $.each(self.elements.content, function (type, element) {
                var content = null;

                // Copie du contenu
                if (type === 'close') {
                    content = $('<button>', {
                        html: element
                    });
                } else if (typeof element === 'object' && element.length) {
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
                    if (type === 'close' || type === 'menu') {
                        self.elements[type + 'Content'] = content;
                        self.elements[type] = content.parent();
                    }
                    if (type === 'menu') {
                        if (self.elements.items === undefined) {
                            self.elements.items = self.toggleMenu.getItemsParent(content.find('li'));

                        } else if (typeof self.elements.items === 'function') {
                            self.elements.items = self.elements.items(content);
                        }
                    }
                }

                // User callback
                if (self.settings.onAddContent !== undefined) {
                    self.settings.onAddContent.call({
                        toggleMenuPush: self,
                        type: type,
                        element: element,
                        content: content,
                        contentWrapper: self.elements[type]
                    });
                }
            });

            return self;
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

            // Bouton close
            if (self.elements.closeContent !== undefined) {
                self.elements.closeContent.on((self.events.closeContent = 'click.togglemenu.close'), function () {
                    self.toggle();
                });
            }

            // User callback
            if (self.settings.afterEventsHandler !== undefined) {
                self.settings.afterEventsHandler.call({
                    toggleMenuPush: self,
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

                    // Ajout du layout
                    item.layout = self.getItemLayout(item);
                    item.addClass('l-' + item.layout);

                    // Ajout de contenu
                    self.addItemContent(item);

                    // Events
                    self.elements.itemLink(item).on('click.togglemenu.itemLink', function (event) {
                        event.preventDefault();

                        self.toggleSubmenu(item);
                    });

                    // User callback
                    if (self.settings.afterItemHandler !== undefined) {
                        self.settings.afterItemHandler.call({
                            toggleMenuPush: self,
                            elements: self.elements,
                            item: item
                        });
                    }
                });
            }

            return self;
        },

        /**
         * Retourne le layout correspondant à l'item
         *
         * @param  jQueryObject item Élément parent (optionnel)
         * @return string
         */
        getItemLayout: function (item) {
            if (this.settings.layout === 'data' && item !== undefined) {
                var layout = item.attr('data-layout');
                return (layout !== undefined || layout !== '') ? layout : $.ToggleMenuPush.defaults.layout;

            } else {
                return this.settings.layout;
            }
        },

        /**
         * Ajout du contenu pour un item
         *
         * @param jQueryObject item Élément parent
         */
        addItemContent: function (item) {
            var self = this;

            if (item.layout === 'panel') {
                var content = null;

                if (self.elements.back !== undefined) {
                    content = self.elements.back;
                } else {
                    // Container
                    content = $('<li>', {
                        'class': self.settings.classes.back
                    });

                    // Bouton
                    $('<button>', {
                        'class': 'item-btn'
                    }).appendTo(content);

                    // Titre
                    var title = $('<span>', {
                        'class': 'item-title',
                        html: self.elements.itemLink(item).text()
                    }).appendTo(content);

                    // Lien sur le titre
                    if (self.settings.backLink) {
                        title.wrapInner($('<a>', {
                            href: self.elements.itemLink(item).attr('href')
                        }));
                    }
                }

                if (content !== null) {
                    content.prependTo(self.elements.itemContent(item));

                    // Event
                    self.elements.backBtn(content).on('click.togglemenu.backBtn', function () {
                        self.toggleSubmenu(item);
                    });

                    // User callback
                    if (self.settings.onAddItemContent !== undefined) {
                        self.settings.onAddItemContent.call({
                            toggleMenuPush: self,
                            item: item,
                            itemContent: content
                        });
                    }
                }
            }

            return self;
        },

        /**
         * Ouverture/fermeture du menu
         */
        toggle: function () {
            var self = this;

            // Statut
            self.toggleMenu.elements.body.toggleClass(self.settings.classes.open);
            self.isOpen = (self.toggleMenu.elements.body.hasClass(self.settings.classes.open));

            // Événement
            setTimeout(function () {
                if (self.isOpen) {
                    self.elements.page.on((self.events.page = 'click touchstart'), function (event) {
                        event.preventDefault();

                        if (self.isOpen) {
                            self.toggle();
                        }
                    });
                } else {
                    self.elements.page.off(self.events.page);
                    self.closeSubmenus();
                }
            }, 0);

            // User callback
            if (self.settings.onToggle !== undefined) {
                self.settings.onToggle.call({
                    toggleMenuPush: self,
                    body: self.toggleMenu.elements.body,
                    page: self.elements.page,
                    isOpen: self.isOpen
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
            // States
            this.closeSubmenus(item);
            item.toggleClass(this.settings.classes.active);

            if (item.layout !== undefined && item.layout === 'panel') {
                this.elements.wrapper.scrollTop(0);
                this.toggleMenu.elements.body.toggleClass(this.settings.classes.submenuOpen);
            }

            // User callback
            if (this.settings.onToggleSubmenu !== undefined) {
                this.settings.onToggleSubmenu.call({
                    toggleMenuPush: this,
                    item: item
                });
            }

            return this;
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

                // Suppression de l'état d'ouverture d'un sous-menu
                if (this.toggleMenu.elements.body.hasClass(this.settings.classes.submenuOpen)) {
                    this.toggleMenu.elements.body.removeClass(this.settings.classes.submenuOpen);
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
            self.elements.items.each(function (i, item) {
                item = $(item);

                self.elements.itemLink(item).off('click.togglemenu.itemLink');

                if (self.elements.back !== undefined) {
                    self.elements.backBtn(item).off('click.togglemenu.backBtn');
                }
            });

            // Suppression des classes "copy"
            $.each(self.elements.content, function (type, element) {
                if (type !== 'close') {
                    element.removeClass(self.settings.classes.copy);
                }
            });

            return self;
        }
    };
})(jQuery);