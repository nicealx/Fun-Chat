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

export type WSRequestMessage = {
  id: string;
  type: string;
  payload: {
    message: {
      to: string;
      text: string;
    };
  };
};

export type WSResponseMessage = {
  id: string | null;
  type: 'MSG_SEND';
  payload: {
    message: {
      id: string;
      from: string;
      to: string;
      text: string;
      datetime: number;
      status: {
        isDelivered: boolean;
        isReaded: boolean;
        isEdited: boolean;
      };
    };
  };
};

export type WSRequestHistoryMessage = {
  id: string;
  type: string;
  payload: {
    user: {
      login: string;
    };
  };
};

export type WSResponseMessages = {
  id: string;
  type: 'MSG_FROM_USER';
  payload: {
    messages: WSResponseMsgFromUser[];
  };
};

export type WSResponseMsgFromUser = {
  id: string | null;
  from: string;
  to: string;
  text: string;
  datetime: number;
  status: {
    isDelivered: boolean;
    isReaded: boolean;
    isEdited: boolean;
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

export type GetUsers = {
  login: string;
  isLogined: boolean;
};

export type MessageData = {
  to: string;
  text: string;
};
