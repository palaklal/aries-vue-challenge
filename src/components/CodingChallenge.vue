<template>
  <div>
    <div id="header">
      <img src="../assets/logo.png">
      <h1>Options Profit Calculator</h1>
    </div>
    <form id="review-form" @submit.prevent="onSubmit">
      <div class="d-flex">
        <div v-for="(option, key) in optionsData" :key="key" class="option col">
          <span class="option-title">OPTION {{ key + 1 }}</span>
          <div class="col">
            <label>Strike Price: </label>
            <input type="number" step=".01" class="strike_price" v-model="option.strike_price">
          </div>
          <div class="col">
            <label>Type: </label>
            <select class="type" v-model="option.type">
              <option>Call</option>
              <option>Put</option>
            </select>
          </div>
          <div class="col">
            <label>Bid: </label>
            <input type="number" step=".01" class="bid" v-model="option.bid">
          </div>
          <div class="col">
            <label>Ask: </label>
            <input type="number" step=".01" class="ask" v-model="option.ask">
          </div>
          <div class="col">
            <label>Long or Short: </label>
            <select class="long_short" v-model="option.long_short">
              <option>Long</option>
              <option>Short</option>
            </select>
          </div>
          <div class="col">
            <label>Expiration Date: </label>
            <input type="date" class="expiration_date" v-model="option.expiration_date">
          </div>
        </div>
      </div>
      <input class="button" type="submit" value="Generate Risk & Reward Graph">  
    </form>  
  </div>
</template>

<script>
export default {
  name: 'CodingChallenge',
  props: {
    optionsData: Array
  },
  data() {
    return this.optionsData
  },
  methods: {
    onSubmit() {
      console.log(this.optionsData)
    },
  }
  }
</script>

  <style scoped>
  #header {
    display: flex;
    align-items: center;
    background-color: #33235E;
    margin-bottom: 0;
  }
  #header img {
    height: 60px;
    margin: 15px;
  }
  #header h1 {
    font-size: 30px;
    color: white;
    font-weight: 600;
    padding-top: 35px;
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
    border-bottom: 1px solid #33235E;
    font-size: 18px;
    font-weight: 500;
    color: #33235E;
    letter-spacing: 1px;
    margin-bottom: 10px;
  }
  label {
    width: 125px;
    text-transform: lowercase;
  }
  input, select {
    margin: .5rem .75rem .5rem 0rem;
    padding-left: 2.5px;
    border-radius: 3.5px;
    width: 8rem;
    height: 2rem;
    box-shadow: 3px 3px 2px 1px #cdd2d2;
    border-width: 1px;
  }
  input:hover, select:hover, input:active, select:active, input:focus-visible, select:focus-visible {
    border-color: #711aff;
    border-width: 2.5px;
  }
  input[type='number'], input[type='date'] {
    padding-left: .5rem;
  }
  input[type='submit'] {
    font-weight: 600;
    font-size: 14px;
    color: #28323e;
    text-transform: uppercase;
    background-color: #0be881;
    padding: 4px 10px;
    margin-top: 30px;
    border-radius: 0px;
    border: none;
    width: 17.5rem;
  }
  input[type="submit"]:hover, input[type="submit"]:active {
    background-color: #711aff;
    color: #fff;
  }
</style>
