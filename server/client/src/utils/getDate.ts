import moment from 'moment';

export const getDate = (date: string) => {
  moment.locale('zh-cn');
  const dateMoment = moment(date);
  if (dateMoment.diff(moment(new Date().toISOString()), 'days', true) >= -2) {
    return dateMoment.fromNow();
  }
  return dateMoment.toDate().toLocaleString();
};
