import { Store } from "vuex";
import { v4 as uuid } from "uuid";
import { SOCKET_STATE } from "@/types";
import { throttle } from "@/utils/helper";

interface WsMessage<T> {
  id: string;
  method: string;
  status: number;
  url: string;
  body: {
    data?: T;
    code?: number;
    msg?: string;
  };
}

function execute(cb, ...args) {
  if (cb && typeof cb === "function") {
    cb(...args);
  }
}

export default class Socket {
  store: Store<any>;
  websocket!: WebSocket;
  url: any;

  interval = 3000;
  state = SOCKET_STATE.CLOSED;
  listeners = {};
  queue: any[] = [];

  constructor(url: string, store: Store<any>) {
    this.store = store;
    this.url = url;
    this._connect();
  }

  get(path): Promise<any> {
    return this._send({
      method: "GET",
      url: path,
    });
  }

  post(path, data): Promise<any> {
    return this._send({
      method: "POST",
      url: path,
      body: data,
    });
  }

  _connect = throttle(() => {
    if (this.state === SOCKET_STATE.CONNECTING) return;
    this._setstate(SOCKET_STATE.CONNECTING);
    this.websocket = new WebSocket(this.url);
    this.websocket.onopen = this._onopen.bind(this);
    this.websocket.onclose = this._onclose.bind(this);
    this.websocket.onmessage = this._onmessage.bind(this);
    this.websocket.onerror = this._onerror.bind(this);
  }, this.interval);

  _send(params) {
    return new Promise((resolve, reject) => {
      const id = uuid();
      const data = JSON.stringify({ ...params, id });
      this.listeners[id] = (res: WsMessage<any>) => {
        res.body.code ? reject(res.body) : resolve(res.body.data);
      };

      setTimeout(() => {
        if (this.listeners[id]) {
          reject({ msg: "请求超时" });
          delete this.listeners[id];
        }
      }, 15000);

      if (this.state === SOCKET_STATE.CONNECTED) {
        this.websocket.send(data);
      } else if (params.method === "POST") {
        reject({ msg: "网络未连接" });
        delete this.listeners[id];
      } else {
        this.queue.push(data);
      }
    });
  }

  _setstate(value) {
    this.state = value;
    this.store.commit("app/SET_WS_STATE", value);
  }

  _onopen() {
    this._setstate(SOCKET_STATE.CONNECTED);
    while (this.queue.length > 0) {
      this.websocket.send(this.queue.shift());
    }
  }

  _onmessage(evt) {
    const msg: WsMessage<any> = JSON.parse(evt.data);
    const callback = this.listeners[msg.id];
    if (callback) {
      if (msg.body.code === 401) {
        this.store.dispatch("auth/logout");
      }
      execute(callback, msg);
      delete this.listeners[msg.id];
    }
  }

  _onerror() {
    this._setstate(SOCKET_STATE.ERROR);
    this._connect();
  }

  _onclose() {
    this._setstate(SOCKET_STATE.CLOSED);
    this._connect();
  }
}
