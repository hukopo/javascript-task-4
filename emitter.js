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
            events.reverse().forEach(e => {
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
                this.forTheFirstNEvents.bind({ callCount: 0, maxCallCount: times,
                    context: context, handler: handler }));

            return this;
        },
        through: function (event, context, handler, frequency) {
            this.on(event, context,
                this.forEveryNthEvent.bind({ callCount: 0, frequency: frequency,
                    context: context, handler: handler }));

            return this;
        },
        forTheFirstNEvents: function () {
            this.callCount++;
            if (this.callCount > this.maxCallCount) {
                return;
            }
            this.handler.call(this.context);
        },
        forEveryNthEvent: function () {
            this.callCount++;
            if (this.callCount % this.frequency !== 1) {
                return;
            }
            this.handler.call(this.context);
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
