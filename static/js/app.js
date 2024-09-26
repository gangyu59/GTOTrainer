import { startTrainingMode, clearTrainingMode } from './training.js';
import { startLearningMode } from './learning.js';
import { startSimulationMode, clearSimulationMode } from './simulation.js';
import { GTOCalculator } from './GTOCalculator.js';

// 创建并初始化 GTO 计算器实例
const gtoCalculator = new GTOCalculator();
gtoCalculator.initialize();  // 初始化并缓存所有策略

export { gtoCalculator };  // 导出 gtoCalculator 实例

//console.log("GTO计算器已初始化，策略已缓存");

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

	document.addEventListener("DOMContentLoaded", () => {
	    const betSizeInput = document.getElementById("bet-size");
	    if (betSizeInput) {
	        betSizeInput.addEventListener("input", () => {
	            const betSizeValue = document.getElementById("bet-size-value");
	            betSizeValue.textContent = `${betSizeInput.value} BB`;
	        });
	    } else {
	        console.error("找不到 betSizeInput 元素");
	    }
	});

});
