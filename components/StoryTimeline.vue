<template>
  <div>
    <v-slide-group>
      <v-slide-item v-for="story in stories" :key="story.title">
        <div class="mr-2">
          <nuxt-link :to="'/play-stories?id=' + story.id">
            <v-avatar size="81" color="primary">
              <v-avatar size="77" color="white">
                <v-avatar size="72">
                  <!-- 
                  :color="Math.random() * 10 > 5 ? 'primary' : 'grey'"
                  <v-img
                :src="story.photo"
                gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
              ></v-img> -->
                  <v-img :src="story.photo"></v-img>
                </v-avatar>
              </v-avatar>
            </v-avatar>
          </nuxt-link>
          <div
            class="single-line-only mt-1 text-center"
            style="max-width: 81px; overflow: hidden; font-size: 12px"
          >
            {{ story.title }}
          </div>
        </div>
      </v-slide-item>
    </v-slide-group>
  </div>
</template>

<script>
export default {
  props: {
    stories: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style></style>
