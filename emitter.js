'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = false;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    return {
        listener: {},
        on: function (event, context, handler) {
            // handler.bind(context)();
            if (this.listener[event] === undefined) {
                this.listener[event] = { contexts: new Map() };
            }

            const currentEventContexts = this.listener[event].contexts;

            if (currentEventContexts.get(context) === undefined) {
                currentEventContexts.set(context, []);
            }

            currentEventContexts.get(context).push(handler.bind(context));

            return this;
        },
        off: function (event, context) {
            Object.keys(this.listener).forEach(k => {
                if (k.startsWith(event)) {
                    this.listener[k].contexts.delete(context);
                }
            });

            return this;
        },
        emit: function (event) {
            const eventSplit = event.split(/\./);
            const events = [];
            let currentEvent = '';
            eventSplit.forEach(e => {
                currentEvent += currentEvent.length === 0 ? e : '.' + e;
                events.push(currentEvent);
            });
            events.reverse();
            events.forEach(e => this.emit2(e));

            return this;
        },
        emit2: function (event) {
            if (!this.listener.hasOwnProperty(event)) {
                return this;
            }

            this.listener[event].contexts
                .forEach((v) => {
                    v.forEach(f => f());
                });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         */
        several: function (event, context, handler, times) {
            this.on(event, context,
                function () {
                    if (this.callCount > this.maxCallCount) {
                        return;
                    }
                    this.callCount++;
                    handler(this.context);
                }.bind({ callCount: 0, maxCallCount: times, context: context }));
            console.info(event, context, handler, times);
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
