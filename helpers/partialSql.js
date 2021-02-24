const { BadRequestError } = require('../expressError')

/**
 * Helper for making selective update queries.
 *
 * The calling function can use it to make the SET clause of an SQL UPDATE
 * statement.
 *
 * @param dataToUpdate {Object} {field1: newVal, field2: newVal, ...}
 * @param jsToSql {Object} maps js-style data fields to database column names,
 * what is jsdoc-- https://medium.com/@imanol_suarez/jsdoc-what-is-that-1d2aa10d9635
 *   like { username: "username" }
 * the param tag allows us to specify the name of the parameter we are documenting https://jsdoc.app/tags-param.html
 * @returns {Object} {sqlSetCols, dataToUpdate}
 *This tag documents the value that a function returns.
 * @example {username: 'Chickens21'} =>
 *   { setCols: '"username"=$1,
 *     values: ['Chickens21'] }
 * https://jsdoc.app/tags-example.html
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
    const keys = Object.keys(dataToUpdate)
    if (keys.length === 0) throw new BadRequestError('No data')

    // {username: 'Chickens21'} => ['"username"=$1']
    const cols = keys.map(
        (colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`
    )

    return {
        setCols: cols.join(', '),
        values: Object.values(dataToUpdate),
    }
}

module.exports = { sqlForPartialUpdate }

//code adapted from Springboard solution to react-jobly https://github.com/Cerchie/react-jobly/blob/main/backend/helpers/sql.js
