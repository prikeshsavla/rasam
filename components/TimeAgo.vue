<template>
  <time :datetime="isoDate">{{ timeAgoString }}</time>
</template>

<script>
import format from '@/services/registerTimeago'

export default {
  props: {
    date: {
      type: [Date, String],
      required: true,
    },
  },
  computed: {
    timeAgoString() {
      return format(this.date, 'slim')
    },
    isoDate() {
      const date =
        typeof this.date === 'object' ? this.date : new Date(this.date)
      return date.toISOString()
    },
  },
  methods: {},
}
</script>

<style></style>
