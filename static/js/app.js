import { startTrainingMode, clearTrainingMode } from './training.js';
// 假设也有类似的模块，如 startLearningMode 和 startSimulationMode
import { startLearningMode } from './learning.js';
import { startSimulationMode, clearSimulationMode } from './simulation.js';

document.addEventListener("DOMContentLoaded", () => {
    const learningSection = document.getElementById("learning-section");
    const trainingSection = document.getElementById("training-section");
    const simulationSection = document.getElementById("simulation-section");

    // 显示指定的模块，并隐藏其他模块
    function showModule(module) {
        learningSection.style.display = module === 'learning' ? 'block' : 'none';
        trainingSection.style.display = module === 'training' ? 'block' : 'none';
        simulationSection.style.display = module === 'simulation' ? 'block' : 'none';

        // 在切换到其他模块时，清理内容
        if (module !== 'training') clearTrainingMode();
        if (module !== 'simulation') clearSimulationMode();
    }

    // 绑定按钮点击事件来切换模块
    document.getElementById("start-learning").addEventListener("click", () => {
        showModule('learning');
        startLearningMode();  // 假设学习模块的逻辑
    });

    document.getElementById("start-training").addEventListener("click", () => {
        showModule('training');
        startTrainingMode();
    });

    document.getElementById("start-simulation").addEventListener("click", () => {
        showModule('simulation');
        startSimulationMode();
    });

    // 更新下注大小的实时显示
    const betSizeInput = document.getElementById("bet-size");
    const betSizeValue = document.getElementById("bet-size-value");
    betSizeInput.addEventListener("input", () => {
        betSizeValue.textContent = `${betSizeInput.value} BB`;
    });
});
