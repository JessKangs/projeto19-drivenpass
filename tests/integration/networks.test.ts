import app, { init } from "../../src/app"
import supertest from "supertest";
import { cleanDb } from "../helpers";
import httpStatus from "http-status";
import {faker} from "@faker-js/faker"
import Cryptr from "cryptr"
import { generateValidToken } from "../helpers"
import { 
    createUser,
    createNetwork, 
    createValidNetworkBody
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

describe("POST /networks/:userId", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await api.post("/networks/:userId");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    })

    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();

        const response = await api.post("/networks/:userId").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED)
    })

    describe("when token is valid", () => {
        it("should respond with status 400 if body is not present", async () => {
            const token = await generateValidToken();

            const response = await api.post("/networks/:userId").set("Authorization", `Bearer ${token}`);
    
            expect(response.status).toBe(httpStatus.BAD_REQUEST)
        });

        it("should respond with status 400 when body is not valid", async () => {
            const token = await generateValidToken();
            const body = { [faker.lorem.word()]: faker.lorem.word()};

            const response = await api.post("/networks/:userId").set("Authorization", `Bearer ${token}`).send(body);

            expect(response.status).toBe(httpStatus.BAD_REQUEST)
        })

        describe("when body is valid", () => {
            it("should respond with status 201 and create a new credential", async () => {
                const incomingPassword = faker.internet.password(6);
                const hashedPassword = cryptr.encrypt(incomingPassword);
                const user = await createUser();
                const token = await generateValidToken();
                
                const response = await api.post(`/networks/${user.id}`).set("Authorization", `Bearer ${token}`).send({
                    title: faker.lorem.word(),
                    network: faker.lorem.words(3),
                    password: hashedPassword,
                    userId: user.id
                })
                
                expect(response.status).toBe(httpStatus.CREATED)
                const network = await prisma.network.findFirst({ where: { userId: user.id}})
                expect(network).toBeDefined();
            })
        })
    })
})

describe("GET /networks/:userId", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await api.get("/networks/:userId");
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();
    
        const response = await api.get("/networks/:userId").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

      describe("when token is valid", () => {
        it("should respond with status 200 and with networks data", async () => {
            
            const user = await createUser();
            const token = await generateValidToken();
            const body = await createValidNetworkBody();
            
            const network = await createNetwork( body, user.id)

            const response = await api.get(`/networks/${user.id}`).set("Authorization", `Bearer ${token}`);
            
            expect(response.status).toBe(httpStatus.OK)
            expect(response.body).toEqual([{
                id: network.id,
                title: body.title,
                network: body.network,
                password: cryptr.decrypt(body.password),
                userId: user.id
            }])
        })
      })
})

describe("GET /networks/:userId/:networkId", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await api.get("/networks/:userId/:networkId");
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();
    
        const response = await api.get("/networks/:userId/:networkId").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

      describe("when token is valid", () => {
        it("should respond with status 200 and with networks data", async () => {
            const body = await createValidNetworkBody();
            const user = await createUser();
            const token = await generateValidToken();
            const network = await createNetwork(body, user.id)

            const response = await api.get(`/networks/${user.id}/${network.id}`).set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.OK)
            expect(response.body).toEqual({
                id: network.id,
                title: body.title,
                network: body.network,
                password: cryptr.decrypt(body.password),
                userId: user.id
            })
        })
      })
})

describe("DELETE /networks/:userId/:networkId", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await api.get("/networks/:userId/:networkId");
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();
    
        const response = await api.get("/networks/:userId/:networkId").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

      describe("when token is valid", () => {
        it("should respond with status 200 and delete network", async () => {
            const body = await createValidNetworkBody();
            const user = await createUser();
            const token = await generateValidToken();
            const network = await createNetwork(body, user.id)

            const response = await api.delete(`/networks/${user.id}/${network.id}`).set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.OK)
            const delection = await prisma.network.findFirst({
                where: {
                    id: network.id
                }
            })
            expect(delection).toBeNull();
        })
    })
})