declare namespace State {
  export interface Page {
    detail: {
      tabIndex: number;
    };
    auction: {
      tabIndex: number;
    };
    home: {
      sorter: API.SortBy;
    };
  }
}
