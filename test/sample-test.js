const {expect} = require("chai");

describe("RedPacket", function () {
    let tokenDemo, redPacket, owner, acct1, assetAmount;
    beforeEach(async function () {
        const TokenDemo = await ethers.getContractFactory("TokenDemo");
        tokenDemo = await TokenDemo.deploy(10000000, "L Token", 18, "LT");
        await tokenDemo.deployed();
        const RedPacket = await ethers.getContractFactory("RedPacket");
        redPacket = await RedPacket.deploy(tokenDemo.address);
        await redPacket.deployed();
        [owner, acct1] = await ethers.getSigners();
        assetAmount = 1000;
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
        let beforeBalance = await tokenDemo.balanceOf(owner.address)
        const approveTx = await tokenDemo.approve(redPacket.address, assetAmount);
        await approveTx.wait();
        const sendRedPacketTx = await redPacket.sendRedPacket(assetAmount, 10);
        await sendRedPacketTx.wait();
        let afterBalance = await tokenDemo.balanceOf(owner.address);
        expect(afterBalance-beforeBalance).to.equal(assetAmount);
    });
    it("after sendRedPacket", async function () {
        res = await redPacket.packets(0);
        expect(res.receivedIndex).to.equal(0);
        res = await redPacket.nextPacketId();
        expect(res).to.equal(1);
    });
    it("receivePacket", async function () {
        balance = await tokenDemo.balanceOf(acct1.address);
        console.log("acct1 before balance2:", balance.toString());
        await redPacket.connect(acct1).receivePacket(0);
        balance = await tokenDemo.balanceOf(acct1.address);
        console.log("acct2 after balance2:", balance.toString());
    });
});
