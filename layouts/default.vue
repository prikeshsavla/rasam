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

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.dxc-login-dlg button {
  padding: 5px;
  margin: 5px;
  border: 1px solid black;
}
</style>
