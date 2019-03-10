(function ($) {
    'use strict';

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
        classes: {
            active: 'is-active'
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

            self.getElements().items.on(self.events.items = 'focusin.togglemenu focusout.togglemenu blur.togglemenu mouseenter.togglemenu mouseleave.togglemenu', function (event) {
                var options = {
                    event: $.extend({}, event),
                    item: this,
                    $item: $(event.currentTarget)
                };

                // Clear le timeout de l'item
                if (options.item.hoverTimeout) {
                    options.item.hoverTimeout = clearTimeout(options.item.hoverTimeout);
                }

                // Hover
                if (options.event.type === 'mouseenter' || options.event.type === 'focusin') {
                    // On enregistre la position inital de la souris
                    self.setPosition('previous', options.event);

                    // Puis on met à jour cette position pour faire une comparaison
                    options.$item.on('mousemove.togglemenu', function () {
                        self.setPosition('current', options.event);
                    });

                    // Comparaison des positions si l'état hover n'est pas activé
                    if (options.item.hoverState !== true) {
                        options.item.hoverTimeout = setTimeout(function () {
                            self.comparePosition(options);
                        }, self.settings.interval);
                    }
                }
                // Leave
                else {
                    // Désactivation de l'event mousemove
                    options.$item.off('mousemove.togglemenu');

                    // S'il y a un état hover sur l'item, on execute onOut() après un délai
                    if (options.item.hoverState === true) {
                        options.item.hoverTimeout = setTimeout(function () {
                            options.item.hoverTimeout = clearTimeout(options.item.hoverTimeout);
                            options.item.hoverState = false;

                            return self.onOut.call($.extend({toggleMenuHover: self}, options));
                        }, self.settings.timeout);
                    }
                }
            });

            // Désativation du click sur les items parent
            if (self.settings.disableItemsClick) {
                self.getElements().items.on(self.events.itemsLink = 'click.togglemenu', self.getElements().itemLink, function (event) {
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
         * @param {string} type  Type de position : previous ou current
         * @param {object} event Événement courant
         */
        setPosition: function (type, event) {
            this.position[type].x = event.pageX;
            this.position[type].y = event.pageY;

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
         * @param {object} options Options de l'item à comparer {event, item, $item}
         */
        comparePosition: function (options) {
            var self = this;
            options.item.hoverTimeout = clearTimeout(options.item.hoverTimeout);

            // Si la comparaison des posisitions est inférieure au paramètre de sensibilité, on active l'item
            if ((Math.abs(self.getPosition('previous', 'x') - self.getPosition('current', 'x')) + Math.abs(self.getPosition('previous', 'y') - self.getPosition('current', 'y'))) < 7) {
                options.$item.off('mousemove.togglemenu');
                options.item.hoverState = true;

                return self.onOver.call($.extend({toggleMenuHover: self}, options));

            } else {
                // On défini les positions précédentes comme actuelles
                self.position.previous.x = self.getPosition('current', 'x');
                self.position.previous.y = self.getPosition('current', 'y');

                // Rappel de la méthode
                options.item.hoverTimeout = setTimeout(function () {
                    self.comparePosition(options);
                }, self.settings.interval);
            }

            return self;
        },

        /**
         * Callback au hover
         *
         * @param {toggleMenuHover, options de l'item}
         */
        onOver: function () {
            this.$item.addClass(this.toggleMenuHover.settings.classes.active);

            if (this.toggleMenuHover.settings.onOver !== undefined) {
                this.toggleMenuHover.settings.onOver.call(this);
            }

            return this;
        },

        /**
         * Callback au leave
         *
         * @param {toggleMenuHover, options de l'item}
         */
        onOut: function () {
            this.$item.removeClass(this.toggleMenuHover.settings.classes.active);

            if (this.toggleMenuHover.settings.onOut !== undefined) {
                this.toggleMenuHover.settings.onOut.call(this);
            }

            return this;
        }
    };
})(jQuery);