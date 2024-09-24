// 导入学习、训练、模拟模块
import { startLearningMode } from './learning.js';
import { startTrainingMode } from './training.js';
import { startSimulationMode } from './simulation.js';

document.addEventListener("DOMContentLoaded", () => {
    // 获取按钮并绑定事件
    document.getElementById("start-training").addEventListener("click", startTrainingMode);
    document.getElementById("start-learning").addEventListener("click", startLearningMode);
    document.getElementById("start-simulation").addEventListener("click", startSimulationMode);
});