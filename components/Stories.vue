<template>
  <div>
    <div id="stories" class="storiesWrapper">
      <!-- story -->
      <div
        v-for="story in stories"
        :key="story.id"
        class="story"
        :class="{ seen: story.seen }"
        :data-id="story.id"
        :data-last-updated="story.lastUpdated"
        :data-photo="story.photo"
      >
        <a class="item-link" :href="story.link">
          <span class="item-preview">
            <img :src="story.photo" />
          </span>
          <span
            class="info"
            itemProp="author"
            itemScope=""
            itemType="http://schema.org/Person"
          >
            <strong class="name" itemProp="name">{{ story.name }}</strong>
            <span class="time">{{ story.lastUpdated }}</span>
          </span>
        </a>

        <ul class="items">
          <!-- story item -->
          <li
            v-for="storyItem in story.items"
            :key="storyItem.id"
            :data-id="storyItem.id"
            :data-time="storyItem.time"
            :class="storyItem.seen"
          >
            <a
              :href="storyItem.src"
              :data-type="storyItem.type"
              :data-length="storyItem.length"
              :data-link="storyItem.link"
              :data-linkText="storyItem.linkText"
            >
              <img :src="storyItem.preview" />
            </a>
          </li>
          <!--/ story item -->
        </ul>
      </div>
      <!--/ story -->
    </div>
  </div>
</template>

<script>
import Zuck from "zuck.js";
import css from "zuck.js/dist/zuck.min.css";
import skin from "zuck.js/dist/skins/facesnap.min.css";
export default {
  props: ["stories"],
  async mounted() {
    var stories = new Zuck("stories", {
      backNative: true,
      previousTap: true,
      skin: "facesnap",
      avatars: false,
      list: false,
      autoFullScreen: false,
      cubeEffect: true,
      paginationArrows: false,
      localStorage: true,
      reactive: true,
      template: {
        viewerItemBody(index, currentIndex, item) {
          return `<div 
                    class="item ${get(item, "seen") === true ? "seen" : ""} ${
            currentIndex === index ? "active" : ""
          }"
                    data-time="${get(item, "time")}" data-type="${get(
            item,
            "type"
          )}" data-index="${index}" data-item-id="${get(item, "id")}">
                    <h1> HELLO </h1>
                    ${
                      get(item, "type") === "video"
                        ? `<video class="media" muted webkit-playsinline playsinline preload="auto" src="${get(
                            item,
                            "src"
                          )}" ${get(item, "type")}></video>
                        `
                        : `<img loading="auto" class="media" src="${get(
                            item,
                            "src"
                          )}" ${get(item, "type")} />
                    `
                    }
                    F
                    ${
                      get(item, "link")
                        ? `<a class="tip link" href="${get(
                            item,
                            "link"
                          )}" rel="noopener" target="_blank">
                            ${
                              !get(item, "linkText") ||
                              get(item, "linkText") === ""
                                ? ""
                                : get(item, "linkText")
                            }
                          </a>`
                        : ""
                    }
                  </div>`;
        },
      },
      stories: this.stories || [],
    });
  },
};

const get = function (array, what) {
  if (array) {
    return array[what] || "";
  } else {
    return "";
  }
};
</script>

<style >
.stories.carousel .story > .item-link > .info .name {
  font-size: 0.8em;
}
.storiesWrapper {
  padding: 0;
  max-width: 500px;
  height: 100px;
  margin: 0 auto;
}
</style>
