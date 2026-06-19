# hybridseal-warp-lp

Hybrid Seal（主役・捨てられない物理メディア）× WARP（付帯オプション・動的LP＋データ分析）の営業用ランディングページ。

> 世界観：黒基調のSF・宇宙・最先端（シアン × 金、差し色にバイオレット）。
> 顧問が営業で見せ、相手が「触りたくなる・導入したくなる」状態をゴールにする。

## 技術スタック

- **Next.js 15**（App Router）/ TypeScript
- **React Three Fiber**（HEROの星パーティクル＝ワープ加速）
- **GSAP / ScrollTrigger**（スクロール演出・カウントアップ）
- **Lenis**（慣性スクロール）
- **Tailwind CSS**

## デザイントークン（指示書 第4章）

| 用途 | 値 |
| --- | --- |
| 背景 | `#04050A` |
| シアン | `#3FE3FF` |
| 金 | `#E8C56B` |
| バイオレット | `#8B6CFF` |
| 見出し | Chakra Petch |
| 数値・ラベル | Space Mono |
| 本文 | Noto Sans JP |

## 実装済みセクション（優先度【高】の4つ）

1. **① HERO** — 「捨てられない。だから毎日100回見られる。」／3D星パーティクルがスクロールでワープ加速、上からの光ビーム
2. **③ シールの3機能** — ①マルチクリーナー（拭くと曇りが晴れる）②洗って何度でも（ドラッグで貼り剥がし）③光触媒で自己除菌（除菌パーティクルが分解）
3. **④ 1日100回** — 朝→夜の背景遷移＋0→100カウントアップ
4. **⑥ めくってQR→WARP** — シールをめくる→QR出現→宇宙トンネルを抜けて体験世界へ

> 未実装：②問題提起 ／ ⑤ダイカット＆実績 ／ ⑦データ分析 ／ ⑧一気通貫フロー ／ ⑨クロージング（今後追加）

## 重要な設計方針

- **ブラックアウト厳禁**：コンテンツは常に `opacity:1` で表示され、スクロール演出はあくまで「上乗せ」。
  ScrollTrigger が不発でも、`prefers-reduced-motion` でも、JSが失敗しても画面が黒くならない（各演出に安全タイマーと最終表示の担保を実装）。
- **モバイル最優先・低スペックフォールバック**：`useDeviceTier` でコア数/メモリ/WebGL/reduced-motion を判定し、低スペックでは 3D を CSS 星空にフォールバック。Canvas は `dpr` 上限を絞って軽量化。

## 開発

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 本番ビルド
```

## 計測（接続枠のみ・既定で無効）

指示書 第6章に従い、計測は接続箇所だけ用意し既定で無効。
有効化するときは `.env.local`（`.env.local.example` 参照）に Supabase の値を設定し、
`NEXT_PUBLIC_ANALYTICS_ENABLED=true` にする。テーブルは `events(project, event, meta, created_at)`。
