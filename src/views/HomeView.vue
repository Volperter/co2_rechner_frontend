<template>

  <v-sheet align="center" border>
    CO2-Rechner
  </v-sheet>
<Input></Input>

</template>

<script>
import { defineComponent } from 'vue';
import Input from "@/components/Input.vue";



export default defineComponent({
  name: 'HomeView',

  components: {
    Input
  }
});
</script>

<style>

</style>
