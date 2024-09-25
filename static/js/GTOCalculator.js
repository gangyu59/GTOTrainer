class GTOCalculator {
    constructor() {
        this.strategyCache = {}; // 内存缓存
        this.opponentTypes = ["TAG", "LAG", "TP", "LP"]; // 对手类型：紧凶(Tight Aggressive)，松凶(Loose Aggressive)，紧弱(Tight Passive)，松弱(Loose Passive)
    }

    // 初始化函数，计算并缓存所有策略
    initialize() {
        const handRanges = this.getHandRanges();
        const positions = ["early", "middle", "late"];
        const stackSizes = [100, 200, 300]; // 示例不同筹码量
        const rounds = ["pre-flop", "flop", "turn", "river"];

        // 遍历所有手牌范围、位置、筹码量、轮次和对手类型，推导策略
        for (const hand of handRanges) {
            for (const position of positions) {
                for (const stackSize of stackSizes) {
                    for (const round of rounds) {
                        for (const opponentType of this.opponentTypes) {
                            const strategy = this.calculateStrategy(hand, position, stackSize, round, opponentType);
                            this.cacheStrategy(hand, position, stackSize, round, opponentType, strategy);
                        }
                    }
                }
            }
        }
    }

    // 获取手牌范围（可以根据具体需求扩展）
    getHandRanges() {
        return ["AA", "KK", "QQ", "AKs", "AQo", "22-99"]; // 示例手牌范围
    }

    // 计算给定手牌、位置、筹码量、轮次和对手类型的策略
    calculateStrategy(hand, position, stackSize, round, opponentType) {
        // 根据不同对手类型调整策略
        let strategy = {};
        if (round === "pre-flop") {
            strategy = this.calculatePreFlopStrategy(hand, position, stackSize, opponentType);
        } else {
            strategy = this.calculatePostFlopStrategy(hand, position, stackSize, round, opponentType);
        }
        return strategy;
    }

    // 计算翻牌前策略，包含对手类型的考量
    calculatePreFlopStrategy(hand, position, stackSize, opponentType) {
        let actions = [];
        if (position === "early") {
            actions = this.getEarlyPositionStrategy(hand, stackSize, opponentType);
        } else if (position === "middle") {
            actions = this.getMiddlePositionStrategy(hand, stackSize, opponentType);
        } else {
            actions = this.getLatePositionStrategy(hand, stackSize, opponentType);
        }
        return { round: "pre-flop", actions };
    }

    // 计算翻牌后策略，包含对手类型的考量
    calculatePostFlopStrategy(hand, position, stackSize, round, opponentType) {
        return { round, actions: this.getPostFlopActions(hand, stackSize, round, opponentType) };
    }

    // 示例：根据不同对手类型调整策略
    getEarlyPositionStrategy(hand, stackSize, opponentType) {
        if (hand === "AA" || hand === "KK") {
            return [{ action: "raise", probability: 1.0 }];
        }

        // 针对不同的对手类型调整策略
        if (opponentType === "TAG") { // 面对紧凶型对手
            return [{ action: "raise", probability: 0.8 }, { action: "fold", probability: 0.2 }];
        } else if (opponentType === "LAG") { // 面对松凶型对手
            return [{ action: "raise", probability: 0.6 }, { action: "call", probability: 0.4 }];
        } else if (opponentType === "TP") { // 面对紧弱型对手
            return [{ action: "raise", probability: 0.7 }, { action: "call", probability: 0.3 }];
        } else { // 面对松弱型对手 (LP)
            return [{ action: "raise", probability: 0.9 }, { action: "call", probability: 0.1 }];
        }
    }

    // 示例：翻牌后的策略
    getPostFlopActions(hand, stackSize, round, opponentType) {
        if (round === "flop") {
            if (opponentType === "TAG") {
                return [{ action: "bet", probability: 0.6 }, { action: "check", probability: 0.4 }];
            }
            if (opponentType === "LAG") {
                return [{ action: "bet", probability: 0.5 }, { action: "check", probability: 0.5 }];
            }
            if (opponentType === "TP") {
                return [{ action: "check", probability: 0.7 }, { action: "bet", probability: 0.3 }];
            }
            return [{ action: "bet", probability: 0.8 }, { action: "check", probability: 0.2 }];
        }
        if (round === "turn") {
            return [
                { action: "bet", probability: 0.6 },
                { action: "fold", probability: 0.4 }
            ];
        }
        return [
            { action: "check", probability: 0.7 },
            { action: "raise", probability: 0.3 }
        ];
    }

    // 缓存策略
    cacheStrategy(hand, position, stackSize, round, opponentType, strategy) {
        const key = `${hand}-${position}-${stackSize}-${round}-${opponentType}`;
        this.strategyCache[key] = strategy;

        // 如果你想持久化，可以使用 localStorage
        localStorage.setItem(key, JSON.stringify(strategy));
    }

    // 从缓存中获取策略
    getCachedStrategy(hand, position, stackSize, round, opponentType) {
        const key = `${hand}-${position}-${stackSize}-${round}-${opponentType}`;
        if (this.strategyCache[key]) {
            return this.strategyCache[key];
        }

        // 如果需要从localStorage获取
        const cached = localStorage.getItem(key);
        return cached ? JSON.parse(cached) : null;
    }
}

// 创建GTO计算器实例
const gtoCalculator = new GTOCalculator();
gtoCalculator.initialize();

// 示例：获取某手牌针对紧凶型对手的策略
console.log(gtoCalculator.getCachedStrategy("AA", "early", 100, "pre-flop", "TAG"));
