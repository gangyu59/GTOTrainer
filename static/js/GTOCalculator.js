export class GTOCalculator {
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
        const opponentTypes = this.opponentTypes;

        // 遍历所有手牌范围、位置、筹码量、轮次和对手类型，推导策略
        for (const hand of handRanges) {
            for (const position of positions) {
                for (const stackSize of stackSizes) {
                    for (const round of rounds) {
                        for (const opponentType of opponentTypes) {
                            const strategy = this.calculateStrategy(hand, position, stackSize, round, opponentType);
                            this.cacheStrategy(hand, position, stackSize, round, opponentType, strategy);
                        }
                    }
                }
            }
        }

        console.log("策略初始化完成，已缓存所有策略");
    }

    // 获取手牌范围（可以根据具体需求扩展）
    getHandRanges() {
        return [
            "AA", "KK", "QQ", "JJ", "TT", "99", "88", "77", "66", "55", "44", "33", "22",
            "AKs", "AQs", "AJs", "ATs", "KQs", "QJs", "JTs",  // suited hands
            "AKo", "AQo", "AJo", "KQo", "QJo", "JTo", "T9o"  // offsuit hands
        ];
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

    // 示例：根据不同对手类型调整策略 - 早期位置
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

    // 示例：根据不同对手类型调整策略 - 中期位置
    getMiddlePositionStrategy(hand, stackSize, opponentType) {
        if (hand === "AA" || hand === "KK" || hand === "QQ") {
            return [{ action: "raise", probability: 0.9 }, { action: "call", probability: 0.1 }];
        }

        // 针对不同的对手类型调整策略
        if (opponentType === "TAG") { // 面对紧凶型对手
            return [{ action: "raise", probability: 0.7 }, { action: "call", probability: 0.3 }];
        } else if (opponentType === "LAG") { // 面对松凶型对手
            return [{ action: "raise", probability: 0.5 }, { action: "call", probability: 0.5 }];
        } else if (opponentType === "TP") { // 面对紧弱型对手
            return [{ action: "raise", probability: 0.6 }, { action: "call", probability: 0.4 }];
        } else { // 面对松弱型对手 (LP)
            return [{ action: "raise", probability: 0.85 }, { action: "call", probability: 0.15 }];
        }
    }

    // 示例：根据不同对手类型调整策略 - 后期位置
    getLatePositionStrategy(hand, stackSize, opponentType) {
        if (hand === "AA" || hand === "KK" || hand === "AKs") {
            return [{ action: "raise", probability: 0.85 }, { action: "call", probability: 0.15 }];
        }

        // 针对不同的对手类型调整策略
        if (opponentType === "TAG") { // 面对紧凶型对手
            return [{ action: "raise", probability: 0.65 }, { action: "call", probability: 0.35 }];
        } else if (opponentType === "LAG") { // 面对松凶型对手
            return [{ action: "raise", probability: 0.55 }, { action: "call", probability: 0.45 }];
        } else if (opponentType === "TP") { // 面对紧弱型对手
            return [{ action: "raise", probability: 0.75 }, { action: "call", probability: 0.25 }];
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
//        console.log(`策略已缓存，键为: ${key}`);
    }

    // 从缓存中获取策略
    getCachedStrategy(hand, position, stackSize, round, opponentType) {
        const key = `${hand}-${position}-${stackSize}-${round}-${opponentType}`;
 //       console.log("正在查找策略，生成的键为: ", key);

        if (this.strategyCache[key]) {
            return this.strategyCache[key];
        } else {
            console.error("未找到该手牌的策略，缓存中不存在该键: ", key);
            return null;
        }
    }
}