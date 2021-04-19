<template>
  <time :datetime="isoDate">{{ timeAgoString }}</time>
</template>

<script>
import { format, register } from "timeago.js";

const localeFunc = (number, index, totalSec) => {
  // number: the timeago / timein number;
  // index: the index of array below;
  // totalSec: total seconds between date to be formatted and today's date;
  return [
    ["now", "now"],
    ["%ss", "in %ss"],
    ["1min", "in 1min"],
    ["%smin", "in %smin"],
    ["1h", "in 1h"],
    ["%sh", "in %sh"],
    ["1d", "in 1d"],
    ["%sd", "in %sd"],
    ["1w", "in 1w"],
    ["%sw", "in %sw"],
    ["1m", "in 1m"],
    ["%sm", "in %sm"],
    ["1y", "in 1y"],
    ["%sy", "in %sy"],
  ][index];
};
// register your locale with timeago
register("slim", localeFunc);

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