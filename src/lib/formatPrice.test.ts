import { describe, expect, it } from 'vitest'
import { formatPrice } from '@/lib/formatPrice'

describe('formatPrice', () => {
  it('formatiert Cent als Euro-Betrag', () => {
    expect(formatPrice(123456)).toBe('1.234,56 €')
  })
})
