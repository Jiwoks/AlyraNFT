/**
 * Return the events arguments of an Event from a transaction receipt
 * @param receipt
 * @param eventName
 * @param argName
 * @returns {null|*}
 */
const getTransactionEventReturns = (receipt, eventName, argName = null) => {

    for (const log of receipt.logs) {
        if (log.event !== eventName) {
            continue;
        }

        if (argName !== null) {
            return  log.args[argName];
        }

        return log.args;
    }

    return null;
}

module.exports = {
    getTransactionEventReturns,
}
