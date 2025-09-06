export const useJDate = () => {
  const { $dayjs } = useNuxtApp();
  const j = (d?: string | number | Date, fmt = "YYYY/MM/DD") =>
    $dayjs(d).calendar("jalali").locale("fa").format(fmt);
  return { j };
};
