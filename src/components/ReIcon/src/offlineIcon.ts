import { addIcon } from "@iconify/vue/dist/offline";

/**
 * 这里存放本地图标，在 src/layout/index.vue 文件中加载，避免在首启动加载
 */

// 本地菜单图标，后端在路由的icon中返回对应的图标字符串并且前端在此处使用addIcon添加即可渲染菜单图标
import UbuntuFill from "@iconify-icons/ri/ubuntu-fill";
import Menu from "@iconify-icons/ep/menu";
import Edit from "@iconify-icons/ep/edit";
import InformationLine from "@iconify-icons/ri/information-line";
import SetUp from "@iconify-icons/ep/set-up";
import TerminalWindowLine from "@iconify-icons/ri/terminal-window-line";
import Guide from "@iconify-icons/ep/guide";
import HomeFilled from "@iconify-icons/ep/home-filled";
import Card from "@iconify-icons/ri/bank-card-line";
import ListCheck from "@iconify-icons/ri/list-check";
import Histogram from "@iconify-icons/ep/histogram";
import Ppt from "@iconify-icons/ri/file-ppt-2-line";
import CheckboxCircleLine from "@iconify-icons/ri/checkbox-circle-line";
import FlUser from "@iconify-icons/ri/admin-line";
import Role from "@iconify-icons/ri/admin-fill";
import Setting from "@iconify-icons/ri/settings-3-line";
import Dept from "@iconify-icons/ri/git-branch-line";
import Lollipop from "@iconify-icons/ep/lollipop";
import Monitor from "@iconify-icons/ep/monitor";
import Watch from "@iconify-icons/ep/watch";
import EditPen from "@iconify-icons/ep/edit-pen";
import DataBoard from "@iconify-icons/ep/data-board";
import QuestionFilled from "@iconify-icons/ep/question-filled";
import User from "@iconify-icons/ep/user";
import ChatDotSquare from "@iconify-icons/ep/chat-dot-square";
import Calendar from "@iconify-icons/ep/calendar";
import Info from "@iconify-icons/ri/information-line";
import Task from "@iconify-icons/ri/task-line";
addIcon("card", Card);
addIcon("calendar", Calendar);
addIcon("chat-dot-square", ChatDotSquare);
addIcon("checkboxCircleLine", CheckboxCircleLine);
addIcon("data-board", DataBoard);
addIcon("dept", Dept);
addIcon("edit", Edit);
addIcon("edit-pen", EditPen);
addIcon("flUser", FlUser);
addIcon("guide", Guide);
addIcon("histogram", Histogram);
addIcon("homeFilled", HomeFilled);
addIcon("info", Info);
addIcon("informationLine", InformationLine);
addIcon("listCheck", ListCheck);
addIcon("lollipop", Lollipop);
addIcon("menu", Menu);
addIcon("monitor", Monitor);
addIcon("ppt", Ppt);
addIcon("question-filled", QuestionFilled);
addIcon("role", Role);
addIcon("setting", Setting);
addIcon("setUp", SetUp);
addIcon("terminalWindowLine", TerminalWindowLine);
addIcon("ubuntuFill", UbuntuFill);
addIcon("user", User);
addIcon("watch", Watch);
addIcon("task", Task);
