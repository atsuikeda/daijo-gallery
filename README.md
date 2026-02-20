# Lifetime Canvas

画家・山田大乗 氏の作品をアーカイブし、広く世に届けるためのオンラインギャラリーサイト。
和風テイストの上品なデザインで、作品の魅力を余すところなく伝える。

---

## プロジェクト概要

| 項目 | 内容 |
|---|---|
| サイト名 | Lifetime Canvas |
| 目的 | 作品のデジタルアーカイブ・オンライン公開・普及 |
| 対象ユーザー | 一般閲覧者（作品鑑賞）、管理者（作品CRUD） |
| 言語 | 日本語 |
| デザイン方針 | 和風・上品・作品を引き立てる余白感 |

### ページ構成

| パス | 内容 |
|---|---|
| `/` | トップ（作品ハイライト） |
| `/works` | 作品一覧（検索・タグ絞り込み・ページネーション） |
| `/artist` | 作家紹介 |
| `/admin` | 管理画面（認証必須） |

---

## 技術スタック

| カテゴリ | 採用技術 |
|---|---|
| フレームワーク | Next.js 16（App Router） |
| 言語 | TypeScript（strictモード） |
| スタイリング | Tailwind CSS v4 |
| バックエンド / DB | Supabase（PostgreSQL） |
| 認証 | Supabase Auth（メール / パスワード） |
| ストレージ | Supabase Storage（`gallery-images` バケット） |
| デプロイ | Vercel |
| フォント | Noto Serif JP / Playfair Display（Google Fonts） |

### アーキテクチャの特徴

- **Server Components ファースト** — データ取得はすべてサーバー側。`'use client'` は検索・タグ・ページネーションなど最小限のインタラクティブ要素に限定
- **APIルートなし** — Server Components から Supabase を直接クエリ
- **URLベースの状態管理** — フィルタ・ページ等は `searchParams` で管理（React state 不使用）
- **キャッシュ** — `unstable_cache()` で60秒 revalidation

### カラーパレット

| 変数 | 値 | 用途 |
|---|---|---|
| `--color-main` | `#5A3A22` | 濃茶（メインテキスト・ボーダー） |
| `--color-sub` | `#F5EFE6` | 生成り（カード背景） |
| `--color-bg` | `#FBF7F2` | 薄ベージュ（ページ背景） |
| `--color-accent` | `#6B7B6A` | 深緑（アクセント） |

---

## ディレクトリ構成

```
Lifetime Canvas/
├── frontend/                  # Next.js アプリ本体
│   ├── app/                   # App Router ページ
│   │   ├── page.tsx           # / トップ
│   │   ├── works/             # /works 作品一覧
│   │   └── artist/            # /artist 作家紹介
│   ├── components/
│   │   ├── layout/            # Header, Footer 等
│   │   ├── ui/                # 汎用UIコンポーネント
│   │   └── works/             # 作品関連コンポーネント
│   ├── lib/
│   │   └── superbase.ts       # Supabaseクライアント初期化
│   └── types/                 # TypeScript インターフェース
└── docs/                      # 設計ドキュメント
    ├── overview.md
    ├── architecture.md
    ├── db.md
    ├── design.md
    ├── api.md
    └── knowledge/             # コードレビュー知見の蓄積
```

---

## セットアップ・開発コマンド

```bash
cd frontend

npm run dev      # 開発サーバー起動（localhost:3000）
npm run build    # 本番ビルド
npm run lint     # ESLint 実行
```

### 環境変数

`frontend/.env.local` に以下を設定:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## 運用方針

### コンテンツ管理

- 作品の追加・編集・削除は `/admin` の管理画面から行う
- 作品は `status`（`true` = 公開 / `false` = 下書き）で公開制御
- 画像は Supabase Storage にアップロード（最大5MB、jpeg / png / webp）

### セキュリティ

- **RLS（Row Level Security）** を全テーブルに適用
  - 匿名ユーザー: `status = true` の作品のみ閲覧可
  - 認証済み管理者: フルCRUD
- 管理画面は Supabase Auth による認証でガード

### コードレビュー・品質管理

レビューで発見した知見は `docs/knowledge/` 以下に記録し蓄積する。
観点: 可読性・パフォーマンス・設計・バグ混在リスク。

詳細ドキュメントは [docs/](docs/) を参照。
