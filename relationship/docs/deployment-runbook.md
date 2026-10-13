# Relationship 部署交接说明

> 目的：给新 session 快速接手 `https://lightaitec.com/relationship/` 的更新、部署、统计后台维护。
> 最后更新：2026-10-13

## 当前线上信息

| 项目 | 值 |
| --- | --- |
| 线上入口 | `https://lightaitec.com/relationship/` |
| 统计后台 | `https://lightaitec.com/relationship-stats/` |
| 服务器 | 腾讯云 LightHouse，新加坡，Ubuntu 22.04 |
| 公网 IP | `43.128.107.32` |
| SSH | `ssh ubuntu@43.128.107.32` |
| 线上站点目录 | `/var/www/lightaitec/relationship/` |
| 线上 Git 根目录 | `/var/www/lightaitec/` |
| GitHub 仓库 | `https://github.com/Jonathan220808/lightaitec`，`main` 分支 |
| Nginx 配置 | `/etc/nginx/sites-available/lightaitec.conf` |
| 本地工作目录 | `E:\产品\relationship\` |
| 本地部署仓库副本 | `E:\粤剧\demo\relationship\` |

不要把服务器密码、统计后台密码、密钥写进 Git 或项目文档。需要登录时向用户索取。

## 关系游戏页面结构

当前 `/relationship/` 下主要页面：

| 页面 | 本地路径 | 线上路径 |
| --- | --- | --- |
| 首页 | `index.html` | `/relationship/` |
| 心灵奇旅 | `chat/index.html` | `/relationship/chat/` |
| 情绪特工队 | `feeling/index.html` | `/relationship/feeling/` |
| 翻出真心 | `flip/index.html` | `/relationship/flip/` |
| 需求押注 | `needs/index.html` | `/relationship/needs/` |
| 知己成双 | `match/index.html` | `/relationship/match/` |
| 人生拍卖行 | `auction/index.html` | `/relationship/auction/` |
| 你画我猜 | `draw/index.html` | `/relationship/draw/` |
| 心动信箱 | `mailbox/index.html` | `/relationship/mailbox/` |
| 亲子悄悄话 | `parent/index.html` | `/relationship/parent/` |
| 小红书配图工具 | `xiaohongshu-match-tool/index.html` | `/relationship/xiaohongshu-match-tool/` |
| 共享联机工具 | `shared/relationship-session.js` | `/relationship/shared/relationship-session.js` |

历史兼容文件如 `chat-index.html`、`feeling-index.html`、`flip-index.html`、`needs-index.html` 也在本地目录中；如果修改了对应游戏，确认这些文件是否仍需要同步更新。

## 标准部署流程

### 1. 在本地工作目录完成修改

工作目录：

```powershell
cd "E:\产品\relationship"
```

建议先跑相关测试或至少检查改动文件。由于当前仓库根在 `E:\产品`，如果 Git 提示 dubious ownership，可以用一次性参数查看状态：

```powershell
git -c safe.directory=E:/产品 status --short
```

### 2. 同步到部署仓库副本

部署仓库副本在：

```text
E:\粤剧\demo\
```

关系游戏对应子目录：

```text
E:\粤剧\demo\relationship\
```

把本地工作目录中改过的文件复制到部署仓库副本。例如：

```powershell
Copy-Item -LiteralPath "E:\产品\relationship\index.html" -Destination "E:\粤剧\demo\relationship\index.html" -Force
Copy-Item -LiteralPath "E:\产品\relationship\chat\index.html" -Destination "E:\粤剧\demo\relationship\chat\index.html" -Force
Copy-Item -LiteralPath "E:\产品\relationship\shared\relationship-session.js" -Destination "E:\粤剧\demo\relationship\shared\relationship-session.js" -Force
```

如果新增了目录或图片资源，用递归复制，但先确认目标路径是 `E:\粤剧\demo\relationship\...`：

```powershell
Copy-Item -LiteralPath "E:\产品\relationship\match\img-fast" -Destination "E:\粤剧\demo\relationship\match\img-fast" -Recurse -Force
```

### 3. 在部署仓库提交并推送

```powershell
cd "E:\粤剧\demo"
git status --short
git add relationship/
git commit -m "Update relationship site"
git push origin main
```

如果只是服务器脚本或 Nginx 配置变化，不一定会进入 GitHub；但如果变更了本项目中的辅助脚本或文档，仍应提交。

### 4. 服务器拉取最新代码

```bash
ssh ubuntu@43.128.107.32
cd /var/www/lightaitec
git pull
```

静态 HTML/CSS/JS 更新通常不需要 reload Nginx。

### 5. 验证线上页面

至少检查：

```bash
curl -I https://lightaitec.com/relationship/
curl -I https://lightaitec.com/relationship/chat/
curl -I https://lightaitec.com/relationship/shared/relationship-session.js
```

浏览器打开：

```text
https://lightaitec.com/relationship/
```

如果修改了联机功能，额外检查 WebSocket 相关页面和服务器服务。

## 联机功能和 WebSocket

关系游戏的联机房间通过服务器本地端口 `3002` 转发。Nginx 中有这些路径：

```nginx
/relationship/chat/ws
/relationship/feeling/ws
/relationship/flip/ws
/relationship/needs/ws
/relationship/match/ws
/relationship/auction/ws
```

如果联机异常，先查：

```bash
sudo nginx -t
sudo systemctl status nginx
sudo ss -tlnp | grep 3002
sudo journalctl -n 120 --no-pager
```

不要在不了解当前 Node 服务启动方式时直接杀进程；先查看进程和服务来源。

## 统计后台

统计后台地址：

```text
https://lightaitec.com/relationship-stats/
```

它是自建长期统计服务，不依赖百度统计、GA，也不再依赖 Nginx 14 天日志轮转。当前逻辑：

- 每个正式页面加载 `shared/analytics-client.js`。
- 第一次访问生成匿名访客 ID，存到用户浏览器 `localStorage`。
- 每次打开正式页面向 `/relationship/analytics/collect` 发送一次页面访问。
- 后端服务写入 SQLite，长期保存。
- 后台展示总浏览量、总独立访客、今日、近 7 天、近 30 天、游戏排行、城市排行、地区/国家、设备分布。
- 不记录游戏内行为事件；不统计 `/relationship/xiaohongshu-match-tool/`。
- `总独立访客` 是匿名浏览器 ID 去重，不等于身份证意义上的真实人数。同一人换设备/浏览器会被算多个，清除浏览器数据后也会变。
- 城市来自访问 IP 的地理解析并缓存，会有误差；解析失败显示“未知”。

服务器关键文件：

| 文件 | 用途 |
| --- | --- |
| `/var/www/relationship-analytics/server.py` | 长期统计服务 |
| `/var/www/relationship-analytics/analytics.sqlite3` | 长期统计 SQLite 数据库 |
| `/var/www/relationship-analytics/secret_salt` | IP/UA 哈希盐，勿提交 |
| `/etc/systemd/system/relationship-analytics.service` | systemd 服务 |
| `/etc/nginx/.relationship-stats.htpasswd` | 统计页 HTTP Basic Auth |
| `/home/ubuntu/.relationship-stats-password` | 当前统计页密码备份，仅服务器本地 |

本地脚本备份：

```text
E:\产品\relationship\tools\relationship_analytics_server.py
E:\产品\relationship\shared\analytics-client.js
```

如果修改了本地服务脚本，需要上传并重启：

```powershell
scp "E:\产品\relationship\tools\relationship_analytics_server.py" ubuntu@43.128.107.32:/tmp/relationship_analytics_server.py
ssh ubuntu@43.128.107.32 "sudo install -m 755 /tmp/relationship_analytics_server.py /var/www/relationship-analytics/server.py && sudo systemctl restart relationship-analytics"
```

检查统计页：

```bash
sudo systemctl status relationship-analytics --no-pager
curl -s http://127.0.0.1:3012/health
python3 - <<'PY'
import sqlite3
con = sqlite3.connect('/var/www/relationship-analytics/analytics.sqlite3')
print(con.execute('select count(*) from page_views').fetchone()[0])
PY
```

检查统计页访问控制：

```bash
curl -I https://lightaitec.com/relationship-stats/
```

预期未登录返回 `401 Unauthorized`。登录密码不要写入仓库；需要时 SSH 到服务器读取：

```bash
cat /home/ubuntu/.relationship-stats-password
```

当前统计后台 Basic Auth 用户名是 `jonathan`；只记录用户名，不要把密码写进仓库或文档。

旧的 `/etc/cron.d/relationship-stats` 和 `/var/www/relationship-stats/index.html` 属于过去的 Nginx 日志统计方案。现在 Nginx 已将 `/relationship-stats/` 代理到 `relationship-analytics` 动态后台，旧 cron 即使存在也不是当前统计页的数据来源。

## Nginx 注意事项

修改 Nginx 前先备份：

```bash
sudo cp /etc/nginx/sites-available/lightaitec.conf /etc/nginx/sites-available/lightaitec.conf.bak-$(date +%Y%m%d-%H%M%S)
```

每次改完必须：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

不要手动改 `/etc/letsencrypt/`，不要手动乱加 `listen 443`；HTTPS 由 certbot 管理。

## 给另一个 session 的快速交接 Prompt

可以直接复制下面这段给另一个 session：

```text
你要帮我部署 lightaitec.com 的关系游戏站最新变化。

请先阅读项目文档：
E:\产品\relationship\docs\deployment-runbook.md

关键路径：
- 本地工作目录：E:\产品\relationship\
- 部署仓库副本：E:\粤剧\demo\
- GitHub 仓库：https://github.com/Jonathan220808/lightaitec，main 分支
- 服务器：ssh ubuntu@43.128.107.32
- 线上 Git 根目录：/var/www/lightaitec
- 线上关系游戏目录：/var/www/lightaitec/relationship/
- 统计后台：https://lightaitec.com/relationship-stats/

部署步骤：
1. 看清 E:\产品\relationship\ 中本次改动。
2. 把需要上线的文件复制到 E:\粤剧\demo\relationship\ 对应路径。
3. 在 E:\粤剧\demo 中 git add relationship/，commit，push origin main。
4. SSH 到服务器执行：cd /var/www/lightaitec && git pull。
5. 打开 https://lightaitec.com/relationship/ 验证。

如果涉及统计后台：
- 本地采集脚本：E:\产品\relationship\shared\analytics-client.js
- 本地后端脚本：E:\产品\relationship\tools\relationship_analytics_server.py
- 服务器后端脚本：/var/www/relationship-analytics/server.py
- 服务器数据库：/var/www/relationship-analytics/analytics.sqlite3
- systemd 服务：relationship-analytics
- Nginx 采集入口：/relationship/analytics/collect
- Nginx 后台入口：/relationship-stats/
- 统计后台用户名：jonathan
- 不要把密码写进仓库；需要统计后台密码时，让我提供或 SSH 后读 /home/ubuntu/.relationship-stats-password。

注意：
- 不要删除 /var/www/lightaitec。
- 不要修改 /etc/letsencrypt。
- 修改 Nginx 必须先备份，再 sudo nginx -t，最后 sudo systemctl reload nginx。
- 静态页面更新通常不需要 reload Nginx。
```

