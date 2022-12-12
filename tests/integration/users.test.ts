import app, { init } from "../../src/app"
import supertest from "supertest";
import { cleanDb } from "../helpers";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker"
import { generateValidToken } from "../helpers"
import { prisma } from "../../src/config";
import { createUser } from "../factories";

beforeAll(async () => {
    await init();
})

beforeEach(async () => {
    await cleanDb();
})

const api = supertest(app);

describe("POST /auth/signup", () => {
  
        it("should respond with status 400 if body is not present", async () => {
            const response = await api.post("/auth/signup")
    
            expect(response.status).toBe(httpStatus.BAD_REQUEST)
        });

        it("should respond with status 400 when body is not valid", async () => {
            const body = { [faker.lorem.word()]: faker.lorem.word()};

            const response = await api.post("/auth/signup")

            expect(response.status).toBe(httpStatus.BAD_REQUEST)
        })

        describe("when body is valid", () => {

            it("should respond with status 201 and create a new user", async () => {
                const incomingPassword = faker.internet.password(6);
                const hashedPassword = await bcrypt.hash(incomingPassword, 10);

                const response = await api.post("/auth/signup").send({
                    email: faker.internet.email(),
                    password: hashedPassword
                })

                expect(response.status).toBe(httpStatus.CREATED);
                
            })


        })
    })

    describe("POST /auth/signin", () => {
  
        it("should respond with status 400 if body is not present", async () => {
            const response = await api.post("/auth/signin")
    
            expect(response.status).toBe(httpStatus.BAD_REQUEST)
        });

        it("should respond with status 400 when body is not valid", async () => {
            const body = { [faker.lorem.word()]: faker.lorem.word()};

            const response = await api.post("/auth/signin").send(body)

            expect(response.status).toBe(httpStatus.BAD_REQUEST)
        })

        describe("when body is valid", () => {

            it("should respond with status 201 and create a token", async () => {
                    const token = await generateValidToken();
                    const user = await createUser();

                    const response = await api.post("/auth/signin").send({
                        email: user.email,
                        password: user.password
                    })
                    console.log(response.error)
                    expect(response.status).toBe(httpStatus.CREATED);
                    const newUser = await prisma.user.findFirst({
                        where: {
                            id: user.id
                        }
                    }) 

                    expect(newUser).toBeDefined();
            })

    })
})






