import { statusTabIcon } from "./status-icon.type";

export interface TabConfig {
    tabTitle?: string;
    icon?: string;
    iconColor?: string;
    iconTooltipText?: string;
    status?: statusTabIcon;
    disabled?: boolean;
    route?: string;
    active?: boolean;
    closeable?: boolean;
    isFirst?: boolean;
    isLast?: boolean;
    isNameEditing?: boolean;
    editName?: string;
    previousName?: string;
    isDynamicTab?: boolean;
    code?: string;
    dataContext?: any;
  }
  