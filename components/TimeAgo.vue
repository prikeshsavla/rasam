<template>
  <time :datetime="isoDate">{{ timeAgoString }}</time>
</template>

<script>
import format from "@/plugins/registerTimeago";

export default {
  props: ["date"],
  methods: {},
  computed: {
    timeAgoString() {
      return format(this.date, "slim");
    },
    isoDate() {
      const date =
        typeof this.date === "object" ? this.date : new Date(this.date);
      return date.toISOString();
    },
  },
};
</script>

<style>
</style>