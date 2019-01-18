export const getShortLIst = longList => {
  const arr = [];
  for(let i = 0, len = longList.length; i < len; i++) {
    const item = longList[i].index.replace(/(\d{4}).(\d{2}).(\d{2})/g, '*');
    if (arr.indexOf(item) === -1) {
      arr.push(item);
    }
  }
  return arr;
};

export const checkDate = date => {
  const regMatch = date.match(`^.*-((19|20|21)\\d\\d).(0[1-9]|1[012]).(0[1-9]|[12][0-9]|3[01])$`);
  if (regMatch) {
    const completeData = new Date(`${regMatch[1]}-${regMatch[3]}-${regMatch[4]}`);
    const monther = new Intl.DateTimeFormat(['ru', 'en'], {
      month: 'long',
      year: 'numeric'
    });
    const dater = new Intl.DateTimeFormat(['ru', 'en'], {
      year: 'numeric',
      day: '2-digit',
      month: '2-digit'
    });
    const month = monther.format(completeData);
    const date = dater.format(completeData);
    return {
      month,
      date,
    };
  } else {
    return false;
  }
};
