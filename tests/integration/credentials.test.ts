import app, { init } from "../../src/app"
import supertest from "supertest";
import { cleanDb } from "../helpers";
import httpStatus from "http-status";
import {faker} from "@faker-js/faker"
import Cryptr from "cryptr"
import { generateValidToken } from "../helpers"
import { 
    createCredential,
    createUser,
    createValidBody
  } from "../factories";
import { prisma } from "../../src/config";

beforeAll(async () => {
    await init();
})

beforeEach(async () => {
    await cleanDb();
})

const api = supertest(app);

const cryptr = new Cryptr('secretKey')

describe("POST /credentials/:userId", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await api.post("/credentials/:userId");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    })

    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();

        const response = await api.post("/credentials/:userId").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED)
    })

    describe("when token is valid", () => {
        it("should respond with status 400 if body is not present", async () => {
            const token = await generateValidToken();

            const response = await api.post("/credentials/:userId").set("Authorization", `Bearer ${token}`);
    
            expect(response.status).toBe(httpStatus.BAD_REQUEST)
        });

        it("should respond with status 400 when body is not valid", async () => {
            const token = await generateValidToken();
            const body = { [faker.lorem.word()]: faker.lorem.word()};

            const response = await api.post("/credentials/:userId").set("Authorization", `Bearer ${token}`).send(body);

            expect(response.status).toBe(httpStatus.BAD_REQUEST)
        })

        describe("when body is valid", () => {
            it("should respond with status 201 and create a new credential", async () => {
                const incomingPassword = faker.internet.password(6);
                const hashedPassword = cryptr.encrypt(incomingPassword);
                const user = await createUser();
                const token = await generateValidToken();
                
                const response = await api.post(`/credentials/${user.id}`).set("Authorization", `Bearer ${token}`).send({
                    title: faker.lorem.word(),
                    url: faker.internet.url(),
                    username: faker.name.firstName(),
                    password: hashedPassword
                })
                
                expect(response.status).toBe(httpStatus.CREATED)
                const credential = await prisma.credential.findFirst({ where: { userId: user.id}})
                expect(credential).toBeDefined();
            })
        })
    })
})

describe("GET /credentials/:userId", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await api.get("/credentials/:userId");
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();
    
        const response = await api.get("/credentials/:userId").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

      describe("when token is valid", () => {
        it("should respond with status 200 and with credentials data", async () => {
            
            const user = await createUser();
            const token = await generateValidToken();
            const body = await createValidBody();
            
            const credential = await createCredential( body, user.id)

            const response = await api.get(`/credentials/${user.id}`).set("Authorization", `Bearer ${token}`);
            
            expect(response.status).toBe(httpStatus.OK)
            expect(response.body).toEqual([{
                id: credential.id,
                title: body.title,
                url: body.url,
                username: body.username,
                password: cryptr.decrypt(body.password),
                userId: user.id
            }])
        })
      })
})

describe("GET /credentials/:userId/:credentialId", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await api.get("/credentials/:userId/:credentialId");
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();
    
        const response = await api.get("/credentials/:userId/:credentialId").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

      describe("when token is valid", () => {
        it("should respond with status 200 and with credentials data", async () => {
            const body = await createValidBody();
            const user = await createUser();
            const token = await generateValidToken();
            const credential = await createCredential(body, user.id)

            const response = await api.get(`/credentials/${user.id}/${credential.id}`).set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.OK)
            expect(response.body).toEqual({
                id: credential.id,
                title: body.title,
                url: body.url,
                username: body.username,
                password: cryptr.decrypt(body.password),
                userId: user.id
            })
        })
      })
})

describe("DELETE /credentials/:userId/:credentialId", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await api.get("/credentials/:userId/:credentialId");
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();
    
        const response = await api.get("/credentials/:userId/:credentialId").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

      describe("when token is valid", () => {
        it("should respond with status 200 and delete credential", async () => {
            const body = await createValidBody();
            const user = await createUser();
            const token = await generateValidToken();
            const credential = await createCredential(body, user.id)

            const response = await api.delete(`/credentials/${user.id}/${credential.id}`).set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.OK)
            const delection = await prisma.credential.findFirst({
                where: {
                    id: credential.id
                }
            })
            expect(delection).toBeNull();
        })
    })
})