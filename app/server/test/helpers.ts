import mongoose from "mongoose";
import sinon from "sinon";

export abstract class Helpers {

    /**
     * Create mock request with "query" for GET
     */
    public static createQueryRequest(obj:{}){
        return {query: obj}
    }

    /**
     * Create mock request with "body" for POST, PUT, DELETE
     */
    public static createBodyRequest(obj:{}){
        return {body: obj}
    }

    /**
     * Instantiate mockResponse
     */
    public static createMockResponse():any {
        const mockResponse: any = {}
        mockResponse.json = sinon.fake();
        mockResponse.status = sinon.fake(() => mockResponse);
        mockResponse.send = sinon.fake();
        mockResponse.sendStatus = sinon.fake();
        return mockResponse;
    }

    /**
     * Instantiate mock mongoose and session
     * @returns fakeMongoose and fakeSession
     */
    public static createMockMongoose():{fakeMongoose:any, fakeSession:any} {
        var fakeSession: any = {
            startTransaction: sinon.fake(),
            commitTransaction: sinon.fake(),
            abortTransaction: sinon.fake(),
            endSession: sinon.fake(),
        }
        const fakeMongoose = sinon.replace(mongoose, "startSession", sinon.fake.returns(fakeSession));
        return {
            fakeMongoose:fakeMongoose,
            fakeSession:fakeSession
        };
    }
}