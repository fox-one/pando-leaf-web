declare namespace State {
  export interface AppBarState {
    style: "home" | "nav";
    title: string;
    show: boolean;
    back: boolean;
  }

  export interface SettingsState {
    dark: boolean;
  }

  export interface BottomNavState {
    value: string;
  }

  export interface PayState {
    visible: boolean;
    timer: any;
  }

  export interface App {
    appbar: AppBarState;
    settings: SettingsState;
    bottomNav: BottomNavState;
    paying: PayState;
    visited: boolean;
    initing: boolean;
  }
}