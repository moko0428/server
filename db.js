import { JSONFilePreset } from 'lowdb/node';

const defaultData = { articles: [] };
const db = await JSONFilePreset('db.json', defaultData);

export default db;
