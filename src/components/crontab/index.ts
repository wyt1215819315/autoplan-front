import crontab from "./src/index.vue";
import { withInstall } from "@pureadmin/utils";

export const cron = withInstall(crontab);

export default cron;
