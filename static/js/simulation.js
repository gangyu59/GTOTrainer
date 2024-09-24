// 开始模拟模式的占位符函数
export async function startSimulationMode() {
    const simulationSection = document.getElementById("simulation-section");
    simulationSection.innerHTML = "<p>模拟模式即将上线...</p>";
}

// 清理模拟模式的内容
export function clearSimulationMode() {
    const simulationSection = document.getElementById("simulation-section");
    simulationSection.innerHTML = "";  // 清空所有动态生成的内容
}
