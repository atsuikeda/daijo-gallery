# データ取得設計（Supabase）

## 基本方針
- Supabase クライアント（`@supabase/supabase-js`）を使用
- Server Component からデータ取得
- RLS（Row Level Security）で公開 / 管理者のアクセス制御
- 画像は Supabase Storage から取得

---

## 公開データ取得

### 作品一覧取得

用途: 作品一覧ページ

```ts
const { data, count } = await supabase
  .from('works')
  .select('id, title, year, img_url, tags:works_tags!inner(tag:tags(id, tag_name))', { count: 'exact' })
  .eq('status', true)
  .ilike('title', `%${query}%`)          // テキスト検索（任意）
  .eq('works_tags.tag_id', tagId)        // タグフィルタ（任意、!inner で内部結合）
  .range(offset, offset + limit - 1)
  .order('year', { ascending: false })
```

※ タグフィルタを使わない場合は `!inner` を外し、`.eq('works_tags.tag_id', tagId)` を省略する。

レスポンス例:
```json
{
  "data": [
    {
      "id": 1,
      "title": "静寂の森",
      "year": 1985,
      "img_url": "https://<project>.supabase.co/storage/v1/object/public/works/1.jpg",
      "tags": [
        { "tag": { "id": 1, "tag_name": "風景" } },
        { "tag": { "id": 2, "tag_name": "油彩" } }
      ]
    }
  ],
  "count": 82
}
```

### 作品詳細取得

用途: 作品詳細ページ

```ts
const { data } = await supabase
  .from('works')
  .select('id, title, description, year, img_url, tags:works_tags(tag:tags(id, tag_name))')
  .eq('id', id)
  .eq('status', true)
  .single()
```

### 代表作取得

用途: トップページ（3件固定）

```ts
const { data } = await supabase
  .from('works')
  .select('id, title, year, img_url')
  .eq('status', true)
  .in('id', representativeIds)
  .limit(3)
```

### タグ一覧取得

```ts
const { data } = await supabase
  .from('tags')
  .select('id, tag_name')
  .order('id')
```

---

## 管理者操作

### 認証

Supabase Auth を使用（メール / パスワード）

```ts
// ログイン
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
})

// ログアウト
await supabase.auth.signOut()
```

### 作品登録

```ts
// 1. 画像を Storage にアップロード
const { data: file, error: uploadError } = await supabase.storage
  .from('works')
  .upload(`${fileName}`, imageFile)

if (uploadError || !file) {
  throw new Error('画像のアップロードに失敗しました')
}

// 2. 公開URLを取得
const { data: urlData } = supabase.storage
  .from('works')
  .getPublicUrl(file.path)

// 3. works テーブルに挿入
const { data, error } = await supabase
  .from('works')
  .insert({ title, description, year, img_url: urlData.publicUrl, status: true })
  .select()
  .single()

// 4. DB 挿入失敗時は Storage の画像を削除（孤児ファイル防止）
if (error) {
  await supabase.storage.from('works').remove([file.path])
  throw new Error('作品の登録に失敗しました')
}
```

### 作品更新（テキスト情報のみ）

```ts
const { data } = await supabase
  .from('works')
  .update({ title, description, year })
  .eq('id', id)
  .select()
  .single()
```

### 作品更新（画像変更あり）

旧画像削除 → 新画像アップロード → DB 更新の順で処理する。

```ts
// 1. 現在の画像パスを取得
const { data: work } = await supabase
  .from('works')
  .select('img_url')
  .eq('id', id)
  .single()

// 2. 新しい画像を Storage にアップロード
const { data: file, error: uploadError } = await supabase.storage
  .from('works')
  .upload(`${newFileName}`, newImageFile)

if (uploadError || !file) {
  throw new Error('画像のアップロードに失敗しました')
}

// 3. 公開URLを取得
const { data: urlData } = supabase.storage
  .from('works')
  .getPublicUrl(file.path)

// 4. DB を更新
const { data: updated, error } = await supabase
  .from('works')
  .update({ title, description, year, img_url: urlData.publicUrl })
  .eq('id', id)
  .select()
  .single()

// 5. DB 更新失敗時は新画像を削除（孤児ファイル防止）
if (error) {
  await supabase.storage.from('works').remove([file.path])
  throw new Error('作品の更新に失敗しました')
}

// 6. DB 更新成功後、旧画像を Storage から削除
if (work?.img_url) {
  const oldPath = work.img_url.split('/storage/v1/object/public/works/')[1]
  if (oldPath) {
    await supabase.storage.from('works').remove([oldPath])
  }
}
```

### 作品削除

Storage の画像も合わせて削除する。画像パス取得 → Storage 削除 → DB 削除の順で処理する。

```ts
// 1. 削除対象の作品から画像パスを取得
const { data: work } = await supabase
  .from('works')
  .select('img_url')
  .eq('id', id)
  .single()

// 2. Storage から画像を削除
if (work?.img_url) {
  // 公開URLからファイルパスを抽出
  const filePath = work.img_url.split('/storage/v1/object/public/works/')[1]
  if (filePath) {
    await supabase.storage.from('works').remove([filePath])
  }
}

// 3. works テーブルから削除（works_tags は CASCADE で自動削除）
await supabase.from('works').delete().eq('id', id)
```

---

## エラーハンドリング

Supabase クライアントはエラーを `error` オブジェクトで返す。

```ts
const { data, error } = await supabase.from('works').select()

if (error) {
  // error.message: エラー詳細
  // error.code: PostgreSQL エラーコード
  console.error(error.message)
}
```

主なエラーケース:
- データ未検出: `.single()` で該当なしの場合 `PGRST116`
- 権限エラー: RLS ポリシー違反時 `42501`
- バリデーション: NOT NULL 違反等 `23502`
