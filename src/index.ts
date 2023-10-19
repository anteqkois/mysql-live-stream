import "dotenv/config";
import mysql from "mysql2";
import ZongJi from "zongji";

const connection = mysql.createConnection({
  port: process.env.DATABASE_PORT as unknown as number,
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

connection.connect();

// @ts-ignore
let watcher = new ZongJi(connection);

// Each change to the replication log results in an event
watcher.on("binlog", function (event) {
  if (event.getEventName() === "writerows")
    console.dir({
      timestamp: event.timestamp,
      rows: event.rows,
      tableName: event.tableMap[event.tableId].tableName,
    });
});

// Binlog must be started, optionally pass in filters
watcher.start({
  startAtEnd: true,
  includeSchema: {
    "coins-price": ["btcusd"],
  },
  includeEvents: ["tablemap", "writerows"],
});
