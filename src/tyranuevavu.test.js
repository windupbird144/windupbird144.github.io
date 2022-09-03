import { describe, expect, it } from 'vitest'
import * as t from './tyranuevavu'

describe('partition', () => {
    it('item is the first item', () => {
        const result = t.partition([1,2,3],1)
        expect(result).to.deep.eq([[], [2,3]])
    })

    it('item is the last item', () => {
        const result = t.partition([1,2,3],3)
        expect(result).to.deep.eq([[1,2], []])
    })

    it('item is in the middle', () => {
        const result = t.partition([4,-3,0,3,5],0)
        expect(result).to.deep.eq([[4,-3], [3,5]])
    })
})

describe('start game with 2', () => {
    const result = t.computeOdds(2,[])
    it('should be tyranu', () => {
        expect(result.bestChoice).to.eql(t.TYRANU)
    })
    it('should have 0 lower', () => {
        expect(result.actualLower).to.eql(0)
    })
    it('should have 0 lower', () => {
        expect(result.actualHigher).to.eql(48)
    })
})

describe('start game with a', () => {
    const result = t.computeOdds(t.A,[])
    it('should be tyranu', () => {
        expect(result.bestChoice).to.eql(t.EVAVU)
    })
    it('should have 0 lower', () => {
        expect(result.actualLower).to.eql(48)
    })
    it('should have 0 lower', () => {
        expect(result.actualHigher).to.eql(0)
    })
})

describe('no more twos', () => {
    const result = t.computeOdds(3,[2,2,2,2])
    it('should know all the twos are gone', () => {
        expect(result.actualLower).to.eql(0)
    })
})

describe('parse character to card', () => {
    it('accepts T or 0 as 10', () => {
        expect(t.parseCard('T')).to.eq(t.T)
        expect(t.parseCard('0')).to.eq(t.T)
        expect(t.parseCard('1')).to.eq(t.T)
    })
    it('works for cards and numbers', () => {
        expect(t.parseCard('A')).to.eq(t.A)
        expect(t.parseCard('5')).to.eq(5)
    })
    it('ignores 1', () => {
        expect(t.parseCard('x')).to.eq(undefined)
    })
})