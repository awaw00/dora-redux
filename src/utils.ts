let randomTextDict: string[] = [];
for (let i = 65; i <= 122; i++) {
  if (i === 91) {
    i = 97;
  }

  randomTextDict.push(String.fromCharCode(i));
}

export function getRandomChar () {
  return randomTextDict[Math.round(Math.random() * (randomTextDict.length - 1))];
}
export function getRandomText (length: number) {
  let textArr = [];
  for (let i = 0; i < length; i++) {
    textArr.push(getRandomChar());
  }

  return textArr.join('');
}

export function getAsyncType (baseType: string, namespace: string, key?: string) {
  const slicer = '/';

  if (namespace) {
    namespace += (key ? `<${key}>` : '') + slicer;
  } else {
    namespace = '';
  }

  return {
    START: `${namespace}${baseType}${slicer}START`,
    END: `${namespace}${baseType}${slicer}END`,
    ERROR: `${namespace}${baseType}${slicer}ERROR`,
  };
}

export function getClassMembersDescriptor (prototype: any) {
  let res: {name: string, descriptor: PropertyDescriptor}[] = [];
  while (true) {
    const arr = Object.getOwnPropertyNames(prototype);
    res = res.concat(arr.map(i => ({
      name: i,
      descriptor: Object.getOwnPropertyDescriptor(prototype, i)
    })));
    prototype = Object.getPrototypeOf(prototype);
    if (!prototype || prototype === Object) {
      break;
    }
  }

  return res.filter(i => {
    return [
      'constructor',
      'hasOwnProperty',
      'isPrototypeOf',
      'propertyIsEnumerable',
      'toString',
      'valueOf',
      'toLocaleString',
      'loadReducer',
      'unloadReducer',
      'getState',
      'dispatch',
      'processDecoratedMethods'
    ].indexOf(i.name) < 0 && !/^__.*__$/.test(i.name);
  });
}
