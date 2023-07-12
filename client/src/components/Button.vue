<template>
  <button>{{ label }}</button>
</template>

<script>
export default {
  name: "ButtonComponent",
  props: {
    label: {
      type: String,
      required: true,
    },
  },
};
</script>

<style>
/* Component styles */
</style>
