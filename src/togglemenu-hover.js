(function ($) {
    'use strict';

    $.ToggleMenuHover = function (ToggleMenu, options) {
        // Héritage
        this.ToggleMenu = ToggleMenu;

        // Config
        $.extend(true, (this.settings = {}), this.ToggleMenu.settings, $.ToggleMenuHover.defaults, options);

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
            this.load();
        }
    };

    $.ToggleMenuHover.defaults = {
        elements: {
            menu: undefined,
            items: undefined,
            itemsLink: undefined
        },
        classes: {
            active: 'is-active'
        },
        disableItemsClick: false,
        interval: 100,
        timeout: 0,
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
                this.ToggleMenu.setLog('error', 'Missing elements.menu parameter');
                return false;
            }

            if (this.elements.items === undefined) {
                this.elements.items = this.ToggleMenu.getItemsParent(this.elements.menu.find('li'));
            }

            // Si aucun élément parent, pas besoin du display
            if (this.elements.items.length === 0) {
                return false;
            }

            if (this.settings.disableItemsClick) {
                if (this.elements.itemsLink === undefined) {
                    this.elements.itemsLink = this.elements.items.children('a');
                }

                if (this.elements.itemsLink.length === 0) {
                    this.ToggleMenu.setLog('error', 'Missing elements.itemsLink parameter');
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
                    ToggleMenuHover: this
                });
            }

            // Load
            this.eventsHandler();

            // User callback
            if (this.settings.onComplete !== undefined) {
                this.settings.onComplete.call({
                    ToggleMenuHover: this,
                    elements: this.elements
                });
            }
        },

        /**
         * Gestionnaire des événements
         */
        eventsHandler: function () {
            var self = this;

            self.elements.items.on((self.events.items = 'focus.togglemenu blur.togglemenu mouseenter.togglemenu mouseleave.togglemenu'), function (event) {
                var options = {
                    event: $.extend({}, event),
                    item: this,
                    $item: $(this)
                };

                // Clear le timeout de l'item
                if (options.item.hoverTimeout) {
                    options.item.hoverTimeout = clearTimeout(options.item.hoverTimeout);
                }

                // Hover
                if (options.event.type === 'mouseenter' || options.event.type === 'focus') {
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

                            return self.onOut.call($.extend({ToggleMenuHover: self}, options));
                        }, self.settings.timeout);
                    }
                }
            });

            // Désativation du click sur les items parent
            if (self.settings.disableItemsClick) {
                self.elements.itemsLink.on((self.events.itemsLink = 'click.togglemenu'), function (event) {
                    event.preventDefault();
                });
            }

            // User callback
            if (self.settings.afterEventsHandler !== undefined) {
                self.settings.afterEventsHandler.call({
                    ToggleMenuHover: self,
                    elements: self.elements,
                    events: self.events
                });
            }
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

                return self.onOver.call($.extend({ToggleMenuHover: self}, options));

            } else {
                // On défini les positions précédentes comme actuelles
                self.previousPosition.x = self.currentPosition.x;
                self.previousPosition.y = self.currentPosition.y;

                // Rappel de la méthode
                options.item.hoverTimeout = setTimeout(function () {
                    self.comparePosition(options);
                }, self.settings.interval);
            }
        },

        /**
         * Callback au hover
         *
         * @param {ToggleMenuHover, options de l'item}
         */
        onOver: function () {
            this.$item.addClass(this.ToggleMenuHover.settings.classes.active);

            if (this.ToggleMenuHover.settings.onOver !== undefined) {
                this.ToggleMenuHover.settings.onOver.call(this);
            }
        },

        /**
         * Callback au leave
         *
         * @param {ToggleMenuHover, options de l'item}
         */
        onOut: function () {
            this.$item.removeClass(this.ToggleMenuHover.settings.classes.active);

            if (this.ToggleMenuHover.settings.onOut !== undefined) {
                this.ToggleMenuHover.settings.onOut.call(this);
            }
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
        }
    };
})(jQuery);