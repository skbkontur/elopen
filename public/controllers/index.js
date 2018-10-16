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
  const regMatch = date.match(`^.*-(19|20)\\d\\d.(0[1-9]|1[012]).(0[1-9]|[12][0-9]|3[01])$`);
  if (regMatch) {
    const completeData = new Date(regMatch[0]);
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
    const finDate = dater.format(completeData);
    return {
      month: month,
      date: finDate,
    };
  } else {
    return false;
  }
};

// export const extractDate = data => {
//   const parts = data.split('-');
//   if (parts.length > 1) {
//     const date = parts[parts.length - 1];
//     const dateParts = date.split('.');
//     if (dateParts.length === 2) {
//       dateParts.push(1);
//     }
//     if (dateParts.length === 3) {
//       const d = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], 0, 0, 0);
//       const formatter = new Intl.DateTimeFormat(['ru', 'en'], {
//         month: 'long',
//         year: 'numeric'
//       });
//       const month = formatter.format(d);
//       return {
//         month: month,
//         date: date,
//       };
//     }
//   }
//   return undefined;
// };



// class IndicesObj {
//   constructor(indexName, indexStatus) {
//     this.indexName = indexName;
//     this.status = indexStatus;
//   }
// }

// export const buildDate = (data, teamName) => {
//   const newOrignData = [];
//   for (const key in data) {
//     if (data.hasOwnProperty(key) && (key.match(`^${teamName}.*\\d{4}.\\d{2}.\\d{2}$`) || key.match(`.*-${teamName}-\\d{4}.\\d{2}.\\d{2}$`))) {
//       const obj = new IndicesObj(key, data[key].state);
//       newOrignData.push(obj);
//     }
//   }
//   return newOrignData;
// };

// export const extractNames = names => {
//   const map = {};
//   const result = [];
//   for (let i = 0; i < names.length; i++) {
//     const valideDate = new RegExp(`^.*-\\d{4}.\\d{2}.\\d{2}$`);
//     if (names[i].indexName[0] !== '.' && names[i].indexName.match(valideDate)) {
//       const name = names[i].indexName.replace(/(\d{4}).(\d{2}).(\d{2})/g, '*');
//       if (undefined === map[name]) {
//         map[name] = true;
//         result.push(name);
//       }
//     }
//   }
//   return result;
// };
