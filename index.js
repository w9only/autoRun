const schedule = require('node-schedule');
const axios = require("axios");
const config = require("./config")
const turn_up_url = 'https://turnup-uw-test-apiv2.turnup.so/api/'

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getUserInfo(token) {
  let url = turn_up_url + 'v1/userinfo';
  let res = await axios.post(url, {userId: 0, token: token}, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  let data = res.data.data;
  let manUserId = data.userId;
  let useType = data.platformData.useType;
  let name;
  if(useType === 0) {
    name = data.platformData.defaultName;
  }else {
    name = data.platformData.platformMap[useType].displayName
  }
  return [name, manUserId]
}

async function getPortfolio(userId, token) {
  let url = turn_up_url + 'v1/portfolio';
  let res = await axios.post(url, {userId: userId, token: token}, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  let holding = res.data.data.holding;
  return holding
}

async function takeCoin(employeeId, token) {
  let url = turn_up_url + 'v1/friendtrade_takeworkcoin';
  return await axios.post(url, {employeeId: employeeId, token: token}, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}


async function batchSubmit(emplyeeIds, token) {
  let url = turn_up_url + 'v1/friendtrade_dispatch_batch_emplyees';
  return await axios.post(url, {emplyeeIds: emplyeeIds, token: token}, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

 async function takeCoinFunc(prefix, manUserId, holding, token) {
  let pokeList =[]
  for (let i = 0; i < holding.length; i++) {
    let obj = holding[i];
    let managerId = obj.managerId;
    let workId = obj.workId;
    // 当前等级
    let tierId = obj.tierId;
    let userId = obj.userId;
    let energy = obj.energy;
    let selfWorkProfit = obj.selfWorkProfit;
    if(manUserId != managerId ) {
        continue;
    }
    let targetName = obj.profile.displayName;
    // 进行收矿,收矿只支持单个
    if(workId === 0 && selfWorkProfit > 0) {
      console.log(prefix + "检测到【%s】club的可收矿,开始收矿", targetName);
        try {
            const tc = takeCoin(userId, token);
            pokeList.push(userId);
            console.log(prefix + "的【%s】club收矿完成,已收取:%f", targetName, selfWorkProfit);
        }catch (error) {
            console.log(prefix + "收取【%s】club的挖矿奖励失败,跳过不处理", targetName);
        }
    }

    // 进行挖矿，挖矿可以多个
    if(workId === 0 && selfWorkProfit === 0) {
        pokeList.push(userId);
    }
  }
  return pokeList
}

async function run(token) {
  // 用户信息
  var [name, manUserId] = await getUserInfo(token);

  var prefix = "用户【" + name + "】";
  console.log(prefix + "=======自动挖矿开始===========");

  // 挖矿列表
  let holding = await getPortfolio(manUserId, token)
  
  // 单个采矿
  let pokeList = await takeCoinFunc(prefix, manUserId,holding, token)

  // 批量挖矿
  if(pokeList.length > 0) {
    console.log(prefix + "检测到%d个club需挖矿, 开始批量挖矿", pokeList.length);
    try {
        batchSubmit(pokeList, token);
    }catch (error) {
      console.log(prefix + "的%d个club挖矿失败", );
    }
    console.log(prefix + "的%d个club进行批量挖矿成功", pokeList.length);
  }
  console.log(prefix + "=======自动挖矿结束===========");
}


async function autoRun() {
  let tokens = config.tokens;
  schedule.scheduleJob(config.corn, () => {
    for (let i = 0; i < tokens.length; i++) {
      run(tokens[i])
    }
  });
}


autoRun();
