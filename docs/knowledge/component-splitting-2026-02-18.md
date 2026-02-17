# コンポーネント分割の基準と実践知識

> 実施日: 2026-02-18
> 対象PR: [#21 refactor: Buttonコンポーネントを責務別に分割](https://github.com/ryutaKimu/daijo-gallery/pull/21)

---

## 1. コンポーネントに分ける基準

### 分割すべきタイミング

| 基準 | 説明 | 例 |
|---|---|---|
| **役割が異なる** | 見た目が似ていても、HTML要素・動作・用途が違う | `<Link>` と `<button>` は別コンポーネント |
| **状態を持つ** | disabled / active / pending など固有のUI状態がある | TagButton のアクティブ切り替え |
| **再利用される** | 2箇所以上で同じ構造が登場する | SubmitButton を複数フォームで使う |
| **変更理由が異なる** | デザイン変更・ロジック変更が独立して起きる | タグボタンのスタイルとフォーム送信ボタンのスタイルは別 |

### 分割しなくていいタイミング

- 1箇所でしか使わない、かつ将来も増える見込みがない
- 分割によって props のバケツリレーが発生する
- 抽象化のコストが再利用のメリットを上回る（YAGNI）

### このプロジェクトでの実践

```
Button.tsx（汎用）→ 廃止

button/
  LinkButton.tsx   # <Link> ベースのナビゲーション専用
  SubmitButton.tsx # <button type="submit"> フォーム送信専用
  TagButton.tsx    # <button type="button"> トグル状態を持つフィルター専用
```

**分割の決め手**: HTML要素が異なる（`Link` vs `button`）＋ UI状態の種類が異なる（なし / pending / active+pending）

---

## 2. Criticalの要因と解決策

### Critical 1: 変数名のケース違反

**要因**

```tsx
// ❌ パスカルケース → Reactコンポーネントと誤認しやすい
const ButtonClass = `...`
```

JavaScript の慣習では、パスカルケース（`ButtonClass`）はクラスやReactコンポーネントに使う。
変数に使うと「これはコンポーネントか？」と読み手が一瞬迷う。

**解決策**

```tsx
// ✅ キャメルケース
const buttonClass = `...`
```

**教訓**: 変数・関数はキャメルケース、コンポーネント・クラスはパスカルケースを徹底する。

---

### Critical 2: disabled 状態の視覚フィードバック欠如

**要因**

```tsx
// ❌ disabled になっても見た目が変わらない + カーソルもポインターのまま
<button disabled={isPending} className="... cursor-pointer">
```

`disabled` 属性はクリック不可にするが、CSSで明示しないと視覚的変化が出ない。
特に高齢者向けサイトでは「なぜ押せないのか」が伝わらないと操作を繰り返すリスクがある。

コンポーネント間の不一致も問題（`SubmitButton` には `disabled:opacity-50` があったが `TagButton` にはなかった）。

**解決策**

```tsx
// ✅ disabled 時のスタイルを明示
<button
  disabled={isPending}
  className="... cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
>
```

| クラス | 効果 |
|---|---|
| `disabled:opacity-50` | 半透明にして「操作できない」を伝える |
| `disabled:cursor-not-allowed` | カーソルを禁止アイコンにして意図を明示 |

**教訓**: 同じ役割（ボタン）を持つコンポーネントは `disabled` / `loading` / `active` の表現を揃える。
新しいボタンコンポーネントを作るときは必ず disabled スタイルをチェックする。

---

## チェックリスト（新しいボタンコンポーネントを作るとき）

- [ ] `<Link>` か `<button>` か、HTML要素の選択は適切か
- [ ] `type="button"` を明示しているか（フォーム内誤送信防止）
- [ ] `disabled` 状態の視覚フィードバックがあるか（`disabled:opacity-50` など）
- [ ] カーソルが disabled 時に `cursor-not-allowed` になるか
- [ ] 変数名はキャメルケースか（`buttonClass` ◯ / `ButtonClass` ✗）
- [ ] export スタイルがディレクトリ内で統一されているか
