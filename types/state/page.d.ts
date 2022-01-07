declare namespace State {
  export interface Page {
    detail: {
      tabIndex: number;
    };
    home: {
      sorter: API.SortBy;
    };
  }
}
