// LICENSE : MIT
"use strict";
export default class MessageProcessManager {
    /**
     * create MessageProcessManager with processes
     * @param {function(messages: Array)[]} processes
     */
    constructor(processes = []) {
        this._backers = processes;
    }

    add(process) {
        this._backers.push(process);
    }

    remove(process) {
        const index = this._backers.indexOf(process);
        if (index !== -1) {
            this._backers.splice(index, 1);
        }
    }

    /**
     * process `messages` with registered processes
     * @param {TextLintMessage[]} messages
     * @returns {TextLintMessage[]}
     */
    process(messages) {
        const originalMessages = messages;
        if (this._backers === 0) {
            return originalMessages;
        }
        return this._backers.reduce((messages, filter) => {
            return filter(messages);
        }, originalMessages);
    }
}
