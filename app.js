// ============================================================================
// GAME STATE MANAGEMENT - ENHANCED WITH CLICK LIMIT
// ============================================================================

const GameState = {
    // Points and Stats
    points: 0,
    totalClicks: 0,
    clicksToday: 0,
    lastClickDate: null,
    
    // Click Limit System
    clickLimit: {
        maxClicks: 600,
        clicksUsed: 0,
        periodHours: 3,
        lastReset: Date.now(),
        nextReset: Date.now() + (3 * 60 * 60 * 1000) // 3 hours from now
    },
    
    // Boosters
    activeBoosters: [],
    boostersHistory: [],
    
    // Tasks
    tasks: {
        ads: {
            count: {1: 0, 2: 0, 3: 0, 4: 0},
            lastReset: Date.now()
        },
        channels: {
            1: false,
            2: false,
            3: false
        }
    },
    
    // Daily Bonus
    dailyBonus: {
        lastClaimed: null,
        streak: 0
    },
    
    // User Data
    username: 'user123',
    usernameChanges: 0,
    accountCreated: Date.now(),
    
    // Referrals
    referrals: [],
    referralCode: generateReferralCode(),
    
    // Withdrawals
    withdrawals: [],
    
    // Settings
    settings: {
        soundEnabled: true,
        notificationsEnabled: true
    }
};

const CONFIG = {
    // Points
    basePointsPerClick: 1,
    
    // Click Limit
    CLICK_LIMIT: {
        MAX_CLICKS: 600,
        PERIOD_HOURS: 3,
        PERIOD_MS: 3 * 60 * 60 * 1000,
        WARNING_THRESHOLD: 450, // 75% warning
        DANGER_THRESHOLD: 540   // 90% danger
    },
    
    // Boosters
    boosters: {
        '2x': {
            name: 'x2 Clicks',
            cost: 2000,
            duration: 120000,
            multiplier: 2
        },
        'fast': {
            name: 'Fast Clicks',
            cost: 2000,
            duration: 120000,
            interval: 500
        }
    },
    
    // Daily Bonus
    dailyBonusAmount: 50,
    dailyBonusCooldown: 24 * 60 * 60 * 1000,
    
    // Tasks
    tasksConfig: {
        ads: {
            reward: 100,
            dailyLimit: 2,
            resetTime: 24 * 60 * 60 * 1000
        },
        channels: {
            reward: 250
        }
    },
    
    // Withdrawal
    withdrawalRequirements: {
        minReferrals: 10,
        minAccountAge: 7 * 24 * 60 * 60 * 1000
    },
    withdrawalOptions: {
        'canva-link': {name: 'Canva Pro (Direct Link)', cost: 4500},
        'canva-email': {name: 'Canva Pro (Email)', cost: 6000},
        '1usdt': {name: '1 USDT', cost: 7500},
        '5usdt': {name: '5 USDT', cost: 15000},
        '10usdt': {name: '10 USDT', cost: 30000},
        '20usdt': {name: '20 USDT', cost: 50000}
    },
    
    // Username Changes
    usernameChangeCost: 3500,
    
    // Referral
    referralCommission: 0.1
};

// ============================================================================
// DOM ELEMENTS - ENHANCED
// ============================================================================

const DOM = {
    // Header
    headerPoints: document.getElementById('headerPoints'),
    clickLimitIndicator: document.getElementById('clickLimitIndicator'),
    remainingClicks: document.getElementById('remainingClicks'),
    
    // Click Limit Banner
    clickLimitBanner: document.getElementById('clickLimitBanner'),
    clickProgressFill: document.getElementById('clickProgressFill'),
    clickProgressText: document.getElementById('clickProgressText'),
    limitTimer: document.getElementById('limitTimer'),
    
    // Pages
    pages: document.querySelectorAll('.page'),
    navItems: document.querySelectorAll('.nav-item'),
    
    // Dashboard Elements
    mainPoints: document.getElementById('mainPoints'),
    todayClicks: document.getElementById('todayClicks'),
    multiplier: document.getElementById('multiplier'),
    activeBoosts: document.getElementById('activeBoosts'),
    perClick: document.getElementById('perClick'),
    clickerCircle: document.getElementById('clickerCircle'),
    clickEffect: document.getElementById('clickEffect'),
    clicksLeft: document.getElementById('clicksLeft'),
    clickLimitWarning: document.getElementById('clickLimitWarning'),
    
    // Boosters
    activate2x: document.getElementById('activate2x'),
    activateFast: document.getElementById('activateFast'),
    claimDaily: document.getElementById('claimDaily'),
    timer2x: document.getElementById('timer2x'),
    timerFast: document.getElementById('timerFast'),
    dailyTimer: document.getElementById('dailyTimer'),
    boost2xStatus: document.getElementById('boost2xStatus'),
    boostFastStatus: document.getElementById('boostFastStatus'),
    
    // Tasks
    adCounts: {
        1: document.getElementById('adCount1'),
        2: document.getElementById('adCount2'),
        3: document.getElementById('adCount3'),
        4: document.getElementById('adCount4')
    },
    adButtons: document.querySelectorAll('.ad-watch'),
    channelButtons: document.querySelectorAll('.channel-join'),
    
    // Withdraw
    reqPoints: document.getElementById('reqPoints'),
    reqReferrals: document.getElementById('reqReferrals'),
    reqAge: document.getElementById('reqAge'),
    statusFill: document.getElementById('statusFill'),
    statusText: document.getElementById('statusText'),
    rewardButtons: document.querySelectorAll('.reward-btn'),
    
    // Referral
    totalReferrals: document.getElementById('totalReferrals'),
    referralPoints: document.getElementById('referralPoints'),
    referralLinkInput: document.getElementById('referralLinkInput'),
    copyReferralLink: document.getElementById('copyReferralLink'),
    referralsTable: document.getElementById('referralsTable'),
    
    // Settings
    currentUsername: document.getElementById('currentUsername'),
    usernameChangeCost: document.getElementById('usernameChangeCost'),
    accountCreatedDate: document.getElementById('accountCreatedDate'),
    changeUsernameBtn: document.getElementById('changeUsernameBtn'),
    resetDataBtn: document.getElementById('resetDataBtn'),
    
    // Modals
    modalOverlay: document.getElementById('modalOverlay'),
    usernameModal: document.getElementById('usernameModal'),
    withdrawModal: document.getElementById('withdrawModal'),
    privacyModal: document.getElementById('privacyModal'),
    termsModal: document.getElementById('termsModal'),
    disclaimerModal: document.getElementById('disclaimerModal'),
    
    // Modal Elements
    closeUsernameModal: document.getElementById('closeUsernameModal'),
    cancelUsername: document.getElementById('cancelUsername'),
    saveUsername: document.getElementById('saveUsername'),
    newUsername: document.getElementById('newUsername'),
    costNotice: document.getElementById('costNotice'),
    
    closeWithdrawModal: document.getElementById('closeWithdrawModal'),
    cancelWithdraw: document.getElementById('cancelWithdraw'),
    confirmWithdraw: document.getElementById('confirmWithdraw'),
    withdrawRewardName: document.getElementById('withdrawRewardName'),
    withdrawCost: document.getElementById('withdrawCost'),
    checkPoints: document.getElementById('checkPoints'),
    checkReferrals: document.getElementById('checkReferrals'),
    codeSection: document.getElementById('codeSection'),
    withdrawCode: document.getElementById('withdrawCode'),
    copyWithdrawCode: document.getElementById('copyWithdrawCode'),
    
    // Toast
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage'),
    
    // Floating Container
    floatingContainer: document.getElementById('floatingContainer')
};

// ============================================================================
// CLICK LIMIT SYSTEM
// ============================================================================

class ClickLimitManager {
    static checkClickLimit() {
        const now = Date.now();
        const limit = GameState.clickLimit;
        
        // Check if reset period has passed
        if (now >= limit.nextReset) {
            this.resetClickLimit();
            return {
                canClick: true,
                remaining: limit.maxClicks - limit.clicksUsed,
                limitReached: false
            };
        }
        
        const remaining = limit.maxClicks - limit.clicksUsed;
        const canClick = remaining > 0;
        
        return {
            canClick,
            remaining,
            limitReached: !canClick
        };
    }
    
    static useClick() {
        const limit = GameState.clickLimit;
        if (limit.clicksUsed < limit.maxClicks) {
            limit.clicksUsed++;
            return true;
        }
        return false;
    }
    
    static resetClickLimit() {
        const now = Date.now();
        GameState.clickLimit = {
            maxClicks: CONFIG.CLICK_LIMIT.MAX_CLICKS,
            clicksUsed: 0,
            periodHours: CONFIG.CLICK_LIMIT.PERIOD_HOURS,
            lastReset: now,
            nextReset: now + CONFIG.CLICK_LIMIT.PERIOD_MS
        };
        saveGameState();
        return true;
    }
    
    static getRemainingClicks() {
        const limit = GameState.clickLimit;
        const remaining = limit.maxClicks - limit.clicksUsed;
        return Math.max(0, remaining);
    }
    
    static getTimeUntilReset() {
        const now = Date.now();
        const timeLeft = GameState.clickLimit.nextReset - now;
        
        if (timeLeft <= 0) {
            this.resetClickLimit();
            return 0;
        }
        
        return timeLeft;
    }
    
    static getUsagePercentage() {
        const limit = GameState.clickLimit;
        return (limit.clicksUsed / limit.maxClicks) * 100;
    }
    
    static getStatusColor() {
        const percentage = this.getUsagePercentage();
        
        if (percentage >= CONFIG.CLICK_LIMIT.DANGER_THRESHOLD) {
            return '#ff3b30'; // Red
        } else if (percentage >= CONFIG.CLICK_LIMIT.WARNING_THRESHOLD) {
            return '#ff9500'; // Orange
        } else {
            return '#34c759'; // Green
        }
    }
    
    static updateUI() {
        const remaining = this.getRemainingClicks();
        const percentage = this.getUsagePercentage();
        const timeLeft = this.getTimeUntilReset();
        const statusColor = this.getStatusColor();
        
        // Update header indicator
        DOM.remainingClicks.textContent = remaining;
        DOM.clickLimitIndicator.style.color = statusColor;
        
        // Update click limit banner
        DOM.clickProgressFill.style.width = `${percentage}%`;
        DOM.clickProgressFill.style.backgroundColor = statusColor;
        DOM.clickProgressText.textContent = `${remaining} clicks remaining`;
        
        // Update timer
        if (timeLeft > 0) {
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            DOM.limitTimer.textContent = `Resets in ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            DOM.limitTimer.textContent = 'Ready!';
        }
        
        // Update stats bar
        DOM.clicksLeft.textContent = remaining;
        DOM.clicksLeft.className = 'stat-value click-limit-value';
        
        if (percentage >= CONFIG.CLICK_LIMIT.DANGER_THRESHOLD) {
            DOM.clicksLeft.classList.add('danger');
            DOM.clicksLeft.classList.remove('warning');
        } else if (percentage >= CONFIG.CLICK_LIMIT.WARNING_THRESHOLD) {
            DOM.clicksLeft.classList.add('warning');
            DOM.clicksLeft.classList.remove('danger');
        } else {
            DOM.clicksLeft.classList.remove('warning', 'danger');
        }
        
        // Update clicker button state
        const canClick = remaining > 0;
        DOM.clickerCircle.classList.toggle('disabled', !canClick);
        
        // Show/hide warning
        if (remaining === 0) {
            DOM.clickLimitWarning.classList.remove('hidden');
        } else {
            DOM.clickLimitWarning.classList.add('hidden');
        }
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

function init() {
    loadGameState();
    setupEventListeners();
    initTelegramWebApp();
    updateUI();
    startGameLoop();
    checkDailyReset();
    
    showToast('Welcome to CPro Store! Click to earn points.', 'success');
}

function initTelegramWebApp() {
    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();
        
        const user = Telegram.WebApp.initDataUnsafe?.user;
        if (user) {
            if (user.username) {
                GameState.username = user.username;
            } else if (user.first_name) {
                GameState.username = user.first_name;
            }
            updateReferralLink();
        }
        
        Telegram.WebApp.setHeaderColor('#0088cc');
        Telegram.WebApp.setBackgroundColor('#f2f2f7');
    }
}

// ============================================================================
// GAME STATE MANAGEMENT
// ============================================================================

function loadGameState() {
    const saved = localStorage.getItem('cproStoreGame');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            Object.keys(parsed).forEach(key => {
                if (GameState[key] !== undefined) {
                    if (key === 'dailyBonus' && parsed[key].lastClaimed) {
                        parsed[key].lastClaimed = new Date(parsed[key].lastClaimed);
                    }
                    if (key === 'accountCreated') {
                        parsed[key] = new Date(parsed[key]);
                    }
                    if (key === 'tasks' && parsed[key].ads && parsed[key].ads.lastReset) {
                        parsed[key].ads.lastReset = new Date(parsed[key].ads.lastReset);
                    }
                    if (key === 'clickLimit' && parsed[key].lastReset) {
                        parsed[key].lastReset = new Date(parsed[key].lastReset);
                        // Update next reset time
                        parsed[key].nextReset = parsed[key].lastReset + (CONFIG.CLICK_LIMIT.PERIOD_HOURS * 60 * 60 * 1000);
                    }
                    GameState[key] = parsed[key];
                }
            });

            const now = Date.now();
            GameState.activeBoosters = GameState.activeBoosters.filter(booster => {
                return booster.expires > now;
            });

            // Check if click limit needs reset
            if (now >= GameState.clickLimit.nextReset) {
                ClickLimitManager.resetClickLimit();
            }

        } catch (error) {
            console.error('Error loading game state:', error);
            resetGameData(true);
        }
    }
}

function saveGameState() {
    try {
        const toSave = JSON.parse(JSON.stringify(GameState));
        localStorage.setItem('cproStoreGame', JSON.stringify(toSave));
    } catch (error) {
        console.error('Error saving game state:', error);
    }
}

function resetGameData(confirm = false) {
    if (!confirm) {
        if (!window.confirm('Are you sure you want to reset all data? This cannot be undone!')) {
            return;
        }
    }
    
    GameState.points = 0;
    GameState.totalClicks = 0;
    GameState.clicksToday = 0;
    GameState.activeBoosters = [];
    GameState.boostersHistory = [];
    GameState.tasks = {
        ads: {count: {1: 0, 2: 0, 3: 0, 4: 0}, lastReset: Date.now()},
        channels: {1: false, 2: false, 3: false}
    };
    GameState.dailyBonus = {lastClaimed: null, streak: 0};
    GameState.usernameChanges = 0;
    GameState.referrals = [];
    GameState.withdrawals = [];
    GameState.accountCreated = Date.now();
    GameState.referralCode = generateReferralCode();
    
    // Reset click limit
    ClickLimitManager.resetClickLimit();
    
    localStorage.removeItem('cproStoreGame');
    
    if (!confirm) {
        showToast('Game data has been reset.', 'info');
    }
    
    updateUI();
}

// ============================================================================
// EVENT LISTENERS SETUP
// ============================================================================

function setupEventListeners() {
    // Navigation
    DOM.navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            switchPage(item.dataset.page);
        });
    });
    
    // Clicker with limit check
    DOM.clickerCircle.addEventListener('click', handleClick);
    
    // Boosters
    DOM.activate2x.addEventListener('click', () => activateBooster('2x'));
    DOM.activateFast.addEventListener('click', () => activateBooster('fast'));
    DOM.claimDaily.addEventListener('click', claimDailyBonus);
    
    // Tasks - Ads
    DOM.adButtons.forEach(btn => {
        btn.addEventListener('click', () => watchAd(parseInt(btn.dataset.ad)));
    });
    
    // Tasks - Channels
    DOM.channelButtons.forEach(btn => {
        btn.addEventListener('click', () => joinChannel(parseInt(btn.dataset.channel)));
    });
    
    // Withdraw
    DOM.rewardButtons.forEach(btn => {
        btn.addEventListener('click', () => startWithdrawal(btn.dataset.reward, parseInt(btn.dataset.cost)));
    });
    
    // Referral
    DOM.copyReferralLink.addEventListener('click', copyReferralLink);
    
    // Settings
    DOM.changeUsernameBtn.addEventListener('click', openUsernameModal);
    DOM.resetDataBtn.addEventListener('click', () => resetGameData(false));
    
    // Modal Events
    DOM.closeUsernameModal.addEventListener('click', closeUsernameModal);
    DOM.cancelUsername.addEventListener('click', closeUsernameModal);
    DOM.saveUsername.addEventListener('click', saveUsername);
    
    DOM.closeWithdrawModal.addEventListener('click', closeWithdrawModal);
    DOM.cancelWithdraw.addEventListener('click', closeWithdrawModal);
    DOM.confirmWithdraw.addEventListener('click', confirmWithdrawal);
    DOM.copyWithdrawCode.addEventListener('click', copyWithdrawalCode);
    
    // Legal modals
    document.querySelectorAll('[data-legal]').forEach(btn => {
        btn.addEventListener('click', () => {
            openLegalModal(btn.dataset.legal);
        });
    });
    
    // Close modals on overlay click
    DOM.modalOverlay.addEventListener('click', closeAllModals);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'Enter') {
            handleClick();
        }
    });
}

// ============================================================================
// GAME LOGIC - CLICKER WITH LIMIT CHECK
// ============================================================================

function handleClick(e) {
    // Check click limit
    const limitCheck = ClickLimitManager.checkClickLimit();
    if (!limitCheck.canClick) {
        showToast('Click limit reached! Try again in a few hours.', 'warning');
        return;
    }
    
    // Use one click from limit
    ClickLimitManager.useClick();
    
    let pointsToAdd = CONFIG.basePointsPerClick;
    
    const now = Date.now();
    const active2x = GameState.activeBoosters.find(b => b.type === '2x' && b.expires > now);
    if (active2x) {
        pointsToAdd *= CONFIG.boosters['2x'].multiplier;
    }
    
    GameState.points += pointsToAdd;
    GameState.totalClicks++;
    GameState.clicksToday++;
    GameState.lastClickDate = now;
    
    updatePointsDisplay();
    DOM.todayClicks.textContent = GameState.clicksToday;
    
    if (e) {
        const rect = DOM.clickerCircle.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        showFloatingPoints(pointsToAdd, x, y);
    }
    
    animateClickEffect();
    
    // Update click limit UI
    ClickLimitManager.updateUI();
    
    saveGameState();
}

function updatePointsDisplay() {
    const points = GameState.points;
    DOM.headerPoints.textContent = formatNumber(points);
    DOM.mainPoints.textContent = formatNumber(points);
    
    DOM.mainPoints.style.transform = 'scale(1.1)';
    DOM.headerPoints.style.transform = 'scale(1.1)';
    
    setTimeout(() => {
        DOM.mainPoints.style.transform = 'scale(1)';
        DOM.headerPoints.style.transform = 'scale(1)';
    }, 100);
}

function showFloatingPoints(amount, x, y) {
    const floatPoint = document.createElement('div');
    floatPoint.className = 'floating-point';
    floatPoint.textContent = `+${amount}`;
    floatPoint.style.left = `${x}px`;
    floatPoint.style.top = `${y}px`;
    
    DOM.floatingContainer.appendChild(floatPoint);
    
    setTimeout(() => {
        floatPoint.remove();
    }, 1000);
}

function animateClickEffect() {
    DOM.clickEffect.style.opacity = '1';
    DOM.clickEffect.style.background = 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)';
    
    setTimeout(() => {
        DOM.clickEffect.style.opacity = '0';
    }, 300);
}

// ============================================================================
// GAME LOGIC - BOOSTERS
// ============================================================================

function activateBooster(type) {
    const booster = CONFIG.boosters[type];
    
    if (!booster) {
        showToast('Invalid booster type', 'error');
        return;
    }
    
    const now = Date.now();
    const alreadyActive = GameState.activeBoosters.find(b => b.type === type && b.expires > now);
    if (alreadyActive) {
        showToast('This booster is already active!', 'warning');
        return;
    }
    
    if (GameState.points < booster.cost) {
        showToast(`Not enough points! Need ${booster.cost}`, 'error');
        return;
    }
    
    GameState.points -= booster.cost;
    
    const expires = now + booster.duration;
    GameState.activeBoosters.push({type, expires});
    GameState.boostersHistory.push({type, activated: now, cost: booster.cost});
    
    if (type === 'fast') {
        startFastClicks();
    }
    
    updatePointsDisplay();
    updateBoosterTimers();
    
    // Update booster status
    const statusElement = document.getElementById(`boost${type === '2x' ? '2x' : 'Fast'}Status`);
    if (statusElement) {
        statusElement.textContent = 'ACTIVE';
        statusElement.className = 'boost-status active';
    }
    
    showToast(`${booster.name} activated for 2 minutes!`, 'success');
    
    saveGameState();
}

function startFastClicks() {
    const interval = setInterval(() => {
        const now = Date.now();
        const activeFast = GameState.activeBoosters.find(b => b.type === 'fast' && b.expires > now);
        
        if (!activeFast) {
            clearInterval(interval);
            const statusElement = document.getElementById('boostFastStatus');
            if (statusElement) {
                statusElement.textContent = '';
                statusElement.className = 'boost-status';
            }
            return;
        }
        
        // Check click limit for auto-clicks too
        const limitCheck = ClickLimitManager.checkClickLimit();
        if (!limitCheck.canClick) {
            return;
        }
        
        ClickLimitManager.useClick();
        
        // Simulate click
        let pointsToAdd = CONFIG.basePointsPerClick;
        const active2x = GameState.activeBoosters.find(b => b.type === '2x' && b.expires > now);
        if (active2x) {
            pointsToAdd *= CONFIG.boosters['2x'].multiplier;
        }
        
        GameState.points += pointsToAdd;
        GameState.totalClicks++;
        GameState.clicksToday++;
        GameState.lastClickDate = now;
        
        updatePointsDisplay();
        DOM.todayClicks.textContent = GameState.clicksToday;
        
        // Show floating points at random position
        const rect = DOM.clickerCircle.getBoundingClientRect();
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        showFloatingPoints(pointsToAdd, x, y);
        
        // Update click limit UI
        ClickLimitManager.updateUI();
        
    }, CONFIG.boosters.fast.interval);
}

function claimDailyBonus() {
    const now = Date.now();
    const lastClaimed = GameState.dailyBonus.lastClaimed;
    
    if (lastClaimed) {
        const timeSinceLastClaim = now - lastClaimed;
        if (timeSinceLastClaim < CONFIG.dailyBonusCooldown) {
            const timeLeft = CONFIG.dailyBonusCooldown - timeSinceLastClaim;
            showToast(`Come back in ${formatTime(timeLeft)}`, 'warning');
            return;
        }
    }
    
    GameState.dailyBonus.lastClaimed = now;
    GameState.dailyBonus.streak++;
    GameState.points += CONFIG.dailyBonusAmount;
    
    updatePointsDisplay();
    updateDailyTimer();
    
    showToast(`Daily bonus claimed! +${CONFIG.dailyBonusAmount} points`, 'success');
    
    saveGameState();
}

// ============================================================================
// GAME LOGIC - TASKS (ADS - WORKING IMPLEMENTATION)
// ============================================================================

class AdManager {
    static adTypes = {
        REWARDED_INTERSTITIAL: 'rewarded_interstitial',
        REWARDED_POPUP: 'rewarded_popup',
        IN_APP_INTERSTITIAL: 'in_app_interstitial'
    };

    static showAd(adType, adId) {
        return new Promise((resolve, reject) => {
            try {
                if (typeof show_10380236 === 'undefined') {
                    console.warn('Ad SDK not loaded, simulating ad...');
                    setTimeout(() => {
                        if (Math.random() > 0.1) {
                            resolve(true);
                        } else {
                            reject(new Error('Ad skipped'));
                        }
                    }, 2000);
                    return;
                }

                let adPromise;
                
                switch(adType) {
                    case this.adTypes.REWARDED_INTERSTITIAL:
                        adPromise = show_10380236();
                        break;
                        
                    case this.adTypes.REWARDED_POPUP:
                        adPromise = show_10380236('pop');
                        break;
                        
                    case this.adTypes.IN_APP_INTERSTITIAL:
                        adPromise = show_10380236({
                            type: 'inApp',
                            inAppSettings: {
                                frequency: 2,
                                capping: 0.1,
                                interval: 30,
                                timeout: 5,
                                everyPage: false
                            }
                        });
                        break;
                        
                    default:
                        adPromise = show_10380236();
                }

                adPromise
                    .then(() => {
                        console.log(`Ad ${adId} completed successfully`);
                        resolve(true);
                    })
                    .catch((error) => {
                        console.warn(`Ad ${adId} failed or skipped:`, error);
                        reject(new Error('Ad not completed'));
                    });

            } catch (error) {
                console.error('Error showing ad:', error);
                reject(error);
            }
        });
    }

    static canWatchAd(adId) {
        const count = GameState.tasks.ads.count[adId] || 0;
        return count < CONFIG.tasksConfig.ads.dailyLimit;
    }

    static getAdReward() {
        return CONFIG.tasksConfig.ads.reward;
    }
}

async function watchAd(adId) {
    if (!AdManager.canWatchAd(adId)) {
        showToast('Daily limit reached for this ad', 'warning');
        return;
    }
    
    const btn = document.querySelector(`.ad-watch[data-ad="${adId}"]`);
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>Loading...</span><i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;
    
    try {
        showToast('Starting ad...', 'info');
        
        const adCompleted = await AdManager.showAd(AdManager.adTypes.REWARDED_INTERSTITIAL, adId);
        
        if (adCompleted) {
            completeAdTask(adId);
        } else {
            throw new Error('Ad not completed');
        }
        
    } catch (error) {
        console.error('Ad error:', error);
        showToast('Ad not completed - no points awarded', 'error');
        
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

function completeAdTask(adId) {
    const reward = AdManager.getAdReward();
    GameState.points += reward;
    GameState.tasks.ads.count[adId] = (GameState.tasks.ads.count[adId] || 0) + 1;
    
    updatePointsDisplay();
    updateAdCounts();
    
    showToast(`Ad watched! +${reward} points`, 'success');
    
    const btn = document.querySelector(`.ad-watch[data-ad="${adId}"]`);
    if (btn && AdManager.canWatchAd(adId)) {
        btn.innerHTML = '<span>+100</span><i class="fas fa-play-circle"></i>';
        btn.disabled = false;
    } else {
        btn.innerHTML = '<span>Limit Reached</span>';
        btn.disabled = true;
    }
    
    saveGameState();
}

function joinChannel(channelId) {
    if (GameState.tasks.channels[channelId]) {
        showToast('Already completed this task', 'warning');
        return;
    }
    
    const channelUrls = {
        1: 'https://t.me/+-ALd_P5x4dw4MmNk',
        2: 'https://t.me/directcanvapro',
        3: 'https://t.me/GeneratCPro_bot'
    };
    
    window.open(channelUrls[channelId], '_blank');
    
    setTimeout(() => {
        if (confirm('Have you joined the channel?')) {
            completeChannelTask(channelId);
        }
    }, 3000);
}

function completeChannelTask(channelId) {
    GameState.points += CONFIG.tasksConfig.channels.reward;
    GameState.tasks.channels[channelId] = true;
    
    const btn = document.querySelector(`.channel-join[data-channel="${channelId}"]`);
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span>Joined</span>';
    }
    
    updatePointsDisplay();
    
    showToast(`Channel joined! +${CONFIG.tasksConfig.channels.reward} points`, 'success');
    
    saveGameState();
}

// ============================================================================
// GAME LOGIC - WITHDRAWAL
// ============================================================================

function startWithdrawal(rewardType, cost) {
    const reward = CONFIG.withdrawalOptions[rewardType];
    if (!reward) return;
    
    DOM.withdrawRewardName.textContent = reward.name;
    DOM.withdrawCost.textContent = `${cost} POINT`;
    
    DOM.withdrawModal.dataset.rewardType = rewardType;
    DOM.withdrawModal.dataset.cost = cost;
    
    const meetsPoints = GameState.points >= cost;
    const meetsReferrals = GameState.referrals.length >= CONFIG.withdrawalRequirements.minReferrals;
    
    updateCheckmark(DOM.checkPoints, meetsPoints, `Need ${cost} points`);
    updateCheckmark(DOM.checkReferrals, meetsReferrals, `Need ${CONFIG.withdrawalRequirements.minReferrals} referrals`);
    
    DOM.codeSection.classList.add('hidden');
    DOM.confirmWithdraw.textContent = 'Generate Code';
    
    openModal(DOM.withdrawModal);
}

function updateCheckmark(element, met, tooltip = '') {
    const icon = element.querySelector('i');
    if (met) {
        icon.className = 'fas fa-check-circle';
        icon.style.color = '#34c759';
        element.title = '';
    } else {
        icon.className = 'fas fa-times-circle';
        icon.style.color = '#ff3b30';
        if (tooltip) {
            element.title = tooltip;
        }
    }
}

function confirmWithdrawal() {
    const rewardType = DOM.withdrawModal.dataset.rewardType;
    const cost = parseInt(DOM.withdrawModal.dataset.cost);
    
    if (!DOM.codeSection.classList.contains('hidden')) {
        closeModal(DOM.withdrawModal);
        return;
    }
    
    const meetsPoints = GameState.points >= cost;
    const meetsReferrals = GameState.referrals.length >= CONFIG.withdrawalRequirements.minReferrals;
    
    if (!meetsPoints || !meetsReferrals) {
        showToast('Requirements not met', 'error');
        return;
    }
    
    GameState.points -= cost;
    
    const code = generateWithdrawalCode(rewardType);
    DOM.withdrawCode.textContent = code;
    
    GameState.withdrawals.push({
        type: rewardType,
        cost: cost,
        code: code,
        date: Date.now(),
        status: 'pending'
    });
    
    DOM.codeSection.classList.remove('hidden');
    DOM.confirmWithdraw.textContent = 'Close';
    
    updatePointsDisplay();
    updateWithdrawRequirements();
    
    saveGameState();
    
    showToast('Withdrawal code generated! Send it to support.', 'success');
}

function generateWithdrawalCode(type) {
    const prefix = 'CPRO';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${type.toUpperCase()}-${timestamp}-${random}`;
}

function copyWithdrawalCode() {
    navigator.clipboard.writeText(DOM.withdrawCode.textContent)
        .then(() => showToast('Code copied to clipboard!', 'success'))
        .catch(err => {
            console.error('Failed to copy:', err);
            showToast('Failed to copy code', 'error');
        });
}

// ============================================================================
// GAME LOGIC - REFERRAL
// ============================================================================

function updateReferralLink() {
    const baseUrl = 'https://t.me/CProStorebot?startapp=';
    const username = GameState.username || 'user';
    DOM.referralLinkInput.value = `${baseUrl}${username}`;
}

function copyReferralLink() {
    navigator.clipboard.writeText(DOM.referralLinkInput.value)
        .then(() => showToast('Referral link copied!', 'success'))
        .catch(err => {
            console.error('Failed to copy:', err);
            showToast('Failed to copy link', 'error');
        });
}

function generateReferralCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ============================================================================
// SETTINGS FUNCTIONS
// ============================================================================

function openUsernameModal() {
    DOM.newUsername.value = GameState.username;
    
    if (GameState.usernameChanges === 0) {
        DOM.costNotice.innerHTML = '<i class="fas fa-info-circle"></i> First username change is free.';
    } else {
        DOM.costNotice.innerHTML = `<i class="fas fa-info-circle"></i> Username changes cost ${CONFIG.usernameChangeCost} POINT.`;
    }
    
    openModal(DOM.usernameModal);
}

function saveUsername() {
    const newUsername = DOM.newUsername.value.trim();
    
    if (!newUsername) {
        showToast('Username cannot be empty', 'error');
        return;
    }
    
    if (newUsername === GameState.username) {
        closeModal(DOM.usernameModal);
        return;
    }
    
    if (GameState.usernameChanges > 0) {
        if (GameState.points < CONFIG.usernameChangeCost) {
            showToast(`Not enough points! Need ${CONFIG.usernameChangeCost}`, 'error');
            return;
        }
        GameState.points -= CONFIG.usernameChangeCost;
    }
    
    GameState.username = newUsername;
    GameState.usernameChanges++;
    
    DOM.currentUsername.textContent = newUsername;
    updateReferralLink();
    
    updatePointsDisplay();
    
    showToast(`Username changed to ${newUsername}`, 'success');
    
    closeModal(DOM.usernameModal);
    saveGameState();
}

// ============================================================================
// UI UPDATES - ENHANCED WITH CLICK LIMIT
// ============================================================================

function updateUI() {
    updatePointsDisplay();
    updateBoosterTimers();
    updateDailyTimer();
    updateAdCounts();
    updateWithdrawRequirements();
    updateReferralStats();
    updateSettingsDisplay();
    
    // Update click limit UI
    ClickLimitManager.updateUI();
    
    const now = Date.now();
    const active2x = GameState.activeBoosters.find(b => b.type === '2x' && b.expires > now);
    const multiplier = active2x ? CONFIG.boosters['2x'].multiplier : 1;
    DOM.multiplier.textContent = `x${multiplier}`;
    DOM.multiplier.style.color = multiplier > 1 ? '#ff9500' : '#8e8e93';
    DOM.perClick.textContent = `+${multiplier}`;
    
    const activeCount = GameState.activeBoosters.filter(b => b.expires > now).length;
    DOM.activeBoosts.textContent = activeCount;
}

function updateBoosterTimers() {
    const now = Date.now();
    
    const booster2x = GameState.activeBoosters.find(b => b.type === '2x');
    if (booster2x && booster2x.expires > now) {
        const timeLeft = booster2x.expires - now;
        DOM.timer2x.textContent = formatTime(timeLeft);
        DOM.timer2x.classList.remove('hidden');
        DOM.activate2x.disabled = true;
    } else {
        DOM.timer2x.classList.add('hidden');
        DOM.activate2x.disabled = false;
        DOM.boost2xStatus.textContent = '';
        DOM.boost2xStatus.className = 'boost-status';
    }
    
    const boosterFast = GameState.activeBoosters.find(b => b.type === 'fast');
    if (boosterFast && boosterFast.expires > now) {
        const timeLeft = boosterFast.expires - now;
        DOM.timerFast.textContent = formatTime(timeLeft);
        DOM.timerFast.classList.remove('hidden');
        DOM.activateFast.disabled = true;
    } else {
        DOM.timerFast.classList.add('hidden');
        DOM.activateFast.disabled = false;
        DOM.boostFastStatus.textContent = '';
        DOM.boostFastStatus.className = 'boost-status';
    }
}

function updateDailyTimer() {
    const now = Date.now();
    const lastClaimed = GameState.dailyBonus.lastClaimed;
    
    if (!lastClaimed) {
        DOM.dailyTimer.textContent = 'Ready to claim!';
        DOM.claimDaily.disabled = false;
        return;
    }
    
    const timeSinceLastClaim = now - lastClaimed;
    
    if (timeSinceLastClaim >= CONFIG.dailyBonusCooldown) {
        DOM.dailyTimer.textContent = 'Ready to claim!';
        DOM.claimDaily.disabled = false;
    } else {
        const timeLeft = CONFIG.dailyBonusCooldown - timeSinceLastClaim;
        DOM.dailyTimer.textContent = `Available in ${formatTime(timeLeft)}`;
        DOM.claimDaily.disabled = true;
    }
}

function updateAdCounts() {
    for (let i = 1; i <= 4; i++) {
        const count = GameState.tasks.ads.count[i] || 0;
        const remaining = CONFIG.tasksConfig.ads.dailyLimit - count;
        if (DOM.adCounts[i]) {
            DOM.adCounts[i].textContent = remaining;
        }
        
        const btn = document.querySelector(`.ad-watch[data-ad="${i}"]`);
        if (btn) {
            if (remaining <= 0) {
                btn.innerHTML = '<span>Limit Reached</span>';
                btn.disabled = true;
            } else {
                btn.innerHTML = '<span>+100</span><i class="fas fa-play-circle"></i>';
                btn.disabled = false;
            }
        }
    }
}

function updateWithdrawRequirements() {
    const points = GameState.points;
    const referrals = GameState.referrals.length;
    const accountAge = Date.now() - GameState.accountCreated;
    
    DOM.reqPoints.textContent = `${formatNumber(points)} / 4500`;
    DOM.reqReferrals.textContent = `${referrals} / ${CONFIG.withdrawalRequirements.minReferrals}`;
    DOM.reqAge.textContent = `${Math.floor(accountAge / (1000 * 60 * 60 * 24))} days`;
    
    const pointsProgress = Math.min(points / 4500, 1);
    const referralsProgress = Math.min(referrals / CONFIG.withdrawalRequirements.minReferrals, 1);
    const overallProgress = (pointsProgress + referralsProgress) / 2;
    
    DOM.statusFill.style.width = `${overallProgress * 100}%`;
    
    if (overallProgress >= 1) {
        DOM.statusText.textContent = 'Ready to withdraw!';
        DOM.statusText.style.color = '#34c759';
    } else {
        DOM.statusText.textContent = 'Complete requirements to withdraw';
        DOM.statusText.style.color = '#8e8e93';
    }
}

function updateReferralStats() {
    const totalReferrals = GameState.referrals.length;
    const totalPoints = GameState.referrals.reduce((sum, ref) => sum + ref.pointsEarned, 0);
    
    DOM.totalReferrals.textContent = totalReferrals;
    DOM.referralPoints.textContent = formatNumber(totalPoints);
    
    updateReferralsTable();
}

function updateReferralsTable() {
    const tableBody = DOM.referralsTable;
    tableBody.innerHTML = '';
    
    if (GameState.referrals.length === 0) {
        tableBody.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-plus"></i>
                <p>No referrals yet. Share your link!</p>
            </div>
        `;
        return;
    }
    
    const recentReferrals = GameState.referrals.slice(-10).reverse();
    
    recentReferrals.forEach(ref => {
        const row = document.createElement('div');
        row.className = 'table-row';
        row.style.display = 'grid';
        row.style.gridTemplateColumns = '2fr 1fr 1fr';
        row.style.padding = '12px 16px';
        row.style.borderBottom = '1px solid #e5e5e7';
        
        const usernameCell = document.createElement('span');
        usernameCell.textContent = ref.username || 'Anonymous';
        
        const dateCell = document.createElement('span');
        const date = new Date(ref.date);
        dateCell.textContent = date.toLocaleDateString();
        
        const pointsCell = document.createElement('span');
        pointsCell.textContent = `+${ref.pointsEarned}`;
        pointsCell.style.color = '#34c759';
        pointsCell.style.fontWeight = '600';
        
        row.appendChild(usernameCell);
        row.appendChild(dateCell);
        row.appendChild(pointsCell);
        tableBody.appendChild(row);
    });
}

function updateSettingsDisplay() {
    DOM.currentUsername.textContent = GameState.username;
    
    if (GameState.usernameChanges === 0) {
        DOM.usernameChangeCost.textContent = 'First change is free';
    } else {
        DOM.usernameChangeCost.textContent = `Next change: ${CONFIG.usernameChangeCost} POINT`;
    }
    
    const createdDate = new Date(GameState.accountCreated);
    DOM.accountCreatedDate.textContent = createdDate.toLocaleDateString();
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function switchPage(pageId) {
    DOM.navItems.forEach(item => {
        item.classList.toggle('active', item.dataset.page === pageId);
    });
    
    DOM.pages.forEach(page => {
        page.classList.toggle('active', page.id === pageId);
    });
}

function openModal(modal) {
    modal.style.display = 'block';
    DOM.modalOverlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.style.display = 'none';
    DOM.modalOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    DOM.modalOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function closeUsernameModal() {
    closeModal(DOM.usernameModal);
}

function closeWithdrawModal() {
    closeModal(DOM.withdrawModal);
}

function openLegalModal(type) {
    const modal = document.getElementById(`${type}Modal`);
    if (modal) {
        openModal(modal);
    }
}

function showToast(message, type = 'success') {
    const toast = DOM.toast;
    const toastMessage = DOM.toastMessage;
    
    toastMessage.textContent = message;
    const icon = toast.querySelector('i');
    
    switch (type) {
        case 'success':
            icon.className = 'fas fa-check-circle';
            icon.style.color = '#34c759';
            break;
        case 'error':
            icon.className = 'fas fa-exclamation-circle';
            icon.style.color = '#ff3b30';
            break;
        case 'warning':
            icon.className = 'fas fa-exclamation-triangle';
            icon.style.color = '#ffcc00';
            break;
        case 'info':
            icon.className = 'fas fa-info-circle';
            icon.style.color = '#5ac8fa';
            break;
    }
    
    toast.style.display = 'flex';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
}

// ============================================================================
// GAME LOOP & DAILY RESET - ENHANCED WITH CLICK LIMIT
// ============================================================================

function startGameLoop() {
    // Update timers every second
    setInterval(() => {
        updateBoosterTimers();
        updateDailyTimer();
        
        // Update click limit timer
        const timeLeft = ClickLimitManager.getTimeUntilReset();
        if (timeLeft > 0) {
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            DOM.limitTimer.textContent = `Resets in ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            DOM.limitTimer.textContent = 'Ready!';
            ClickLimitManager.resetClickLimit();
            ClickLimitManager.updateUI();
        }
    }, 1000);
    
    // Save state every 30 seconds
    setInterval(() => {
        saveGameState();
    }, 30000);
}

function checkDailyReset() {
    const now = new Date();
    const lastReset = GameState.tasks.ads.lastReset ? new Date(GameState.tasks.ads.lastReset) : new Date(0);
    
    if (now.toDateString() !== lastReset.toDateString()) {
        GameState.tasks.ads.count = {1: 0, 2: 0, 3: 0, 4: 0};
        GameState.tasks.ads.lastReset = now.getTime();
        GameState.clicksToday = 0;
        
        updateAdCounts();
        DOM.todayClicks.textContent = 0;
        
        saveGameState();
        
        if (GameState.settings.notificationsEnabled) {
            showToast('Daily tasks have been reset!', 'info');
        }
    }
}

// ============================================================================
// INITIALIZATION CALL
// ============================================================================

document.addEventListener('DOMContentLoaded', init);

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        checkDailyReset();
        updateUI();
    }
});