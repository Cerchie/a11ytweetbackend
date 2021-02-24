const { sqlForPartialUpdate } = require('./partialSql')

describe('sqlForPartialUpdate', function () {
    test('works: 1 item', function () {
        const result = sqlForPartialUpdate(
            { f1: 'v1' },
            { f1: 'f1', fF2: 'f2' }
        )
        expect(result).toEqual({
            setCols: '"f1"=$1',
            values: ['v1'],
        })
    })
})

//test code adapted from Springboard solution code found here https://github.com/Cerchie/react-jobly/blob/main/backend/helpers/sql.test.js
