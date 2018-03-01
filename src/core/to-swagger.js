/**
 * Created by zhouyong on 2018/1/10.
 */

// const swaggerTmpl = require('./swagger-template.json');
const path = require('path');
const fs = require('fs');
const mockjs = require('mockjs');
const utils = require('./utils');
// 反编译

function mockToMeta(mockData) {
  if (!(mockData instanceof Object)) {
    utils.error('invalid mock data');
    return;
  }

  const responseSchema = getMeta(mockData.response);
  const parameters = parseParams(mockData.method, mockData.parameter, mockData.url);
  let url = mockData.url.replace(/:(\w+)/g, (_, key) => {
    return `{${key}}`;
  });
  return {
    [url]: {
      [mockData.method.toLowerCase()]: {
        tags: mockData.tags,
        summary: mockData.description,
        produces: [
          'application/json'
        ],
        parameters,
        responses: {
          200: {
            description: '请求返回成功',
            schema: responseSchema,
          }
        }
      }
    }
  };
}

function flattenQuery(obj) {
  const foo = [];
  Object.keys(obj).forEach(key => {
    foo.push({
      name: key,
      in: 'query',
      description: `${key} description`,
      required: false,
      ...obj[key],
      example: undefined,
    });
  });

  return foo;
}


function parseParams(method, parameters, url) {
  let query = getMeta(parameters || {});
  if (method.toLowerCase() === 'get') {
    query = flattenQuery(query.properties);
  } else {
    if (parameters) {
      query = [
        {
          in: 'body',
          name: 'body',
          description: '字段信息',
          required: true,
          schema: query,
        },
      ];
    } else {
      query = [];
    }
  }

  let matcher = url.match(/:(\w+)/g);
  if (matcher) {
    let queryInPath = matcher.map(str => {
      let key = str.slice(1);
      return {
        name: key,
        in: 'path',
        'required': true,
        'type': 'string',
      };
    });
    query = [
      ...query,
      ...queryInPath
    ];
  }

  return query;
}

function getMeta(value) {
  if (isBaseType(value)) {
    return getBaseTypeMeta(value);
  } else if (isObject(value)) {
    const objMeta = {};
    Object.keys(value).forEach(key => {
      objMeta[key] = getMeta(value[key]);
    });
    return {
      type: 'object',
      properties: objMeta,
    };
  } else if (isArray(value) && value.length > 0) {
    let item = value[0];
    const arrayMeta = getMeta(item);
    return {
      type: 'array',
      items: arrayMeta,
    };
  }
}

function isBaseType(value) {
  const type = getType(value);
  const baseTypes = ['string', 'number', 'boolean'];
  if (baseTypes.indexOf(type) > -1) {
    return true;
  }
  return false;
}

function isObject(value) {
  return getType(value) === 'object';
}

function isArray(value) {
  return getType(value) === 'array';
}

function getBaseTypeMeta(value) {
  const type = getType(value);
  return {
    type,
    example: value,
  };
}

function getType(value) {
  let type = Object.prototype.toString.call(value);
  let matcher = type.match(/\[object (\w+)\]/);
  if (matcher) {
    type = matcher[1];
  }
  return type.toLowerCase();
}

function mergeAPIObject(all, obj) {
  let store = JSON.parse(JSON.stringify(all));
  Object.keys(obj).forEach((key) => {
    if (store[key]) {
      store[key] = {
        ...store[key],
        ...obj[key],
      };
    } else {
      store[key] = obj[key];
    }
  });
  return store;
}

module.exports = function(workspaceDir) {
  const swaggerTmplObj = utils.parseFileAsObject(path.resolve(workspaceDir, 'swagger-template', 'index.json'));
  const dataDir = path.resolve(workspaceDir, 'data');
  let pathMap = {};
  const list = utils.parseFilesAsList(dataDir);
  list.forEach(obj => {
    const data = mockToMeta(mockjs.mock(obj));
    pathMap = mergeAPIObject(pathMap, data);
  });

  fs.writeFileSync(path.resolve('swagger-data.json'), JSON.stringify({
    ...swaggerTmplObj,
    paths: pathMap,
  }));
  utils.info('成功生成swagger-data.json文件，请将其内容粘贴到swagger编辑器中查看效果。');
};
