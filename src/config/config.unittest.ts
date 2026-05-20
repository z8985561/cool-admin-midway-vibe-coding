import * as path from 'path';
import { pUploadPath } from '../comm/path';
import { availablePort } from '../comm/port';

export default {
  keys: '59c0b4aa-49b5-4d7c-b33b-0abc8344ba98',
  koa: {
    port: availablePort(8001),
  },
  asyncContextManager: {
    enable: true,
  },
  staticFile: {
    buffer: true,
    dirs: {
      default: {
        prefix: '/',
        dir: path.join(__dirname, '..', '..', 'public'),
      },
      static: {
        prefix: '/upload',
        dir: pUploadPath(),
      },
    },
  },
  upload: {
    fileSize: '200mb',
    whitelist: null,
  },
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        username: 'root',
        password: '123456',
        database: 'cool',
        charset: 'utf8mb4',
        logging: false,
        synchronize: true,
        // 实体路径
        entities: ['**/modules/*/entity'],
      },
    },
  },
  cool: {
    file: {},
    tenant: {
      enable: false,
      urls: [],
    },
    i18n: {
      enable: false,
      languages: ['zh-cn', 'zh-tw', 'en'],
    },
    crud: {
      upsert: 'save',
      softDelete: true,
      pageSize: 10,
    },
    initJudge: 'file',
    location: {
      default: {
        type: 'local',
      },
    },
  },
};
