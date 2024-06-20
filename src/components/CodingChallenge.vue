<template>
  <div>
    <div id="header">
      <h1>Options Profit Calculator</h1>
    </div>
    <form id="review-form" @submit.prevent="onSubmit">
      <div class="d-flex">
        <div v-for="(option, key) in options" :key="key" class="option col">
          <span class="option-title">OPTION {{ key + 1 }}</span>
          <div class="col">
            <label>Strike Price: </label>
            <input type="number" step=".01" class="strike_price" v-model="option.strike_price" required>
          </div>
          <div class="col">
            <label>Type: </label>
            <select class="type" v-model="option.type" required>
              <option>Call</option>
              <option>Put</option>
            </select>
          </div>
          <div class="col">
            <label>Bid: </label>
            <input type="number" step=".01" class="bid" v-model="option.bid" required>
          </div>
          <div class="col">
            <label>Ask: </label>
            <input type="number" step=".01" class="ask" v-model="option.ask" required>
          </div>
          <div class="col">
            <label>Long or Short: </label>
            <select class="long_short" v-model="option.long_short" required>
              <option>Long</option>
              <option>Short</option>
            </select>
          </div>
          <div class="col">
            <label>Expiration Date: </label>
            <input type="date" class="expiration_date" v-model="option.expiration_date" required>
          </div>
          <div class="col">
            <button @click.prevent="remove(option)" :disabled="optionsData.length < 2" class="remove">Remove Option</button>
          </div>
        </div>
        <div v-if="optionsData.length < 4" class="option col">
          <div class="add-col col">
            <button @click.prevent="add()" class="add">Add Option</button>
          </div>
        </div>
      </div>
      <input class="button" type="submit" value="Generate Risk & Reward Graph" id="generate_button">  
    </form>
    <div v-show="showGraph" id="results">
      <svg></svg>
      <div id="legend">
        <div><label>Max Profit: </label>${{maxProfit}}</div>
        <div><label>Max Loss: </label>${{maxLoss}}</div>
        <div><label>Break Even Points: </label><span v-if="breakEvenPoints != 'none'">$</span>{{breakEvenPoints}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'CodingChallenge',
  props: {
    optionsData: Array
  },
  mounted() {
    window.addEventListener("resize", this.resizeGraph)
  },
  unmounted() {
    window.removeEventListener("resize", this.resizeGraph)
  },
  data() {
    return {
      options: this.optionsData,
      showGraph: false,
      maxProfit: -1,
      maxLoss: -1,
      breakEvenPoints: -1,
      step: 1
    }
  },
  methods: {
    remove(option) {
      let oi = this.optionsData.findIndex((d) => d.strike_price === option.strike_price && d.type === option.type && d.bid === option.bid && d.ask === option.ask && d.long_short === option.long_short)
      if (oi > -1) this.optionsData.splice(oi, 1)
      else console.error('Could not find option to remove')
    },
    add() {
      this.optionsData.push(
        {
          "strike_price": null, 
          "type": "", 
          "bid": null, 
          "ask": null, 
          "long_short": "", 
          "expiration_date": ""
        }
      )
    },
    onSubmit() {
      this.showGraph = true
      this.drawGraph()
    },
    calculatePrices() {
      const strikes = this.optionsData.map((option) => option.strike_price)
      const minimum = Math.min(...strikes) * .5
      const maximum = Math.max(...strikes) * 1.5
      const step = (maximum - minimum) / 100
      let prices = []
      for (let currentPrice = minimum; currentPrice <= maximum; currentPrice += step) prices.push(currentPrice)
      return prices
    },
    calculateProfits(prices) {
      let profits = []
      for (let price of prices) {
        let totalProfit = 0
        for (let option of this.optionsData) {
          const { strike_price, type, bid, ask, long_short } = option
          const premium = (bid + ask) / 2
          let value = (type.toLocaleLowerCase() === 'call') ?  Math.max((price - strike_price), 0) : Math.max((strike_price - price), 0)
          let profit = (long_short.toLocaleLowerCase() === 'long') ? (value - premium) : (premium - value)
          totalProfit += profit
        }
        profits.push(totalProfit)
      }
      return profits
    },
    drawGraph() {
      /* Given more time, I would add a hover functionality so users could see the the profit at an exact price */
      const prices = this.calculatePrices()
      const profits = this.calculateProfits(prices)
      // Aggregate prices and profits into one data array
      let data = []
      for (let i = 0; i < prices.length; i++) {
        data.push({price: prices[i], profit: profits[i]})
      }
      this.calculateLegend(data, profits)

      const margin = {top: 20, right: 20, bottom: 20, left: 20}
      const width = (window.innerWidth * .66) - margin.left - margin.right
      const height = (window.innerHeight * .66) - margin.top - margin.bottom

      d3.selectAll("svg > *").remove() // reset graph
      const svg = d3
        .select("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("id", "graph")
      const g = svg.append("g")
      
      // Create the Graph Axes
      const x = d3
        .scaleLinear()
        .domain(d3.extent(prices))
        .rangeRound([0, width])

      const y = d3
        .scaleLinear()
        .domain([this.maxLoss - (Math.abs(this.maxLoss) * .125), this.maxProfit * 1.125])
        .rangeRound([height, 0])

      // Create a Line
      const line = d3
        .line()
        .x((d) => x(d.price))
        .y((d) => y(d.profit))

      // Append the Axes to the Graph
      let dollarFormat = (d) => '$' + d

      const xAxis = g.append("g")
        .attr("transform", "translate(50," + (height - 50) + ")")
        .call(d3.axisBottom(x).tickFormat(dollarFormat))
      xAxis.selectAll(".tick text")
        .attr("font-size", "13px")
      xAxis.append("text")
        .attr("fill", "#583689")
        .attr("x", width/2)
        .attr("y", 30)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .attr("font-size", "15px")
        .attr("font-weight", "600")
        .attr("letter-spacing", "1px")
        .text("Price")

      const yAxis = g.append("g")
        .attr("transform", "translate(50, -50)")
        .call(d3.axisLeft(y).tickFormat(dollarFormat))
      yAxis.selectAll(".tick text")
        .attr("font-size", "13px")
      yAxis.append("text")
        .attr("fill", "#583689")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", (height/2 * -1))
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .attr("font-size", "15px")
        .attr("font-weight", "600")
        .attr("letter-spacing", "1px")
        .text("Profit/Loss")

      // Append a path to the Graph
      g.append("path")
        .datum(data)
        .attr("transform", "translate(50, -50)")
        .attr("fill", "none")
        .attr("stroke", "#583689")
        .attr("stroke-width", 2.5)
        .attr("d", line)
        
    },
    calculateLegend(data, profits) {
      this.maxProfit = Math.max(...profits).toFixed(2)
      this.maxLoss = Math.min(...profits).toFixed(2)
      const breakEvenProfitsAndPrices = data.filter((d) => d.profit.toFixed() == 0)
      this.breakEvenPoints =  (breakEvenProfitsAndPrices.length > 0) ? breakEvenProfitsAndPrices.map((d) => d.price.toFixed(2)).join(', ') : 'none'
    },
    resizeGraph() {
      if (this.showGraph) this.drawGraph()
    }
  }
}
</script>

  <style scoped>
  #header {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #35495E;
    margin-bottom: 0;
    border-bottom: 1px solid #cdd2d2;
  }
  #header h1 {
    font-size: 30px;
    color: white;
    font-weight: 600;
    padding-top: 10px;
    letter-spacing: 1px;
  }
  .option {
    padding-top: 30px;
    border-right: 1px solid #e8eaea;
  }
  .option:last-child {
    border-right: none;
  }
  .option:hover {
    background-color: #e8eaea;
  }
  .option-title {
    border-bottom: 1px solid #35495E;
    font-size: 18px;
    font-weight: 500;
    color: #35495E;
    letter-spacing: 1px;
    margin-bottom: 10px;
  }
  label {
    width: 125px;
    text-transform: lowercase;
    display: inline-block;
  }
  input, select, button {
    margin: .5rem .75rem .5rem 0rem;
    padding-left: 2.5px;
    border-radius: 3.5px;
    width: 8rem;
    height: 2rem;
    box-shadow: 3px 3px 2px 1px #cdd2d2;
    border-width: 1px;
  }
  input:hover, select:hover, input:active, select:active, input:focus-visible, select:focus-visible {
    border-color: #583689;
    border-width: 2.5px;
    box-shadow: 4px 4px 2px 2px #cdd2d2;
  }
  input[type='number'], input[type='date'] {
    padding-left: .5rem;
  }
  input[type='submit'], button {
    font-weight: 600;
    font-size: 14px;
    color: #28323e;
    text-transform: uppercase;
    background-color: #41B883;
    padding: 4px 10px;
    margin-top: 30px;
    border-radius: 0px;
    border: none;
    width: 17.5rem;
    cursor: pointer;
  }
  input[type="submit"]:hover, input[type="submit"]:active, button.add:hover, button.add:active {
    background-color: #583689;
    color: #fff;
  }
  button {
    font-size: 12px;
    width: 7.5rem;
    border-radius: 5px;
    padding: 2px 7.5px;
  }
  button.remove {
    background-color: #b84841;
    color: #fff;
  }
  button.remove:hover, button.remove:active {
    opacity: .9;
    border-width: 2.5px;
    box-shadow: 4px 4px 2px 2px #cdd2d2;
  }
  button.remove:disabled {
    opacity: .5;
  }
  .add-col {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  #results {
    display: flex;
    padding: 2.5rem 1.5rem;
    justify-content: space-around;
    background-color: #F5F6F6;
  }
  #legend {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    border: 2px solid #41B883;
    height: 100px;
    padding: .5rem;
    border-radius: 5px;
    box-shadow: 3px 3px 2px 1px #cdd2d2;
    background-color: #fff;
    min-width: 225px;
  }
  #legend:hover {
    border-color: #583689;
    box-shadow: 4px 4px 2px 2px #cdd2d2;
  }
  #legend label {
    width: 9rem;
    text-transform: capitalize;
    color: #000;
    font-weight: 500;
  }

  .d-flex {
    display: flex;
  }
  .col {
    flex: 1 0 0%;
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: 0%;
  }
</style>
