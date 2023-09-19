import { ActionRowBuilder, EmbedBuilder, PermissionsBitField, RoleSelectMenuBuilder, StringSelectMenuBuilder, UserSelectMenuBuilder, VoiceState } from "discord.js";
import { botcolor } from "../config.json";

const voiceChannelId: string = "1153634422583730176";
const memberRoleId: string = "712572415850315807";

const defaultChannelList: string[] = [
    "1161720349587669073", // 自動作成
    "1043089821947678720", // 作業
    "993406228346707988",  // ゲーム
    "993406601807536160",  // 色々1
    "1022153462806478860", // 色々2
    "1068464214311714816", // 色々3
    "1068465168746553385", // 色々4
];
// ボイスチャンネルを使用するユーザーの権限
const allowUserPermisson: bigint[] = [
    PermissionsBitField.Flags.ViewChannel,            // チャンネルを見る
    PermissionsBitField.Flags.SendMessages,           // メッセージを送信
    PermissionsBitField.Flags.EmbedLinks,             // 埋め込みメッセージ
    PermissionsBitField.Flags.AttachFiles,            // ファイルを添付
    PermissionsBitField.Flags.ReadMessageHistory,     // メッセージ履歴を読む
    PermissionsBitField.Flags.AddReactions,           // リアクションの追加
    PermissionsBitField.Flags.UseExternalEmojis,      // 外部の絵文字の使用
    PermissionsBitField.Flags.UseExternalStickers,    // 外部のスタンプの使用
    PermissionsBitField.Flags.UseExternalSounds,      // 外部のサウンドボードの使用
    PermissionsBitField.Flags.UseSoundboard,          // サウンドボードの使用
    PermissionsBitField.Flags.UseApplicationCommands, // アプリケーションコマンドの使用
];
// ボイスチャンネルを作成したユーザーの追加管理権限
const allowCreateUserPermisson: bigint[] = [
    PermissionsBitField.Flags.MuteMembers,            // メンバーをミュート
    PermissionsBitField.Flags.DeafenMembers,          // メンバーをスピーカーミュート
    PermissionsBitField.Flags.ManageMessages,         // メッセージの管理
    PermissionsBitField.Flags.ManageChannels,         // チャンネルの管理
];
// ボイスチャンネルを使用させなくさせる為の権限
const denyUserPermisson: bigint[] = [
    PermissionsBitField.Flags.ViewChannel,            // チャンネルを見る
    PermissionsBitField.Flags.SendMessages,           // メッセージを送信
    PermissionsBitField.Flags.AttachFiles,            // ファイルを添付
];
// ボイスチャンネルを作成時に送る埋め込みメッセージ
const createChannelEmbed: EmbedBuilder = new EmbedBuilder()
    .setColor(Number(botcolor))
    .setTitle("ボイスチャンネルを作成しました。")
    .setDescription("二段階認証をしている場合、チャンネルの設定やボイスチャットメンバーへのミュートなどが行えます。\n二段階認証していない場合、BOTからチャンネルの設定を行って下さい。\n※このチャンネルは、誰もいない状態が30秒以上続くと自動的にチャンネルが消えます。\n※引き継がれるのはブロックしているユーザー・ロールのみです。チャンネル名などは引き継がれません。")
// ブロックするユーザーを選択するためのセレクトメニュー
const userBlackListMenu: ActionRowBuilder<UserSelectMenuBuilder> = new ActionRowBuilder<UserSelectMenuBuilder>().setComponents(
    new UserSelectMenuBuilder()
        .setCustomId("user_blacklist")
        .setPlaceholder("ブロックするユーザーを選択")
        .setMaxValues(5)
        .setMinValues(1)
)
// ブロックしているユーザーを解除選択するためのセレクトメニュー
const userBlackReleaseListMenu: ActionRowBuilder<UserSelectMenuBuilder> = new ActionRowBuilder<UserSelectMenuBuilder>().setComponents(
    new UserSelectMenuBuilder()
        .setCustomId("user_blackreleaselist")
        .setPlaceholder("ブロックを解除するユーザーを選択")
        .setMaxValues(5)
        .setMinValues(1)
)
// ブロックするロールを選択するためのセレクトメニュー
const roleBlackListMenu: ActionRowBuilder<RoleSelectMenuBuilder> = new ActionRowBuilder<RoleSelectMenuBuilder>().setComponents(
    new RoleSelectMenuBuilder()
        .setCustomId("role_blacklist")
        .setPlaceholder("ブロックするロールを選択")
        .setMaxValues(5)
        .setMinValues(1)
)
// ブロックするロールを解除選択するためのセレクトメニュー
const roleBlackReleaseListMenu: ActionRowBuilder<RoleSelectMenuBuilder> = new ActionRowBuilder<RoleSelectMenuBuilder>().setComponents(
    new RoleSelectMenuBuilder()
        .setCustomId("role_blackreleaselist")
        .setPlaceholder("ブロックを解除するロールを選択")
        .setMaxValues(5)
        .setMinValues(1)
)
// 設定を選択するためのセレクトメニュー
const operationMenu: ActionRowBuilder<StringSelectMenuBuilder> = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
    new StringSelectMenuBuilder()
        .setCustomId("operationMenu")
        .setPlaceholder("設定")
        .setMaxValues(1)
        .setMinValues(1)
        .addOptions(
            {
                label: "名前",
                description: "チャンネルの名前を変更できます",
                value: "name_change"
            },
            {
                label: "人数制限",
                description: "人数制限の人数を変更できます(0~99)",
                value: "peoplelimited_change"
            },
            {
                label: "ビットレート",
                description: "ビットレート(音質)を変更できます(8~384)",
                value: "bitrate_change"
            },
            {
                label: "設定確認",
                description: "現在設定している項目を確認出来ます(他人には見られません)",
                value: "confirmation_setting"
            }
        )
)
// -----------------------------------------------------------------------------------------------------------
// ボイスチャンネル作成機能
// VC作成チャンネルにアクセス -> VC作成(権限管理) -> VC移動 
// [仕様: VCに30秒間誰もいない場合は自動削除]
// -----------------------------------------------------------------------------------------------------------
module.exports = {  
    async execute(oldState: VoiceState, newState: VoiceState): Promise<void> {
        const newMember = newState.member;
        const oldMember = oldState.member;
        const userName = newMember ? `${newState.member?.user.displayName}` : oldMember ? `${oldState.member?.user.displayName}` : "unknown user";
        const userId = newMember ? `${newState.member?.user.id}` : oldMember ? `${oldState.member?.user.id}` : "";
        const defaultChannelName = `自動作成-${userName}`;
        const deleteMap = new Map();
        // -----------------------------------------------------------------------------------------------------------
        // VC作成チャンネルに入った場合の処理
        // -----------------------------------------------------------------------------------------------------------
        if (oldState.channelId !== voiceChannelId && newState.channelId === voiceChannelId) {
            
            const voiceChannel = newState.channel; // 特定のボイスチャンネルを取得
            
            voiceChannel?.clone({ // 特定のボイスチャンネルと同じカテゴリーに新しいボイスチャンネルを作成
                name: defaultChannelName,
                permissionOverwrites: [
                    {
                        id: userId,
                        allow: [allowCreateUserPermisson, allowUserPermisson]
                    },
                    {
                        id: authenticatedRoleId,
                        deny: [denyUserPermisson]
                    },
                    {
                        id: everyoneRoleId,
                        deny: [denyUserPermisson]
                    }
                ]
            })
            .then((newVoiceChannel) => {
                // 新しいボイスチャンネルに移動する
                newState.setChannel(newVoiceChannel)
                .then(() => {
                    // 成功したらメッセージを送信する
                    newVoiceChannel.send({ // 移動が成功したらメッセージを送信
                        content: `<@${userId}>`,
                        embeds: [createChannelEmbed
                            .setFields(
                                { name: "現在の設定", value: `チャンネル名: ${channelName}\nユーザー人数制限: ${channelUserLimit}\nビットレート: ${channelBitRate}kbps`},
                                { name: "ブロックしているユーザー", value: blockUserList}
                            )
                        ],
                        components: [userBlackListMenu, userBlackReleaseListMenu, operationMenu, publicButton]
                    });
                })
                .catch((error: Error) => {
                    console.error(error);
                    newVoiceChannel.send('移動に失敗しました');
                });
            })
            .catch((error: Error) => {
                console.error(error);
            });
        };
        // -----------------------------------------------------------------------------------------------------------
        // VCに誰もいない場合、チャンネルを削除する処理
        // -----------------------------------------------------------------------------------------------------------
        if (oldState.channelId && oldState.channelId !== newState.channelId) { 
            try {
                for (let i = 0; i < defaultChannelList.length; i++) { // デフォルトで存在しているボイスチャンネルを除外する
                    if (defaultChannelList[i] === oldState.channelId) return;
                };
                if (oldState.channel?.members.size === 0) { // チャンネルに誰もいない場合
                    const timeout = setTimeout(() => { // 30秒後に削除する予約を作成
                        oldState.channel?.delete();
                        deleteMap.delete(oldState.channel?.id!);
                    }, 30 * 1000);
                    deleteMap.set(oldState.channel.id, timeout); // マップに予約を保存
                };
            } catch (error) {
                console.log(error);
            };
        };
        // -----------------------------------------------------------------------------------------------------------
        // VCに入り直した場合、チャンネルを削除する予約をキャンセルする処理
        // -----------------------------------------------------------------------------------------------------------
        if (newState.channelId && newState.channelId !== oldState.channelId) {
            try {
                for (let i = 0; i < defaultChannelList.length; i++) { // デフォルトで存在しているボイスチャンネルを除外する
                    if (defaultChannelList[i] === newState.channelId) return;
                };
                // マップに予約がある場合
                if (deleteMap.has(newState.channel?.id)) { // マップに予約がある場合
                    // 予約をキャンセル
                    clearTimeout(deleteMap.get(newState.channel?.id)); // 予約をキャンセル
                    deleteMap.delete(newState.channel?.id);
                };
            } catch (error) {
                console.log(error);
            };
        };
    },
};