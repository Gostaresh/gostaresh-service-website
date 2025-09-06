import { defineNuxtPlugin } from "#app";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import "dayjs/locale/fa";

dayjs.extend(jalaliday);
dayjs.locale("fa");

export default defineNuxtPlugin(() => {
  return {
    provide: {
      dayjs,
    },
  };
});
