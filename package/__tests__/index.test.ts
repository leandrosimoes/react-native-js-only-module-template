import { sayHello } from '../src/index'

describe('index.ts', () => {
    it('should pass', () => {
        const name = 'Leandro'
        const expectedResult = `Hello ${name}!`
        const result = sayHello('Leandro')
        
        expect(result).toEqual(expectedResult)
    })
})
