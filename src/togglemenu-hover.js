(function ($) {
    'use strict';

    /**
     * ToggleMenuHover
     *
     * @param {object} toggleMenu
     * @param {object=undefined} options
     *
     * @return {$.ToggleMenuHover}
     */
    $.ToggleMenuHover = function (toggleMenu, options) {
        // Héritage
        this.toggleMenu = toggleMenu;
        $.extend($.ToggleMenuHover.prototype, $.ToggleMenu.prototype);

        // Config
        $.extend(true, this.settings = {}, this.toggleMenu.settings, $.ToggleMenuHover.defaults, options);

        // Éléments
        this.elements = this.settings.elements;
        delete this.settings.elements;

        // Variables
        this.position = {
            previous: {x: 0, y: 0},
            current: {x: 0, y: 0}
        };
        this.events = {};

        // Init
        if (this.prepareUserOptions()) {
            this.load();
        }

        return this;
    };

    $.ToggleMenuHover.defaults = {
        elements: {
            menu: undefined,
            items: undefined,
            itemLink: '> a'
        },
        disableItemsClick: false,
        interval: 100,
        timeout: 200,
        beforeLoad: undefined,
        afterEventsHandler: undefined,
        onComplete: undefined,
        onOver: undefined,
        onOut: undefined
    };

    $.ToggleMenuHover.prototype = {
        /**
         * Préparation des options utilisateur
         *
         * @return {boolean}
         */
        prepareUserOptions: function () {
            if (this.getElements().menu === undefined) {
                this.setLog('Missing elements.menu parameter', 'error');
                return false;
            }

            if (this.getElements().items === undefined) {
                this.elements.items = this.getItemsParent(this.getElements().menu.find('li'));
            }

            // Si aucun élément parent, pas besoin du menu
            return this.getElements().items.length !== 0;
        },

        /**
         * Initialisation
         */
        load: function () {
            // User callback
            if (this.settings.beforeLoad !== undefined) {
                this.settings.beforeLoad.call({
                    toggleMenuHover: this
                });
            }

            // Load
            this.eventsHandler();

            // User callback
            if (this.settings.onComplete !== undefined) {
                this.settings.onComplete.call({
                    toggleMenuHover: this,
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

            // Désactivation des events
            $.each(self.events, function (element, event) {
                self.getElements()[element].off(event);
            });

            return self;
        },

        /**
         * Gestionnaire des événements
         */
        eventsHandler: function () {
            var self = this;

            self.getElements().items.on(self.events.items = 'focusin.togglemenuHover focusout.togglemenuHover blur.togglemenuHover mouseenter.togglemenuHover mouseleave.togglemenuHover', function (event) {
                var item = {
                    storage: this,
                    element: $(event.currentTarget)
                };

                // Clear le timeout de l'item
                if (item.storage.hoverTimeout) {
                    item.storage.hoverTimeout = clearTimeout(item.storage.hoverTimeout);
                }

                // Hover
                if (event.type === 'mouseenter' || event.type === 'focusin') {
                    // On enregistre la position inital de la souris
                    self.setPosition('previous', {x: event.pageX, y: event.pageY});

                    // Puis on met à jour cette position pour faire une comparaison
                    item.element.on('mousemove.togglemenuHover', function () {
                        self.setPosition('current', {x: event.pageX, y: event.pageY});
                    });

                    // Comparaison des positions si l'état hover n'est pas activé
                    if (item.storage.hoverState !== true) {
                        item.storage.hoverTimeout = setTimeout(function () {
                            self.comparePosition(item);
                        }, self.settings.interval);
                    }
                }
                // Leave
                else {
                    // Désactivation de l'event mousemove
                    item.element.off('mousemove.togglemenuHover');

                    // S'il y a un état hover sur l'item, on execute onOut() après un délai
                    if (item.storage.hoverState === true) {
                        item.storage.hoverTimeout = setTimeout(function () {
                            item.storage.hoverTimeout = clearTimeout(item.storage.hoverTimeout);
                            item.storage.hoverState = false;

                            return self.onOut(item);
                        }, self.settings.timeout);
                    }
                }
            });

            // Désativation du click sur les items parent
            if (self.settings.disableItemsClick) {
                self.getElements().items.on(self.events.itemsLink = 'click.togglemenuHover', self.getElements().itemLink, function (event) {
                    event.preventDefault();
                });
            }

            // User callback
            if (self.settings.afterEventsHandler !== undefined) {
                self.settings.afterEventsHandler.call({
                    toggleMenuHover: self,
                    elements: self.getElements(),
                    events: self.events
                });
            }

            return self;
        },

        /**
         * Récupération de la position courante de la souris
         *
         * @param {string} type Type de position : previous ou current
         * @param {object} pos Positions X,Y
         */
        setPosition: function (type, pos) {
            this.position[type].x = pos.x;
            this.position[type].y = pos.y;

            return this;
        },

        /**
         * Retourne la position enregistrée
         *
         * @param {string} type Type de position : previous ou current
         * @param {string=undefined} axis Axe de position : x ou y
         *
         * @return {int}
         */
        getPosition: function (type, axis) {
            var pos = this.position[type];

            if (axis !== undefined) {
                pos = pos[axis];
            }

            return pos;
        },

        /**
         * Comparaison de la position courante et précédente
         *
         * @param {object} item
         */
        comparePosition: function (item) {
            var self = this;
            item.storage.hoverTimeout = clearTimeout(item.storage.hoverTimeout);

            // Hover
            if ((Math.abs(self.getPosition('previous', 'x') - self.getPosition('current', 'x')) + Math.abs(self.getPosition('previous', 'y') - self.getPosition('current', 'y'))) < 7) {
                item.element.off('mousemove.togglemenuHover');
                item.storage.hoverState = true;

                return self.onOver(item);

            } else {
                // On défini les positions précédentes comme actuelles
                self.setPosition('previous', {
                    x: self.getPosition('current', 'x'),
                    y: self.getPosition('current', 'y')
                });

                // Rappel de la méthode
                item.storage.hoverTimeout = setTimeout(function () {
                    self.comparePosition(item);
                }, self.settings.interval);
            }

            return self;
        },

        /**
         * Callback au hover
         *
         * @param {object} item
         */
        onOver: function (item) {
            item.element.addClass(this.settings.classes.active);

            if (this.settings.onOver !== undefined) {
                this.settings.onOver.call({
                    toggleMenuHover: this,
                    item: item
                });
            }

            return this;
        },

        /**
         * Callback au leave
         *
         * @param {object} item
         */
        onOut: function (item) {
            item.element.removeClass(this.settings.classes.active);

            if (this.settings.onOut !== undefined) {
                this.settings.onOut.call({
                    toggleMenuHover: this,
                    item: item
                });
            }

            return this;
        }
    };
})(jQuery);