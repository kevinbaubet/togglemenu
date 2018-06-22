(function ($) {
    'use strict';

    $.ToggleMenuHover = function (toggleMenu, options) {
        // Héritage
        this.toggleMenu = toggleMenu;

        // Config
        $.extend(true, (this.settings = {}), this.toggleMenu.settings, $.ToggleMenuHover.defaults, options);

        // Éléments
        this.elements = this.settings.elements;
        delete this.settings.elements;

        // Variables
        this.currentPosition = {
            x: 0,
            y: 0
        };
        this.previousPosition = {
            x: 0,
            y: 0
        };
        this.events = {};

        // Init
        if (this.prepareOptions()) {
            return this.load();
        }

        return false;
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
        onLoad: undefined,
        afterEventsHandler: undefined,
        onComplete: undefined,
        onOver: undefined,
        onOut: undefined
    };

    $.ToggleMenuHover.prototype = {
        /**
         * Préparation des options utilisateur
         *
         * @return bool
         */
        prepareOptions: function () {
            if (this.elements.menu === undefined) {
                this.toggleMenu.setLog('error', 'Missing elements.menu parameter');
                return false;
            }

            if (this.elements.items === undefined) {
                this.elements.items = this.toggleMenu.getItemsParent(this.elements.menu.find('li'));
            }

            // Si aucun élément parent, pas besoin du display
            if (this.elements.items.length === 0) {
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
                    toggleMenuHover: this
                });
            }

            // Load
            this.eventsHandler();

            // User callback
            if (this.settings.onComplete !== undefined) {
                this.settings.onComplete.call({
                    toggleMenuHover: this,
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

            self.elements.items.on((self.events.items = 'focusin.togglemenu focusout.togglemenu blur.togglemenu mouseenter.togglemenu mouseleave.togglemenu'), function (event) {
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
                    self.setTrackPosition('previous', options.event);

                    // Puis on met à jour cette position pour faire une comparaison
                    options.$item.on('mousemove.togglemenu', function () {
                        self.setTrackPosition('current', options.event);
                    });

                    // Comparaison des positions si l'état hover n'est pas activé
                    if (options.item.hoverState !== true) {
                        options.item.hoverTimeout = setTimeout(function () {
                            self.comparePosition(options);
                        }, self.settings.interval);
                    }

                // Leave
                } else {
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
                self.elements.items.on((self.events.itemsLink = 'click.togglemenu'), self.elements.itemLink, function (event) {
                    event.preventDefault();
                });
            }

            // User callback
            if (self.settings.afterEventsHandler !== undefined) {
                self.settings.afterEventsHandler.call({
                    toggleMenuHover: self,
                    elements: self.elements,
                    events: self.events
                });
            }

            return self;
        },

        /**
         * Récupération de la position courante de la souris
         *
         * @param  string type  Type de position : previous ou current
         * @param  object event Événement courant
         */
        setTrackPosition: function (type, event) {
            type = (type === 'previous') ? 'previousPosition' : 'currentPosition';
            this[type].x = event.pageX;
            this[type].y = event.pageY;

            return this;
        },

        /**
         * Comparaison de la position courante et précédente
         *
         * @param  object options Options de l'item à comparer {event, item, $item}
         * @return function
         */
        comparePosition: function (options) {
            var self = this;
            options.item.hoverTimeout = clearTimeout(options.item.hoverTimeout);

            // Si la comparaison des posisitions est inférieure au paramètre de sensibilité, on active l'item
            if ((Math.abs(self.previousPosition.x - self.currentPosition.x) + Math.abs(self.previousPosition.y - self.currentPosition.y)) < 7) {
                options.$item.off('mousemove.togglemenu');
                options.item.hoverState = true;

                return self.onOver.call($.extend({toggleMenuHover: self}, options));

            } else {
                // On défini les positions précédentes comme actuelles
                self.previousPosition.x = self.currentPosition.x;
                self.previousPosition.y = self.currentPosition.y;

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
        },

        /**
         * Destroy
         */
        unload: function () {
            var self = this;

            // Désactivation des events
            $.each(self.events, function (element, event) {
                self.elements[element].off(event);
            });

            return self;
        }
    };
})(jQuery);