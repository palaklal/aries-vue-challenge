import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CodingChallenge from './CodingChallenge.vue'

const sampleData = [
    {
      "strike_price": 100, 
      "type": "Call", 
      "bid": 10.05, 
      "ask": 12.04, 
      "long_short": "Long", 
      "expiration_date": "2025-12-17"
    },
    {
      "strike_price": 102.50, 
      "type": "Call", 
      "bid": 12.10, 
      "ask": 14, 
      "long_short": "Long", 
      "expiration_date": "2025-12-17"
    },
    {
      "strike_price": 103, 
      "type": "Put", 
      "bid": 14, 
      "ask": 15.50, 
      "long_short": "Short", 
      "expiration_date": "2025-12-17"
    },
    {
      "strike_price": 105, 
      "type": "Put", 
      "bid": 16, 
      "ask": 18, 
      "long_short": "Long", 
      "expiration_date": "2025-12-17"
    }
  ]

describe('Coding Challenge', () => {
    let wrapper
    beforeEach(() => {
        wrapper = mount(CodingChallenge, {
            propsData: {
                optionsData: sampleData
            }
        })
    })

    it('Displays 4 Options', () => {
        expect(wrapper.text()).toContain('OPTION 1')
        expect(wrapper.text()).toContain('OPTION 2')
        expect(wrapper.text()).toContain('OPTION 3')
        expect(wrapper.text()).toContain('OPTION 4')
    })
    it('Prepopulates with Sample Data', () => {
        expect(wrapper.find('.strike_price').element.value).toEqual(sampleData[0].strike_price.toString())
        expect(wrapper.find('.type').element.value).toEqual(sampleData[0].type)
        expect(wrapper.find('.bid').element.value).toEqual(sampleData[0].bid.toString())
        expect(wrapper.find('.ask').element.value).toEqual(sampleData[0].ask.toString())
        expect(wrapper.find('.long_short').element.value).toEqual(sampleData[0].long_short)
        expect(wrapper.find('.expiration_date').element.value).toEqual(sampleData[0].expiration_date.toString())
    })
    it('Loads Graph upon Button Click', async () => {
        const button = wrapper.find('#generate_button')
        expect(wrapper.find('svg').isVisible()).toBe(false)
        await button.trigger('click')
        expect(wrapper.find('svg').isVisible()).toBe(false)
    })
})
