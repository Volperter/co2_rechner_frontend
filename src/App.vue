<template>
  <v-app>
    <v-main>
      <header>
        header
      </header>
      <router-view/>
      <v-footer>
        <!-- Footer -->
      </v-footer>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  components: {},

  data: () => ({
    //
  }),
}
</script>
