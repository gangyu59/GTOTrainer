import { gtoCalculator } from './app.js';  // 从 app.js 导入 gtoCalculator

export async function startTrainingMode() {
    const gameSection = document.getElementById("training-section");
    const feedbackSection = document.getElementById("feedback-section");

    // 清空当前内容
    gameSection.innerHTML = "";
    feedbackSection.innerHTML = "";

    // 动态生成输入界面：选择位置
    const formGroupPosition = document.createElement("div");
    formGroupPosition.classList.add("form-group");

    const positionLabel = document.createElement("label");
    positionLabel.setAttribute("for", "position");
    positionLabel.innerText = "位置：";
    formGroupPosition.appendChild(positionLabel);

    const positionSelect = document.createElement("select");
    positionSelect.id = "position";
    const options = ["early", "middle", "late"];
    options.forEach(optionValue => {
        const option = document.createElement("option");
        option.value = optionValue;
        option.innerText = optionValue === "early" ? "前位（early）" : (optionValue === "middle" ? "中位（middle）" : "后位（late）");
        positionSelect.appendChild(option);
    });
    formGroupPosition.appendChild(positionSelect);
    gameSection.appendChild(formGroupPosition);

    // 动态生成输入框：输入手牌
    const formGroupUserAction = document.createElement("div");
    formGroupUserAction.classList.add("form-group");

    const userActionLabel = document.createElement("label");
    userActionLabel.setAttribute("for", "user-action");
    userActionLabel.innerText = "手牌：";
    formGroupUserAction.appendChild(userActionLabel);

    const userActionInput = document.createElement("input");
    userActionInput.id = "user-action";
    userActionInput.placeholder = "例如：AA, KK, AKs, AQo, ...";
    formGroupUserAction.appendChild(userActionInput);
    gameSection.appendChild(formGroupUserAction);

    // 动态生成下注大小的输入框
    const formGroupBetSize = document.createElement("div");
    formGroupBetSize.classList.add("form-group");

    const betSizeLabel = document.createElement("label");
    betSizeLabel.setAttribute("for", "bet-size");
    betSizeLabel.innerText = "码量：";
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

    betSizeInput.addEventListener("input", () => {
        betSizeValue.textContent = `${betSizeInput.value} BB`;
    });

    // 动态生成输入框：选择轮次
    const formGroupRound = document.createElement("div");
    formGroupRound.classList.add("form-group");

    const roundLabel = document.createElement("label");
    roundLabel.setAttribute("for", "round");
    roundLabel.innerText = "轮次：";
    formGroupRound.appendChild(roundLabel);

    const roundSelect = document.createElement("select");
    roundSelect.id = "round";
    const rounds = ["翻前（pre-flop）", "翻后（flop）", "转牌（turn）", "河牌（river）"];
    rounds.forEach(round => {
        const option = document.createElement("option");
        option.value = round;
        option.innerText = round;
        roundSelect.appendChild(option);
    });
    formGroupRound.appendChild(roundSelect);
    gameSection.appendChild(formGroupRound);

    // 动态生成输入框：选择对手类型
    const formGroupOpponentType = document.createElement("div");
    formGroupOpponentType.classList.add("form-group");

    const opponentLabel = document.createElement("label");
    opponentLabel.setAttribute("for", "opponent-type");
    opponentLabel.innerText = "对手：";
    formGroupOpponentType.appendChild(opponentLabel);

    const opponentSelect = document.createElement("select");
    opponentSelect.id = "opponent-type";
    const opponentTypes = ["紧凶（TAG）", "松凶（LAG）", "紧弱（TP）", "松弱（LP）"]; // 紧凶、松凶、紧弱、松弱
    opponentTypes.forEach(type => {
        const option = document.createElement("option");
        option.value = type;
        option.innerText = type;
        opponentSelect.appendChild(option);
    });
    formGroupOpponentType.appendChild(opponentSelect);
    gameSection.appendChild(formGroupOpponentType);

    // 动态生成提交按钮
    const submitButton = document.createElement("button");
    submitButton.id = "submit-action";
    submitButton.type = "button";
    submitButton.innerText = "提交";
    gameSection.appendChild(submitButton);

    // 提交按钮事件绑定
    submitButton.addEventListener("click", handleSubmit);
}

// 提交处理函数
function handleSubmit(event) {
    event.preventDefault();  // 阻止默认行为

    const userAction = document.getElementById("user-action").value.trim();
    let position = document.getElementById("position").value;
    let round = document.getElementById("round").value;
    let opponentType = document.getElementById("opponent-type").value;
    const feedbackSection = document.getElementById("feedback-section");

    // 映射中文选项为英文
    const positionMapping = {
        "前位（early）": "early",
        "中位（middle）": "middle",
        "后位（late）": "late"
    };

    const roundMapping = {
        "翻前（pre-flop）": "pre-flop",
        "翻后（flop）": "flop",
        "转牌（turn）": "turn",
        "河牌（river）": "river"
    };

    const opponentMapping = {
        "紧凶（TAG）": "TAG",
        "松凶（LAG）": "LAG",
        "紧弱（TP）": "TP",
        "松弱（LP）": "LP"
    };

    // 使用映射表获取英文
 //   position = positionMapping[position];
    round = roundMapping[round];
    opponentType = opponentMapping[opponentType];
		
    if (!userAction) {
        feedbackSection.innerHTML = "<p>请输入有效的手牌。</p>";
        return;
    }

    try {
        // 使用 GTO 计算器直接获取策略
        const strategy = gtoCalculator.getCachedStrategy(userAction, position, 100, round, opponentType);

        if (strategy) {
            // 显示行动及其概率
            let actionsHTML = strategy.actions.map(action => `${action.action} (概率: ${action.probability * 100}%)`).join(", ");
            feedbackSection.innerHTML = `<p>GTO建议: ${actionsHTML}</p>`;
            feedbackSection.innerHTML += `<p>期望值 (EV): ${calculateEV(strategy.actions)}</p>`;
        } else {
            feedbackSection.innerHTML = "<p>未找到该手牌的有效策略。</p>";
        }
    } catch (error) {
        feedbackSection.innerHTML = `<p>处理数据时出错，请稍后再试。</p>`;
        console.error("处理数据时出错：", error);
    }
}

// 计算期望值 (EV)
function calculateEV(actions) {
    // 计算期望值的简单示例，假设每个action都有一个相应的胜率
    let ev = 0;
    actions.forEach(action => {
        ev += action.probability * 100;  // 假设每个行动胜利的EV为100
    });
    return ev.toFixed(2);
}

// 清理训练模块
export function clearTrainingMode() {
    const gameSection = document.getElementById("game-section");
    const feedbackSection = document.getElementById("feedback-section");

    // 清空所有动态生成的内容
    gameSection.innerHTML = "";
    feedbackSection.innerHTML = "";
}
