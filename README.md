# DiscordBOT-Kokone
猫の隠れ家-CatHideaway 専属BOTのソースコードです。
まだ書き直し部分が多いです...
# 主な機能
## 利用規約
> 使い方 `/rule` <br>

![実際の利用規約](https://cdn.discordapp.com/attachments/954745154407911454/1195257604247650395/image.png?ex=65b35563&is=65a0e063&hm=c3d20f00da510ceb480d6c261c58f274826a0fc49b53d34846112a6891283216&)<br>
猫の隠れ家は海外の方が多いので、英語・繁体字中国語・簡体字中国語・韓国語に対応しています。<br>
利用規約に同意するボタンを押すと、メンバーロールが付与されます。<br>
## お問い合わせ(チケット機能)
![実際のお問い合わせ](https://cdn.discordapp.com/attachments/954745154407911454/1195258917563940984/image.png?ex=65b3569c&is=65a0e19c&hm=9d2541884ca901c7bb76390a1a32622dcce6178748b2b0b6efb702b0c9eb2393&)<br>
> 使い方 `tiket`<br>

お問い合わせを開始するボタンを押すと、#お問い合わせ-<ユーザーiD>というチャンネルが作成されます。<br>
![実際のチャンネル](https://cdn.discordapp.com/attachments/954745154407911454/1195259461007314996/image.png?ex=65b3571e&is=65a0e21e&hm=fe849e78c100f80e8118a29b2baa1dcca87e8957bbdac4f46da4f2b2e5662f08&)<br>
## Stickyメッセージ
![実際の埋め込みメッセージ](https://cdn.discordapp.com/attachments/954745154407911454/1195260189855731832/image.png?ex=65b357cc&is=65a0e2cc&hm=6c241a9fb6a7bc6541ad1ce267dada5ab5baf650535d1aed91d0c850868179b7&)<br>
メッセージが送信される度にBOTのメッセージも更新されるようになっています。<br>
## VC作成機能
![実際の埋め込みメッセージ](https://cdn.discordapp.com/attachments/954745154407911454/1195260835212296244/image.png?ex=65b35865&is=65a0e365&hm=c73f3897a40a09c28b3fa49f096aeb9ff8816b851b9441eb99e67048e85fa819&)<br>
#VC作成というチャンネルに入ると、#自動作成-<ユーザー名>というチャンネルが作成されます。<br>
そのチャンネルにBOTから送信されたメッセージから各設定を行えます。<br>
### 設定出来る項目
- チャンネル名
- ユーザー人数
- ビットレート
- ブロックユーザー
> VC作成機能で作成されたチャンネルは、誰もいない状態が30秒間続くと自動的に削除されます。<br>

## ログ入出力機能
猫の隠れ家では、以下のログを取っています。
- 全てのメッセージ
- ボイスチャンネルの入退室・ミュート・配信
- 違反者
- 利用規約同意者
- お問い合わせ
これらのログを毎日0時に運営部屋に送信し、各ログファイルをリセットしています。
## 猫の隠れ家-CatHideaway
https://nekosanq.net/cathideaway/invite
