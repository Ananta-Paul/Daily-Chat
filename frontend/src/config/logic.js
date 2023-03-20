export const sender = (id, user) => {
  return user[0]._id === id ? user[1] : user[0];
};
export const isExist = (id, users) => {
  if (users.find((user) => user._id === id)) return true;
  return false;
};
export const getusers = (users) => {
  var data = JSON.stringify(users.map((user) => user._id));
  return data;
};
export const isSame = (user, message) => {
  return user.result._id === message.sender._id;
};
export const isLast = (messages, i) => {
  return (
    i === messages.length - 1 ||
    (i < messages.length - 1 &&
      messages[i].sender._id !== messages[i + 1].sender._id)
  );
};
export const isFirst = (messages, i) => {
  return (
    messages[i].chat.isGroupChat &&
    (i === 0 || messages[i].sender._id !== messages[i - 1].sender._id)
  );
};
export const getRandom = (id) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
};
