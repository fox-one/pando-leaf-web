declare namespace State {
  export interface AppBarState {
    style: "home" | "nav";
    title: string;
    show: boolean;
    back: boolean;
    customContent?: null | any;
    extension?: null | any;
    extensionHeight?: number;
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

  export interface FiatState {
    symbol: string;
    name: string;
  }

  export interface App {
    appbar: AppBarState;
    settings: SettingsState;
    bottomNav: BottomNavState;
    paying: PayState;
    visited: boolean;
    initing: boolean;
    safetyWarningShown: boolean;
    fiat: FiatState;
    termsAccepted: boolean;
    termsVersion: string;
  }
}
