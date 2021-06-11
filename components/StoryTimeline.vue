<template>
  <div>
    <v-slide-group>
      <v-slide-item v-for="story in stories" :key="story.title">
        <nuxt-link
          :to="'/stories?id=' + story.id"
          class="black--text text-decoration-none"
        >
          <div class="mr-2">
            <v-avatar size="81" color="primary">
              <v-avatar size="77" color="white">
                <v-avatar size="72">
                  <v-img :src="story.photo"></v-img>
                </v-avatar>
              </v-avatar>
            </v-avatar>

            <div
              class="single-line-only mt-1 text-center"
              style="max-width: 81px; overflow: hidden; font-size: 12px"
            >
              {{ story.title }}
            </div>
          </div>
        </nuxt-link>
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
