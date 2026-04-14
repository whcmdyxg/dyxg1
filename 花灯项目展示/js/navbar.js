// navbar.js - 修复切换页面丢失登录状态版本
function loadNavbar() {
    // ========== 1. 注入导航栏CSS样式（无修改） ==========
    const style = document.createElement('style');
    style.textContent = `
        /* 全局重置 */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: "Microsoft YaHei", "SimHei", sans-serif;
        }

        /* 页面顶部留导航栏空间 */
        body {
            margin: 0;
            padding-top: 80px !important;
        }

        /* 导航栏核心样式 */
        .navbar {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 80px;
            background-color: rgba(15, 13, 11, 0.95);
            backdrop-filter: blur(8px);
            box-shadow: 0 2px 20px rgba(250, 214, 137, 0.2);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .navbar-container {
            width: 90%;
            max-width: 1200px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
        }

        .navbar-brand {
            font-size: 24px;
            font-weight: bold;
            color: #fad689;
            text-decoration: none;
            letter-spacing: 2px;
            text-shadow: 0 0 10px rgba(250, 214, 137, 0.5);
            transition: color 0.3s ease;
        }

        .navbar-brand:hover {
            color: #ffd966;
        }

        .nav-menu {
            display: flex;
            gap: 2px;
        }

        .nav-item {
            position: relative;
            list-style: none;
        }

        .nav-link {
            display: block;
            padding: 12px 24px;
            font-size: 16px;
            color: #d4c0a1;
            text-decoration: none;
            border-radius: 4px;
            transition: all 0.3s ease;
        }

        .nav-link:hover {
            background: linear-gradient(135deg, #fad689, #f7b733);
            color: #0f0d0b;
            transform: translateY(-2px);
        }

        /* ========== 高亮核心样式（重点！） ========== */
        .nav-link.active {
            background: linear-gradient(135deg, #fad689, #f7b733) !important;
            color: #0f0d0b !important;
            box-shadow: 0 4px 8px rgba(250, 214, 137, 0.3) !important;
        }

        .nav-link::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 50%;
            width: 0;
            height: 2px;
            background-color: #0f0d0b;
            transition: all 0.3s ease;
            transform: translateX(-50%);
        }

        .nav-link:hover::after, .nav-link.active::after {
            width: 80% !important;
        }

        /* 汉堡菜单 */
        .hamburger {
            display: none;
            flex-direction: column;
            gap: 5px;
            cursor: pointer;
        }

        .hamburger span {
            width: 28px;
            height: 3px;
            background-color: #fad689;
            border-radius: 2px;
            transition: all 0.3s ease;
        }

        /* 用户区域 */
        .user-right-group {
            display: flex;
            align-items: center;
            gap: 12px;
            position: relative;
        }

        .auth-btn {
            padding: 8px 18px;
            border-radius: 4px;
            border: 1px solid #fad689;
            background: transparent;
            color: #fad689;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.25s ease;
        }

        .auth-btn:hover {
            background: linear-gradient(135deg, #fad689, #f7b733);
            color: #0f0d0b;
            border-color: #f7b733;
        }

        .user-info {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #fad689;
            display: none;
        }

        .user-avatar {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #fad689;
        }

        .user-name {
            font-size: 15px;
            max-width: 100px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .logout-btn {
            padding: 6px 14px;
            font-size: 13px;
            border-color: #dc3545;
            color: #dc3545;
            background: transparent;
        }

        .logout-btn:hover {
            background: #dc3545;
            color: #fff;
        }

        /* 登录面板（无遮挡） */
        .login-panel {
            position: absolute;
            top: calc(100% + 10px);
            right: 0;
            width: 300px;
            padding: 20px;
            background: rgba(15,13,11,0.98);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(250,214,137,0.3);
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.4);
            display: none;
            flex-direction: column;
            gap: 14px;
            z-index: 10000;
        }

        .login-panel.show {
            display: flex !important;
        }

        .panel-title {
            color: #fad689;
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 4px;
        }

        .auth-input {
            width: 100%;
            height: 38px;
            padding: 0 12px;
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(250,214,137,0.4);
            border-radius: 4px;
            color: #fff;
            outline: none;
            font-size: 14px;
        }

        .auth-input:focus {
            border-color: #fad689;
            box-shadow: 0 0 6px rgba(250,214,137,0.4);
        }

        /* 表单优化样式 */
        .form-tip {
            color: #d4c0a1;
            font-size: 11px;
            text-align: right;
            margin-top: -10px;
            margin-bottom: 8px;
        }
        .password-strength {
            display: flex;
            gap: 4px;
            height: 4px;
            margin-top: -10px;
            margin-bottom: 8px;
        }
        .strength-bar {
            flex: 1;
            background: #333;
            border-radius: 2px;
        }
        .strength-bar.weak {
            background: #dc3545;
        }
        .strength-bar.medium {
            background: #ffc107;
        }
        .strength-bar.strong {
            background: #28a745;
        }

        .panel-submit {
            height: 38px;
            border-radius: 4px;
            border: none;
            background: linear-gradient(135deg, #fad689, #f7b733);
            color: #0f0d0b;
            font-weight: bold;
            cursor: pointer;
            transition: 0.2s;
        }

        .panel-submit:hover {
            transform: translateY(-1px);
        }

        .panel-switch {
            text-align: center;
            color: #d4c0a1;
            font-size: 13px;
            cursor: pointer;
        }

        .panel-switch span {
            color: #fad689;
        }

        .error-tip {
            color: #dc3545;
            font-size: 12px;
            height: 14px;
            text-align: center;
            display: none;
        }

        /* 移动端适配 */
        @media (max-width: 768px) {
            .hamburger {
                display: flex;
            }

            .nav-menu {
                position: absolute;
                top: 80px;
                left: 0;
                width: 100%;
                background-color: rgba(15, 13, 11, 0.98);
                backdrop-filter: blur(8px);
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
                flex-direction: column;
                align-items: center;
                padding: 20px 0;
                gap: 15px;
                transform: translateY(-120%);
                opacity: 0;
                pointer-events: none;
                transition: all 0.5s ease;
                z-index: 9998;
            }

            .nav-menu.active {
                transform: translateY(0);
                opacity: 1;
                pointer-events: all;
            }

            .hamburger.active span:nth-child(1) {
                transform: rotate(45deg) translate(6px, 6px);
            }

            .hamburger.active span:nth-child(2) {
                opacity: 0;
            }

            .hamburger.active span:nth-child(3) {
                transform: rotate(-45deg) translate(6px, -6px);
            }

            .user-name {
                display: none;
            }

            .login-panel {
                width: 280px;
                right: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ========== 2. 注入导航栏HTML结构（无修改） ==========
    const navbar = document.createElement('nav');
    navbar.className = 'navbar';
    navbar.innerHTML = `
        <div class="navbar-container">
            <a href="section1.html" class="navbar-brand">灯影寻根</a>

            <ul class="nav-menu" id="navMenu">
                <li class="nav-item"><a href="section1.html" class="nav-link" data-page="section1">灯影寻根</a></li>
                <li class="nav-item"><a href="section2.html" class="nav-link" data-page="section2">花灯解码</a></li>
                <li class="nav-item"><a href="section3.html" class="nav-link" data-page="section3">匠心互动</a></li>
                <li class="nav-item"><a href="section4.html" class="nav-link" data-page="section4">薪火永续</a></li>
                <li class="nav-item"><a href="section5.html" class="nav-link" data-page="section5">流光共创</a></li>
            </ul>

            <div class="user-right-group">
                <button class="auth-btn" id="loginShowBtn">登录</button>
                <button class="auth-btn" id="regShowBtn">注册</button>

                <div class="user-info" id="userInfo">
                    <img src="default-avatar.png" class="user-avatar" id="avatar">
                    <span class="user-name" id="uname">用户名</span>
                    <button class="auth-btn logout-btn" id="logoutBtn">退出</button>
                </div>

                <!-- 登录面板（完善表单提示） -->
                <div class="login-panel" id="loginPanel">
                    <div class="panel-title">账号登录</div>
                    <input type="text" class="auth-input" id="loginUser" placeholder="请输入用户名">
                    <div class="form-tip">用户名由字母/数字/下划线组成</div>
                    <input type="password" class="auth-input" id="loginPwd" placeholder="请输入密码">
                    <div class="error-tip" id="loginErr"></div>
                    <button class="panel-submit" id="loginSubmit">登录</button>
                    <div class="panel-switch">没有账号？<span id="toReg">立即注册</span></div>
                </div>

                <!-- 注册面板（完善字段：新增昵称，优化密码强度提示） -->
                <div class="login-panel" id="regPanel">
                    <div class="panel-title">账号注册</div>
                    <input type="text" class="auth-input" id="regUser" placeholder="请设置用户名（3-16位）">
                    <div class="form-tip">支持字母、数字、下划线，不支持特殊字符</div>
                    
                    <input type="text" class="auth-input" id="regNickname" placeholder="请设置昵称（2-12位）">
                    <div class="form-tip">可包含中文、字母、数字，将显示在作品和评论区</div>
                    
                    <input type="password" class="auth-input" id="regPwd" placeholder="请输入密码（6-20位）">
                    <div class="password-strength">
                        <div class="strength-bar" id="strength1"></div>
                        <div class="strength-bar" id="strength2"></div>
                        <div class="strength-bar" id="strength3"></div>
                    </div>
                    <div class="form-tip">建议包含字母+数字+特殊字符，提高安全性</div>
                    
                    <input type="password" class="auth-input" id="regPwd2" placeholder="请确认密码">
                    <div class="error-tip" id="regErr"></div>
                    
                    <button class="panel-submit" id="regSubmit">注册</button>
                    <div class="panel-switch">已有账号？<span id="toLogin">立即登录</span></div>
                </div>
            </div>

            <div class="hamburger" id="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    document.body.insertBefore(navbar, document.body.firstChild);

    // ========== 3. 注入导航栏交互JS（核心修复：登录态持久化） ==========
    const script = document.createElement('script');
    script.textContent = `
        // ========== 全局配置axios（解决跨域/请求头） ==========
        axios.defaults.baseURL = 'http://localhost:8080';
        axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
        axios.defaults.withCredentials = true;

        // ========== 封装会话存储操作（统一管理，便于维护） ==========
        const sessionStorageUtil = {
            // 保存用户信息
            setUserInfo: function(userData) {
                try {
                    sessionStorage.setItem('userInfo', JSON.stringify(userData));
                    // 同步到localStorage做兜底（防止sessionStorage偶发丢失）
                    localStorage.setItem('tempUserInfo', JSON.stringify(userData));
                } catch (e) {
                    console.warn('存储用户信息失败：', e);
                }
            },
            // 获取用户信息（优先sessionStorage，兜底localStorage）
            getUserInfo: function() {
                try {
                    // 优先从sessionStorage读取
                    let userStr = sessionStorage.getItem('userInfo');
                    if (userStr) return JSON.parse(userStr);
                    
                    // sessionStorage没有则从localStorage兜底读取
                    userStr = localStorage.getItem('tempUserInfo');
                    if (userStr) {
                        const user = JSON.parse(userStr);
                        // 同步回sessionStorage
                        sessionStorage.setItem('userInfo', userStr);
                        return user;
                    }
                    return null;
                } catch (e) {
                    console.warn('读取用户信息失败：', e);
                    return null;
                }
            },
            // 清除用户信息（同时清空session和local兜底）
            removeUserInfo: function() {
                try {
                    sessionStorage.removeItem('userInfo');
                    localStorage.removeItem('tempUserInfo');
                } catch (e) {
                    console.warn('清除用户信息失败：', e);
                }
            }
        };

        // ========== 元素获取 ==========
        // 导航栏元素
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        const navLinks = document.querySelectorAll('.nav-link');
        // 登录/注册元素
        const loginShowBtn = document.getElementById('loginShowBtn');
        const regShowBtn = document.getElementById('regShowBtn');
        const loginPanel = document.getElementById('loginPanel');
        const regPanel = document.getElementById('regPanel');
        const toReg = document.getElementById('toReg');
        const toLogin = document.getElementById('toLogin');
        const loginSubmit = document.getElementById('loginSubmit');
        const regSubmit = document.getElementById('regSubmit');
        const loginErr = document.getElementById('loginErr');
        const regErr = document.getElementById('regErr');
        const userInfo = document.getElementById('userInfo');
        const uname = document.getElementById('uname');
        const avatar = document.getElementById('avatar');
        const logoutBtn = document.getElementById('logoutBtn');

        // 注册表单新增元素
        const regUser = document.getElementById('regUser');
        const regNickname = document.getElementById('regNickname');
        const regPwd = document.getElementById('regPwd');
        const regPwd2 = document.getElementById('regPwd2');
        const strengthBars = [
            document.getElementById('strength1'),
            document.getElementById('strength2'),
            document.getElementById('strength3')
        ];

        // ========== 核心：自动高亮当前页面 ==========
        function highlightCurrentPage() {
            const pathname = window.location.pathname;
            const currentPage = pathname.split('/').pop() || 'index.html';
            
            navLinks.forEach(link => {
                const linkHref = link.getAttribute('href');
                link.classList.remove('active');
                if (linkHref === currentPage) link.classList.add('active');
                if (currentPage === 'index.html' && link.getAttribute('data-page') === 'section1') link.classList.add('active');
            });
            console.log('当前页面：', currentPage, '，高亮已生效');
        }

        // ========== 核心：更新登录态UI（抽离为独立函数，便于重复调用） ==========
        function updateUserUI(user) {
            if (user) {
                // 显示用户信息
                userInfo.style.display = 'flex';
                uname.textContent = user.nickname || user.username || '用户';
                avatar.src = user.photo || 'default-avatar.png';
                // 隐藏登录/注册按钮
                loginShowBtn.style.display = 'none';
                regShowBtn.style.display = 'none';
            } else {
                // 隐藏用户信息，显示登录/注册
                userInfo.style.display = 'none';
                loginShowBtn.style.display = 'inline-block';
                regShowBtn.style.display = 'inline-block';
                avatar.src = 'default-avatar.png';
                uname.textContent = '用户名';
            }
        }

        // ========== 核心：初始化登录态（最高优先级执行） ==========
        function initUserState() {
            // 1. 读取用户信息
            const user = sessionStorageUtil.getUserInfo();
            console.log('初始化登录态：', user);
            // 2. 立即更新UI（不等待页面加载完成）
            updateUserUI(user);
        }

        // ========== 汉堡菜单交互 ==========
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            closeAllPanel();
        });

        // ========== 导航链接点击交互（修复：跳转前保留登录态） ==========
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // 关闭面板
                if (hamburger.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                closeAllPanel();
                
                // 可选：强制保存登录态（防止跳转时丢失）
                const user = sessionStorageUtil.getUserInfo();
                if (user) {
                    sessionStorageUtil.setUserInfo(user);
                }
            });
        });

        // ========== 登录/注册面板交互 ==========
        function closeAllPanel() {
            loginPanel.classList.remove('show');
            regPanel.classList.remove('show');
        }

        loginShowBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllPanel();
            loginPanel.classList.add('show');
        });

        regShowBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllPanel();
            regPanel.classList.add('show');
        });

        toReg.addEventListener('click', () => {
            loginPanel.classList.remove('show');
            regPanel.classList.add('show');
        });

        toLogin.addEventListener('click', () => {
            regPanel.classList.remove('show');
            loginPanel.classList.add('show');
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-right-group') && !e.target.closest('.login-panel')) {
                closeAllPanel();
            }
        });

        loginPanel.addEventListener('click', (e) => e.stopPropagation());
        regPanel.addEventListener('click', (e) => e.stopPropagation());

        // ========== 显示错误提示 ==========
        function showErr(el, txt) {
            el.textContent = txt;
            el.style.display = 'block';
            setTimeout(() => el.style.display = 'none', 2500);
        }

        // ========== 新增：密码强度检测 ==========
        function checkPasswordStrength(password) {
            let strength = 0;
            // 长度≥6
            if (password.length >= 6) strength++;
            // 包含字母+数字
            if (/[a-zA-Z]/.test(password) && /\d/.test(password)) strength++;
            // 包含特殊字符
            if (/[^a-zA-Z0-9]/.test(password)) strength++;
            
            // 更新强度条
            strengthBars.forEach((bar, index) => {
                bar.className = 'strength-bar';
                if (index < strength) {
                    if (strength === 1) bar.classList.add('weak');
                    if (strength === 2) bar.classList.add('medium');
                    if (strength === 3) bar.classList.add('strong');
                }
            });
            return strength;
        }

        // 密码输入时实时检测强度
        regPwd.addEventListener('input', (e) => {
            const password = e.target.value;
            checkPasswordStrength(password);
        });

        // ========== 完善：注册功能（严格表单校验+后端请求） ==========
        regSubmit.addEventListener('click', async () => {
            const username = regUser.value.trim();
            const nickname = regNickname.value.trim();
            const password = regPwd.value.trim();
            const password2 = regPwd2.value.trim();

            // 1. 严格表单校验
            if (!username) return showErr(regErr, '请输入用户名');
            if (!/^[a-zA-Z0-9_]{3,16}$/.test(username)) return showErr(regErr, '用户名需3-16位（字母/数字/下划线）');
            
            if (!nickname) return showErr(regErr, '请输入昵称');
            if (!/^[\u4e00-\u9fa5a-zA-Z0-9]{2,12}$/.test(nickname)) return showErr(regErr, '昵称需2-12位（中文/字母/数字）');
            
            if (password.length < 6 || password.length > 20) return showErr(regErr, '密码需6-20位');
            if (checkPasswordStrength(password) < 1) return showErr(regErr, '密码强度过低');
            
            if (password !== password2) return showErr(regErr, '两次密码不一致');

            try {
                // 2. 调用后端注册接口（传递完整参数）
                const response = await axios.post('/user/register', {
                    username: username,
                    nickname: nickname,
                    password: password
                });

                // 3. 注册成功处理
                if (response.status === 200) {
                    showErr(regErr, '注册成功，请登录');
                    setTimeout(() => {
                        regPanel.classList.remove('show');
                        loginPanel.classList.add('show');
                        // 清空注册表单
                        regUser.value = '';
                        regNickname.value = '';
                        regPwd.value = '';
                        regPwd2.value = '';
                        // 重置强度条
                        strengthBars.forEach(bar => bar.className = 'strength-bar');
                    }, 1500);
                }
            } catch (error) {
                // 4. 错误处理（兼容后端返回的业务错误）
                console.error('注册失败：', error);
                if (error.response) {
                    const errMsg = error.response.data.message;
                    // 针对性错误提示
                    if (errMsg.includes('用户名')) showErr(regErr, '用户名已被注册');
                    else if (errMsg.includes('昵称')) showErr(regErr, '昵称已被使用');
                    else showErr(regErr, errMsg || '注册失败，请重试');
                } else {
                    showErr(regErr, '网络异常，请检查后端服务');
                }
            }
        });

        // ========== 完善：登录功能（表单校验+后端请求+登录态加固） ==========
        loginSubmit.addEventListener('click', async () => {
            const username = document.getElementById('loginUser').value.trim();
            const password = document.getElementById('loginPwd').value.trim();

            // 1. 登录表单校验
            if (!username) return showErr(loginErr, '请输入用户名');
            if (!password) return showErr(loginErr, '请输入密码');

            try {
                // 2. 调用后端登录接口
                const response = await axios.get('/user/login', {
                    params:{
                        username: username,
                        password: password
                    }
                });
                
                // 3. 登录成功处理（使用后端返回的完整用户信息）
                if (response.status === 200) {
                    const userData = response.data.data;
                    if (!userData) throw new Error('用户信息为空');
                    
                    // 核心：加固存储（同时存session和local兜底）
                    sessionStorageUtil.setUserInfo({
                        username: userData.username || '',
                        nickname: userData.nickname || '',
                        photo: userData.photo || 'default-avatar.png'
                    });

                    closeAllPanel();
                    // 立即更新UI
                    updateUserUI(userData);
                    alert('登录成功，欢迎回来！');
                }

            } catch (error) {
                // 4. 登录错误处理
                console.error('登录失败：', error);
                if (error.response) {
                    showErr(loginErr, error.response.data.message || '账号或密码错误');
                } else {
                    showErr(loginErr, error.message || '网络异常，请检查后端服务');
                }
            }
        });

        // ========== 退出登录（清空所有存储） ==========
        logoutBtn.addEventListener('click', () => {
            if (confirm('确定退出登录？')) {
                // 核心：清空所有存储
                sessionStorageUtil.removeUserInfo();
                // 立即更新UI
                updateUserUI(null);
                alert('已退出登录');
            }
        });

        // ========== 最高优先级执行初始化（解决页面加载顺序问题） ==========
        // 1. 立即执行初始化（不等待任何事件）
        initUserState();
        // 2. 页面加载完成后再次确认
        window.addEventListener('load', () => {
            highlightCurrentPage();
            initUserState(); // 双重确认
        });
        // 3. 页面显示时再次检查（覆盖刷新/后退/前进场景）
        window.addEventListener('pageshow', () => {
            initUserState();
        });
        // 4. DOM加载完成后再次加固
        document.addEventListener('DOMContentLoaded', () => {
            initUserState();
        });
    `;
    document.body.appendChild(script);
}

// 页面加载时执行导航栏加载（最高优先级）
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNavbar);
} else {
    loadNavbar();
}

// 额外：确保所有页面都能访问到sessionStorageUtil（全局挂载）
window.sessionStorageUtil = {
    setUserInfo: function(userData) {
        try {
            sessionStorage.setItem('userInfo', JSON.stringify(userData));
            localStorage.setItem('tempUserInfo', JSON.stringify(userData));
        } catch (e) {
            console.warn('存储用户信息失败：', e);
        }
    },
    getUserInfo: function() {
        try {
            let userStr = sessionStorage.getItem('userInfo');
            if (userStr) return JSON.parse(userStr);
            userStr = localStorage.getItem('tempUserInfo');
            if (userStr) {
                const user = JSON.parse(userStr);
                sessionStorage.setItem('userInfo', userStr);
                return user;
            }
            return null;
        } catch (e) {
            console.warn('读取用户信息失败：', e);
            return null;
        }
    },
    removeUserInfo: function() {
        try {
            sessionStorage.removeItem('userInfo');
            localStorage.removeItem('tempUserInfo');
        } catch (e) {
            console.warn('清除用户信息失败：', e);
        }
    }
};