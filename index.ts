// const qqq: string = "안녕하세요~~";

// console.log(qqq);

import { DataSource } from "typeorm";
import { Board } from "./Board.postgres";

const AppDataSource = new DataSource({
  type: "postgres",
  host: "데이터베이스 깔린 컴퓨터 IP 주 깔린 컴퓨터 IP 주소",
  port: "데이터베이스 깔린 컴퓨터 포트",
  username: "postgres",
  password: "postgres2022",
  database: "postgres",
  entities: [Board],
  synchronize: true,
  logging: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log("DB접속에 성공했습니다!!");
  })
  .catch((error) => {
    console.log("DB접속에 실패했습니다!!");
    console.log("원인", error);
  });
