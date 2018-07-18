class IndicesObj {
  constructor(indexName, indexStatus) {
    this.indexName = indexName;
    this.status = indexStatus;
  }
}

export const buildDate = (data, teamName) => {
  const newOrignData = [];
  for (const key in data) {
    if (data.hasOwnProperty(key) && key.match(teamName)) {
      const obj = new IndicesObj(key, data[key].state);
      newOrignData.push(obj);
    }
  }
  return newOrignData;
};

export const extractDate = data => {
  const parts = data.split('-');
  if (parts.length > 1) {
    const date = parts[parts.length - 1];
    const dateParts = date.split('.');
    if (dateParts.length === 2) {
      dateParts.push(1);
    }
    if (dateParts.length === 3) {
      const d = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], 0, 0, 0);
      const formatter = new Intl.DateTimeFormat(['ru', 'en'], {
        month: 'long',
        year: 'numeric'
      });
      const month = formatter.format(d);
      return {
        month: month,
        date: date,
      };
    }
  }
  return undefined;
};

export const extractNames = names => {
  const map = {};
  const result = [];
  for (let i = 0; i < names.length; i++) {
    const valideDate = new RegExp(`^.*-\\d{4}.\\d{2}.\\d{2}$`);
    if (names[i].indexName[0] !== '.' && names[i].indexName.match(valideDate)) {
      const name = names[i].indexName.replace(/(\d{4}).(\d{2}).(\d{2})/g, '*');
      if (undefined === map[name]) {
        map[name] = true;
        result.push(name);
      }
    }
  }
  return result;
};
