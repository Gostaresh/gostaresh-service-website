import { defineNuxtPlugin } from "#app";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import "dayjs/locale/fa.js";

dayjs.extend(jalaliday);
dayjs.locale("fa");

export default defineNuxtPlugin(() => ({ provide: { dayjs } }));
