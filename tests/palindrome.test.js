const palindrome = require('../utils/testing').palindrome
const average = require('../utils/testing').average


describe('palindrome',()=>{
    test("palindrome of a",() => {
        const result = palindrome('a')
    
        expect(result).toBe('a')
    })
    
    
    test("palindrome of react",() => {
        const result = palindrome('react')
    
        expect(result).toBe('tcaer')
    })
})

describe('average',()=>{
    test('average of a array is one item',() => {
        const result = average([1])

        expect(result).toBe(1)
    })

    test('average of a array is three items',() => {
        const result = average([1,2,3])

        expect(result).toBe(2)
    })

    test('average of a array zero item',() => {
        const result = average([])

        expect(result).toBe(0)
    })
})