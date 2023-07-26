import { Request, Response, NextFunction } from 'express';
const cafeController = require("../controllers/cafeController");

import * as mongoose from 'mongoose';
// beforeAll(async () => await db.connect())
// afterEach(async () => await db.clearDatabase())
// afterAll(async () => await db.closeDatabase())

describe('CafeController', () => {

    const mockResponse: any = {
      json: jest.fn(),
      status: jest.fn(),
    };
    const mockNext:NextFunction = jest.fn();

    // it ("Request GET", async () => {
    //     const mockRequest = {
    //         body: {
    //             location: "",
    //         }
    //     } as Request;

    //     await cafeController.get(mockRequest, mockResponse, mockNext);
    //     console.log(mockResponse);
    // });

    it ("Request POST", async () => {
        const mockRequest = {
            body: {
                name: "CafeName",
                description: "Description",
                location: "Location",
            }
        } as Request;

        let result:any = await cafeController.post(mockRequest, mockResponse, mockNext);
        console.log(result);
    });

    // })
    // it('Second Test', async (done: DoneCallback): Promise<void> => {
    // 	const result = 10;
    //     expect(result).toBe("ten")
    //     expect(result).toBe(10)
    //     done()

    // })

});