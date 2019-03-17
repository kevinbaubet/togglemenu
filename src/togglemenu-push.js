(function ($) {
    'use strict';

    /**
     * ToggleMenuPush
     *
     * @param {object} toggleMenu
     * @param {object=undefined} options
     *
     * @return {$.ToggleMenuPush}
     */
    $.ToggleMenuPush = function (toggleMenu, options) {
        // Héritage
        this.toggleMenu = toggleMenu;
        $.extend($.ToggleMenuPush.prototype, $.ToggleMenu.prototype);

        // Config
        $.extend(true, this.settings = {}, this.toggleMenu.settings, $.ToggleMenuPush.defaults, options);

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

        return this
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
            submenuOpen: 'is-{prefix}-submenu-open',
            copy: '{prefix}-copy',
            back: 'item-back'
        },
        beforeLoad: undefined,
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
         * @return {boolean}
         */
        prepareUserOptions: function () {
            // Classes
            this.replacePrefixClass();

            // Éléments
            if (this.getElements().toggle === undefined) {
                this.elements.toggle = $('.' + this.settings.classes.prefix + '-toggle');

                if (this.getElements().toggle.length === 0) {
                    this.setLog('Missing elements.toggle parameter', 'error');
                    return false;
                }
            }

            if (this.getContentElements().menu === undefined) {
                this.setLog('Missing elements.content.menu parameter', 'error');
                return false;
            }

            if (this.getElements().page === undefined) {
                this.elements.page = this.getElements().body.children('div:first');

                if (this.getElements().page.length === 0) {
                    this.setLog('Missing elements.page parameter', 'error');
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
            if (this.settings.beforeLoad !== undefined) {
                this.settings.beforeLoad.call({
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

            // Suppression des éléments
            self.unWrap();

            // Désactivation des events
            $.each(self.events, function (element, event) {
                self.getElements()[element].off(event);
            });
            self.getElements().items.each(function (i, item) {
                item = $(item);

                self.getElements().itemLink(item).off('click.togglemenuPush');

                if (self.getElements().back !== undefined) {
                    self.getElements().backBtn(item).off('click.togglemenuPush');
                }
            });

            // Suppression des classes "copy"
            $.each(self.getContentElements(), function (type, element) {
                if (type !== 'close') {
                    element.removeClass(self.settings.classes.copy);
                }
            });

            return self;
        },

        /**
         * Créer un wrapper
         */
        wrap: function () {
            // Wrapper global
            this.elements.wrapper = $('<nav>', {
                'class': this.settings.classes.prefix + ' ' + this.settings.classes.prefix + '--' + this.toggleMenu.menu.current
            });

            // User callback
            if (this.settings.beforeWrap !== undefined) {
                this.settings.beforeWrap.call({
                    toggleMenuPush: this,
                    wrapper: this.getWrapper()
                });
            }

            // Ajout du wrapper
            this.getWrapper().appendTo(this.getElements().body);

            return this;
        },

        /**
         * Supprime le wrapper
         */
        unWrap: function () {
            this.getWrapper().remove();

            return this;
        },

        /**
         * Ajout des contenus dans le wrapper
         */
        addContent: function () {
            var self = this;

            // Contenu utilisateur
            $.each(self.getContentElements(), function (type, element) {
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
                    content.appendTo(self.getWrapper());
                    content.wrap($('<div>', {
                        'class': self.settings.classes.prefix + '-' + type
                    }));

                    // Ajout des éléments
                    if (type === 'close' || type === 'menu') {
                        self.elements[type + 'Content'] = content;
                        self.elements[type] = content.parent();
                    }
                    if (type === 'menu') {
                        if (self.getElements().items === undefined) {
                            self.elements.items = self.getItemsParent(content.find('li'));

                        } else if (typeof self.getElements().items === 'function') {
                            self.elements.items = self.getElements().items(content);
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
                        contentWrapper: self.getElements()[type]
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
            self.getElements().toggle.on(self.events.toggle = 'click.togglemenuPush', {self: self}, self.toggle);

            // Bouton close
            if (self.getElements().closeContent !== undefined) {
                self.getElements().closeContent.on(self.events.closeContent = 'click.togglemenuPush', {self: self}, self.toggle);
            }

            // User callback
            if (self.settings.afterEventsHandler !== undefined) {
                self.settings.afterEventsHandler.call({
                    toggleMenuPush: self,
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

                    // Ajout du layout
                    item.layout = self.getItemLayout(item);
                    item.addClass('l-' + item.layout);

                    // Ajout de contenu
                    self.addItemContent(item);

                    // Events
                    self.getElements().itemLink(item).on('click.togglemenuPush', function (event) {
                        event.preventDefault();

                        self.toggleSubmenu(item);
                    });

                    // User callback
                    if (self.settings.afterItemHandler !== undefined) {
                        self.settings.afterItemHandler.call({
                            toggleMenuPush: self,
                            elements: self.getElements(),
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
         * @param  {object} item Élément parent (optionnel)
         * @return {string}
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
         * @param {object} item Élément parent
         */
        addItemContent: function (item) {
            var self = this;

            if (item.layout === 'panel') {
                var content = null;

                if (self.getElements().back !== undefined) {
                    content = self.getElements().back;
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
                        html: self.getElements().itemLink(item).text()
                    }).appendTo(content);

                    // Lien sur le titre
                    if (self.settings.backLink) {
                        title.wrapInner($('<a>', {
                            href: self.getElements().itemLink(item).attr('href')
                        }));
                    }
                }

                if (content !== null) {
                    content.prependTo(self.getElements().itemContent(item));

                    // Event
                    self.getElements().backBtn(content).on('click.togglemenuPush', function () {
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
        toggle: function (event) {
            var self = (event !== undefined && event.data !== undefined && event.data.self !== undefined) ? event.data.self : this;

            // Statut
            self.getElements().body.toggleClass(self.settings.classes.open);
            self.isOpen = self.getElements().body.hasClass(self.settings.classes.open);

            // Événement
            self.onReady(function () {
                if (self.isOpen) {
                    self.getElements().page.on(self.events.page = 'click.togglemenuPush touchstart.togglemenuPush', function (event) {
                        event.preventDefault();

                        if (self.isOpen) {
                            self.toggle();
                        }
                    });
                } else {
                    self.getElements().page.off(self.events.page);
                    self.closeSubmenus();
                }
            });

            // User callback
            if (self.settings.onToggle !== undefined) {
                self.settings.onToggle.call({
                    toggleMenuPush: self,
                    elements: self.getElements(),
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
            // States
            this.closeSubmenus(item);
            item.toggleClass(this.settings.classes.active);

            if (item.layout !== undefined && item.layout === 'panel') {
                this.getWrapper().scrollTop(0);
                this.getElements().body.toggleClass(this.settings.classes.submenuOpen);
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
         * @param {object=undefined} item Élément parent
         */
        closeSubmenus: function (item) {
            var active = item !== undefined ? item.siblings('.' + this.settings.classes.active) : this.getElements().items;
            var activeChildren = active.find('.' + this.settings.classes.active);

            // Suppression de l'état actif sur les frères
            if (active.length) {
                active.removeClass(this.settings.classes.active);

                // Suppression de l'état d'ouverture d'un sous-menu
                if (this.getElements().body.hasClass(this.settings.classes.submenuOpen)) {
                    this.getElements().body.removeClass(this.settings.classes.submenuOpen);
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