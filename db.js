import { JSONFilePreset } from 'lowdb/node';

const defaultData = { articles: [], users: [] };
const db = await JSONFilePreset('db.json', defaultData);

export default db;
