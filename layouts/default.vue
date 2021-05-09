<template>
  <v-app>
    <v-main>
      <Nuxt />
    </v-main>
    <bottom-navigation />
  </v-app>
</template>
<script>
import BottomNavigation from '~/components/BottomNavigation.vue'
export default {
  components: { BottomNavigation },
  data: () => ({ value: 'recent' }),
}
</script>
<style>
html {
  --lh: 1.4rem;
  line-height: var(--lh);
}

.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.single-line-only {
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.double-line-only {
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.v-application .content a {
  color: black !important;
}
</style>
