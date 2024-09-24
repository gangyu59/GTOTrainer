// 动态加载课程数据
async function loadLesson(lessonNumber) {
    try {
        const response = await fetch(`data/lesson${lessonNumber}.json`);
        if (!response.ok) {
            throw new Error(`无法加载第 ${lessonNumber} 课的内容`);
        }

        const lesson = await response.json();

        // 显示课程内容
        displayLesson(lesson, lessonNumber);
    } catch (error) {
        console.error("加载课程时出错: ", error);
    }
}

// 显示课程内容，并更新课号显示
function displayLesson(lesson, lessonNumber) {
    const feedbackSection = document.getElementById("feedback-section");
    const lessonLabel = document.getElementById("lesson-label");
    
    // 更新课号显示
    lessonLabel.textContent = `第 ${lessonNumber} 课`;

    // 显示课程内容
    feedbackSection.innerHTML = `
        <h2>${lesson.title}</h2>
        ${lesson.content}
    `;
}

// 启动学习模块
export function startLearningMode() {
    const gameSection = document.getElementById("game-section");
    const feedbackSection = document.getElementById("feedback-section");

    // 清空导航相关内容
    gameSection.innerHTML = ""; 
    feedbackSection.innerHTML = ""; 

    const lessonNav = document.createElement("div");
    lessonNav.id = "lesson-nav";

    // 创建左右导航按钮和显示当前课号的label
    const leftArrow = document.createElement("button");
    leftArrow.textContent = "←";
    
    const rightArrow = document.createElement("button");
    rightArrow.textContent = "→";
    
    const lessonLabel = document.createElement("span");
    lessonLabel.id = "lesson-label";
    lessonLabel.textContent = "第 1 课"; // 默认从第 1 课开始

    lessonNav.appendChild(leftArrow);
    lessonNav.appendChild(lessonLabel);
    lessonNav.appendChild(rightArrow);

    gameSection.appendChild(lessonNav);

    // 课程范围设置
    let currentLesson = 1; // 默认从第 1 课开始
    const numberOfLessons = 20; // 假设有 20 节课

    // 加载初始课程
    loadLesson(currentLesson);

    // 左箭头点击事件
    leftArrow.addEventListener("click", () => {
        if (currentLesson > 1) {
            currentLesson--;
            loadLesson(currentLesson);
        }
    });

    // 右箭头点击事件
    rightArrow.addEventListener("click", () => {
        if (currentLesson < numberOfLessons) {
            currentLesson++;
            loadLesson(currentLesson);
        }
    });
}

// 清理学习模块
export function clearLearningMode() {
    const gameSection = document.getElementById("game-section");
    const feedbackSection = document.getElementById("feedback-section");

    // 清空当前模块的内容，避免干扰其他模块
    gameSection.innerHTML = "";
    feedbackSection.innerHTML = "";
}

