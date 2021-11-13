/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const argv = require("minimist")(process.argv.slice(2));

const resovle = (file) => path.join(__dirname, file);

const read = (path) => JSON.parse(fs.readFileSync(resovle(path)));

const write = (path, data) =>
  fs.writeFileSync(resovle(path), JSON.stringify(data, null, 2));

const mergeProperty = (a, b, reversse = false) => {
  const ksa = Object.keys(a);
  const ksb = Object.keys(b);

  for (let k of ksa) {
    if (typeof a[k] === "object") {
      if (!ksb.includes(k)) {
        b[k] = {};
      }
      mergeProperty(a[k], b[k]);
    } else {
      if (!ksb.includes(k)) {
        if (reversse) {
          a[k] = "--" + a[k];
        } else {
          b[k] = "!!" + a[k];
        }
      }
    }
  }
};

const sortProperty = (obj) => {
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === "object") {
      obj[key] = sortProperty(obj[key]);
    }
  }

  return Object.keys(obj)
    .sort()
    .reduce((acc, k) => {
      acc[k] = obj[k];
      return acc;
    }, {});
};

function mergeFile(path1, path2, flat = false) {
  let file1 = read(path1);
  let file2 = read(path2);

  if (flat) {
    file1 = flatProperty(file1, "");
    file2 = flatProperty(file2, "");
  }

  mergeProperty(file1, file2);
  mergeProperty(file2, file1, true);

  write(path1, sortProperty(file1));
  write(path2, sortProperty(file2));
}

function flatProperty(obj, perfix) {
  const context = {};
  const flat = (o, p) => {
    for (const key of Object.keys(o)) {
      if (typeof o[key] === "object") {
        flat(o[key], key + ".");
      } else {
        context[p + key] = o[key];
      }
    }
  };
  flat(obj, perfix);
  return context;
}

mergeFile("../src/lang/en-US.json", "../src/lang/zh-TW.json", argv.f);
mergeFile("../src/lang/en-US.json", "../src/lang/ja-JP.json");
