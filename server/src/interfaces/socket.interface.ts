export enum ClientEventType {
  CONNECTION = 'connection',
  DISCONNECT = 'disconnect',
  SETNAME = 'set_name',
  MESSAGE = 'message',
  GROUPMESSAGE = 'group_message',
}

export enum ServerEventType {
  RECIEVEDMESSAGE = 'recieved_message',
  FORCELOGOUT = 'force_logout',
  ERRORLOGOUT = 'error_logout',
}
