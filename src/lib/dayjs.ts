// https://github.com/element-plus/element-plus-nuxt/issues/95#issuecomment-2065970469
import dayjs from "dayjs/esm";
import relativeTime from "dayjs/esm/plugin/relativeTime";

dayjs.extend(relativeTime);

export { dayjs };
