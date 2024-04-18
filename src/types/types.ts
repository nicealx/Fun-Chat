export type Callback<T> = (data?: T) => void;

export type WSRequest = {
  id: string;
  type: string;
  payload: {
    user: {
      login: string;
      password: string;
    };
  };
};

export type WSResponseSuccess = {
  id: string;
  type: string;
  payload: {
    user: {
      login: string;
      password: string;
      isLogined: boolean;
    };
  };
};

export type WSResponseError = {
  id: string;
  type: string;
  payload: {
    error: string;
  };
};

export type SessionStorage = {
  login: string;
  password: string;
  isLogined?: boolean;
};
