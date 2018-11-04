'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    return {
        listener: {},
        on: function (event, context, handler) {
            if (!this.listener[event]) {
                this.listener[event] = { contexts: new Map() };
            }

            const currentEventContexts = this.listener[event].contexts;

            if (!currentEventContexts.get(context)) {
                currentEventContexts.set(context, []);
            }

            currentEventContexts.get(context).push(handler.bind(context));

            return this;
        },
        off: function (event, context) {
            Object.keys(this.listener).forEach(k => {
                if (k.startsWith(event + '.') || event === k) {
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

            events.forEach(e => {
                if (!this.listener.hasOwnProperty(e)) {
                    return this;
                }

                this.listener[e].contexts
                    .forEach((v) => {
                        v.forEach(f => f());
                    });
            });

            return this;
        },
        several: function (event, context, handler, times) {
            this.on(event, context,
                function () {
                    this.callCount++;
                    if (this.callCount > this.maxCallCount) {
                        return;
                    }
                    handler.call(this.context);
                }.bind({ callCount: 0, maxCallCount: times, context: context }));

            return this;
        },
        through: function (event, context, handler, frequency) {
            this.on(event, context,
                function () {
                    this.callCount++;
                    if (this.callCount % this.frequency !== 1) {
                        return;
                    }
                    handler.call(this.context);
                }.bind({ callCount: 0, frequency: frequency, context: context }));

            return this;
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
