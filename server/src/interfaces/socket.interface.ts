export enum ClientEventType {
  CONNECTION = 'connection',
  DISCONNECT = 'user_disconnect',
  SETNAME = 'set_name',
  MESSAGE = 'message',
  GROUPMESSAGE = 'group_message',
  GETONLINE = 'get_online',
  TYPING = 'typing',
  TYPINGEND = 'typing_end',
  USERONLINE = 'user_online',
  MESSAGEREAD = 'message_read',
}

export enum ServerEventType {
  RECIEVEDMESSAGE = 'recieved_message',
  FORCELOGOUT = 'force_logout',
  ERRORLOGOUT = 'error_logout',
  SENDONLINE = 'send_online',
  TYPING = 'typing',
  TYPINGEND = 'typing_end',
  INFORMFRIENDONLINE = 'inform_friend_online',
  NAMESET = 'name_set',
  USEROFFLINE = 'user_offline',
  MESSAGEREAD = 'message_read',
}
