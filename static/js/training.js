export async function startTrainingMode() {
//    console.log("开始训练模式");

    const gameSection = document.getElementById("training-section");
    const feedbackSection = document.getElementById("feedback-section");

    // 清空当前内容
    gameSection.innerHTML = "";
    feedbackSection.innerHTML = "";

//    console.log("正在加载 GTO 数据...");
    const gtoData = await loadGTOData();

    if (!gtoData) {
        console.error("GTO 数据加载失败。");
        return;
    }

    // 动态生成输入界面
    const formGroupPosition = document.createElement("div");
    formGroupPosition.classList.add("form-group");

    const positionLabel = document.createElement("label");
    positionLabel.setAttribute("for", "position");
    positionLabel.innerText = "你的位置：";
    formGroupPosition.appendChild(positionLabel);

    const positionSelect = document.createElement("select");
    positionSelect.id = "position";
    const options = ["early", "middle", "late"];
    options.forEach(optionValue => {
        const option = document.createElement("option");
        option.value = optionValue;
        option.innerText = optionValue === "early" ? "前位" : (optionValue === "middle" ? "中位" : "后位");
        positionSelect.appendChild(option);
    });
    formGroupPosition.appendChild(positionSelect);
    gameSection.appendChild(formGroupPosition);

    // 动态生成输入框
    const formGroupUserAction = document.createElement("div");
    formGroupUserAction.classList.add("form-group");

    const userActionLabel = document.createElement("label");
    userActionLabel.setAttribute("for", "user-action");
    userActionLabel.innerText = "输入手牌：";
    formGroupUserAction.appendChild(userActionLabel);

    const userActionInput = document.createElement("input");
    userActionInput.id = "user-action";
    userActionInput.placeholder = "例如：AA, KK, AKs, AQo, ...";
    formGroupUserAction.appendChild(userActionInput);
    gameSection.appendChild(formGroupUserAction);

    // 动态生成下注大小的输入框和范围显示
    const formGroupBetSize = document.createElement("div");
    formGroupBetSize.classList.add("form-group");

    const betSizeLabel = document.createElement("label");
    betSizeLabel.setAttribute("for", "bet-size");
    betSizeLabel.innerText = "下注大小：";
    formGroupBetSize.appendChild(betSizeLabel);

    const betSizeInput = document.createElement("input");
    betSizeInput.id = "bet-size";
    betSizeInput.type = "range";
    betSizeInput.min = "1";
    betSizeInput.max = "10";
    betSizeInput.value = "5";
    formGroupBetSize.appendChild(betSizeInput);

    const betSizeValue = document.createElement("span");
    betSizeValue.id = "bet-size-value";
    betSizeValue.innerText = "5 BB";
    formGroupBetSize.appendChild(betSizeValue);
    gameSection.appendChild(formGroupBetSize);

    // 更新下注大小的显示
    betSizeInput.addEventListener("input", () => {
        betSizeValue.textContent = `${betSizeInput.value} BB`;
    });

    // 动态生成提交按钮
    const submitButton = document.createElement("button");
    submitButton.id = "submit-action";
    submitButton.type = "button";
    submitButton.innerText = "提交";
    gameSection.appendChild(submitButton);

    // 提交按钮事件绑定
    submitButton.addEventListener("click", handleSubmit);

//    console.log("训练模式界面已加载，按钮事件已绑定");
}

// 提交处理函数
function handleSubmit(event) {
//    console.log("进入提交处理函数");
		event.preventDefault();  // 确保阻止默认行为
//    console.log("点击了提交按钮");

    const userAction = document.getElementById("user-action").value.trim();
    const feedbackSection = document.getElementById("feedback-section");

//    console.log(`提交的手牌: ${userAction}`);

    if (!userAction) {
        feedbackSection.innerHTML = "<p>请输入有效的手牌。</p>";
        return;
    }

    // 处理用户输入并加载 GTO 数据
    loadGTOData().then(gtoData => {
        processUserAction(userAction, gtoData);
    }).catch(error => {
        console.error("处理数据时出错：", error);
        feedbackSection.innerHTML = "<p>数据加载错误，请稍后再试。</p>";
    });
}

// 加载GTO策略数据
async function loadGTOData() {
    try {
        const response = await fetch(`data/strategy.json`);
        if (!response.ok) {
            throw new Error(`无法加载GTO数据：${response.status} ${response.statusText}`);
        }

        const data = await response.json();
//        console.log("成功加载 GTO 数据", data);
        return data;
    } catch (error) {
        console.error("加载GTO数据时出错：", error);
        throw error;
    }
}

// 处理用户输入并给出建议
function processUserAction(userAction, gtoData) {
    const feedbackSection = document.getElementById("feedback-section");
//    console.log("正在处理用户输入:", userAction);

    if (gtoData[userAction]) {
        const action = gtoData[userAction].action;
//        console.log(`GTO建议: ${action}`);
        feedbackSection.innerHTML = `<p>GTO建议: ${action}</p>`;
        showNextActions(gtoData[userAction].next);
    } else {
        console.log("无效的手牌输入");
        feedbackSection.innerHTML = `<p>无效的输入，请输入例如 AA、KK、AKs 等手牌。</p>`;
    }
}

// 显示对手的反应和后续行动
function showNextActions(next) {
    const feedbackSection = document.getElementById("feedback-section");
    let responsesHTML = "";

    if (next && next.response) {
        next.response.forEach(response => {
            responsesHTML += `<p>对手反应: ${response.action} (概率: ${response.probability})</p>`;
            if (response.next && response.next.response) {
                responsesHTML += "<p>可能的后续行动:</p>";
                response.next.response.forEach(res => {
                    responsesHTML += `<p>${res.action} (概率: ${res.probability})</p>`;
                });
            }
        });
    }

    feedbackSection.innerHTML += responsesHTML;
}

// 清理训练模块
export function clearTrainingMode() {
    const gameSection = document.getElementById("game-section");
    const feedbackSection = document.getElementById("feedback-section");

    // 清空所有动态生成的内容
    gameSection.innerHTML = "";
    feedbackSection.innerHTML = "";
//    console.log("清理训练模式内容");
}
