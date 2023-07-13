<template>
  <div>
    <h2>Counter: {{ counterValue }}</h2>
    <button @click="increaseCounter">Increment</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      counterValue: 0,
    };
  },
  mounted() {
    this.fetchCounterValue();
    this.setupWebSocket();
  },
  methods: {
    fetchCounterValue() {
      fetch('http://localhost:3000')
        .then((response) => response.json())
        .then((data) => {
          this.counterValue = data.counter;
        })
        .catch((error) => {
          console.error('Error fetching counter value:', error);
        });
    },
    increaseCounter() {
      fetch('http://localhost:3000/counter/increase', { method: 'POST' })
        .then((response) => response.json())
        .then((data) => {
          this.counterValue = data.counter;
        })
        .catch((error) => {
          console.error('Error increasing counter:', error);
        });
    },
    setupWebSocket() {
      const socket = new WebSocket('ws://localhost:3000');

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'counterUpdate') {
          this.counterValue = data.counter;
        }
      };
    },
  },
};
</script>
