import { describe, expect, it } from 'vitest'
import { cn } from '@/lib/cn'

describe('cn', () => {
  it('führt Klassen zusammen und löst Tailwind-Konflikte auf', () => {
    expect(cn('px-4', false, 'px-6')).toBe('px-6')
  })
})
