import mysql from 'mysql2/promise';

const parseConnectionString = (connectionString) => {
    const url = new URL(connectionString);
    return {
        host: url.hostname,
        user: url.username,
        password: url.password,
        database: url.pathname.substring(1), // Remove leading slash
        port: url.port || 3306,
        ssl: JSON.parse(url.searchParams.get('ssl') || '{}'),
    };
};

export const dbGAP2566 = mysql.createPool(parseConnectionString(process.env.MYSQL_URI_GAP2566));
export const dbGAPSEED2566 = mysql.createPool(parseConnectionString(process.env.MYSQL_URI_GAPSEED2566));
export const dbORG2566 = mysql.createPool(parseConnectionString(process.env.MYSQL_URI_ORG2566));
