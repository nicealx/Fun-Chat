export interface UserInfo {
  [key: string]: string;
}

export interface UserValid {
  [key: string]: boolean;
}

export interface RouterData<T> {
  path: string;
  page: T;
}

export interface RouterEntry<T> {
  [key: string]: T;
}
