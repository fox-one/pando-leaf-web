import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh";

dayjs.extend(relativeTime);

export function toRelative(t) {
  return dayjs().to(t);
}

export function format(t, p = "YYYY-MM-DD HH:mm:ss") {
  return dayjs(t).format(p);
}
