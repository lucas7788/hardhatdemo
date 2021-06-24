const {expect} = require("chai");

describe("RedPacket", function () {
    it("RedPacket", async function () {

        const [owner, acct1] = await ethers.getSigners();
        console.log("acct1:%s, owner:%s", acct1.address, owner.address);

        let balance = await acct1.getBalance();
        console.log("acct1 ong balance:", balance.toString());
        // console.log("provider:", provider);
        balance =await  owner.getBalance();
        console.log("owner ong balance:", balance.toString());

        const TokenDemo = await ethers.getContractFactory("TokenDemo");
        const tokenDemo = await TokenDemo.deploy(10000000, "L Token", 18, "LT");
        await tokenDemo.deployed();

        const RedPacket = await ethers.getContractFactory("RedPacket");
        const redPacket = await RedPacket.deploy(tokenDemo.address);
        await redPacket.deployed();

        expect(await redPacket.token()).to.equal(tokenDemo.address);


        console.log("redPacket.address:", redPacket.address);
        balance = await tokenDemo.balanceOf(owner.address)
        console.log("owner before balance:", balance.toString());
        const approveTx = await tokenDemo.approve(redPacket.address, 100);
        await approveTx.wait();

        const setGreetingTx = await redPacket.sendRedPacket(100, 10);
        // wait until the transaction is mined
        await setGreetingTx.wait();

        balance = await tokenDemo.balanceOf(owner.address);
        console.log("owner after balance:", balance.toString());
        res = await redPacket.packets(0);
        console.log("packets:", res);
        res = await redPacket.nextPacketId();
        console.log("nextPacketId:", res);

        balance = await tokenDemo.balanceOf(acct1.address);
        console.log("acct1 before balance2:", balance.toString());

        await redPacket.connect(acct1).receivePacket(0);

        balance = await tokenDemo.balanceOf(acct1.address);
        console.log("acct2 after balance2:", balance.toString());
    });
});
