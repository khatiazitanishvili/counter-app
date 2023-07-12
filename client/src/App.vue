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
      timestampHistory: [],
    };
  },
  mounted() {
    this.fetchCounterValue();
    this.setupWebSocket();
  },
  methods: {
    fetchCounterValue() {
      fetch('http://localhost:3000/counter')
        .then((response) => response.json())
        .then((data) => {
          this.counterValue = data.counter;
          this.timestampHistory = data.timestampHistory;
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
          // No need to update timestampHistory here since it's not shown to the user
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
          // No need to update timestampHistory here since it's not shown to the user
        }
      };
    },
  },
};
</script>
