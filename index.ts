// const qqq: string = "안녕하세요~~";

// console.log(qqq);

import { DataSource } from "typeorm";
import { Board } from "./Board.postgres";

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// API DOCS 만들기
const typeDefs = `#graphql
  input CreateBoardInput{
    writer: String
    title: String
    contents: String
  }

  type MyBoard {
    number: Int
    writer: String
    title: String
    contents: String
  }

  type Query {
    fetchBoards: [MyBoard]
  }

  type Mutation {
    # 연습용 (backend-example 방식)
    # createBoard(writer:String, title:String , contents: String):String

    #실무용 (backend-practice 방식)
    createBoard(createBoardInput: CreateBoardInput):String
  }
`;

// API  만들기
const resolvers = {
  Query: {
    fetchBoards: async () => {
      // 1. 모두꺼내기
      const result = await Board.find();
      console.log(result);

      // // 2. 한개만 꺼내기
      // const result = await Board.findOne({ where: { number: 3 } });
      // console.log(result);

      return result;
    },
  },
  Mutation: {
    createBoard: async (parent: any, context: any, args: any, info: any) => {
      await Board.insert({
        ...args.createBoardInput,

        //하나 하나 모두 입력하는 비효율적인 방식
        // writer: args.createBoardInput.writer,
        // title: args.createBoardInput.title,
        // content: args.createBoardInput.contents,
      });
      return "게시글 등록에 성공했어요!!";
    },

    updateBoard: async()  => {
      await Board.update ({number:3}, {{writer:"영희"}}) //3 번게시물 수정
    },

    deleteBoard: async() =>{
      await Board.delete({number:3}) //3번게시물 삭제
      await Board.update({number:3} , {isDelete: true}) //3번게시물을 삭제했다고 치자 (소프트 딜리트)
    }
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors: true,
});

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

    startStandaloneServer(server).then(() => {
      console.log("그래프큐엘 서버가 실행되었습니다!!!"); // 포트 4000
    });
  })
  .catch((error) => {
    console.log("DB접속에 실패했습니다!!");
    console.log("원인", error);
  });
