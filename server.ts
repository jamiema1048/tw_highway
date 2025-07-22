import jsonServer from "json-server";
import { Request, Response, NextFunction } from "express";

const server = jsonServer.create();
const router = jsonServer.router("database"); // 假設 database 是 JSON 檔案或資料夾
const middlewares = jsonServer.defaults();

server.use(middlewares);

// 自訂中介層加上 CORS header
server.use((req: Request, res: Response, next: NextFunction) => {
  console.log("Request received");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

server.use(router);

server.listen(3001, () => {
  console.log("JSON Server is running on port 3001");
});
