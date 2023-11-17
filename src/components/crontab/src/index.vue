<style lang="scss">
.no-vue3-cron-div {
  .language {
    position: absolute;
    right: 25px;
    z-index: 1;
  }

  .el-tabs {
    box-shadow: none;
  }

  .tabBody {
    overflow: auto;

    .el-row {
      margin: 20px 0;

      .long {
        margin-right: 2px;
      }

      .el-input-number {
        width: 120px;
      }
    }
  }

  .myScroller {
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 1px;
    }

    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      background-color: skyblue;
      background-image: -webkit-linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.2) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, 0.2) 50%,
        rgba(255, 255, 255, 0.2) 75%,
        transparent 75%,
        transparent
      );
    }

    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: #ededed;
      border-radius: 10px;
    }
  }

  .bottom {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: white;
    border: 1px solid var(--el-border-color);
    border-top: 0;

    .value {
      float: left;
      font-size: 14px;
      vertical-align: middle;

      span:nth-child(1) {
        color: red;
      }
    }
  }
}
</style>
<template>
  <div class="no-vue3-cron-div">
    <el-button class="language" v-show="enableI18n" link @click="state.language = state.language === 'en' ? 'cn' : 'en'">{{
      state.language === "en" ? "cn" : "en"
    }}</el-button>
    <el-tabs type="border-card">
      <el-tab-pane>
        <template #label>
          <span><i class="el-icon-date" /> {{ state.text.Seconds.name }}</span>
        </template>
        <div class="tabBody myScroller" :style="{ 'max-height': maxHeight }">
          <el-row>
            <el-radio v-model="state.second.cronEvery" label="1">{{ state.text.Seconds.every }} </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="state.second.cronEvery" label="2"
              >{{ state.text.Seconds.interval[0] }}
              <el-input-number v-model="state.second.incrementIncrement" :min="1" :max="60" />
              {{ state.text.Seconds.interval[1] || "" }}
              <el-input-number v-model="state.second.incrementStart" :min="0" :max="59" />
              {{ state.text.Seconds.interval[2] || "" }}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio class="long" v-model="state.second.cronEvery" label="3">{{ state.text.Seconds.specific }} </el-radio>
            <el-select multiple collapse-tags max-collapse-tags="2" v-model="state.second.specificSpecific" :teleported="false">
              <el-option v-for="(val, index) in 60" :key="index" :value="val - 1">{{ val - 1 }} </el-option>
            </el-select>
          </el-row>
          <el-row>
            <el-radio v-model="state.second.cronEvery" label="4"
              >{{ state.text.Seconds.cycle[0] }}
              <el-input-number v-model="state.second.rangeStart" :min="1" :max="60" />
              {{ state.text.Seconds.cycle[1] || "" }}
              <el-input-number v-model="state.second.rangeEnd" :min="0" :max="59" />
              {{ state.text.Seconds.cycle[2] || "" }}
            </el-radio>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <span><i class="el-icon-date" /> {{ state.text.Minutes.name }}</span>
        </template>
        <div class="tabBody myScroller" :style="{ 'max-height': maxHeight }">
          <el-row>
            <el-radio v-model="state.minute.cronEvery" label="1">{{ state.text.Minutes.every }} </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="state.minute.cronEvery" label="2"
              >{{ state.text.Minutes.interval[0] }}
              <el-input-number v-model="state.minute.incrementIncrement" :min="1" :max="60" />
              {{ state.text.Minutes.interval[1] }}
              <el-input-number v-model="state.minute.incrementStart" :min="0" :max="59" />
              {{ state.text.Minutes.interval[2] || "" }}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio class="long" v-model="state.minute.cronEvery" label="3">{{ state.text.Minutes.specific }} </el-radio>
            <el-select multiple v-model="state.minute.specificSpecific" :teleported="false">
              <el-option v-for="(val, index) in 60" :key="index" :value="val - 1">{{ val - 1 }} </el-option>
            </el-select>
          </el-row>
          <el-row>
            <el-radio v-model="state.minute.cronEvery" label="4"
              >{{ state.text.Minutes.cycle[0] }}
              <el-input-number v-model="state.minute.rangeStart" :min="1" :max="60" />
              {{ state.text.Minutes.cycle[1] }}
              <el-input-number v-model="state.minute.rangeEnd" :min="0" :max="59" />
              {{ state.text.Minutes.cycle[2] }}
            </el-radio>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <span><i class="el-icon-date" /> {{ state.text.Hours.name }}</span>
        </template>
        <div class="tabBody myScroller" :style="{ 'max-height': maxHeight }">
          <el-row>
            <el-radio v-model="state.hour.cronEvery" label="1">{{ state.text.Hours.every }} </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="state.hour.cronEvery" label="2"
              >{{ state.text.Hours.interval[0] }}
              <el-input-number v-model="state.hour.incrementIncrement" :min="0" :max="23" />
              {{ state.text.Hours.interval[1] }}
              <el-input-number v-model="state.hour.incrementStart" :min="0" :max="23" />
              {{ state.text.Hours.interval[2] }}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio class="long" v-model="state.hour.cronEvery" label="3">{{ state.text.Hours.specific }} </el-radio>
            <el-select multiple v-model="state.hour.specificSpecific" :teleported="false">
              <el-option v-for="(val, index) in 24" :key="index" :value="val - 1">{{ val - 1 }} </el-option>
            </el-select>
          </el-row>
          <el-row>
            <el-radio v-model="state.hour.cronEvery" label="4"
              >{{ state.text.Hours.cycle[0] }}
              <el-input-number v-model="state.hour.rangeStart" :min="0" :max="23" />
              {{ state.text.Hours.cycle[1] }}
              <el-input-number v-model="state.hour.rangeEnd" :min="0" :max="23" />
              {{ state.text.Hours.cycle[2] }}
            </el-radio>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <span><i class="el-icon-date" /> {{ state.text.Day.name }}</span>
        </template>
        <div class="tabBody myScroller" :style="{ 'max-height': maxHeight }">
          <el-row>
            <el-radio v-model="state.day.cronEvery" label="1">{{ state.text.Day.every }} </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="state.day.cronEvery" label="2"
              >{{ state.text.Day.intervalWeek[0] }}
              <el-input-number v-model="state.week.incrementIncrement" :min="1" :max="7" />
              {{ state.text.Day.intervalWeek[1] }}
              <el-select v-model="state.week.incrementStart" :teleported="false">
                <el-option v-for="(val, index) in 7" :key="index" :label="state.text.Week[val - 1]" :value="val" />
              </el-select>
              {{ state.text.Day.intervalWeek[2] }}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="state.day.cronEvery" label="3"
              >{{ state.text.Day.intervalDay[0] }}
              <el-input-number v-model="state.day.incrementIncrement" :min="1" :max="31" />
              {{ state.text.Day.intervalDay[1] }}
              <el-input-number v-model="state.day.incrementStart" :min="1" :max="31" />
              {{ state.text.Day.intervalDay[2] }}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio class="long" v-model="state.day.cronEvery" label="4">{{ state.text.Day.specificWeek }} </el-radio>
            <el-select multiple v-model="state.week.specificSpecific" :teleported="false">
              <el-option
                v-for="(val, index) in 7"
                :key="index"
                :label="state.text.Week[val - 1]"
                :value="['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][val - 1]"
              />
            </el-select>
          </el-row>
          <el-row>
            <el-radio class="long" v-model="state.day.cronEvery" label="5">{{ state.text.Day.specificDay }} </el-radio>
            <el-select multiple v-model="state.day.specificSpecific" :teleported="false">
              <el-option v-for="(val, index) in 31" :key="index" :value="val">{{ val }} </el-option>
            </el-select>
          </el-row>
          <el-row>
            <el-radio v-model="state.day.cronEvery" label="6">{{ state.text.Day.lastDay }} </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="state.day.cronEvery" label="7">{{ state.text.Day.lastWeekday }} </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="state.day.cronEvery" label="8"
              >{{ state.text.Day.lastWeek[0] }}
              <el-select v-model="state.week.cronLastSpecificDomDay" :teleported="false">
                <el-option v-for="(val, index) in 7" :key="index" :label="state.text.Week[val - 1]" :value="val" />
              </el-select>
              {{ state.text.Day.lastWeek[1] || "" }}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="state.day.cronEvery" label="9">
              <el-input-number v-model="state.day.cronDaysBeforeEomMinus" :min="1" :max="31" />
              {{ state.text.Day.beforeEndMonth[0] }}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="state.day.cronEvery" label="10"
              >{{ state.text.Day.nearestWeekday[0] }}
              <el-input-number v-model="state.day.cronDaysNearestWeekday" :min="1" :max="31" />
              {{ state.text.Day.nearestWeekday[1] }}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="state.day.cronEvery" label="11"
              >{{ state.text.Day.someWeekday[0] }}
              <el-input-number v-model="state.week.cronNthDayNth" :min="1" :max="5" />
              <el-select v-model="state.week.cronNthDayDay" :teleported="false">
                <el-option v-for="(val, index) in 7" :key="index" :label="state.text.Week[val - 1]" :value="val" />
              </el-select>
              {{ state.text.Day.someWeekday[1] }}
            </el-radio>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <span><i class="el-icon-date" /> {{ state.text.Month.name }}</span>
        </template>
        <div class="tabBody myScroller" :style="{ 'max-height': maxHeight }">
          <el-row>
            <el-radio v-model="state.month.cronEvery" label="1">{{ state.text.Month.every }} </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="state.month.cronEvery" label="2"
              >{{ state.text.Month.interval[0] }}
              <el-input-number v-model="state.month.incrementIncrement" :min="0" :max="12" />
              {{ state.text.Month.interval[1] }}
              <el-input-number v-model="state.month.incrementStart" :min="0" :max="12" />
            </el-radio>
          </el-row>
          <el-row>
            <el-radio class="long" v-model="state.month.cronEvery" label="3">{{ state.text.Month.specific }} </el-radio>
            <el-select multiple v-model="state.month.specificSpecific" :teleported="false">
              <el-option v-for="(val, index) in 12" :key="index" :label="val" :value="val" />
            </el-select>
          </el-row>
          <el-row>
            <el-radio v-model="state.month.cronEvery" label="4"
              >{{ state.text.Month.cycle[0] }}
              <el-input-number v-model="state.month.rangeStart" :min="1" :max="12" />
              {{ state.text.Month.cycle[1] }}
              <el-input-number v-model="state.month.rangeEnd" :min="1" :max="12" />
            </el-radio>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <span><i class="el-icon-date" /> {{ state.text.Year.name }}</span>
        </template>
        <div class="tabBody myScroller" :style="{ 'max-height': maxHeight }">
          <el-row>
            <el-radio v-model="state.year.cronEvery" label="1">{{ state.text.Year.every }} </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="state.year.cronEvery" label="2"
              >{{ state.text.Year.interval[0] }}
              <el-input-number v-model="state.year.incrementIncrement" :min="1" :max="99" />
              {{ state.text.Year.interval[1] }}
              <el-input-number v-model="state.year.incrementStart" :min="2018" :max="2118" />
            </el-radio>
          </el-row>
          <el-row>
            <el-radio class="long" v-model="state.year.cronEvery" label="3">{{ state.text.Year.specific }} </el-radio>
            <el-select filterable multiple v-model="state.year.specificSpecific" :teleported="false">
              <el-option v-for="(val, index) in 100" :key="index" :label="2017 + val" :value="2017 + val" />
            </el-select>
          </el-row>
          <el-row>
            <el-radio v-model="state.year.cronEvery" label="4"
              >{{ state.text.Year.cycle[0] }}
              <el-input-number v-model="state.year.rangeStart" :min="2018" :max="2118" />
              {{ state.text.Year.cycle[1] }}
              <el-input-number v-model="state.year.rangeEnd" :min="2018" :max="2118" />
            </el-radio>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-footer class="bottom" v-show="showBottom">
      <div class="value">
        <span> cron预览: </span>
        <el-tag type="info">
          {{ state.cron }}
        </el-tag>
      </div>
      <div class="buttonDiv">
        <el-button type="primary" size="default" @click.stop="handleSave">{{ state.text.Save }}</el-button>
        <el-button type="primary" size="default" @click="close">{{ state.text.Close }}</el-button>
      </div>
    </el-footer>
  </div>
</template>
<script>
import Language from "./language";
import { watch, reactive, computed, toRefs, defineComponent } from "vue";

export default defineComponent({
  name: "noVue3Cron",
  props: {
    cronValue: String,
    i18n: {},
    enableI18n: {
      type: Boolean,
      default: false
    },
    showBottom: {
      type: Boolean,
      default: true
    },
    maxHeight: {}
  },
  setup(props, { emit }) {
    const { i18n } = toRefs(props);
    const state = reactive({
      language: i18n.value,
      second: {
        cronEvery: "1",
        incrementStart: 3,
        incrementIncrement: 5,
        rangeStart: 0,
        rangeEnd: 0,
        specificSpecific: []
      },
      minute: {
        cronEvery: "1",
        incrementStart: 3,
        incrementIncrement: 5,
        rangeStart: 0,
        rangeEnd: 0,
        specificSpecific: []
      },
      hour: {
        cronEvery: "1",
        incrementStart: 3,
        incrementIncrement: 5,
        rangeStart: 0,
        rangeEnd: 0,
        specificSpecific: []
      },
      day: {
        cronEvery: "1",
        incrementStart: 1,
        incrementIncrement: 1,
        rangeStart: 0,
        rangeEnd: 0,
        specificSpecific: [],
        cronDaysBeforeEomMinus: 0,
        cronDaysNearestWeekday: 0
      },
      week: {
        cronEvery: "1",
        incrementStart: 1,
        incrementIncrement: 1,
        specificSpecific: [],
        cronLastSpecificDomDay: 1,
        cronNthDayDay: 1,
        cronNthDayNth: 1
      },
      month: {
        cronEvery: "1",
        incrementStart: 3,
        incrementIncrement: 5,
        rangeStart: 0,
        rangeEnd: 0,
        specificSpecific: []
      },
      year: {
        cronEvery: "1",
        incrementStart: 2017,
        incrementIncrement: 1,
        rangeStart: 0,
        rangeEnd: 0,
        specificSpecific: []
      },
      output: {
        second: "",
        minute: "",
        hour: "",
        day: "",
        month: "",
        Week: "",
        year: ""
      },
      text: computed(() => Language[state.language || "cn"]),
      secondsText: computed(() => {
        let seconds = "";
        const cronEvery = state.second.cronEvery;
        switch (cronEvery.toString()) {
          case "1":
            seconds = "*";
            break;
          case "2":
            seconds = state.second.incrementStart + "/" + state.second.incrementIncrement;
            break;
          case "3":
            state.second.specificSpecific.map((val) => {
              seconds += val + ",";
            });
            seconds = seconds.slice(0, -1);
            break;
          case "4":
            seconds = state.second.rangeStart + "-" + state.second.rangeEnd;
            break;
        }
        return seconds;
      }),
      minutesText: computed(() => {
        let minutes = "";
        const cronEvery = state.minute.cronEvery;
        switch (cronEvery.toString()) {
          case "1":
            minutes = "*";
            break;
          case "2":
            minutes = state.minute.incrementStart + "/" + state.minute.incrementIncrement;
            break;
          case "3":
            state.minute.specificSpecific.map((val) => {
              minutes += val + ",";
            });
            minutes = minutes.slice(0, -1);
            break;
          case "4":
            minutes = state.minute.rangeStart + "-" + state.minute.rangeEnd;
            break;
        }
        return minutes;
      }),
      hoursText: computed(() => {
        let hours = "";
        const cronEvery = state.hour.cronEvery;
        switch (cronEvery.toString()) {
          case "1":
            hours = "*";
            break;
          case "2":
            hours = state.hour.incrementStart + "/" + state.hour.incrementIncrement;
            break;
          case "3":
            state.hour.specificSpecific.map((val) => {
              hours += val + ",";
            });
            hours = hours.slice(0, -1);
            break;
          case "4":
            hours = state.hour.rangeStart + "-" + state.hour.rangeEnd;
            break;
        }
        return hours;
      }),
      daysText: computed(() => {
        let days = "";
        const cronEvery = state.day.cronEvery;
        switch (cronEvery.toString()) {
          case "1":
            break;
          case "2":
          case "4":
          case "11":
          case "8":
            days = "?";
            break;
          case "3":
            days = state.day.incrementStart + "/" + state.day.incrementIncrement;
            break;
          case "5":
            state.day.specificSpecific.map((val) => {
              days += val + ",";
            });
            days = days.slice(0, -1);
            break;
          case "6":
            days = "L";
            break;
          case "7":
            days = "LW";
            break;
          case "9":
            days = "L-" + state.day.cronDaysBeforeEomMinus;
            break;
          case "10":
            days = state.day.cronDaysNearestWeekday + "W";
            break;
        }
        return days;
      }),
      weeksText: computed(() => {
        let weeks = "";
        const cronEvery = state.day.cronEvery;
        switch (cronEvery.toString()) {
          case "1":
          case "3":
          case "5":
            weeks = "?";
            break;
          case "2":
            weeks = state.week.incrementStart + "/" + state.week.incrementIncrement;
            break;
          case "4":
            state.week.specificSpecific.map((val) => {
              weeks += val + ",";
            });
            weeks = weeks.slice(0, -1);
            break;
          case "6":
          case "7":
          case "9":
          case "10":
            weeks = "?";
            break;
          case "8":
            weeks = state.week.cronLastSpecificDomDay + "L";
            break;
          case "11":
            weeks = state.week.cronNthDayDay + "#" + state.week.cronNthDayNth;
            break;
        }
        return weeks;
      }),
      monthsText: computed(() => {
        let months = "";
        const cronEvery = state.month.cronEvery;
        switch (cronEvery.toString()) {
          case "1":
            months = "*";
            break;
          case "2":
            months = state.month.incrementStart + "/" + state.month.incrementIncrement;
            break;
          case "3":
            state.month.specificSpecific.map((val) => {
              months += val + ",";
            });
            months = months.slice(0, -1);
            break;
          case "4":
            months = state.month.rangeStart + "-" + state.month.rangeEnd;
            break;
        }
        return months;
      }),
      yearsText: computed(() => {
        let years = "";
        const cronEvery = state.year.cronEvery;
        switch (cronEvery.toString()) {
          case "1":
            years = "*";
            break;
          case "2":
            years = state.year.incrementStart + "/" + state.year.incrementIncrement;
            break;
          case "3":
            state.year.specificSpecific.map((val) => {
              years += val + ",";
            });
            years = years.slice(0, -1);
            break;
          case "4":
            years = state.year.rangeStart + "-" + state.year.rangeEnd;
            break;
        }
        return years;
      }),
      cron: computed(() => {
        return `${state.secondsText || "*"} ${state.minutesText || "*"} ${state.hoursText || "*"} ${state.daysText || "*"} ${
          state.monthsText || "*"
        } ${state.weeksText || "?"} ${state.yearsText || "*"}`;
      })
    });
    watch(
      () => props.cronValue,
      (newCron) => {
        if (typeof newCron !== "string" || !newCron) return false;
        const crons = newCron.split(" ");
        // 解析seconds
        const secondsText = crons[0].trim();
        if (secondsText === "*") {
          state.second.cronEvery = "1";
        } else if (secondsText.includes("/")) {
          state.second.cronEvery = "2";
          const secondsTexts = secondsText.split("/");
          state.second.incrementStart = parseInt(secondsTexts[0]);
          state.second.incrementIncrement = parseInt(secondsTexts[1]);
        } else if (secondsText.includes(",") || isFinite(secondsText)) {
          state.second.cronEvery = "3";
          state.second.specificSpecific = secondsText.split(",").map((item) => parseInt(item));
        } else if (secondsText.includes("-")) {
          state.second.cronEvery = "4";
          const secondsTexts = secondsText.split("-");
          state.second.rangeStart = parseInt(secondsTexts[0]);
          state.second.rangeEnd = parseInt(secondsTexts[1]);
        }
        // 解析minutes
        const minutesText = crons[1].trim();
        if (minutesText === "*") {
          state.minute.cronEvery = "1";
        } else if (minutesText.includes("/")) {
          state.minute.cronEvery = "2";
          const minutesTexts = minutesText.split("/");
          state.minute.incrementStart = parseInt(minutesTexts[0]);
          state.minute.incrementIncrement = parseInt(minutesTexts[1]);
        } else if (minutesText.includes(",") || isFinite(minutesText)) {
          state.minute.cronEvery = "3";
          state.minute.specificSpecific = minutesText.split(",").map((item) => parseInt(item));
        } else if (minutesText.includes("-")) {
          state.minute.cronEvery = "4";
          const minutesTexts = minutesText.split("-");
          state.minute.rangeStart = parseInt(minutesTexts[0]);
          state.minute.rangeEnd = parseInt(minutesTexts[1]);
        }
        // 解析hours
        const hoursText = crons[2].trim();
        if (hoursText === "*") {
          state.hour.cronEvery = "1";
        } else if (hoursText.includes("/")) {
          state.hour.cronEvery = "2";
          const hoursTexts = hoursText.split("/");
          state.hour.incrementStart = parseInt(hoursTexts[0]);
          state.hour.incrementIncrement = parseInt(hoursTexts[1]);
        } else if (hoursText.includes(",") || isFinite(hoursText)) {
          state.hour.cronEvery = "3";
          state.hour.specificSpecific = hoursText.split(",").map((item) => parseInt(item));
        } else if (hoursText.includes("-")) {
          state.hour.cronEvery = "4";
          const hoursTexts = hoursText.split("-");
          state.hour.rangeStart = parseInt(hoursTexts[0]);
          state.hour.rangeEnd = parseInt(hoursTexts[1]);
        }
        // 解析days weeks
        const daysText = crons[3].trim();
        const weeksText = crons[5].trim();
        if (daysText.includes("/")) {
          state.day.cronEvery = "3";
          const daysTexts = daysText.split("/");
          state.day.incrementStart = parseInt(daysTexts[0]);
          state.day.incrementIncrement = parseInt(daysTexts[1]);
        } else if (daysText.includes(",") || isFinite(daysText)) {
          state.day.cronEvery = "5";
          state.day.specificSpecific = daysText.split(",").map((item) => parseInt(item));
        } else if (daysText === "L") {
          state.day.cronEvery = "6";
        } else if (daysText === "LW") {
          state.day.cronEvery = "7";
        } else if (daysText.startsWith("L-")) {
          state.day.cronEvery = "9";
          state.day.cronDaysBeforeEomMinus = parseInt(daysText.replaceAll("L-", ""));
        } else if (daysText.endsWith("W")) {
          state.day.cronEvery = "10";
          state.day.cronDaysNearestWeekday = parseInt(daysText.replaceAll("W", ""));
        } else if (daysText === "?") {
          if (weeksText.includes("/")) {
            state.day.cronEvery = "2";
            const weeksTexts = weeksText.split("/");
            state.week.incrementStart = parseInt(weeksTexts[0]);
            state.week.incrementIncrement = parseInt(weeksTexts[1]);
          } else if (weeksText.includes(",") || isFinite(weeksText)) {
            state.day.cronEvery = "4";
            state.week.specificSpecific = weeksText.split(",").map((item) => item);
          } else if (weeksText.includes("#")) {
            state.day.cronEvery = "11";
            const weeksTexts = weeksText.split("#");
            state.week.cronNthDayDay = parseInt(weeksTexts[0]);
            state.week.cronNthDayNth = parseInt(weeksTexts[1]);
          } else if (weeksText.endsWith("L")) {
            state.day.cronEvery = "8";
            state.week.cronLastSpecificDomDay = parseInt(weeksText.replaceAll("L", ""));
          }
        } else {
          state.day.cronEvery = "1";
        }

        // 解析months
        const monthsText = crons[4].trim();
        if (monthsText === "*") {
          state.month.cronEvery = "1";
        } else if (monthsText.includes("/")) {
          state.month.cronEvery = "2";
          const monthsTexts = monthsText.split("/");
          state.month.incrementStart = parseInt(monthsTexts[0]);
          state.month.incrementIncrement = parseInt(monthsTexts[1]);
        } else if (monthsText.includes(",") || isFinite(monthsText)) {
          state.month.cronEvery = "3";
          state.month.specificSpecific = monthsText.split(",").map((item) => parseInt(item));
        } else if (monthsText.includes("-")) {
          state.month.cronEvery = "4";
          const monthsTexts = monthsText.split("-");
          state.month.rangeStart = parseInt(monthsTexts[0]);
          state.month.rangeEnd = parseInt(monthsTexts[1]);
        }
        // 解析years
        const yearsText = crons[6].trim();
        if (yearsText === "*") {
          state.year.cronEvery = "1";
        } else if (yearsText.includes("/")) {
          state.year.cronEvery = "2";
          const yearsTexts = yearsText.split("/");
          state.year.incrementStart = parseInt(yearsTexts[0]);
          state.year.incrementIncrement = parseInt(yearsTexts[1]);
        } else if (yearsText.includes(",") || isFinite(yearsText)) {
          state.year.cronEvery = "3";
          state.year.specificSpecific = yearsText.split(",").map((item) => parseInt(item));
        } else if (yearsText.includes("-")) {
          state.year.cronEvery = "4";
          const yearsTexts = yearsText.split("-");
          state.year.rangeStart = parseInt(yearsTexts[0]);
          state.year.rangeEnd = parseInt(yearsTexts[1]);
        }
      },
      {
        immediate: true
      }
    );
    watch(
      () => state.cron,
      (newCron) => {
        if (newCron !== undefined && newCron.length > 1) {
          emit("change", newCron);
        }
      },
      {
        immediate: true
      }
    );
    const getValue = () => {
      return state.cron;
    };
    const close = () => {
      emit("close");
    };
    const handleSave = () => {
      emit("save", state.cron);
      close();
    };
    const rest = (data) => {
      for (const i in data) {
        if (data[i] instanceof Object) {
          this.rest(data[i]);
        } else {
          switch (typeof data[i]) {
            case "object":
              data[i] = [];
              break;
            case "string":
              data[i] = "";
              break;
          }
        }
      }
    };
    return {
      state,
      getValue,
      close,
      handleSave,
      rest
    };
  }
});
</script>
