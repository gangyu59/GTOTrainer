export function startSimulationMode() {
    const gameSection = document.getElementById("game-section");
    const feedbackSection = document.getElementById("feedback-section");

    gameSection.innerHTML = "<p>进行牌局模拟...</p>";
    feedbackSection.innerHTML = "<p>输入牌局进行模拟...</p>";

    // 此处可以实现用户输入牌局和反馈逻辑
}