import * as path from 'path';
process.env.MIDWAY_ENV = 'unittest';
process.env.MIDWAY_RUN_DIR = path.join(process.cwd(), 'test_run');
