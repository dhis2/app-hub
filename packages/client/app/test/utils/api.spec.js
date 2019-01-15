import __RewireAPI__, * as api from "../../src/api/api.js";

let fetchStub;
const randomToken = "aRandomBearerToken";
const authHeader = {
    Authorization: `Bearer ${randomToken}`
};
let fromApiSpy;
let baseOptions;
let successResponse;
let errorResponse;

describe("API", () => {
    beforeEach(() => {
        successResponse = new Response(JSON.stringify({}), {
            status: 200
        });

        errorResponse = new Response(JSON.stringify({}), {
            status: 401
        });
        __RewireAPI__.__Rewire__("getAuthHeaders", () => authHeader);
        //get non exported values
        baseOptions = __RewireAPI__.__GetDependency__('baseOptions');
        fetchStub = sinon.stub(global, "fetch");
        fetchStub.resolves(successResponse);
        fromApiSpy = sinon.spy(api, "fromApi");
    });

    afterEach(() => {
        fetchStub.restore();
        fromApiSpy.restore();
        __RewireAPI__.__ResetDependency__('getAuthHeaders');
    });

    describe("getAllApps()", () => {
        it("should call fromApi with correct url and auth=true", () => {
            const url = "apps/all";
            return api.getAllApps().then(() => {
                expect(fromApiSpy.calledWith(url, true));
            });
        });
    });

    describe("fromApi()", () => {
        it("should return the response from fetch jsonified", () => {
            return expect(api.fromApi("apps")).to.eventually.be.eql({});
        });

        it("should call fetch with method as GET by default", () => {
            return api.fromApi("apps").then(() => {
                const args = fetchStub.args[0][1];
                expect(args.method).to.be.equal("GET")
            })
        });

        it("should reject the promise with the response if status is not ok", () => {
            fetchStub.rejects(errorResponse);
            return expect(
                api.fromApi("apps")
            ).to.be.rejected
                .and.to.eventually.be.eql(errorResponse)
                .and.to.have.property("ok", false);
        });

        it("should call fetch with given URL concatenated to baseURL", () => {
            const url = "apps/all";
            return api.fromApi(url).then(() => {
                const args = fetchStub.args[0];
                expect(args[0]).to.include(url);
            });
        });

        it("should use authorization header if auth=true", () => {
            return api.fromApi("apps", true).then(() => {
                const args = fetchStub.args[0][1];
                expect(args.headers).to.have.property('Authorization')
                expect(args.headers).to.be.eql(authHeader);
            });
        });

        it("should not send headers if auth is omitted", () => {
            return api.fromApi("apps").then(() => {
                const args = fetchStub.args[0][1];
                expect(args.headers).to.not.exist;
            });
        });

        it("should merge extraOpts with defaultOpts and call fetch with merged opts", () => {
            const extraOpts = {credentials: 'include'}
            return api.fromApi("apps", false, extraOpts).then(() => {
                const args = fetchStub.args[0][1];
                expect(args.headers).to.not.exist;
                expect(args).to.be.an("object").that.includes(extraOpts).and.has.property('method')
                    .that.is.eql(baseOptions.method);
            });
        });

        it("should merge extraOpts with Headers and defaultOpts and call fetch with merged opts", () => {
            const extraOpts = {credentials: 'include'}
            return api.fromApi("apps", true, extraOpts).then(() => {
                const args = fetchStub.args[0][1];
                expect(args.headers).to.exist.with.property('Authorization');
                expect(args.headers).to.be.eql({
                    Authorization: `Bearer ${randomToken}`
                })
                expect(args).to.be.an("object").that.includes(extraOpts);
            });
        });
    });
});
