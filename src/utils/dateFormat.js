/*
包含n个日期时间处理的工具函数模块
*/

// 格式化日期
export function formatDate(time) {
  if (!time) return '';
  let dateObj = new Date(time);
  let year = dateObj.getFullYear();
  let month = dateObj.getMonth() + 1;
  let date = dateObj.getDate();
  let hour = dateObj.getHours();
  let min = dateObj.getMinutes();
  let sec = dateObj.getSeconds();
  hour = hour < 10 ? '0' + hour :hour;
  min = min < 10 ? '0' + min :min;
  sec = sec < 10 ? '0' + sec :sec;
  return `${year}-${month}-${date} ${hour}:${min}:${sec}`
}