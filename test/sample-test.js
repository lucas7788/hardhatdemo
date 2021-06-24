const {expect} = require("chai");

describe("RedPacket", function () {
    let tokenDemo, redPacket, owner, acct1;
    beforeEach(async function () {
        const TokenDemo = await ethers.getContractFactory("TokenDemo");
        tokenDemo = await TokenDemo.deploy(10000000, "L Token", 18, "LT");
        await tokenDemo.deployed();
        const RedPacket = await ethers.getContractFactory("RedPacket");
        redPacket = await RedPacket.deploy(tokenDemo.address);
        await redPacket.deployed();
        console.log("redPacket.address:", redPacket.address);
        [owner, acct1] = await ethers.getSigners();
    });
    it("balance", async function () {
        let balance = await acct1.getBalance();
        console.log("acct1 ong balance:", balance.toString());
        balance = await owner.getBalance();
        console.log("owner ong balance:", balance.toString());
    });
    it("token", async function () {
        expect(await redPacket.token()).to.equal(tokenDemo.address);
    });
    it("sendRedPacket", async function () {
        balance = await tokenDemo.balanceOf(owner.address)
        console.log("owner before balance:", balance.toString());
        const approveTx = await tokenDemo.approve(redPacket.address, 100);
        await approveTx.wait();
        const sendRedPacketTx = await redPacket.sendRedPacket(100, 10);
        await sendRedPacketTx.wait();
        balance = await tokenDemo.balanceOf(owner.address);
        console.log("owner after balance:", balance.toString());
    });
    it("after sendRedPacket", async function () {
        res = await redPacket.packets(0);
        console.log("packets:", res);
        res = await redPacket.nextPacketId();
        console.log("nextPacketId:", res);
    });
    it("receivePacket", async function () {
        balance = await tokenDemo.balanceOf(acct1.address);
        console.log("acct1 before balance2:", balance.toString());
        await redPacket.connect(acct1).receivePacket(0);
        balance = await tokenDemo.balanceOf(acct1.address);
        console.log("acct2 after balance2:", balance.toString());
    });
});
