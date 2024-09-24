// 开始训练模式
export async function startTrainingMode() {
    console.log("开始训练模式");

    const gameSection = document.getElementById("game-section");
    const feedbackSection = document.getElementById("feedback-section");

    // 清空当前内容
    gameSection.innerHTML = "";
    feedbackSection.innerHTML = "";

    console.log("正在加载 GTO 数据...");
    const gtoData = await loadGTOData();

    if (!gtoData) {
        console.error("GTO 数据加载失败。");
        return;
    }

    // 创建输入界面
    gameSection.innerHTML = `
        <h2>训练模式</h2>
        <label for="position">选择你的位置：</label>
        <select id="position">
            <option value="early">早期位置</option>
            <option value="middle">中期位置</option>
            <option value="late">后卫位置</option>
        </select>
        <br><br>
        <label for="user-action">输入你的行动：</label>
        <input type="text" id="user-action" placeholder="例如：AA, KK, AKs"/>
        <br><br>
        <button id="submit-action">提交行动</button>
    `;

    console.log("输入界面已创建");

    // 在创建界面后，立即尝试找到提交按钮
    const submitButton = document.getElementById("submit-action");

    if (!submitButton) {
        console.error("提交按钮未找到，无法绑定事件");
        return;
    } else {
        console.log("成功找到提交按钮，准备绑定事件");
    }

    // 添加事件监听器
    submitButton.addEventListener("click", () => {
        console.log("点击了提交按钮");
        const userAction = document.getElementById("user-action").value.trim();
        console.log(`提交的手牌: ${userAction}`);

        if (!userAction) {
            feedbackSection.innerHTML = "<p>请输入有效的手牌。</p>";
            return;
        }

        // 处理用户输入
        processUserAction(userAction, gtoData);
    });

    console.log("提交按钮事件已绑定");
}

// 加载GTO策略数据
async function loadGTOData() {
    try {
        const response = await fetch(`data/strategy.json`);
        if (!response.ok) {
            throw new Error(`无法加载GTO数据：${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("成功加载 GTO 数据", data);
        return data;
    } catch (error) {
        console.error("加载GTO数据时出错：", error);
        throw error;
    }
}

// 处理用户输入并给出建议
function processUserAction(userAction, gtoData) {
    const feedbackSection = document.getElementById("feedback-section");
    console.log("正在处理用户输入:", userAction);

    if (gtoData) {
        console.log("GTO 数据:", gtoData);
    } else {
        console.error("GTO 数据为空，无法处理用户输入");
        feedbackSection.innerHTML = "<p>数据加载错误，请稍后再试。</p>";
        return;
    }

    // 查找手牌数据
    if (gtoData[userAction]) {
        const action = gtoData[userAction].action;
        console.log(`GTO建议: ${action}`);
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

    // 如果有后续行动，显示对手的反应和可能的后续行动
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
    console.log("清理训练模式内容");
}
