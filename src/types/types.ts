export type Callback<T> = (data?: T) => void;

export type UserData = {
  [key: string]: string;
};

export type WSRequestSuccess = {
  id: string;
  type: string;
  payload: {
    user: {
      login: string;
      password: string;
    };
  };
};

export type WSRequestError = {
  id: string;
  type: string;
  payload: {
    error: string;
  };
};
